import { Op } from "sequelize";
import SWAReport from "../models/SWAReport.js";
import AuditRecord from "../models/AuditRecord.js";
import AuditSection from "../models/AuditSection.js";

export const getSWAReports = async (req, res) => {
  try {
    const managerEmployeeNumber = req.user.employee_number; // 👈 получаем ID менеджера из токена

    const reports = await SWAReport.findAll({
      where: {
        status: { [Op.in]: ["Open", "Closed"] },
      },
      include: [
        {
          model: AuditRecord,
          attributes: ["id", "name", "date_completed", "fab_manager_id"],
          where: {
            fab_manager_id: managerEmployeeNumber, // 👈 фильтруем по менеджеру
          },
        },
        {
          model: AuditSection,
          attributes: ["title"],
        },
      ],
      order: [[AuditRecord, "date_completed", "DESC"]],
    });

    const formatted = reports.map((report) => ({
      audit_id: report.audit_record_id,
      user_name: report.AuditRecord?.name,
      last_reported_at: report.reported_at,
      section_title: report.AuditSection?.title,
      issue_description: report.issue_description,
      corrective_action: report.corrective_action,
      overall_status: report.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch SWA reports:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
 // controllers/swaController.js
export const updateReportStatus = async (req, res) => {
    const { auditId } = req.params;
    const { newStatus } = req.body;
  
    try {
      const updated = await SWAReport.update(
        { status: newStatus },
        { where: { audit_record_id: auditId } }
      );
  
      if (updated[0] === 0) {
        return res.status(404).json({ message: "Report not found" });
      }
  
      res.json({ success: true, newStatus });
    } catch (err) {
      console.error("Failed to update SWA report status:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  