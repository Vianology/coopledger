import { env } from "config/env";
import type { Request, Response } from "express";
import { Transaction } from "fedapay";

export async function membershipFee(req: Request, res: Response) {
  const transaction = await Transaction.create({
    description: "CoopLedger membership fee",
    amount: 100,
    currency: {
      iso: "XOF",
    },
    callbackUrl: `https://${env.API_BASE_URL}/api/payments/cotisation`,
    mode: "mtn_open",
    customer: {
      id: 1,
    },
  });

  transaction.save();
}
