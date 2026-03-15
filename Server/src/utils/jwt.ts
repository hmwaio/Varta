import jwt from 'jsonwebtoken';
import type { UserTokenPayLoad } from "../types/auth.type.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

export const signToken = (payload: UserTokenPayLoad): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};

export const verifyToken = (token: string): UserTokenPayLoad | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserTokenPayLoad;
    return decoded;
  } catch (error) {
    return null;
  }
}
