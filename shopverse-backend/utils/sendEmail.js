import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const mailOptions = {
    from: `"ShopVerse Support" <${process.env.EMAIL_USER}>`,
    to: options.email, 
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage,
    attachments: options.attachments || [], // <-- ADD THIS DYNAMIC LINE
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;