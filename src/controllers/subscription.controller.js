import { User, Subscription, UserProfile } from "../models/index.js"; // Import models
import { StatusCodes } from "http-status-codes"; // Import status codes
import axios from "axios"; // Import axios
import { nanoid } from "nanoid"; // Import nanoid
import crypto from "crypto";

export const createSubscription = async (req, res) => {
  try {
    const { subscriptionType, subscriptionDuration } = req.body;
    const user = req.user;

    const userProfile = await UserProfile.findOne({
      where: { userId: req.user.id },
    });
    if (!userProfile) {
      return res.status(404).json({
        msg: "User profile not found",
      });
    }

    const txRef = nanoid();

    const subscription = {
      subscriptionType: subscriptionType,
      subscriptionDuration: subscriptionDuration,
      endDate: new Date(
        new Date().getTime() + subscriptionDuration * 24 * 60 * 60 * 1000
      ),
      txRef: txRef,
      userId: user.id,
    };

    await Subscription.create(subscription);

    let subscriptionAmount = 0;

    if (subscriptionType === "Basic") {
      subscriptionAmount = 500;
    }
    if (subscriptionType === "Standard") {
      subscriptionAmount = 1000;
    }
    if (subscriptionType === "Premium") {
      subscriptionAmount = 1500;
    }

    let chapaRequestData = {
      amount: subscriptionAmount,
      tx_ref: txRef,
      currency: "ETB",
      email: user.email,
      first_name: userProfile.firstName,
      last_name: userProfile.lastName,
      // phone_number: user.phoneNumber,
      callback_url:
        "https://dozer-backend-tech-gem.onrender.com/api/v1/subscription/verifyPayment",
      // return_url: "",
      "customization[title]": "Subscription Payment",
      "customization[description]": "Subscription + " + subscriptionType,
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
        msg: "Subscription initialized successfully. Proceed to payment.",
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

export const verifySubscription = async (req, res) => {
  try {
    // Validate event
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

      const subscription = await Subscription.findOne({
        where: { txRef: tx_ref },
      });

      if (!subscription) {
        return res.status(404).json({
          msg: "Subscription not found",
        });
      }

      // Verify payment and update subscription status
      if (subscription.paymentStatus === "Pending") {
        const verifiedData = await verifyPayment(
          tx_ref,
          req.headers["x-chapa-signature"],
          req.body
        );

        if (verifiedData.status === "success") {
          subscription.paymentStatus = "Approved";
          subscription.subscriptionStatus = "Active";
          await subscription.save();

          // Update user subscription status
          const user = await User.findOne({
            where: { id: subscription.userId },
          });

          if (user) {
            user.isSubscribed = true;
            await user.save();
          } else {
            return res.status(404).json({
              msg: "User not found",
            });
          }

          return res.sendStatus(200);
        } else {
          return res.status(400).json({
            msg: "Payment verification failed",
          });
        }
      } else {
        return res.status(400).json({
          msg: "Subscription payment status is not pending",
        });
      }
    } else {
      return res.status(400).json({
        msg: "Invalid signature",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

// Duplicate code same as verifySubscription
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
      console.log(event);

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
            const subscription = await Subscription.findOne({
              txRef: tx_ref,
            });
            // check if the book doesn't exist or payment status is not pending
            if (!subscription || subscription.paymentStatus != "pending") {
              // Return a response to acknowledge receipt of the event
              return res.sendStatus(200);
            }
            // change payment status to completed
            if (subscription.paymentStatus == "pending") {
              subscription.paymentStatus = "completed";
              await subscription.save();
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

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.status(200).json({ status: "success", subscriptions });
  } catch (error) {
    console.error("Error in getAllSubscriptions:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};
