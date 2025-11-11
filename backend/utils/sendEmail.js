// backend/utils/sendEmail.js
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// Initialize the MailerSend client with your API token
const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN,
});

const sendEmail = async (options) => {
  // Create a Sender object. The email MUST be from a verified domain in MailerSend.
  const sentFrom = new Sender(process.env.EMAIL_USER, "CoStacked");
  
  // Create a Recipient object
  const recipients = [
    new Recipient(options.to),
  ];

  // Create the EmailParams object with all the details
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(options.subject)
    .setText(options.text);
    // For HTML emails, you would use .setHtml("<strong>...</strong>")

  try {
    console.log("Attempting to send email via MailerSend...");
    await mailersend.email.send(emailParams);
    console.log(`Email successfully sent to ${options.to} via MailerSend!`);
  } catch (error) {
    console.error("!!! MAILERSEND ERROR !!!");
    // MailerSend provides detailed errors in the response body
    console.error(error);
    if (error.body) {
      console.error("Error Body:", error.body);
    }
    throw new Error("Email could not be sent via MailerSend.");
  }
};

module.exports = sendEmail;