import { env } from "@/config/env";
import { TransactionStatus, type TransactionType } from "@/db/enums";
import type { Request, Response } from "express";
import { Transaction } from "fedapay";
import { prisma } from "@/utils/prisma";

export async function initiatePayment(req: Request, res: Response) {
  const { amount, type, cooperativeId, voteId, description } = req.body;

  if (!amount || !type || !cooperativeId) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const coop = await prisma.cooperatives.findUnique({
      where: { id: cooperativeId },
    });

    if (!coop || !coop.fedapayApiKeySecret) {
      return res
        .status(404)
        .json({ message: "Coopérative ou configuration FedaPay manquante" });
    }

    // Ici on utiliserait normalement la clé de la coopérative
    // Pour le MVP on utilise la clé globale configurée dans server.ts

    const fedapayTx = await Transaction.create({
      description: description || `Paiement CoopLedger - ${type}`,
      amount: Number(amount),
      currency: { iso: "XOF" },
      callbackUrl: `https://${env.API_BASE_URL}/api/payments/callback`,
      customer: {
        email: req.session.user.email,
        firstname: req.session.user.name,
      },
    });

    const token = await fedapayTx.generateToken();

    // Enregistrement de la transaction en PENDING dans notre DB
    await prisma.transactions.create({
      data: {
        amount: Number(amount),
        type: type as TransactionType,
        status: TransactionStatus.PENDING,
        userId: req.session.user.id,
        cooperativeId: cooperativeId,
        voteId: voteId || null,
      },
    });

    res.status(200).json({ url: token.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'initiation du paiement" });
  }
}

export async function paymentCallback(req: Request, res: Response) {
  const { id, status } = req.body; // Selon format webhook FedaPay

  // Logique simplifiée pour le MVP
  if (status === "approved") {
    // 1. Déclencher le worker BullMQ pour la séquence atomique (IPFS + Blockchain)
    // 2. Mettre à jour le statut en CONFIRMED
  }

  res.status(200).send("Webhook received");
}
