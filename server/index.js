const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_login_app",
  password: "Basutkar",
  port: 5432,
});

// Create users table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) DEFAULT '',
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    phone VARCHAR(20) DEFAULT ''
  )
`).then(() => {
  console.log("Users table is ready");
}).catch((err) => {
  console.error("Error creating table:", err.message);
});

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, "secret");

    res.json({ token, name: user.rows[0].name });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Login error" });
  }
});

// GET PROFILE - needs token
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, "secret");
    const user = await pool.query("SELECT id, name, email, phone FROM users WHERE id = $1", [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error getting profile" });
  }
});

// UPDATE PROFILE - needs token
app.put("/api/profile", async (req, res) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, "secret");
    const { name, phone } = req.body;

    await pool.query(
      "UPDATE users SET name = $1, phone = $2 WHERE id = $3",
      [name, phone, decoded.id]
    );

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});