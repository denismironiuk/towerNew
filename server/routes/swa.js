import express from "express";
import {getSWAReports,updateReportStatus } from "../controllers/swa.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/reports",authenticate, getSWAReports);
router.put("/reports/:auditId/status", authenticate, updateReportStatus);

export default router;
