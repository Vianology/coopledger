import { env } from "@/config/env";

export const sendWhatsAppOTP = async (to: string, code: string) => {
  return await fetch(new URL("/send/message", env.GOWA_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(env.GOWA_API_BASIC_AUTH).toString("base64")}`,
    },
    body: JSON.stringify({
      phone: `${to}@s.whatsapp.net`,
      message: `Votre code CoopLedger est ${code}`,
      mentions: [to],
      duration: 300,
    }),
  });
};
