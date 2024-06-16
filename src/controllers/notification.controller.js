import messaging from "firebase-admin";
import { StatusCodes } from "http-status-codes";

export const sendBookingRequest = async (req, res) => {
  try {
    const { content, equipment } = req.body;

    const message = {
      notification: {
        title: "New Booking Request",
        body: "You have a new booking request to the equipment: " + equipment,
      },
      data: {
        type: "Booking",
        content,
      },
      token:
        "cKGEXzwDSEGvaWRxbnH3sW:APA91bGMGdZ2KZbzHI1O1tO2YuirMRD92tVa1mHGZX_UPEsLYXOipKnSOTygNcnae7GMxEILa_VCNuqexDnxlsJwzdCsuTQDtGPXyykGJFPO0FNQd2vKWgUAP6Wx3XADzenlTboxR9tO",
    };

    const response = await messaging.messaging().send(message);
    console.log("Successfully sent message:", response);
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error sending message" });
  }
};

export const sendNotification = async (title, body, data, token) => {
  try {
    const message = {
      notification: { title, body },
      data,
      token,
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return { status: "success", message: "Message sent successfully" };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Error sending message");
  }
};