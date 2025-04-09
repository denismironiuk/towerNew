import express from "express";
import { getProfileData } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js"; // Ensure user is authenticated

const router = express.Router();

router.get("/user-profile", authenticate, getProfileData);

export default router;
