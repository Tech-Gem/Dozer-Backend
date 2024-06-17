import messaging from "firebase-admin";
import { StatusCodes } from "http-status-codes";
import { Notification } from "../models/index.js";

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
        "dZdR5VUQTIqiWMaHiFYsG1:APA91bE9U4r-s_B2U2wPoyRXOz87y9TWoTBL9nz43cK69dokkX5nXZ_YDq3WQN90iIx66ByHyhPWt1tWZ10Q1iNbC5aRlF5HZpbOyclGzx2hEoPX43BwXSSIrqIQDfKSmXPfBcxyN-T0",
      // "cKGEXzwDSEGvaWRxbnH3sW:APA91bGMGdZ2KZbzHI1O1tO2YuirMRD92tVa1mHGZX_UPEsLYXOipKnSOTygNcnae7GMxEILa_VCNuqexDnxlsJwzdCsuTQDtGPXyykGJFPO0FNQd2vKWgUAP6Wx3XADzenlTboxR9tO",
      // "expingRCTj2hVHh5hQ0B8Z:APA91bH8OzYD-l3KjHFslA_iN1Uao0-PJ3mMsEj-jtNZronDgW8-9uXaBHDdvTVGc1yXKWQKBZKCTkQZtQrXm18TYfVTQULoS7vrSyPgSbCKF2D458Vaq4egVGeTtsNMPWS4nPnh434z",
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

// Function to save notification to the database
export const saveNotification = async (userId, message, type) => {
  try {
    const notification = await Notification.create({
      userId: userId,
      message,
      type,
    });
    return notification;
  } catch (error) {
    console.error("Error saving notification:", error);
    throw new Error("Error saving notification");
  }
};

// Function to send notification
export const sendNotification = async (title, body, data, token, userId, bookingId) => {
  try {
    const message = {
      notification: { title, body },
      data,
      token,
    };

    const response = await messaging.messaging().send(message);
    console.log("Successfully sent message:", response);

    // Save the notification to the database
    await saveNotification(userId, body, data.type);

    return { status: "success", message: "Message sent successfully" };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Error sending message");
  }
};

// make this get notification that belongs to a user
export const getNotifications = async (req, res) => {
  try {
    const user = req.user;
    const notifications = await Notification.findAll({
      where: { userId: user.id },
    });
    res.status(200).json({ status: "success", notifications });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};

// get notification of a user by type
export const getNotificationsByType = async (req, res) => {
  try {
    const user = req.user;
    const { type } = req.params;
    const notifications = await Notification.findAll({
      where: { userId: user.id, type },
    });
    res.status(200).json({ status: "success", notifications });
  } catch (error) {
    console.error("Error in getNotificationsByType:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};
