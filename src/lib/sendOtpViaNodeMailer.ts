// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpViaNodeMailer = async (email: any, username: string, otp: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Registration",
    text: `Hay ${username} Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email error is" };
  } catch (error) {
    console.log("Email error is");
    return { success: false, message: "Email error is" };
  }
};
