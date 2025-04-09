import models from "../models/index.js";
const { User, Certification, Tutorial, AuditRecord } = models;

export const getProfileData = async (req, res) => {
  try {
    const userNumber = req.user.employee_number;
    console.log("Employee number:", userNumber);  // Log the employee_number

    // Try to fetch the user from the database
    const user = await User.findOne({
      where: { employee_number: userNumber },
      attributes: ["employee_number", "name", "position", "department", "email"],
      include: [
        {
          model: Certification,
          as: "certifications",
          through: { attributes: ["valid_until"] },
          attributes: ["id", "name"],
        },
        {
          model: Tutorial,
          as: "tutorials",
          through: { attributes: ["valid_until"] },
          attributes: ["id", "name"],
        },
      ],
      raw: false, // ✅ ensure nested relations are returned
    });
    

    console.log(user);  // Log the user data to check if it's fetched

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
      certifications: (user.certifications || []).map((cert) => ({
        name: cert.name,
        valid_until: cert.UserCertification?.valid_until || null,
      })),
      tutorials: (user.tutorials || []).map((t) => ({
        name: t.name,
        valid_until: t.UserTutorial?.valid_until || null,
      })),
      
      auditRecordCount,  // Add the count of related audit records
      lastAuditRecord: lastAuditRecord || null,  // Add the last created audit record
    });
  } catch (error) {
    console.error("❌ Error fetching profile data:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};




