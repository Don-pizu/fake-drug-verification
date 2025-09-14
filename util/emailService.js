//util/emailService.js

const nodemailer = require("nodemailer");

exports.sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
     tls: {
      rejectUnauthorized: false, //  allow self-signed certs
    },
  });

  await transporter.sendMail({
    from: `"MedCheck OTP" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your Registration OTP Code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
  });

  console.log(`OTP sent to ${to}: ${otp}`); // dev log
};
