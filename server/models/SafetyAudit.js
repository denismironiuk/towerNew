import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SafetyAudit = sequelize.define(
  "SafetyAudit",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.STRING,
    },
    dueDate: {
      type: DataTypes.DATEONLY, // date only, without time
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME, // represents start time (e.g. 09:00)
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME, // represents end time (e.g. 10:00)
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    recurrence: {
      type: DataTypes.STRING,
      defaultValue: "none",
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "safetyaudits",
    timestamps: true, // ensure timestamps are enabled
  }
);

export default SafetyAudit;
