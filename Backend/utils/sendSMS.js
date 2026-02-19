const axios = require("axios");

const sendSMS = async (from, to, message) => {
  try {
    // 🔔 Try real SMS via Fast2SMS
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",          // Quick SMS
        message: message,
        numbers: to
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📨 SMS request sent to Fast2SMS");
  } catch (err) {
    // ⚠️ Fallback for demo / unpaid API
    console.error(
      "⚠️ Fast2SMS blocked API, switching to MOCK SMS:",
      err.response?.data || err.message
    );
    //The SMS is not actually sent by the coordinator’s phone/SIM it is by Fast2SMS
    console.log("----- SMS MOCK -----");
    console.log("From:", from);
    console.log("To:", to);
    console.log(message);
    console.log("--------------------");
  }
};

module.exports = sendSMS;
