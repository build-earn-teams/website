import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

export const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
