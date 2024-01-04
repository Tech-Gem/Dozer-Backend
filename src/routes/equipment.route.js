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
  deleteEquipment,
  uploadImage,
} = require("../controllers/equipment.controller");
const { authenticate } = require("../middlewares/authentication");
const {
  addEquipmentValidation,
} = require("../validations/equipment.validation");

router
  .route("/")
  .post(authenticate, uploadImage, addEquipmentValidation, createEquipment)
  .get(authenticate, getAllEquipments);
router.get("/search", addEquipmentValidation, searchEquipment);
router.get("/by-location/:location", searchEquipmentByLocation);
router.get("/by-category/:category", searchEquipmentByCategory);
router
  .route("/:id")
  .get(authenticate, getEquipmentById)
  .patch(authenticate, uploadImage, updateEquipment)
  .delete(authenticate, deleteEquipment);

module.exports = router;
