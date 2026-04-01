const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_login_app",
  password: "Basutkar",
  port: 5432,
});

// 📝 REGISTER API
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 🔐 LOGIN API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).send("User not found");
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return res.status(400).send("Wrong email or password");
    }

    const token = jwt.sign({ id: user.rows[0].id }, "secret");

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Login error");
  }
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});