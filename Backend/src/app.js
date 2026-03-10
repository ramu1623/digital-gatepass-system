// app.js
// Express app configuration

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------

// Enable CORS (safe for now, can restrict later)
app.use(cors()); // change it after frontend deploy

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ✅ STEP 5: Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// API ROUTES
// --------------------

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/student", require("./src/routes/studentRoutes"));
app.use("/api/coordinator", require("./src/routes/coordinatorRoutes"));
app.use("/api/hod", require("./src/routes/hodRoutes"));
app.use("/api/gatepass", require("./src/routes/gatepassRoutes"));

// --------------------
// SERVE FRONTEND (after build)
// --------------------

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "build", "index.html"));
    });
}

// --------------------
// DEFAULT ROUTE
// --------------------

app.get("/", (req, res) => {
    res.send("Digital Gate Pass System Backend is running 🚀");
});

module.exports = app;
