// models/UserTutorial.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Tutorial from "./Tutorial.js";

const UserTutorial = sequelize.define("UserTutorial", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employee_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tutorial_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tutorial,
      key: "id",
    },
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "user_tutorials",
  timestamps: true,
});



export default UserTutorial;