import { env } from "@/config/env";

export const sendWhatsAppOTP = async (to: string, code: string) => {
  return await fetch(new URL("/messages", env.GOWA_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-Id": env.GOWA_API_DEVICE_ID,
      Authorization: `Basic ${Buffer.from(env.GOWA_API_BASIC_AUTH).toString("base64")}`,
    },
    body: JSON.stringify({
      phone: to,
      message: `Votre code CoopLedger est ${code}`,
      mentions: [to],
    }),
  });
};
