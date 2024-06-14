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
} from "../controllers/equipment.controller.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";
// import { multerUploads } from "../middlewares/multer.middlewares.js";

router
  .route("/")
  .post(authenticate, authorize("renter"), createEquipment)
  .get(authenticate, authorize("admin", "user", "renter"), getAllEquipments);

router.get("/available", authenticate, getAllAvailableEquipments);
router.get("/by-location/:location", authenticate, searchEquipmentByLocation);
router.get("/by-category/:category", authenticate, searchEquipmentByCategory);

router
  .route("/:id")
  .get(authenticate, authorize("renter", "user"), getEquipmentById)
  .patch(authenticate, authorize("renter"), updateEquipment)
  .delete(authenticate, authorize("renter"), deleteEquipment);

router.post("/filter", authenticate, filterEquipments);

export default router;
