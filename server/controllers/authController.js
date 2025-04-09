import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // ✅ Include .js extension

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "yourAccessTokenSecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "yourRefreshTokenSecret";

// Temporary refresh token storage (Use DB in production)
let refreshTokens = [];

// 🔹 **Generate Access Token**
const generateAccessToken = (user) => {
  return jwt.sign({ employee_number: user.employee_number }, ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
};

// 🔹 **Generate Refresh Token**
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ employee_number: user.employee_number }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  refreshTokens.push(refreshToken); // Store in DB in production
  return refreshToken;
};

// Login endpoint
export const login = async (req, res) => {
  console.log("Login Request Body:", req.body); // Debug incoming request

  const { employee_number, password } = req.body;

  try {
    const user = await User.findOne({ where: { employee_number } });

    if (!user) {
      console.log("❌ User not found:", employee_number);
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) { // Directly compare plain text passwords
      console.log("❌ Invalid password for:", employee_number);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔹 **Generate Tokens**
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("✅ Login successful:", user.employee_number);
    
    res.json({ access_token: accessToken, refresh_token: refreshToken, user });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Refresh token endpoint
export const refreshToken = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) return res.status(401).json({ message: "Refresh token required" });
  if (!refreshTokens.includes(refresh_token)) return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Expired refresh token" });

    const newAccessToken = generateAccessToken({ employee_number: user.employee_number });

    res.json({ access_token: newAccessToken });
  });
};

// ✅ **Verify User Function**
export const verifyUser = async (req, res) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ where: { employee_number: decoded.employee_number } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.employee_number,
      name: user.name,
      email: user.email,
      position: user.position
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

// Logout endpoint
export const logout = (req, res) => {
  console.log("✅ Logout successful");
  res.json({ message: "Logout successful. Clear token on the client side." });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = jwt.sign(
    { employee_number: user.employee_number },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "1h" }
  );

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  res.json({
    message: "Use the link to reset your password.",
    resetToken, // optional: send only if needed
    redirectUrl: resetUrl,
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

const user = await User.findOne({
  where: { employee_number: decoded.employee_number }
});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password; // plain text — as per your setup
    await user.save();

    res.json({ message: "Password successfully reset." });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};