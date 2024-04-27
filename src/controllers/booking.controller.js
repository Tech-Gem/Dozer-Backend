import { Booking, Equipment, UserProfile } from "../models/index.js"; // Import models
import { StatusCodes } from "http-status-codes"; // Import status codes
import axios from "axios"; // Import axios
import { nanoid } from "nanoid"; // Import nanoid
import crypto from "crypto";

export const createBooking = async (req, res) => {
  try {
    const {
      equipmentId,
      email,
      startDate,
      endDate,
      quantity,
      location,
      signature,
      termsAndConditions,
    } = req.body;
    if (
      !equipmentId ||
      !email ||
      !startDate ||
      !endDate ||
      !quantity ||
      !location ||
      !signature ||
      termsAndConditions === undefined
    ) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        msg: "Equipment not found",
      });
    }
    const user = req.user;
    console.log(user);

    const userProfile = await UserProfile.findOne({
      where: { userId: req.user.id },
    });
    if (!userProfile) {
      return res.status(404).json({
        msg: "User profile not found",
      });
    }

    const txRef = nanoid();

    const booking = {
      equipmentId: equipmentId,
      equipmentName: equipment.name,
      equipmentPrice: equipment.pricePerHour,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: email,
      startDate: startDate,
      endDate: endDate,
      quantity: quantity,
      location: location,
      signature: signature,
      termsAndConditions: termsAndConditions,
      txRef: txRef,
      userId: user.id,
    };

    await Booking.create(booking);

    let chapaRequestData = {
      amount: equipment.pricePerHour * quantity, // Assuming equipment price is in the database
      tx_ref: txRef,
      currency: "ETB",
      email: user.email,
      first_name: userProfile.firstName,
      last_name: userProfile.lastName,
      // phone_number: user.phoneNumber,
      callback_url:
        "https://dozer-backend-tech-gem.onrender.com/api/v1/bookings/webhook",
      // return_url: "",
      // "customization[title]": "Payment for my favourite merchant",
      // "customization[description]": "I love online payments",
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/mobile-initialize",
      chapaRequestData,
      {
        headers: {
          Authorization: "Bearer " + process.env.CHAPA_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      return res.json({
        msg: "Equipment Booked successfully. Proceed to payment.",
        paymentUrl: response.data.data.checkout_url,
      });
    } else {
      return res.status(500).json({
        msg: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    //validate event
    console.log("Request", process.env.CHAPA_WEBHOOK_SECRET, req);
    const hash = crypto
      .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    console.log("paymentlog", hash, req.headers["x-chapa-signature"]);
    if (hash == req.headers["x-chapa-signature"]) {
      // Retrieve the request's body
      const event = req.body;
      console.log("Event", event);
      const { tx_ref } = event;
      const book = await Booking.findOne({
        txRef: tx_ref,
      });

      // change payment status to completed
      if (book && book.paymentStatus == "Pending") {
        book.paymentStatus = "Approved";
        await book.save();
      }

      return res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    //validate that this was indeed sent by Chapa's server
    // this is where we use the Secret hash we saved in .env
    const hash = crypto
      .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-chapa-signature"]) {
      // Retrieve the request's body
      const event = req.body;

      const { tx_ref, status } = event;
      if (status == "success" && tx_ref) {
        // hit the verify endpoint to make sure a transaction with the given
        // tx_ref was successful
        const response = await axios.get(
          `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,

          {
            headers: {
              Authorization: "Bearer " + process.env.CHAPA_KEY,
            },
          }
        );
        if (response.status == 200) {
          // if successful find the book
          if (response.data["status"] == "success") {
            let tx_ref = response.data["data"]["tx_ref"];
            const book = await Booking.findOne({
              txRef: tx_ref,
            });
            // check if the book doesn't exist or payment status is not pending
            if (!book || book.paymentStatus != "pending") {
              // Return a response to acknowledge receipt of the event
              return res.sendStatus(200);
            }
            // change payment status to completed
            if (book.paymentStatus == "pending") {
              book.paymentStatus = "completed";
              await book.save();
              // Return a response to acknowledge receipt of the event
              return res.sendStatus(200);
            }
          }
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ status: "success", bookings });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};
