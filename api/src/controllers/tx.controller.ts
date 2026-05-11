import type { Request, Response } from "express";
import * as TxService from "@/services/tx.service";
import { auth } from "@/utils/auth";

export const deposit = async (req: Request, res: Response) => {
  try {
    const { amount, ipfsCid, cooperativeId } = req.body;

    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          headers.append(key, v);
        });
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }
    const session = await auth.api.getSession({
      headers,
    });

    if (!session) throw new Error("Utilisateur non authentifié");

    const tx = await TxService.initiateDeposit(
      session.user.id,
      amount,
      ipfsCid,
      cooperativeId,
    );

    res.status(202).json({
      message: "Cotisation enregistrée, en attente de validation blockchain",
      transactionId: tx.id,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: error });
  }
};
