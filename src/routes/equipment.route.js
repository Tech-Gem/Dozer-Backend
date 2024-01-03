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
} = require("../controllers/equipment.controller");
const { authenticate } = require("../middlewares/authentication");

router
  .route("/")
  .post(authenticate, createEquipment)
  .get(authenticate, getAllEquipments);
router.get("/search", searchEquipment);
router.get("/location", searchEquipmentByLocation);
router.get("/category", searchEquipmentByCategory);
router
  .route("/:id")
  .get(authenticate, getEquipmentById)
  .patch(authenticate, updateEquipment)
  .delete(authenticate, deleteEquipment);

module.exports = router;
