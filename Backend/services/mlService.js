const axios = require("axios");

const getImportanceFromML = async (reason) => {
  try {
    const ML_API_URL = process.env.ML_API_URL;

    console.log("🔥 Using ML_API_URL:", ML_API_URL);
    console.log("🔥 Calling ML with reason:", reason);

    if (!ML_API_URL) {
      console.warn("ML_API_URL not set, defaulting to Normal");
      return "Normal";
    }

    const response = await axios.post(`${ML_API_URL}/predict`, {
      reason
    });

    console.log("🔥 ML RESPONSE:", response.data);

    return response.data.importance || "Normal";
  } catch (error) {
    console.error(
      "ML Service Error:",
      error.response?.data || error.message
    );
    return "Normal"; // fallback
  }
};

module.exports = { getImportanceFromML };
