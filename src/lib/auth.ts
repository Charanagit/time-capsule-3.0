import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'timecapsule-super-secret-key-3.0';

export interface TokenPayload {
  userId: string;
  username: string;
  role?: 'admin' | 'user';
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('timecapsule_session')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
