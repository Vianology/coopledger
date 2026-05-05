import "dotenv/config";
import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Redis } from "ioredis";
import morgan from "morgan";
import { Server } from "socket.io";
import { auth } from "utils/auth";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.all("/api/auth/{*any}", toNodeHandler(auth));

const redis = new Redis({
  path: process.env.REDIS_URL,
  maxRetriesPerRequest: null,
});

io.on("connection", (_) => {
  console.log("A user connected");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

export { io, redis };
export default app;
