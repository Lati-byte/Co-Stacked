// backend/utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object using AhaSend's SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.AHA_SMTP_HOST,
    // --- THIS IS THE FIX ---
    // Use the alternative port 2525, which is less likely to be blocked.
    port: process.env.AHA_SMTP_PORT || 2525, 
    secure: false, // Port 2525 also uses STARTTLS, so `secure` remains false
    auth: {
      user: process.env.AHA_SMTP_USER,
      pass: process.env.AHA_SMTP_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `"${process.env.AHA_FROM_NAME}" <${process.env.AHA_FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // 3. Send the email and log the result
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to} via AhaSend on port 2525. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("AhaSend SMTP Error:", error);
    throw new Error('Email could not be sent via SMTP.');
  }
};

module.exports = sendEmail;