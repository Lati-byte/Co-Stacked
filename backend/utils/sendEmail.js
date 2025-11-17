// backend/utils/sendEmail.js

const sendEmail = async (options) => {
  const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
  const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

  if (!MAILERSEND_API_KEY) {
    console.error("MailerSend API key is missing. Please check your .env file.");
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
    html: options.html, // Pass along HTML content if it exists
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

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error("MailerSend API Error:", errorData);
      throw new Error(`Failed to send email. Status: ${response.status}`);
    }
    
    console.log(`Email sent successfully to ${options.to}`);
    // You can optionally return the response data if needed
    return await response.json();

  } catch (error) {
    console.error("Error in sendEmail utility:", error);
    // Re-throw to be caught by the calling controller
    throw error;
  }
};

module.exports = sendEmail;