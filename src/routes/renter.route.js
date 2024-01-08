const express = require("express");
const { getRenters, getRenter } = require("../controllers/renter.controller");
const { authenticate } = require("../middlewares/authentication.middlewares");

const router = express.Router();

router.route("/").get(authenticate, getRenters);

router.route("/:id").get(authenticate, getRenter);

module.exports = router;
