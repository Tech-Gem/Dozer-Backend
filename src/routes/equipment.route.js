const express = require("express");
const router = express.Router();
const {
  createEquipment,
  searchEquipment,
  searchEquipmentByLocation,
  getEquipmentById,
  searchEquipmentByCategory,
  getAllEquipments,
  updateEquipment,
  getAllAvailableEquipments,
  deleteEquipment,
} = require("../controllers/equipment.controller");
const { authenticate } = require("../middlewares/authentication.middlewares");
const { multerUploads } = require("../middlewares/multer.middlewares");
// multerUploads;
router
  .route("/")
  .post(authenticate, createEquipment)
  .get(authenticate, getAllEquipments);
router.get("/available", authenticate, getAllAvailableEquipments);
// router.get("/search", searchEquipment);
router.get("/by-location/:location", searchEquipmentByLocation);
router.get("/by-category/:category", searchEquipmentByCategory);
router
  .route("/:id")
  .get(authenticate, getEquipmentById)
  .patch(authenticate, multerUploads, updateEquipment)
  .delete(authenticate, deleteEquipment);

module.exports = router;
