import { ethers } from "ethers";
import { env } from "@/config/env";

const provider = new ethers.JsonRpcProvider(env.POLYGON_RPC_URL);
// Cette clé est celle du système (CoopLedger Admin) pour payer le GAS
const systemWallet = new ethers.Wallet(env.SYSTEM_PRIVATE_KEY, provider);

const contractABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_cooperativeId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_receiptHash",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_lighthouseCid",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_proofType",
        type: "uint8",
      },
    ],
    name: "recordProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_lighthouseCid",
        type: "string",
      },
    ],
    name: "verifyProof",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_cooperativeId",
        type: "bytes32",
      },
    ],
    name: "getCoopProofCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_cooperativeId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getCoopProof",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "cooperativeId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "receiptHash",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "lighthouseCid",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "proofType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct CoopLedgerRegistry.Proof",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contract = new ethers.Contract(
  env.CONTRACT_ADDRESS,
  contractABI,
  systemWallet,
);

export enum ProofType {
  COTISATION = 0,
  RETRAIT = 1,
  VOTE_RESULT = 2,
}

/**
 * Enregistre une preuve sur la blockchain
 */
export const recordProofOnChain = async (
  cooperativeId: string,
  receiptHash: string,
  lighthouseCid: string,
  amount: number,
  proofType: ProofType,
) => {
  // Conversion de l'ID coopérative en bytes32 (format attendu par le contrat)
  // On suppose que l'ID est un UUID ou une chaîne transformable en bytes32
  // Si c'est un UUID, on peut le hasher ou le formater.
  // Ici on utilise keccak256 pour garantir un bytes32 cohérent.
  const coopIdBytes32 = ethers.id(cooperativeId);
  const receiptHashBytes32 = receiptHash.startsWith("0x")
    ? receiptHash
    : ethers.id(receiptHash);

  const tx = await contract.recordProof(
    coopIdBytes32,
    receiptHashBytes32,
    lighthouseCid,
    ethers.parseUnits(amount.toString(), 18), // Ajuster les décimales si nécessaire
    proofType,
  );

  await tx.wait();
  return tx.hash;
};

/**
 * Vérifie si un CID est enregistré sur la blockchain
 */
export const verifyProofOnChain = async (lighthouseCid: string) => {
  return await contract.verifyProof(lighthouseCid);
};

/**
 * Scelle une preuve de transaction sur la blockchain (Legacy/Simple)
 * @param dataHash Le hash (SHA256) des détails de la transaction (ID, Montant, Raison)
 */
export const sealTransactionOnChain = async (dataHash: string) => {
  const tx = await systemWallet.sendTransaction({
    to: systemWallet.address,
    data: ethers.hexlify(ethers.isHexString(dataHash) ? dataHash : ethers.toUtf8Bytes(dataHash)),
  });

  await tx.wait();
  return tx.hash;
};
