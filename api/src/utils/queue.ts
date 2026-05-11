import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/config/env";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const blockchainQueue = new Queue("blockchain-transactions", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});
