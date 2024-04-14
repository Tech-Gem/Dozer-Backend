const express = require("express");
const router = express.Router();

const { verifyRenter } = require("../controllers/admin.controller");

router.patch("/verify/:renterId", verifyRenter);

module.exports = router;
