import admin from "firebase-admin";
import serviceAccount from "../config/serviceAccountKey.json";

const firebaseAdmin = admin.initializeApp({
  credential: serviceAccount,
});

exports.sendNotification = async (req, res) => {
  try {
    const { title, body, token } = req.body;
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };
    const response = await firebaseAdmin.messaging().send(message);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
    