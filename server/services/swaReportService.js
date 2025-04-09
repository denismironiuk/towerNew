import { Op } from "sequelize";
import AuditRecord from "../models/AuditRecord.js";
import SWAReport from "../models/SWAReport.js";
import AuditSection from "../models/AuditSection.js";
import AuditQuestion from "../models/AuditQuestion.js";

export const fetchManagerReports = async (managerId) => {
  const audits = await AuditRecord.findAll({
    where: { fab_manager_id: managerId },
    attributes: ["id", "name"],
  });

  if (!audits.length) return [];

  const auditIds = audits.map((audit) => audit.id);

  const reports = await SWAReport.findAll({
    where: { audit_record_id: { [Op.in]: auditIds } },
    attributes: [
      "id",
      "audit_record_id",
      "reported_at",
      "score",
      "issue_description",
      "corrective_action",
      "status",
      "supporting_media",
    ],
    include: [
      {
        model: AuditRecord,
        attributes: ["id", "name"],
      },
      {
        model: AuditSection,
        attributes: ["title"],
      },
      {
        model: AuditQuestion,
        attributes: ["text"],
      },
    ],
  });

  return reports.map((report) => ({
    id: report.id,
    audit_id: report.AuditRecord?.id,
    auditor: report.AuditRecord?.name || "Unknown",
    section: report.AuditSection?.title || "N/A",
    question: report.AuditQuestion?.text || "N/A",
    score: report.score,
    reported_at: report.reported_at
      ? new Date(report.reported_at).toISOString()
      : null,
    description: report.issue_description,
    corrective_action: report.corrective_action,
    status: report.status,
    files: report.supporting_media
      ? report.supporting_media.split(",").map((f) => `http://localhost:5000${f.trim()}`)
      : [],
  }));
};
