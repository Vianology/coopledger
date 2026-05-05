import { prisma } from "utils/prisma";
import { blockchainQueue } from "utils/queue";

export const initiateDeposit = async (
  userId: string,
  amount: number,
  ipfsCid: string,
) => {
  const tx = await prisma.transactions.create({
    data: {
      userId,
      amount,
      type: "DEPOSIT",
      status: "PENDING",
      ipfsCid,
    },
  });

  await blockchainQueue.add("process-deposit", { txId: tx.id });

  return tx;
};
