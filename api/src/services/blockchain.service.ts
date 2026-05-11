import { ethers } from "ethers";
import { env } from "@/config/env";

const provider = new ethers.JsonRpcProvider(env.POLYGON_RPC_URL);
// Cette clé est celle du système (CoopLedger Admin) pour payer le GAS
const systemWallet = new ethers.Wallet(env.SYSTEM_PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  env.CONTRACT_ADDRESS,
  [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "cooperativeId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "lighthouseCid",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "proofType",
          type: "uint8",
        },
      ],
      name: "ProofRecorded",
      type: "event",
    },
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
          internalType: "address",
          name: "_newAdmin",
          type: "address",
        },
      ],
      name: "transferAdmin",
      outputs: [],
      stateMutability: "nonpayable",
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
      inputs: [],
      name: "platformAdmin",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "registeredCids",
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
  ],
  provider,
);

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
