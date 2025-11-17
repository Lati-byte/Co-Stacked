// backend/utils/sendEmail.js
import fetch from "node-fetch";

const sendEmail = async (options) => {
  const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY;
  const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";
  const MAILERSEND_FROM_EMAIL = process.env.MAILERSEND_FROM_EMAIL;
  const MAILERSEND_FROM_NAME = process.env.MAILERSEND_FROM_NAME;

  // Check necessary env vars
  if (!MAILERSEND_API_KEY || !MAILERSEND_FROM_EMAIL || !MAILERSEND_FROM_NAME) {
    console.error("MailerSend env variables missing:", {
      apiKey: !!MAILERSEND_API_KEY,
      fromEmail: !!MAILERSEND_FROM_EMAIL,
      fromName: !!MAILERSEND_FROM_NAME,
    });
    throw new Error("MailerSend is not configured correctly");
  }

  // Validate to / subject / content
  if (!options.to) {
    throw new Error("No recipient email provided for sendEmail");
  }
  if (!options.subject) {
    throw new Error("No subject provided for sendEmail");
  }
  if (!options.text && !options.html) {
    throw new Error("Either text or html must be provided to sendEmail");
  }

  const emailPayload = {
    from: {
      email: MAILERSEND_FROM_EMAIL,
      name: MAILERSEND_FROM_NAME,
    },
    to: [
      { email: options.to, name: options.toName || undefined }
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

    const responseText = await response.text();
    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
    } catch (e) {
      responseBody = responseText;
    }

    if (!response.ok) {
      console.error("MailerSend API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
      });
      throw new Error(
        `MailerSend failed with status ${response.status}: ` +
        (responseBody?.message || JSON.stringify(responseBody))
      );
    }

    console.log(`MailerSend email sent to ${options.to}`, responseBody);
    return responseBody;
  } catch (err) {
    console.error("sendEmail - unexpected error:", err);
    throw err;
  }
};

export default sendEmail;
