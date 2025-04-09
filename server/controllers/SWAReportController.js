
import SWAReport from "../models/SWAReport.js";
import User from "../models/User.js";
import AuditQuestion from "../models/AuditQuestion.js";
import AuditRecord from "../models/AuditRecord.js";
import sequelize from "../config/database.js"; 
import AuditSection from "../models/AuditSection.js";
import {fetchManagerReports } from "../services/swaReportService.js";
import { groupFilesByLocalId, saveFiles } from "../utils/fileHelpers.js"; // helper file

// export const createMultipleReports = async (req, res) => {
//   try {
//     const reports = JSON.parse(req.body.incidents);
//     const fileMaps = req.body.file_map;
//     const files = req.files;

//     if (!Array.isArray(reports) || reports.length === 0) {
//       return res.status(400).json({ error: "Request must be a non-empty array of reports" });
//     }

//     const invalid = reports.find(
//       ({ audit_record_id, section_id, score, local_id }) =>
//         !audit_record_id || !section_id || !score || !local_id
//     );

//     if (invalid) {
//       return res.status(400).json({ error: "One or more reports are missing required fields" });
//     }

//     const fileMap = groupFilesByLocalId(files, fileMaps);
//     const newIncidents = [];

//     for (const { local_id, ...fields } of reports) {
//       const matchedFiles = fileMap[local_id] || [];
//       const fileUrls = saveFiles(matchedFiles);

//       const newIncident = await SWAReport.create({
//         ...fields,
//         supporting_media: fileUrls.join(", "),
//       });

//       newIncidents.push(newIncident);
//     }

//     return res.status(201).json({
//       message: "✅ Incidents saved successfully",
//       data: newIncidents,
//     });
//   } catch (error) {
//     console.error("❌ Error in createMultipleIncidents:", error);
//     return res.status(500).json({ error: "Failed to create reports with files" });
//   }
// };


import { sendIssueAlertEmail } from "../utils/emailService.js";
import { generateAuditSummaryEmail } from "../utils/emailTemplate.js";


export const createMultipleReports = async (req, res) => {
  try {
    const reports = JSON.parse(req.body.incidents);
    const fileMaps = req.body.file_map;
    const files = req.files;

    if (!Array.isArray(reports) || reports.length === 0) {
      return res.status(400).json({ error: "Request must be a non-empty array of reports" });
    }

    const invalid = reports.find(
      ({ audit_record_id, section_id, score, local_id }) =>
        !audit_record_id || !section_id || !score || !local_id
    );
    if (invalid) {
      return res.status(400).json({ error: "One or more reports are missing required fields" });
    }

    const fileMap = groupFilesByLocalId(files, fileMaps);
    const newIncidents = [];
    const allIssues = [];

    for (const { local_id, ...fields } of reports) {
      const matchedFiles = fileMap[local_id] || [];
      const fileUrls = saveFiles(matchedFiles);

      const newIncident = await SWAReport.create({
        ...fields,
        supporting_media: fileUrls.join(", "),
      });

      newIncidents.push(newIncident);

      // Collect for email if score < 4
      if (parseInt(fields.score) < 4) {
        allIssues.push({ ...newIncident.toJSON(), section_id: fields.section_id, question_id: fields.question_id });
      }
    }

    // Prepare single summary if issues found
    if (allIssues.length > 0) {
      const sectionIds = [...new Set(allIssues.map(i => i.section_id))];
      const questionIds = [...new Set(allIssues.map(i => i.question_id))];

      const sections = await AuditSection.findAll({ where: { id: sectionIds } });
      const sectionMap = Object.fromEntries(sections.map(s => [s.id, s.title]));

      const questions = await AuditQuestion.findAll({ where: { id: questionIds } });
      const questionMap = Object.fromEntries(questions.map(q => [q.id, q.text]));

      const formatted = allIssues.map((i) => ({
        section: sectionMap[i.section_id] || "—",
        question: questionMap[i.question_id] || "—",
        score: i.score,
        description: i.issue_description,
        corrective_action: i.corrective_action,
      }));

      const html = generateAuditSummaryEmail({
        auditId: reports[0]?.audit_record_id,
        employeeName: req.user?.name || "Unknown",
        issues: formatted,
      });

      await sendIssueAlertEmail({
        to: "denis.mironik@gmail.com",
        subject: "📋 SWA Audit Summary – Issues Found",
        html,
      });
    }

    return res.status(201).json({
      message: "✅ Reports saved and summary email sent (if needed)",
      data: newIncidents,
    });
  } catch (error) {
    console.error("❌ Error in createMultipleReports:", error);
    return res.status(499).json({ error: "Failed to create reports with files" });
  }
};






export const getManagerReport = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized access. No user data found." });
    }

    const reports = await fetchManagerReports(user.employee_number);

    if (!reports.length) {
      return res.status(404).json({ message: "No reports found for this manager" });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Error fetching manager reports:", error);
    res.status(500).json({ error: "Failed to fetch reports", details: error.message });
  }
};

export const getGroupedReports = async (req, res) => {
  try {
    const managerId = req.user.employee_number;

    const auditRecords = await AuditRecord.findAll({
      where: { fab_manager_id: managerId },
      include: [{ model: User, as: "employee", attributes: ["employee_number", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    const reports = [];

    for (const audit of auditRecords) {
      const findings = await SWAReport.findAll({
        where: { audit_record_id: audit.id },
        include: [
          { model: AuditQuestion, attributes: ["id", "text"] },
        ],
      });

      if (!findings.length) continue;

      const hasOpen = findings.some((f) => parseInt(f.score) < 4);
      const reportStatus = hasOpen ? "Open" : "Closed";

      reports.push({
        reportId: audit.id,
        type: "SWA Report",
        createdAt: audit.createdAt,
        createdBy: audit.employee,
        status: reportStatus,
        questions: findings.map((f) => ({ 
          questionId: f.question_id,
          text: f.AuditQuestion?.text || "Unknown",
          score: f.score,
          description: f.issue_description,
          status: parseInt(f.score) < 4 ? "Open" : "Closed",
        })),
      });
    }

    return res.json(reports);
  } catch (error) {
    console.error("❌ Error fetching grouped reports:", error);
    return res.status(500).json({ error: "Failed to load grouped reports" });
  }
};

export const getReportsGroupedBySection = async (req, res) => {
  try {
    const managerId = req.user.employee_number;

    // 1. Получить все аудиты менеджера
    const auditRecords = await AuditRecord.findAll({
      where: { fab_manager_id: managerId },
      include: [{ model: User, as: "employee", attributes: ["employee_number", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    const sectionsMap = new Map(); // { sectionTitle: { section, reports: [] } }

    for (const audit of auditRecords) {
      const findings = await SWAReport.findAll({
        where: { audit_record_id: audit.id },
        include: [
          { model: AuditQuestion, attributes: ["id", "text"], include: ["AuditSection"] },
        ],
      });

      if (!findings.length) continue;

      const hasOpen = findings.some((f) => parseInt(f.score) < 4);
      const reportStatus = hasOpen ? "Open" : "Closed";

      const groupedQuestions = {};

      for (const f of findings) {
        const sectionTitle = f.AuditQuestion?.AuditSection?.title || "Unknown Section";

        if (!groupedQuestions[sectionTitle]) {
          groupedQuestions[sectionTitle] = [];
        }

        groupedQuestions[sectionTitle].push({
          questionId: f.question_id,
          text: f.AuditQuestion?.text || "Unknown",
          score: f.score,
          description: f.issue_description,
          status: parseInt(f.score) < 4 ? "Open" : "Closed",
        });
      }

      // распределить вопросы по секциям
      for (const [sectionTitle, questions] of Object.entries(groupedQuestions)) {
        if (!sectionsMap.has(sectionTitle)) {
          sectionsMap.set(sectionTitle, { section: sectionTitle, reports: [] });
        }

        sectionsMap.get(sectionTitle).reports.push({
          reportId: audit.id,
          type: "SWA Report",
          createdAt: audit.createdAt,
          createdBy: audit.employee,
          status: reportStatus,
          questions,
        });
      }
    }

    return res.json([...sectionsMap.values()]);
  } catch (error) {
    console.error("❌ Error grouping reports by section:", error);
    return res.status(500).json({ error: "Failed to group reports by section" });
  }
};
 
// controllers/swaReportController.js


export const getSectionSummary = async (req, res) => {
  try {
    const summary = await sequelize.query(`
      SELECT 
        ar.id AS audit_id,
        s.id AS section_id,
        s.title AS section_title,
        u.name AS user_name,
        COUNT(r.id) AS total_questions,
        SUM(CASE WHEN r.status = 'Open' THEN 1 ELSE 0 END) AS open_issues,
        SUM(CASE WHEN r.status = 'Closed' THEN 1 ELSE 0 END) AS closed_issues,
        MAX(r.reported_at) AS last_reported_at,
        CASE 
          WHEN SUM(CASE WHEN r.status = 'Open' THEN 1 ELSE 0 END) > 0 THEN 'Open'
          ELSE 'Closed'
        END AS overall_status
      FROM \`swa-reports\` r
      JOIN auditsections s ON s.id = r.section_id
      JOIN auditrecords ar ON ar.id = r.audit_record_id
      JOIN users u ON u.employee_number = ar.employee_number
      GROUP BY ar.id, s.id, s.title, u.name
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(summary);
  } catch (err) {
    console.error("❌ Summary error:", err);
    res.status(500).json({ error: "Failed to fetch report summary" });
  }
};
// controllers/swaReportController.js


export const closeSectionIfAllClosed = async (req, res) => {
  const { auditId, sectionId } = req.params;

  try {
    // 1. Проверим: все ли вопросы в этой секции закрыты
    const sectionQuestions = await SWAReport.findAll({
      where: {
        audit_record_id: auditId,
        section_id: sectionId,
      },
    });

    const allSectionClosed = sectionQuestions.every(q => q.status === "Closed");

    if (!allSectionClosed) {
      return res.status(400).json({ message: "Not all questions in section are closed" });
    }

    // 2. Теперь проверим: все ли вопросы по ВСЕМ секциям этого аудита закрыты
    const allAuditQuestions = await SWAReport.findAll({
      where: { audit_record_id: auditId },
    });

    const allAuditClosed = allAuditQuestions.every(q => q.status === "Closed");

    // 3. Если да — обновим статус в auditrecords
    if (allAuditClosed) {
      await AuditRecord.update(
        { auditStatus: "Completed" },
        { where: { id: auditId } }
      );
    }

    return res.json({
      message: allAuditClosed
        ? "✅ Section closed and full audit marked as completed"
        : "✅ Section closed",
    });
  } catch (error) {
    console.error("❌ Failed to close section:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getSectionDetails = async (req, res) => {
  try {
    const { auditId, sectionId } = req.params;

    const reports = await SWAReport.findAll({
      where: {
        audit_record_id: auditId,
        section_id: sectionId,
      },
      include: [
        {
          model: AuditQuestion,
          attributes: ["text"], // 👈 important
        },
      ],
      attributes: [
        "id",
        "issue_description",
        "corrective_action",
        "status",
      ],
    });

    const result = reports.map((r) => ({
      id: r.id,
      question_text: r.AuditQuestion?.text || "—",
      issue_description: r.issue_description,
      corrective_action: r.corrective_action,
      status: r.status,
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Failed to fetch section details", error);
    res.status(500).json({ error: "Failed to fetch section details" });
  }
};

export const updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const employee_number = req.user?.employee_number; // предполагаем, что юзер авторизован

  try {
    const report = await SWAReport.findByPk(id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    const updateData = { status };

    if (status === "Closed") {
      updateData.closed_by = employee_number;
      updateData.closed_at = new Date();
    } else {
      updateData.closed_by = null;
      updateData.closed_at = null;
    }

    await report.update(updateData);

    res.json({
      message: `Status updated to ${status}`,
      updated: updateData,
    });
  } catch (error) {
    console.error("❌ Error updating report status:", error);
    res.status(500).json({ error: "Failed to update report status" });
  }
};

