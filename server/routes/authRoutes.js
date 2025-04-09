import express from "express";
import { login, logout, refreshToken, verifyUser,forgotPassword,resetPassword } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js"; // Ensure user is authenticated

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refreshToken); // NEW: Refresh token route
router.post("/logout", logout);
router.get("/me", authenticate, verifyUser); // Protected user info
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
