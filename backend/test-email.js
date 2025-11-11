// test-email.js
require('dotenv').config(); // Make sure to load your .env file
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Using User:', process.env.EMAIL_USER);
  console.log('Using Pass:', process.env.EMAIL_PASS ? 'Exists' : 'MISSING!');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send it to yourself for testing
      subject: 'Nodemailer Test from Local',
      text: 'If you received this, your credentials are correct!',
    });
    console.log('SUCCESS! Message sent:', info.messageId);
  } catch (error) {
    console.error('!!! LOCAL TEST FAILED !!!');
    console.error(error);
  }
}

testEmail();