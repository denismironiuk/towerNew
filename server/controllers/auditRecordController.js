import AuditRecord from "../models/AuditRecord.js";
import User from "../models/User.js";

// ✅ Get all audit records (Authenticated User Required)
export const getAuditRecords = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const records = await AuditRecord.findAll({
      include: [
        { model: User, as: "employee", attributes: ["name", "employee_number"] },
        { model: User, as: "fabManager", attributes: ["name", "employee_number"] }
      ]
    });

    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching audit records:", error);
    res.status(500).json({ error: "Failed to retrieve audit records" });
  }
};

// ✅ Get a specific audit record by ID (Authenticated User Required)
export const getAuditRecordById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const record = await AuditRecord.findOne({
      where: { id },
      include: [
        { model: User, as: "employee", attributes: ["name", "employee_number"] },
        { model: User, as: "fabManager", attributes: ["name", "employee_number"] }
      ]
    });

    if (!record) {
      return res.status(404).json({ error: "Audit record not found" });
    }

    res.json(record);
  } catch (error) { 
    console.error("❌ Error fetching audit record:", error);
    res.status(500).json({ error: "Failed to retrieve audit record" });
  }
};

// ✅ Add a new audit record (Authenticated User Required)
export const addAuditRecord = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const employee_number = req.user.employee_number; // Extract user from token
    const { fab_manager_id, name, date_completed, location, shift, fab_area, toolset, additional_details, auditStatus } = req.body;

    if (!fab_manager_id || !name || !date_completed || !location || !shift || !fab_area || !toolset) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRecord = await AuditRecord.create({
      employee_number,  // Taken from token
      fab_manager_id,
      name,
      date_completed,
      location,
      shift,
      fab_area,
      toolset,
      additional_details: additional_details || null,
      auditStatus: auditStatus || "Incomplete"
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("❌ Error adding audit record:", error);
    res.status(500).json({ error: "Failed to add audit record" });
  }
};

// ✅ Update an audit record (Only Owner or Admin Can Update)
export const updateAuditRecord = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const updates = req.body;
    const record = await AuditRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({ error: "Audit record not found" });
    }

    // Check if user is owner or an admin
    if (req.user.employee_number !== record.employee_number && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: You do not have permission to update this record" });
    }

    await record.update(updates);
    res.json(record);
  } catch (error) {
    console.error("❌ Error updating audit record:", error);
    res.status(500).json({ error: "Failed to update audit record" });
  }
};

// ✅ Delete an audit record (Only Owner or Admin Can Delete)
export const deleteAuditRecord = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const record = await AuditRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({ error: "Audit record not found" });
    }

    // Check if user is owner or an admin
    if (req.user.employee_number !== record.employee_number && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: You do not have permission to delete this record" });
    }

    await record.destroy();
    res.json({ message: "Audit record deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting audit record:", error);
    res.status(500).json({ error: "Failed to delete audit record" });
  }
};


