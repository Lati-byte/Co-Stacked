// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;