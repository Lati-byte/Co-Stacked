// backend/utils/sendEmail.js

const sendEmail = async (options) => {
  const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
  const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";
  const MAILERSEND_FROM_EMAIL = process.env.MAILERSEND_FROM_EMAIL;
  const MAILERSEND_FROM_NAME = process.env.MAILERSEND_FROM_NAME;

  // --- RIGOROUS CHECKING ---
  if (!MAILERSEND_API_KEY || !MAILERSEND_FROM_EMAIL || !MAILERSEND_FROM_NAME) {
    console.error("FATAL: MailerSend environment variables are missing!");
    console.error(`API Key Loaded: ${!!MAILERSEND_API_KEY}`);
    console.error(`From Email Loaded: ${!!MAILERSEND_FROM_EMAIL}`);
    console.error(`From Name Loaded: ${!!MAILERSEND_FROM_NAME}`);
    throw new Error("Email service is not configured correctly on the server.");
  }

  const emailPayload = {
    from: {
      email: MAILERSEND_FROM_EMAIL,
      name: MAILERSEND_FROM_NAME,
    },
    to: [
      { email: options.to }
    ],
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const response = await fetch(MAILERSEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    // --- IMPROVED ERROR LOGGING ---
    if (!response.ok) {
      // Try to get the detailed error message from MailerSend's response body
      let errorBody = 'Could not parse error response.';
      try {
        errorBody = await response.json();
      } catch (e) {
        // Ignore parsing error if body is not JSON
      }
      
      console.error("MailerSend API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });

      throw new Error(`Failed to send email via MailerSend. Status: ${response.status}`);
    }
    
    console.log(`Email sent successfully to ${options.to} via MailerSend.`);
    return await response.json();

  } catch (error) {
    console.error("Critical error in sendEmail utility:", error);
    throw error;
  }
};

module.exports = sendEmail;