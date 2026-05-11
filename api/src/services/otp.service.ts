import IORedis from "ioredis";
import { env } from "@/config/env";

export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const setOTP = async (phone: string, code: string) => {
  await redis.set(`otp:${phone}`, code, "EX", 300); // 5 minutes
};

export const getOTP = async (phone: string) => {
  return await redis.get(`otp:${phone}`);
};

export const deleteOTP = async (phone: string) => {
  await redis.del(`otp:${phone}`);
};
