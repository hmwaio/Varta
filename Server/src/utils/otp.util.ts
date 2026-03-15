import crypto from "crypto";
export const generateOTP = () => {
  const otp = crypto
    .randomInt(0, 1000000)
    .toString()
    .padStart(6, "0");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  return { otp, expiresAt, hashedOtp };
};

export const hashOTP = (otp: string) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
