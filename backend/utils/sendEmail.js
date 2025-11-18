// backend/utils/sendEmail.js

const sendEmail = async (options) => {
  const AHASEND_API_KEY = process.env.AHA_API_KEY;
  const AHASEND_FROM_EMAIL = process.env.AHA_FROM_EMAIL;
  const AHASEND_FROM_NAME = process.env.AHA_FROM_NAME || 'CoStacked';
  
  const AHASEND_API_URL = "https://api.ahasend.com/v1/email"; 

  if (!AHASEND_API_KEY || !AHASEND_FROM_EMAIL) {
    console.error("FATAL: AhaSend API environment variables are missing!");
    throw new Error("Email service is not configured on the server.");
  }

  const emailPayload = {
    from: { email: AHASEND_FROM_EMAIL, name: AHASEND_FROM_NAME },
    to: [{ email: options.to }],
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const response = await fetch(AHASEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // --- THIS IS THE FIX ---
        // Use the 'X-API-KEY' header as requested by the AhaSend error message.
        "X-API-KEY": AHASEND_API_KEY,
        // The 'Authorization: Bearer ...' header is removed.
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("AhaSend API Error Response:", errorBody);
      throw new Error(`AhaSend API failed with status ${response.status}`);
    }
    
    console.log(`Email sent successfully to ${options.to} via AhaSend API.`);
    return await response.json();

  } catch (error) {
    console.error("Critical error in sendEmail utility:", error.message);
    throw new Error('Email could not be sent via API.');
  }
};

module.exports = sendEmail;