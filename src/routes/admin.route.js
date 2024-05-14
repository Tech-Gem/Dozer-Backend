import express from "express";

const router = express.Router();

import verifyRenter from "../controllers/admin.controller.js";

router.patch("/verify/:id", verifyRenter);

export default router;
