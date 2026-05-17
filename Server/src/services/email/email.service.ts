import nodemailer from "nodemailer";
import { otpEmailTemplate } from "../../templates/sendOTPEmail.template.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (
  email: string,
  otp: string,
  magicLink: string,
) => {
  const emailTemplate = otpEmailTemplate({ otp, magicLink });
  await transporter.sendMail({
    from: `"Varta" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: `Varta verification code`,
    html: emailTemplate,
  });
};

export const testConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Brevo connection successful");
  } catch (error) {
    console.log("❌ Brevo connection failed", error);
  }
};
