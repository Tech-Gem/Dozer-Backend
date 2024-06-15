import express from "express";
const router = express.Router();

import { getUserFinancialReport } from "../controllers/financial.report.controller.js";

import { authenticate } from "../middlewares/authentication.middlewares.js";

router.route("/").get(authenticate, getUserFinancialReport);

export default router;
