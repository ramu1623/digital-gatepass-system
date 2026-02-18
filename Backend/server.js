// server.js
// Entry point of the backend application

const app = require("./app");
const connectDB = require("./config/db");

// Load environment variables
require("dotenv").config();
console.log("ML_API_URL =", process.env.ML_API_URL);
//local -> mongodb://devisriprasad18:1623ar@127.0.0.1:27017/gatepass_db?authSource=admin

// Connect to MongoDB
connectDB();

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
  