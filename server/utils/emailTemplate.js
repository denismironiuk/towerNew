export const generateAuditSummaryEmail = ({ auditId, employeeName, issues }) => {
    const rows = issues.map((item, i) => `
      <tr>
        <td style="padding:8px; border:1px solid #ccc;">${i + 1}</td>
        <td style="padding:8px; border:1px solid #ccc;">${item.section}</td>
        <td style="padding:8px; border:1px solid #ccc;">${item.question}</td>
        <td style="padding:8px; border:1px solid #ccc;">${item.score}</td>
        <td style="padding:8px; border:1px solid #ccc;">${item.description}</td>
        <td style="padding:8px; border:1px solid #ccc;">${item.corrective_action}</td>
      </tr>`).join("");
  
    return `
      <div style="font-family:Arial,sans-serif; color:#333;">
        <h2>🧾 SWA Audit Summary — Issues Found</h2>
        <p><strong>Audit ID:</strong> ${auditId}</p>
        <p><strong>Submitted by:</strong> ${employeeName}</p>
  
        <table style="border-collapse:collapse; width:100%; margin-top:16px;">
          <thead style="background:#f5f5f5;">
            <tr>
              <th>#</th><th>Section</th><th>Question</th><th>Score</th><th>Description</th><th>Corrective Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
  
        <p style="margin-top:24px;">Please review these findings.</p>
      </div>
    `;
  };
  