import { Sequelize } from "sequelize";
import dbConfigs from "./db.js"; // ✅ Add `.js` extension for ESM

const env = process.env.NODE_ENV || "development";
const dbConfig = dbConfigs[env]; // ✅ Access environment-specific config

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

// ✅ Test Database Connection
try {
  await sequelize.authenticate();
  console.log("✅ MySQL Database connected successfully!");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error);
}

export default sequelize;
