// models/UserCertification.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Certification from "./Certification.js";

const UserCertification = sequelize.define("UserCertification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certification_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Certification,
      key: "id",
    },
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "user_certifications",
  timestamps: true,
});



export default UserCertification;