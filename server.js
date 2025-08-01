require('dotenv').config(); // Load environment variables

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/submit', async (req, res) => {
  const { firstName, lastName, phone, email, amount } = req.body;

  console.log("✅ New investment received:");
  console.log({ firstName, lastName, phone, email, amount });

  // Gmail transporter using environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email 1: Confirmation email to user and admin
  const confirmationMail = {
    from: `"Filaha Crowdfunding" <${process.env.EMAIL_USER}>`,
    to: `${email}, ${process.env.EMAIL_USER}`,
    subject: 'تأكيد استثمارك في مشروع تربية الدجاج',
    html: `
      <h2>✅ شكراً لك ${firstName} ${lastName}</h2>
      <p>📞 هاتفك: ${phone}</p>
      <p>💰 المبلغ المستثمر: ${amount} دج</p>
      <p>📧 البريد الإلكتروني: ${email}</p>
      <p>سيتم تأكيد الدفع بعد مراجعة التحويل عبر بريدي موب.</p>
    `
  };

  // Email 2: Internal admin email (text only)
  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: '📩 استثمار جديد',
    text: `
تم استلام استثمار جديد:

👤 الاسم: ${firstName} ${lastName}
📞 الهاتف: ${phone}
📧 البريد: ${email}
💰 المبلغ: ${amount} دج
    `
  };

  try {
    await transporter.sendMail(confirmationMail);
    await transporter.sendMail(adminMail);
    console.log('📬 Both emails sent successfully');
    res.status(200).json({ message: '📩 تم إرسال تأكيد الاستثمار عبر البريد' });
  } catch (error) {
    console.error('❌ خطأ في إرسال البريد:', error);
    res.status(500).json({ message: 'فشل إرسال البريد الإلكتروني' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
