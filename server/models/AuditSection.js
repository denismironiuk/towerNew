import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AuditSection = sequelize.define("AuditSection", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'auditsections',
  timestamps: true,
});

export default AuditSection;