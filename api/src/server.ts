import "dotenv/config";
import crypto from "node:crypto";
import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import { Redis } from "ioredis";
import { Server } from "socket.io";
import { WhatsAppAuthService } from "@/lib/whatsapp-auth";
import { AuthService } from "@/lib/auth-service";
import "@/lib/vote-worker";
import { db } from "@/db/config";
import { user, wallet, transaction, member, cooperative, session } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server);
const redis = new Redis(process.env.REDIS_URL as string, {
	maxRetriesPerRequest: null,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Middleware
const authenticate = async (req: any, res: any, next: any) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).json({ error: "Unauthorized" });

	const userId = await AuthService.validateSession(token);
	if (!userId) return res.status(401).json({ error: "Invalid or expired session" });

	req.userId = userId;
	next();
};

app.post("/api/auth/signup", async (req, res) => {
	const { name, email, phoneNumber, password } = req.body;
	if (!name || !email || !phoneNumber || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		const existingUser = await db.query.user.findFirst({
			where: (user, { or }) => or(eq(user.email, email), eq(user.phoneNumber, phoneNumber)),
		});

		if (existingUser) {
			return res.status(400).json({ error: "Email or phone number already registered" });
		}

		const hashedPassword = await AuthService.hashPassword(password);
		const newUser = await db.insert(user).values({
			id: crypto.randomUUID(),
			name,
			email,
			phoneNumber,
			password: hashedPassword,
		}).returning();

		const { token } = await AuthService.createSession(newUser[0].id);
		res.json({ user: newUser[0], token });
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.post("/api/auth/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	try {
		const userData = await db.query.user.findFirst({
			where: eq(user.email, email),
		});

		if (!userData || !(await AuthService.comparePassword(password, userData.password))) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const { token } = await AuthService.createSession(userData.id);
		res.json({ user: userData, token });
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.get("/api/auth/me", authenticate, async (req: any, res) => {
	try {
		const userId = req.userId;
		const [userData, memberships] = await Promise.all([
			db.query.user.findFirst({
				where: eq(user.id, userId),
			}),
			db.query.member.findMany({
				where: eq(member.userId, userId),
			}),
		]);
		res.json({
			...userData,
			hasCooperative: memberships.length > 0,
		});
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

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

app.get("/api/cooperatives", authenticate, async (req: any, res) => {
	try {
		const cooperatives = await db.query.cooperative.findMany();
		res.json(cooperatives);
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.post("/api/cooperatives", authenticate, async (req: any, res) => {
	const { name, description } = req.body;
	if (!name) {
		return res.status(400).json({ error: "Cooperative name is required" });
	}

	try {
		const newCoop = await db.insert(cooperative).values({
			id: crypto.randomUUID(),
			name,
			description,
			founderId: req.userId,
		}).returning();

		await db.insert(member).values({
			id: crypto.randomUUID(),
			userId: req.userId,
			cooperativeId: newCoop[0].id,
			role: "admin",
		});

		res.status(201).json(newCoop[0]);
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.post("/api/cooperatives/join", authenticate, async (req: any, res) => {
	const { cooperativeId } = req.body;
	if (!cooperativeId) {
		return res.status(400).json({ error: "cooperativeId is required" });
	}

	try {
		const existingMember = await db.query.member.findFirst({
			where: (member, { and }) => and(eq(member.userId, req.userId), eq(member.cooperativeId, cooperativeId)),
		});

		if (existingMember) {
			return res.status(400).json({ error: "You are already a member of this cooperative" });
		}

		await db.insert(member).values({
			id: crypto.randomUUID(),
			userId: req.userId,
			cooperativeId,
			role: "member",
		});

		res.json({ success: true, message: "Joined cooperative successfully" });
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
});

app.get("/api/user/dashboard", authenticate, async (req: any, res) => {
	try {
		const userId = req.userId;

		const [walletData, memberships] = await Promise.all([
			db.query.wallet.findFirst({
				where: eq(wallet.userId, userId),
			}),
			db.query.member.findMany({
				where: eq(member.userId, userId),
				with: {
					cooperative: true,
				},
			}),
		]);

		if (memberships.length === 0) {
			return res.status(403).json({ error: "You must belong to at least one cooperative to access the dashboard" });
		}

		const cooperatives = memberships.map(m => m.cooperative);
		const transactionsData = await db.query.transaction.findMany({
			limit: 10,
			orderBy: [desc(transaction.createdAt)],
			// In a real app, we would filter transactions by the user's wallet
		});

		res.json({
			balance: walletData?.balance || "0",
			currency: walletData?.currency || "FCFA",
			cooperatives,
			transactions: transactionsData,
		});
	} catch (e: unknown) {
		const error = e as Error;
		res.status(500).json({ error: error.message });
	}
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
