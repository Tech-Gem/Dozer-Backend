import admin from "firebase-admin";
import serviceAccount from "./dozerAccountKey.json" assert { type: "json" };
// import { WebSocketServer } from "ws";
import { seedAdminUser } from "./seeder/admin.seed.js";
import { seedTestUsers, seedUsers } from "./seeder/user.seed.js";
import { seedEquipment } from "./seeder/equipment.seed.js";
import { seedBookings } from "./seeder/booking.seed.js";
import { seedUserProfiles } from "./seeder/userProfile.seed.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

import dotenv from "dotenv";
import "dotenv-safe";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import routes from "./routes/index.js";
import compression from "compression";
import errorHandler from "./middlewares/errorHandler.middlewares.js";
import fs from "fs/promises";
import db from "./models/index.js";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

db.sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketIOServer(httpServer);

app.use(morgan("dev"));
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(compression());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Change to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  })
);

app.use("/api/v1", routes);

app.get("/", async (req, res) => {
  try {
    // Read the content of index.html
    const indexPath = path.join(__dirname, "index.html");
    const htmlContent = await fs.readFile(indexPath, "utf-8");

    // Send the HTML content as the response
    res.send(htmlContent);
  } catch (error) {
    console.error("Error reading index.html:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
  }
});

app.use("*", (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    message: `The requested url ${req.originalUrl} does not exist`,
  });
});

app.use(errorHandler);

const deleteSeedData = async () => {
  try {
    await db.User.destroy({ where: {} });
    await db.UserProfile.destroy({ where: {} });
    await db.Booking.destroy({ where: {} });
    await db.Equipment.destroy({ where: {} });
    await db.Review.destroy({ where: {} });
    await db.Subscription.destroy({ where: {} });

    console.log("All seed data deleted");
  } catch (error) {
    console.error("Error deleting seed data:", error);
  }
};

const seedData = async () => {
  await deleteSeedData();
  await seedAdminUser();
  await seedTestUsers();
  const { userIds, renterIds } = await seedUsers();
  console.log("User IDs:", userIds); // Log to verify
  console.log("Renter IDs:", renterIds); // Log to verify
  if (renterIds.length > 0) {
    await seedEquipment(renterIds);
  }
  if (userIds.length > 0) {
    await seedUserProfiles(userIds);
  }
  await seedBookings();
};

db.sequelize.sync().then(() => {
  httpServer.listen(process.env.PORT, () => {
    seedData();
    seedAdminUser();

    console.log(`Server running on port ${process.env.PORT}`);
  });

  // io.on("connection", (socket) => {
  //   console.log("a user connected");

  //   socket.on("getTime", async (bidId) => {
  //     try {
  //       // Fetch the bid from the database
  //       const bid = await RealTimeBid.findByPk(bidId);
  //       if (bid) {
  //         const timeElapsed =
  //           (Date.now() - new Date(bid.createdAt).getTime()) / 1000;
  //         const timeLeft = bid.duration - timeElapsed;
  //         // Emit remaining time to the client
  //         socket.emit("remainingTime", timeLeft > 0 ? timeLeft : 0);
  //       } else {
  //         // Emit an error message if the bid is not found
  //         socket.emit("error", "Bid not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching bid:", error);
  //       socket.emit("error", "Internal server error");
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("user disconnected");
  //   });
  // });
});
