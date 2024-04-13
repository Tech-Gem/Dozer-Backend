const getMessaging = require("firebase-admin").messaging;
const { StatusCodes } = require("http-status-codes");

exports.sendBookingRequest = async (req, res) => {
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
    const response = await getMessaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(200).json({
      message: "Notification sent successfully",
      response,
      token: token,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// exports.sendBookingConfirmation = async (req, res) => {
//   try {
//     const { username, content, equipment, token } = req.body;
//     const message = {
//       notification: {
//         title: "New Booking Request",
//         body: "You have a new booking request to the equipment: " + equipment,
//       },
//       data: {
//         type: "Booking",
//         content,
//       },

//       token,
//     };
//     const response = await getMessaging().send(message);
//     console.log("Successfully sent message:", response);
//     res.status(200).json({
//       message: "Notification sent successfully",
//       response,
//       token: userToken,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };
