import models from "../models/index.js";
const {User,UserCertification,Certification,UserTutorial,Tutorial,AuditRecord}=models

import { Op } from "sequelize"; // Import Sequelize operator

// ✅ Get workers assigned to a manager
export const getWorkersForManager = async (req, res) => {
    try {
        const manager_number = req.user.employee_number; // ✅ Use `employee_number` from JWT

        const workers = await User.findAll({
            where: { manager_number: manager_number },
            attributes: ["employee_number", "name", "position", "department", "email"]
        });

        res.json(workers);
    } catch (error) {
        console.error("❌ Error fetching workers:", error);
        res.status(500).json({ message: "Server error", error });
    }
}; 
export const getWorkersByRole = async (req, res) => {
    try {
      const workers = await User.findAll({
        where: {
          position: {
            [Op.in]: ['sam', 'user'] // ✅ Match either "sam" or "user"
          }
        },
        attributes: ["employee_number", "name"]
      });
  
      res.json(workers);
    } catch (error) {
      console.error("❌ Error fetching workers:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

// ✅ Get a specific worker's profile
export const getWorkerProfile = async (req, res) => {
    try {
      const userNumber = req.params.employee_number;
  
      const user = await User.findOne({
        where: {  employee_number: userNumber  },
        attributes: ["employee_number", "name", "position", "department", "email"],
        include: [
          {
            model: UserCertification,
            foreignKey: "user_number",
            as: "UserCertifications",
            include: {
              model: Certification,
              attributes: ["id", "name"],
            },
          },
          {
            model: UserTutorial,
            foreignKey: "employee_number",
            as: "UserTutorials",
            include: {
              model: Tutorial,
              attributes: ["id", "name"],
            },
          },
        ],
      });
  
      if (!user) {
        return res.status(404).json({ message: "Worker not found" });
      }
  // Count the number of audit records for the user using raw query
  const auditRecordCount = await AuditRecord.count({
    where: { employee_number: userNumber },
  });

  // Fetch the last created AuditRecord for the user
  const lastAuditRecord = await AuditRecord.findOne({
    where: { employee_number: userNumber },
    order: [["date_completed", "DESC"]],  // Order by date (or whatever field defines "latest")
    limit: 1,  // Only the last record
  });

  // Return profile data along with audit record count and the last created record
  res.json({
    name: user.name,
    position: user.position,
    department: user.department,
    certifications: user.UserCertifications.map((cert) => ({
      name: cert.Certification.name,
      valid_until: cert.valid_until,
    })),
    tutorials: user.UserTutorials.map((t) => ({
      name: t.Tutorial.name,
      valid_until: t.valid_until,
    })),
    auditRecordCount,  // Add the count of related audit records
    lastAuditRecord: lastAuditRecord || null,  // Add the last created audit record
  });
} catch (error) {
  console.error("❌ Error fetching profile data:", error);
  res.status(500).json({ message: "Internal server error", error });
}
  };

// ✅ Get all Fab Managers
export const getFabManagers = async (req, res) => {
    try {
        const managers = await User.findAll({
            where: { position: "sam" }, // ✅ Fetch users where position = "sam"
            attributes: ["employee_number", "name"]
        });

        res.json(managers);
    } catch (error) {
        console.error("❌ Error fetching fab managers:", error);
        res.status(500).json({ error: "Failed to fetch fab managers" });
    }
};
