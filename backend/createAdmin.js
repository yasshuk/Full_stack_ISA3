require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./db");

async function createAdmin() {
  try {
    const name = "Admin";
    const email = "admin@gmail.com";
    const password = "Admin@123";
    const role = "admin";

    // Check if admin already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      console.log("Admin already exists.");
      process.exit();
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await db.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    console.log("Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();