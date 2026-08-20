import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

console.log("========== DATABASE CONFIG ==========");
console.log("SERVER:", dbConfig.server);
console.log("PORT:", dbConfig.port);
console.log("DATABASE:", dbConfig.database);
console.log("====================================");

export const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};