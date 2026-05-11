import type { Request, Response } from "express";
import * as IdentityService from "@/services/identity.service";

export const finalizeOnboarding = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const updatedUser = await IdentityService.onboardUserBlockchain(userId);

    res.status(200).json({
      message: "Identité blockchain générée",
      publicKey: updatedUser.publicKey,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: error });
  }
};
