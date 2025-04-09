import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import AuditRecord from "./AuditRecord.js";
import AuditSection from "./AuditSection.js";
import AuditQuestion from "./AuditQuestion.js";
import User from "./User.js";

const SWAReport = sequelize.define("SWAReport", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  audit_record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: AuditRecord, key: "id" },
    onDelete: "CASCADE",
  },

  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: AuditSection, key: "id" },
    onDelete: "CASCADE",
  },

  question_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: AuditQuestion, key: "id" },
    onDelete: "SET NULL",
  },

  reported_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  status: {
    type: DataTypes.ENUM("Open", "Closed"),
    allowNull: false,
    defaultValue: "Open",
  },

  score: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: { min: 1, max: 4 },
    set(value) {
      this.setDataValue("score", value);
      this.setDataValue("status", value === 4 ? "Closed" : "Open");
    },
  },

  issue_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  supporting_media: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  corrective_action: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  closed_by: {
    type: DataTypes.STRING(20),
    allowNull: true,
    references: { model: User, key: "employee_number" },
    onDelete: "SET NULL",
  },

  closed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "swa-reports",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});



export default SWAReport;
