// backend/utils/sendEmail.js

const sendEmail = async (options) => {
  const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
  const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

  // Safety check to ensure the API key is loaded
  if (!MAILERSEND_API_KEY) {
    console.error("MailerSend API key is missing! Please check your .env file.");
    throw new Error("Email service is not configured.");
  }

  const emailPayload = {
    from: {
      email: process.env.MAILERSEND_FROM_EMAIL,
      name: process.env.MAILERSEND_FROM_NAME,
    },
    to: [
      { email: options.to }
    ],
    subject: options.subject,
    text: options.text,
    html: options.html, // The HTML version of the email
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

    // If MailerSend returns an error (like 401, 422), handle it
    if (!response.ok) {
      const errorData = await response.json();
      console.error("MailerSend API Error:", errorData);
      throw new Error(`Failed to send email via MailerSend. Status: ${response.status}`);
    }
    
    console.log(`Email successfully sent to ${options.to} via MailerSend.`);
    return await response.json();

  } catch (error) {
    console.error("Error within sendEmail utility:", error);
    // Re-throw the error so the calling controller's catch block can handle it
    throw error;
  }
};

module.exports = sendEmail;