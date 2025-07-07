require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

(async () => {
  try {
    await sendEmail(
      'aniket.jadhav20703@gmail.com',
      '🔧 Test Email from AI Assistant',
      '<h1>This is a test email</h1><p>Sent using Nodemailer ✅</p>'
    );
    console.log('✅ Test email sent');
  } catch (err) {
    console.error('❌ Test email failed:', err);
  }
})();
