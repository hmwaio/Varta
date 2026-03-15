import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

/* Hash Password */
export const hashPassword = async (password: string): Promise <string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/* Check DB, and return password valid or invalid */
export const verifyPassword = async (password: string, hash: string): Promise <boolean> => {
  return await bcrypt.compare(password, hash);
}