import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js"; // Import User model after defining both models

// Define AuditRecord model
const AuditRecord = sequelize.define("AuditRecord", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  employee_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: User, key: "employee_number" }, // FK to User
  },

  fab_manager_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: User, key: "employee_number" }, // FK to User
  },

  name: { type: DataTypes.STRING, allowNull: false },
  date_completed: { type: DataTypes.DATEONLY, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  shift: { type: DataTypes.ENUM("Morning", "Night"), allowNull: false },
  fab_area: { type: DataTypes.STRING, allowNull: false },
  toolset: { type: DataTypes.STRING, allowNull: false },
  additional_details: { type: DataTypes.TEXT, allowNull: true },

  auditStatus: {
    type: DataTypes.ENUM("Completed", "Incomplete", "Canceled"),
    allowNull: false,
    defaultValue: "Incomplete",
  },
}, {
  tableName: "auditrecords",
  timestamps: true,
});

// Set up the reverse relationship (AuditRecord -> User)


export default AuditRecord;
