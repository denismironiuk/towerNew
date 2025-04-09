import AuditSection from  '../models/AuditSection.js'
import AuditQuestion from '../models/AuditQuestion.js'

// ✅ Get all audit sections
export const getAuditSections = async (req, res) => {
  try {
    const sections = await AuditSection.findAll();
    res.json(sections);
  } catch (error) {
    console.error("❌ Error fetching audit sections:", error);
    res.status(500).json({ error: "Failed to retrieve audit sections" });
  }
};
// ✅ Get a specific audit section by ID
export const getAuditSectionById = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await AuditSection.findOne({ where: { id: sectionId } }); // <-- fixed

    if (!section) {
      return res.status(404).json({ error: "Audit section not found" });
    }

    res.json(section);
  } catch (error) {
    console.error("❌ Error fetching audit section:", error);
    res.status(500).json({ error: "Failed to retrieve audit section" });
  }
};

// ✅ Get all questions for a specific section
export const getAuditQuestionsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const questions = await AuditQuestion.findAll({
      where: { section_id: sectionId }, // <-- fixed
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: "No questions found for this section" });
    }

    res.json(questions);
  } catch (error) {
    console.error("❌ Error fetching audit questions:", error);
    res.status(500).json({ error: "Failed to retrieve audit questions" });
  }
};



