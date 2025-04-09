
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import auditRecordRoutes from "./routes/auditRecordRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import SWAReportRoutes from "./routes/SWAReportRoutes.js";
import safetyAuditRoutes from "./routes/safetyAuditRoutes.js";
import tutorialRoutes from "./routes/tutorialRoutes.js";
import certificationRoutes from './routes/certificationRoutes.js'
import userTutorialRoutes from "./routes/userTutorialRoutes.js";
import userCertificationRoutes from "./routes/userCertificationRoutes.js";
import annualPlanRoutes from'./routes/annualplanRoutes.js'
import eventRoutes from './routes/eventRoutes.js';
import swa from './routes/swa.js';
import './models/associations.js'; // Import associations
// Required for resolving __dirname in ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
 
const app = express();

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-encoded data
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register authentication routes
app.use("/api/auth", authRoutes);  
app.use("/api/", profileRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/audit-records", auditRecordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swa-report", SWAReportRoutes); // ✅ Add this line
app.use('/api/safety-audits', safetyAuditRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/certifications", certificationRoutes);
app.use('/api/user-tutorials', userTutorialRoutes);
app.use('/api/user-certifications', userCertificationRoutes);
app.use('/api/annualplan', annualPlanRoutes);
app.use('/api', eventRoutes); // Routes will be accessible under /api/events

app.use("/api/swa", swa);

sequelize.sync()
    .then(() => console.log("✅ Database synced")) 
     .catch(err => console.error("❌ Database error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
 