const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"AI Assistant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('✅ Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending email:', err);
    throw err;
  }
};


module.exports = sendEmail;
