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
        "cab9qDTXRnuHMm87EBIo78:APA91bH0-ILGcZUBJJOX9fb3N7ReTPxUQQRptAxstTE6COaLsXNedxM4TBCVe8AB84ABNs45nhGbaoJvZp2oOA73Sl22D4ilsGWd1K5PuaNFs5IV9ubWStUT123P3x1Q8hXYaAKiyo1W",
    };

    const response = await messaging.messaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(StatusCodes.OK).json({ message: "Message sent" });
  }
  catch (error) {
    console.error("Error sending message:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error sending message" });
  }
}
