import jwt, { SignOptions } from 'jsonwebtoken';
import env from '../../config/env';

export interface JWTPayload {
  sub: string; // user uuid
  email: string;
  iat: number;
  exp: number;
}

export const generateToken = (uuid: string, email: string): string => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: uuid,
    email,
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions;

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 