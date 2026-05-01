import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { Redis } from "ioredis";
import { db } from "@/db/config";
import { member, memberVote, vote } from "@/db/schema";
import { WhatsAppService } from "@/lib/whatsapp";
import { io } from "@/server";

const redisConnection = new Redis(process.env.REDIS_URL as string, {
	maxRetriesPerRequest: null,
});

export const voteQueue = new Queue("vote-notifications", {
	connection: redisConnection,
});

export const voteWorker = new Worker(
	"vote-notifications",
	async (job) => {
		const { voteId } = job.data;

		const voteData = await db.query.vote.findFirst({
			where: eq(vote.id, voteId),
		});

		if (!voteData) return;

		await db
			.update(vote)
			.set({ status: "finished" })
			.where(eq(vote.id, voteId));

		io.to(`vote:${voteId}`).emit("vote:finished", {
			voteId,
			status: "finished",
		});

		const votes = await db.query.memberVote.findMany({
			where: eq(memberVote.voteId, voteId),
		});

		const counts = votes.reduce((acc: Record<string, number>, v) => {
			acc[v.optionIndex] = (acc[v.optionIndex] || 0) + 1;
			return acc;
		}, {});

		const winningIndex = Object.entries(counts).sort(
			(a, b) => b[1] - a[1],
		)[0]?.[0];
		const resultText = winningIndex
			? `The winning option was: ${voteData.options[parseInt(winningIndex)].label}`
			: "No votes were cast.";

		const members = await db.query.member.findMany({
			where: eq(member.cooperativeId, voteData.cooperativeId),
		});

		const users = await db.query.user.findMany({
			where: (user, { inArray }) =>
				inArray(
					user.id,
					members.map((m) => m.userId),
				),
		});

		for (const user of users) {
			if (user.phoneNumber && user.isWhatsappVerified) {
				await WhatsAppService.sendVoteNotification(
					user.phoneNumber,
					voteData.question,
					resultText,
				);
			}
		}
	},
	{ connection: redisConnection },
);
