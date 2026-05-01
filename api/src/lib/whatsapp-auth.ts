import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db/config";
import { user, whatsappVerification } from "@/db/schema";
import { WhatsAppService } from "@/lib/whatsapp";

// biome-ignore lint/complexity/noStaticOnlyClass: ignore
export class WhatsAppAuthService {
  static async generateAndSendCode(userId: string, phoneNumber: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.insert(whatsappVerification).values({
      id: nanoid(),
      userId,
      code,
      expiresAt,
    });

    await db.update(user).set({ phoneNumber: phoneNumber }).where(eq(user.id, userId));

    await WhatsAppService.sendConfirmationCode(phoneNumber, code);
    return { success: true };
  }

  static async verifyCode(userId: string, code: string) {
    const verification = await db.query.whatsappVerification.findFirst({
      where: and(eq(whatsappVerification.userId, userId), eq(whatsappVerification.code, code)),
    });

    if (!verification || new Date() > verification.expiresAt) {
      return { success: false, error: "Invalid or expired code" };
    }

    await db.update(user).set({ isWhatsappVerified: true }).where(eq(user.id, userId));

    // Clean up verification code
    await db.delete(whatsappVerification).where(eq(whatsappVerification.id, verification.id));

    return { success: true };
  }
}
