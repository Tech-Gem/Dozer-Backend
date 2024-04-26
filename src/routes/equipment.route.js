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
} from "../controllers/equipment.controller.js";

import { authenticate } from "../middlewares/authentication.middlewares.js";
import { multerUploads } from "../middlewares/multer.middlewares.js";

router
  .route("/")
  .post(authenticate, createEquipment)
  .get(authenticate, getAllEquipments);

router.get("/available", authenticate, getAllAvailableEquipments);
router.get("/by-location/:location", searchEquipmentByLocation);
router.get("/by-category/:category", searchEquipmentByCategory);

router
  .route("/:id")
  .get(authenticate, getEquipmentById)
  .patch(authenticate, multerUploads, updateEquipment)
  .delete(authenticate, deleteEquipment);

export default router;
