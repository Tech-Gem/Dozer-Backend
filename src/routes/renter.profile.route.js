const express = require("express");
const {
  createRenterProfile,
  getAllRenterProfiles,
  getRenterProfileById,
  getRenterEquipment,
  updateRenterProfile,
  deleteRenterProfile,
} = require("../controllers/renter.profile.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/authentication.middlewares");
const { multerUploads } = require("../middlewares/multer.middlewares");

// POST route for creating user profile

router
  .route("/")
  .post(authenticate, multerUploads, createRenterProfile)
  .get(authenticate, getAllRenterProfiles);

router
  .route("/:id")
  .get(authenticate, getRenterProfileById)
  .put(authenticate, updateRenterProfile)
  .delete(authenticate, deleteRenterProfile);
router.get("/by-equipment/:renterId", getRenterEquipment);

module.exports = router;
