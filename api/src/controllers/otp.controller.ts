import type { Request, Response } from "express";
import * as OTPService from "@/services/otp.service";
import * as WhatsAppService from "@/services/whatsapp.service";

export const sendOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Numéro de téléphone requis" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await OTPService.setOTP(phone, code);
    await WhatsAppService.sendWhatsAppOTP(phone, code);
    res.status(200).json({ message: "Code OTP envoyé via WhatsApp" });
  } catch (error) {
    console.error("Erreur envoi OTP:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'OTP" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: "Téléphone et code requis" });
  }

  try {
    const savedCode = await OTPService.getOTP(phone);

    if (savedCode === code) {
      await OTPService.deleteOTP(phone);
      res.status(200).json({ message: "Code OTP valide", success: true });
    } else {
      res.status(400).json({ message: "Code OTP invalide ou expiré", success: false });
    }
  } catch (error) {
    console.error("Erreur vérification OTP:", error);
    res.status(500).json({ message: "Erreur lors de la vérification de l'OTP" });
  }
};
