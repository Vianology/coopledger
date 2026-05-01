import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/db/config';
import { user, session } from '@/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const TOKEN_EXPIRY = '7d';

export const AuthService = {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  },

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  },

  async generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  },

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  },

  async createSession(userId: string) {
    const token = await this.generateToken(userId);
    const sessionId = crypto.randomUUID();

    await db.insert(session).values({
      id: sessionId,
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { token, sessionId };
  },

  async validateSession(token: string) {
    const payload = await this.verifyToken(token);
    if (!payload) return null;

    const sessionData = await db.query.session.findFirst({
      where: eq(session.token, token),
    });

    if (!sessionData || sessionData.expiresAt < new Date()) {
      return null;
    }

    return sessionData.userId;
  },
};
