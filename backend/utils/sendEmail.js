// backend/utils/sendEmail.js
import fetch from "node-fetch";  

const sendEmail = async ({ to, subject, text, html }) => {
  const API_KEY = process.env.AHASEND_API_KEY;
  const ACCOUNT_ID = process.env.AHASEND_ACCOUNT_ID;
  const FROM_EMAIL = process.env.AHA_FROM_EMAIL;
  const FROM_NAME = process.env.AHA_FROM_NAME || "Co-Stacked";
  
  if (!API_KEY || !ACCOUNT_ID || !FROM_EMAIL) {
    console.error("Missing AhaSend API config:", {
      API_KEY: !!API_KEY,
      ACCOUNT_ID: !!ACCOUNT_ID,
      FROM_EMAIL
    });
    throw new Error("Email service is not configured correctly.");
  }

  const url = `https://api.ahasend.com/v2/accounts/${ACCOUNT_ID}/messages`;
  const payload = {
    from: { email: FROM_EMAIL, name: FROM_NAME },
    recipients: [{ email: to }],
    subject,
    text_content: text,
    html_content: html
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json();
  if (!response.ok) {
    console.error("AhaSend API v2 Error:", { status: response.status, body });
    throw new Error(`AhaSend API failed: ${body.error?.message || body}`);
  }

  console.log("Email sent via AhaSend API v2:", body);
  return body;
};

export default sendEmail;
