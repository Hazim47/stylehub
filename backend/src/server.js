require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

require("./models");

const createAdmin = require("./seeders/adminSeeder");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // اتصال قاعدة البيانات
    await sequelize.authenticate();

    console.log("✅ Database Connected");

    // مزامنة الجداول
    await sequelize.sync();

    console.log("✅ Database Synced");

    // إنشاء الأدمن إذا غير موجود
    await createAdmin();
    app.get("/api/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        message: "ZYA backend is running",
      });
    });
    // تشغيل السيرفر
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Error:", error);

    process.exit(1);
  }
}

startServer();
