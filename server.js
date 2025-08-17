const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const PORT = 3000;
// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve HTML, CSS, JS, images
// Connect to SQLite (creates users.db if not exists)
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to SQLite database.");
});
// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT,
  password TEXT
)`);
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.json({ success: false, message: "Error creating account" });

    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hash],
      function (err) {
        if (err) {
          return res.json({ success: false, message: "Username already exists" });
        }
        res.json({ success: true });
      }
    );
  });
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (!row) return res.json({ success: false, message: "Invalid username or password" });

    bcrypt.compare(password, row.password, (err, same) => {
      if (err) return res.json({ success: false, message: "Error checking password" });
      if (!same) return res.json({ success: false, message: "Invalid username or password" });
      res.json({ success: true });
    });
  });
});
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});