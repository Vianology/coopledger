import "dotenv/config";
import crypto from "node:crypto";
import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import { Redis } from "ioredis";
import { Server } from "socket.io";
import { auth } from "@/lib/auth";
import { WhatsAppAuthService } from "@/lib/whatsapp-auth";
import "@/lib/vote-worker";

const app = express();
const server = createServer(app);
const io = new Server(server);
const redis = new Redis(process.env.REDIS_URL as string, {
	maxRetriesPerRequest: null,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.post("/api/auth/whatsapp/send-code", async (req, res) => {
	const { userId, phoneNumber } = req.body;
	if (!userId || !phoneNumber) {
		return res.status(400).json({ error: "userId and phoneNumber are required" });
	}

	try {
		const result = await WhatsAppAuthService.generateAndSendCode(userId, phoneNumber);
		res.json(result);
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.post("/api/auth/whatsapp/verify", async (req, res) => {
	const { userId, code } = req.body;
	if (!userId || !code) {
		return res.status(400).json({ error: "userId and code are required" });
	}

	try {
		const result = await WhatsAppAuthService.verifyCode(userId, code);
		if (result.success) {
			res.json({ success: true, message: "WhatsApp account verified" });
		} else {
			res.status(400).json({ success: false, error: result.error });
		}
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.post("/webhook/whatsapp", async (req, res) => {
	const signature = req.headers["x-hub-signature-256"] as string;
	const body = JSON.stringify(req.body);
	const secret = process.env.GOWA_WEBHOOK_SECRET || "secret";

	if (!signature) {
		return res.status(401).send("Missing signature");
	}

	const hmac = crypto.createHmac("sha256", secret);
	hmac.update(body);
	const digest = hmac.digest("hex");

	if (signature !== digest) {
		return res.status(401).send("Invalid signature");
	}

	const eventId =
		req.body.event_id ||
		`${req.body.device_id}_${req.body.payload?.id || Date.now()}`;
	const lockKey = `whatsapp_webhook_lock:${eventId}`;

	const existing = await redis.get(lockKey);
	if (existing) {
		return res.status(200).send("Duplicate request handled");
	}
	await redis.set(lockKey, "locked", "EX", 60);

	console.log("Received WhatsApp webhook event:", req.body.event);

	// Future processing logic based on event type

	res.status(200).send("OK");
});

app.get("/", (_, res) => {
	res.send("Hello World!");
});

io.on("connection", (_) => {
	console.log("A user connected");
});

export { io };

server.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on port ${process.env.PORT || 3000}`);
});
