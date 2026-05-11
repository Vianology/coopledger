import { Worker } from "bullmq";
import { prisma } from "@/utils/prisma";
import { blockchainQueue } from "@/utils/queue";
import { ProofType, recordProofOnChain } from "@/services/blockchain.service";

const worker = new Worker(
  "blockchain-transactions",
  async (job) => {
    const { txId } = job.data;

    const txData = await prisma.transactions.findUnique({
      where: { id: txId },
    });

    if (!txData) return;

    try {
      console.log(`Traitement de la transaction ${txId} sur Polygon Amoy...`);

      // On utilise le service blockchain pour enregistrer la preuve
      // Note: On suppose que ipfsCid est présent si on arrive ici
      const blockchainHash = await recordProofOnChain(
        txData.cooperativeId,
        txData.id, // On utilise l'ID de la transaction comme base pour le hash de reçu pour le moment
        txData.ipfsCid || "",
        txData.amount,
        txData.type === "COTISATION" ? ProofType.COTISATION : ProofType.RETRAIT
      );

      // Mise à jour finale dans la base de données
      await prisma.transactions.update({
        where: { id: txId },
        data: {
          status: "CONFIRMED",
          blockchainHash: blockchainHash,
        },
      });

      console.log(`Transaction ${txId} confirmée sur blockchain: ${blockchainHash}`);
    } catch (error) {
      console.error(`Erreur worker sur la transaction ${txId}:`, error);
      throw error;
    }
  },
  {
    connection: blockchainQueue.opts.connection,
  },
);
