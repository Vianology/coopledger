import { Wallet } from "ethers";
import { prisma } from "@/utils/prisma";
import { encrypt } from "./crypto.service";

export const onboardUserBlockchain = async (userId: string) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur introuvable");

  if (user.publicKey) return user;

  const wallet = Wallet.createRandom();

  const encryptedKey = encrypt(wallet.privateKey);

  return await prisma.users.update({
    where: { id: userId },
    data: {
      publicKey: wallet.address,
      encryptedPrivateKey: encryptedKey,
    },
  });
};
