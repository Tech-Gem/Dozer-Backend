import faker from "faker";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

export const seedEquipment = async (renterIds) => {
  if (!renterIds || renterIds.length === 0) {
    console.error("No renter IDs available for seeding equipment.");
    return;
  }

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

  const equipmentAddress = [
    "Addis Ketema",
    "Akaky Kaliti",
    "Arada",
    "Bole",
    "Gullele",
    "Kirkos",
    "Kolfe Keranio",
    "Lideta",
    "Lemi-Kura",
    "Nifas Silk-Lafto",
    "Yeka",
  ];

  const equipment = [];

  renterIds.forEach((renterId) => {
    for (let i = 0; i < 3; i++) {
      const category = faker.random.arrayElement(categories);
      equipment.push({
        id: uuidv4(),
        name: faker.random.arrayElement(equipmentNames),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
        pricePerHour: faker.datatype.number({ min: 100, max: 1000 }), // Price range from hundreds to thousands
        location: faker.random.arrayElement(equipmentAddress),
        description: faker.lorem.sentence(),
        category: category,
        image: [faker.random.arrayElement(equipmentImages)],
        rating: faker.datatype.float({ min: 1, max: 5, precision: 0.1 }),
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
