import { Worker } from "bullmq";
import { ethers } from "ethers";
import { decrypt } from "@/services/crypto.service";
import { prisma } from "@/utils/prisma";
import { blockchainQueue } from "@/utils/queue";

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

const worker = new Worker(
  "blockchain-transactions",
  async (job) => {
    const { txId } = job.data;

    const txData = await prisma.transactions.findUnique({
      where: { id: txId },
      include: { user: true },
    });

    if (!txData?.user.encryptedPrivateKey) return;

    try {
      // 1. Déchiffrement de la clé pour signer
      const privateKey = decrypt(txData.user.encryptedPrivateKey);
      const wallet = new ethers.Wallet(privateKey, provider);

      // 2. Interaction avec ton Smart Contract (ex: recordDeposit)
      // const contract = new ethers.Contract(ADDR, ABI, wallet);
      // const receipt = await contract.recordDeposit(...);

      // Simulation d'envoi pour le test
      console.log(`Traitement de la transaction ${txId} sur Polygon...`);
      const fakeHash = `0x${Math.random().toString(16).slice(2)}`;

      // 3. Mise à jour finale dans Neon
      await prisma.transactions.update({
        where: { id: txId },
        data: {
          status: "CONFIRMED",
          blockchainHash: fakeHash,
        },
      });
    } catch (error) {
      console.error(`Erreur worker sur la transaction ${txId}:`, error);
      throw error; // Permet à BullMQ de retenter le job
    }
  },
  {
    connection: blockchainQueue.opts.connection,
  },
);
