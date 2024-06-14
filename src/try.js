// server.js
import admin from "firebase-admin";
import serviceAccount from "./dozerAccountKey.json" assert { type: "json" };
import dotenv from "dotenv";
import "dotenv-safe";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import compression from "compression";
import fs from "fs/promises";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";
import db from "./models/index.js";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

// Pass io instance to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/v1", routes);

app.get("/", async (req, res) => {
  try {
    const indexPath = path.join(__dirname, "index.html");
    const htmlContent = await fs.readFile(indexPath, "utf-8");
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

db.sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

const seedData = async () => {
  // Your seed data logic here...
};

db.sequelize.sync().then(() => {
  server.listen(process.env.PORT, () => {
    seedData();
    console.log(`Server running on port ${process.env.PORT}`);
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("getTime", () => {
      const bidDuration = 3600;
      const startTime = process.hrtime();
      socket.emit("remainingTime", bidDuration - process.hrtime(startTime)[0]);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
});
