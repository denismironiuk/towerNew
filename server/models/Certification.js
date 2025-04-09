import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // ✅ .js extension

const Certification = sequelize.define(
  "Certification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "certifications",
    timestamps: true, // ✅ adds createdAt & updatedAt
  }
);

export default Certification;
