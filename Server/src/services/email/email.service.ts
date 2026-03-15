import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string, magicLink: string) => {
  await transporter.sendMail({
    from: `"Varta" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: `${otp} is your Varta verification code`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#09090b;color:#fafafa;border-radius:12px;">
        <h2 style="margin:0 0 4px;">⚡ Varta</h2>
        <p style="color:#a1a1aa;margin:0 0 32px;font-size:14px;">Verify your email to continue</p>

        <p style="color:#71717a;font-size:13px;margin:0 0 8px;">YOUR ONE-TIME CODE</p>
        <p style="font-size:48px;font-weight:700;letter-spacing:8px;margin:0 0 8px;color:#a78bfa;">${otp}</p>
        <p style="color:#52525b;font-size:13px;margin:0 0 32px;">Expires in 5 minutes. Do not share this.</p>

        <p style="color:#71717a;font-size:13px;margin:0 0 12px;">OR CLICK TO VERIFY INSTANTLY</p>
        <a href="${magicLink}"
           style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">
          ✓ Verify My Email
        </a>

        <p style="color:#3f3f46;font-size:12px;margin-top:32px;">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
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
