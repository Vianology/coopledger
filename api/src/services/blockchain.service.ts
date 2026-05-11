import { ethers } from "ethers";
import { env } from "@/config/env";

const provider = new ethers.JsonRpcProvider(env.POLYGON_RPC_URL);
// Cette clé est celle du système (CoopLedger Admin) pour payer le GAS
const systemWallet = new ethers.Wallet(env.SYSTEM_PRIVATE_KEY, provider);

/**
 * Scelle une preuve de transaction sur la blockchain
 * @param dataHash Le hash (SHA256) des détails de la transaction (ID, Montant, Raison)
 */
export const sealTransactionOnChain = async (dataHash: string) => {
  // Pour le hackathon, on peut utiliser un Smart Contract simple "Registry"
  // qui stocke uniquement les Hash de transactions pour audit.

  // Exemple d'appel direct (Transaction de données)
  const tx = await systemWallet.sendTransaction({
    to: systemWallet.address, // On s'envoie à soi-même avec la donnée dans le champ 'data'
    data: ethers.hexlify(ethers.toUtf8Bytes(dataHash)),
  });

  return tx.hash;
};
