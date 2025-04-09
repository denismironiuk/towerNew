import express from "express";
import {createMultipleReports,
    getManagerReport,
    getGroupedReports,
    getReportsGroupedBySection,getSectionSummary,getSectionDetails,closeSectionIfAllClosed,updateReportStatus
} from "../controllers/SWAReportController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Added .js extension for ESM

const router = express.Router();

router.post("/", upload.array("files"), createMultipleReports); // ✅ Create new incident
router.get("/manager", authenticate, getManagerReport);
router.get("/manager/grouped", authenticate, getGroupedReports);
router.get("/manager/grouped-by-section", authenticate, getReportsGroupedBySection);
// routes/swaReportRoutes.js
router.get('/summary-by-section', authenticate, getSectionSummary);
// routes/swaReportRoutes.js
router.get('/audit/:auditId/section/:sectionId', authenticate, getSectionDetails);
router.patch("/section/:auditId/:sectionId/close",
    
    closeSectionIfAllClosed
  );
  router.patch("/:id/status", authenticate, updateReportStatus);
export default router;
 