require("dotenv").config();
require("express-async-errors");
require("dotenv-safe").config();
const db = require("./models/index");

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");
const routes = require("./routes");
const compression = require("compression");
const errorHandler = require("./middlewares/errorHandler");

db.sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

const app = express();

app.use(morgan("dev"));
app.use(cors({}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(compression());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Welcome to Dozer API");
});

app.use("*", (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    message: `The requested url ${req.originalUrl} does not exist`,
  });
});

app.use(errorHandler);

const seedAdminUser = async () => {
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
};

// db.sequelize.sync().then(() => {
app.listen(process.env.PORT, () => {
  seedAdminUser();
  console.log(`Server running on port ${process.env.PORT}`);
});
// });
