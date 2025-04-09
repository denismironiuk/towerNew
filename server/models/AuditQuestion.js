import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import AuditSection from "./AuditSection.js";

const AuditQuestion = sequelize.define("AuditQuestion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AuditSection,
      key: "id", // references AuditSection.id
    },
    onDelete: "CASCADE",
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  example: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "auditquestions",
  timestamps: true,
});


export default AuditQuestion;
