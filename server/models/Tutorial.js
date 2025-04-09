import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // ✅ Add .js extension for ESM

const Tutorial = sequelize.define("Tutorial", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true, // Adds `createdAt` & `updatedAt`
  tableName: "tutorials",
});

export default Tutorial;
