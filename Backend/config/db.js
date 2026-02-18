// config/db.js
// MongoDB connection logic

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);

    // Stop the app if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
