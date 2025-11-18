// backend/utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object using AhaSend's SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.AHA_SMTP_HOST,
    port: process.env.AHA_SMTP_PORT,
    secure: false, // Port 587 uses STARTTLS, so `secure` is false
    auth: {
      user: process.env.AHA_SMTP_USER, // Your AhaSend Username from .env
      pass: process.env.AHA_SMTP_PASS, // Your AhaSend Password from .env
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
    console.log(`Email sent successfully to ${options.to} via AhaSend. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("AhaSend SMTP Error:", error);
    // Re-throw the error so the calling controller knows something went wrong.
    throw new Error('Email could not be sent via SMTP.');
  }
};

module.exports = sendEmail;