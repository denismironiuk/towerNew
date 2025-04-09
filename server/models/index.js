import sequelize from "../config/database.js";

// Import all models (only definitions, no associations here)
import User from "./User.js";
import Certification from "./Certification.js";
import UserCertification from "./UserCertification.js";
import Tutorial from "./Tutorial.js";
import UserTutorial from "./UserTutorial.js";
import AuditRecord from "./AuditRecord.js";
import AuditSection from "./AuditSection.js";
import AuditQuestion from "./AuditQuestion.js";
import SWAReport from "./SWAReport.js";
import Annualplan from "./Annualplan.js";
import SafetyAudit from "./SafetyAudit.js";
import Event from "./Event.js";

// Centralized associations
import applyAssociations from "./associations.js";

// Collect all models in one object
const models = {
  sequelize,
  User,
  Certification,
  UserCertification,
  Tutorial,
  UserTutorial,
  AuditRecord,
  AuditSection,
  AuditQuestion,
  SWAReport,
  Annualplan,
  SafetyAudit,
  Event,
};

// Apply all associations here
applyAssociations(models);

export default models;
