import admin from "firebase-admin";
import serviceAccount from "./config/dozerAccountKey.json" assert { type: "json" };

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

dotenv.config();

db.sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();

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

const seedAdminUser = async () => {
  try {
    const user = await db.User.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });
    if (!user) {
      await db.User.create({
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log("Admin User Created");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    seedAdminUser();
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
