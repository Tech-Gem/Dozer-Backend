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

import { authenticate } from "../middlewares/authentication.middlewares.js";
// import { multerUploads } from "../middlewares/multer.middlewares.js";

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
  .patch(authenticate, updateEquipment)
  .delete(authenticate, deleteEquipment);

router.post("/filter", filterEquipments);

export default router;
