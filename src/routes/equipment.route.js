import express from "express";
const router = express.Router();

import {
  createEquipment,
  searchEquipmentByLocation,
  getEquipmentById,
  searchEquipmentByCategory,
  getAllEquipments,
  updateEquipment,
  getAllAvailableEquipments,
  deleteEquipment,
  filterEquipments,
  getAllUserEquipments,
} from "../controllers/equipment.controller.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";
// import { multerUploads } from "../middlewares/multer.middlewares.js";

router
  .route("/")
  .post(authenticate, authorize("renter"), createEquipment)
  .get(getAllEquipments);

router.get("/available", authenticate, getAllAvailableEquipments);
router.get("/by-location/:location", authenticate, searchEquipmentByLocation);
router.get("/by-category/:category", authenticate, searchEquipmentByCategory);
router.get("/user", authenticate, getAllUserEquipments);

router
  .route("/:id")
  .get(authenticate, getEquipmentById)
  .patch(authenticate, authorize("renter"), updateEquipment)
  .delete(authenticate, authorize("renter"), deleteEquipment);

router.post("/filter", authenticate, filterEquipments);

export default router;
