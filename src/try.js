import admin from "firebase-admin";
import serviceAccount from "./config/dozerAccountKey.json" assert { type: "json" };
// import { WebSocketServer } from "ws";
import faker from "faker";
import { v4 as uuidv4 } from "uuid";

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

const deleteSeedData = async () => {
  try {
    await db.User.destroy({ where: {} });
    await db.Equipment.destroy({ where: {} });
    console.log("All seed data deleted");
  } catch (error) {
    console.error("Error deleting seed data:", error);
  }
};

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

const seedUsers = async () => {
  const roles = ["user", "renter"];
  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      id: uuidv4(),
      role: faker.random.arrayElement(roles),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.phoneNumber(),
    });
  }
  await db.User.bulkCreate(users);
  const createdUsers = await db.User.findAll({ attributes: ["id", "role"] });
  const userIds = createdUsers.map((user) => user.id);
  const renterIds = createdUsers
    .filter((user) => user.role === "renter")
    .map((user) => user.id);
  console.log("Seeded User IDs:", userIds); // Log to verify
  console.log("Renter IDs:", renterIds); // Log to verify

  return { userIds, renterIds };
};

const seedEquipments = async (renterIds) => {
  if (!renterIds || renterIds.length === 0) {
    console.error("No renter IDs available for seeding equipment.");
    return;
  }
  console.log("Renter IDs for seeding equipment:", renterIds); // Log to verify

  const equipmentNames = [
    "Excavator",
    "Bulldozer",
    "Backhoe",
    "Skid-Steer Loader",
    "Trencher",
    "Motor Grader",
    "Wheel Tractor-Scraper",
    "Forklift",
    "Pile Boring Machine",
    "Pile Driving Machine",
    "Telehandler",
    "Dragline Excavator",
    "Feller Buncher",
  ];

  const categories = [
    "CompactEquipment",
    "HeavyEarthmoving",
    "LiftAerialWorkPlatform",
    "RollersCompaction",
  ];

  const models = {
    CompactEquipment: ["CAT 301.7", "Bobcat E10", "Kubota K008-3"],
    HeavyEarthmoving: ["CAT 336", "Komatsu PC360", "Volvo EC950"],
    LiftAerialWorkPlatform: ["Genie S-60", "JLG 600S", "Haulotte HA16"],
    RollersCompaction: ["Bomag BW 120", "Dynapac CA250", "HAMM HD 12 VV"],
  };
    
  const specifications = {
    CompactEquipment: [
      "Engine Power: 10 kW",
      "Max Dig Depth: 1.7m",
      "Weight: 1.7 tons",
    ],
    HeavyEarthmoving: [
      "Engine Power: 200 kW",
      "Max Dig Depth: 7.5m",
      "Weight: 36 tons",
    ],
    LiftAerialWorkPlatform: [
      "Platform Height: 60ft",
      "Lift Capacity: 500 lbs",
      "Weight: 20,000 lbs",
    ],
    RollersCompaction: [
      "Drum Width: 1200mm",
      "Centrifugal Force: 25 kN",
      "Weight: 2.5 tons",
    ],
  };

  const equipmentImages = [
    "https://t3.ftcdn.net/jpg/03/58/07/52/240_F_358075212_rrH5tQJHr9yXC0Tr067S0RKEXcofTNCA.jpg",
    "https://t4.ftcdn.net/jpg/02/13/08/67/240_F_213086746_ZIEw0otEbUBkrVm5ziexLGA8V1QZOALn.jpg",
    "https://t4.ftcdn.net/jpg/02/49/04/93/240_F_249049329_BpYUPt5TGST3qTTfOJVpTakAdCLFzcg1.jpg",
    "https://t3.ftcdn.net/jpg/04/96/11/20/240_F_496112057_41Z6MvbueZGqQg3HIw6nFuxDTB10GK6H.jpg",
    "https://t4.ftcdn.net/jpg/03/21/50/15/240_F_321501585_QS9UrrtAIRkCKJkx1dLwsIt1XlBbYv9p.jpg",
    "https://t3.ftcdn.net/jpg/01/65/64/16/240_F_165641684_cHEHIZ9U3uHY2NisBb2APSHmlNkI6zKZ.jpg",
    "https://t4.ftcdn.net/jpg/02/40/81/13/240_F_240811392_Dox9fKC22OKnVQHDVRSE1IIQuNZWO5VR.jpg",
    "https://t3.ftcdn.net/jpg/05/09/25/88/240_F_509258831_7NjK4gtU8JPwHqg0moer7HqLH4PSHIo5.jpg",
    "https://t3.ftcdn.net/jpg/02/01/45/34/240_F_201453422_JsDM3s3jMBUBFyH5i3JNfePmNb5OcoWm.jpg",
    "https://t3.ftcdn.net/jpg/01/07/98/20/240_F_107982085_NLt54tjpK8Lh7yP9kCxLwbvEirVFBVwP.jpg",
    "https://t3.ftcdn.net/jpg/04/53/98/84/240_F_453988489_gO48KaX05j3WBGE1sRFg3uZF3f2QCMal.jpg",
    "https://t4.ftcdn.net/jpg/01/90/72/93/240_F_190729345_GdTSZyI1mzEQWDspmwXjd9zbJVwevKx2.jpg",
    "https://t3.ftcdn.net/jpg/00/43/82/44/240_F_43824441_OosVE1dlfSe5k4k86lmbhmeiNeTep253.jpg",
    "https://t3.ftcdn.net/jpg/02/12/86/36/240_F_212863660_uQzNZmhGraYBXzEqA1tyVK3TC1oaVzZF.jpg",
    "https://t4.ftcdn.net/jpg/01/37/41/77/240_F_137417730_sGN6RUdKpMkr7jnbqC0OqB8Y7dPRoLVX.jpg",
    "https://t3.ftcdn.net/jpg/02/13/08/94/240_F_213089458_1hJOjLJqRyzUGeEywgOUqdgBKvqgTI4L.jpg",
    "https://t4.ftcdn.net/jpg/01/85/45/73/240_F_185457396_j4fggyyPIhkJtG1EeiKkdMwTLSUw71Dh.jpg",
    "https://t3.ftcdn.net/jpg/05/13/65/60/240_F_513656027_GZWyt6hrjXADaeyxjQJbz0v4H39iaKhD.jpg",
    "https://t3.ftcdn.net/jpg/05/13/65/60/240_F_513656027_GZWyt6hrjXADaeyxjQJbz0v4H39iaKhD.jpg",
    "https://t3.ftcdn.net/jpg/00/61/94/94/240_F_61949491_pdF5iqSQGRnhEqXAK27U8JaHGld24Dtj.jpg",
    "https://t4.ftcdn.net/jpg/02/68/24/77/240_F_268247743_nMrFCZYZIMb4NS2xe2Us4kOD8369tE1W.jpg",
    "https://t4.ftcdn.net/jpg/00/11/49/01/240_F_11490197_B2tVrGErHzpn9bZJhMy8z397TmNGe76f.jpg",
    "https://t3.ftcdn.net/jpg/01/59/19/32/240_F_159193220_m3b64OVIdlWiQrggEf6OqFRVOrEMAY4m.jpg",
    "https://t4.ftcdn.net/jpg/02/13/47/09/240_F_213470914_90FaYTk2FZ45JaDn4JltGEbDGImPK2xK.jpg",
    "https://t3.ftcdn.net/jpg/06/47/42/24/240_F_647422468_VLBPVajYTKGuB2jixad2lWosj8AxYyea.jpg",
    "https://t4.ftcdn.net/jpg/06/90/32/57/240_F_690325739_aCy2fKswFuSKKlHPLn7eHbRnVdZnirRK.jpg",
    "https://t4.ftcdn.net/jpg/00/05/97/59/240_F_5975972_X6oYnvPzV95TdJj0iWusJcf0Y4QUbWoy.jpg",
    "https://t3.ftcdn.net/jpg/01/79/03/56/240_F_179035673_zXpmg0CcsyLI1fqLP0RMDYxh3ToLxuVn.jpg",
    "https://t3.ftcdn.net/jpg/03/32/19/96/240_F_332199658_ku0Jh5LRu0IGkHSQSiYqvFs2h3UIMxew.jpg",
    "https://t4.ftcdn.net/jpg/02/50/22/27/240_F_250222752_wYr0KWdVZ3pq80Iy6sQ6VPgbXhsyvDYh.jpg",
    "https://t4.ftcdn.net/jpg/01/49/26/93/240_F_149269320_ITZOLYBgznZUn7sRuwBmLLslKiLEx556.jpg",
    "https://t3.ftcdn.net/jpg/03/74/62/56/240_F_374625619_s46DwYt3ApclGTQv6gWYllVSH5DSOGo6.jpg",
    "https://t4.ftcdn.net/jpg/02/05/38/31/240_F_205383169_faWGwHqgfUE2WhVzYiGpPwLAjn3qw5rR.jpg",
    "https://t3.ftcdn.net/jpg/03/54/46/90/240_F_354469024_xMWeeFZTyhqpQ4G6FOQma1FSJ9FnkIBY.jpg",
  ];

  const equipment = [];

  renterIds.forEach((renterId) => {
    for (let i = 0; i < 10; i++) {
      const category = faker.random.arrayElement(categories);
      equipment.push({
        id: uuidv4(),
        name: faker.random.arrayElement(equipmentNames),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
        pricePerHour: faker.datatype.number({ min: 100, max: 1000 }), // Price range from hundreds to thousands
        location: faker.address.city(),
        description: faker.lorem.sentence(),
        category: category,
        image: faker.random.arrayElement(equipmentImages),
        // rating: faker.datatype.float({ min: 1, max: 5, precision: 0.1 }),
        capacity: `${faker.datatype.number({ min: 1, max: 5 })} Ton`,
        model: faker.random.arrayElement(models[category]),
        specifications: specifications[category],
        transportation: faker.datatype.boolean(),
        isBooked: faker.datatype.boolean(),
        userId: renterId, // Assign the current user ID
      });
    }
  });

  await db.Equipment.bulkCreate(equipment);
};

const seedData = async () => {
  await deleteSeedData(); // Delete existing seed data
  const { userIds, renterIds } = await seedUsers();
  console.log("User IDs:", userIds); // Log to verify
  console.log("Renter IDs:", renterIds); // Log to verify
  if (renterIds.length > 0) {
    await seedEquipments(renterIds);
  }
  // await seedBookings();
};

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    seedAdminUser();
    seedData();

    console.log(`Server running on port ${process.env.PORT}`);
  });

  // const wss = new WebSocketServer({ port: 8080 });

  // wss.on("connection", function connection(ws) {
  //   ws.on("message", function message(data) {
  //     console.log("received: %s", data);
  //   });

  //   ws.send("something");
  // });
});
