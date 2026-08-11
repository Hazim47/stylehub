const bcrypt = require("bcrypt");

const { Admin } = require("../models");

async function createAdmin() {
  try {
    const count = await Admin.count();

    if (count > 0) {
      console.log("Admin already exists");
      return;
    }

    const username = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!username || !adminPassword) {
      throw new Error(
        "ADMIN_USERNAME and ADMIN_PASSWORD must be configured in .env",
      );
    }

    if (adminPassword.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters");
    }

    const password = await bcrypt.hash(adminPassword, 12);

    await Admin.create({
      username: username.trim(),
      password,
    });

    console.log("✅ Default Admin Created");
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error.message);
    throw error;
  }
}

module.exports = createAdmin;
