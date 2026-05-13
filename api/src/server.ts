import "dotenv/config";
import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import { env } from "@/config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { FedaPay } from "fedapay";
import morgan from "morgan";
import { cooperativesRoutes } from "@/routes/cooperatives.route";
import { otpRoutes } from "@/routes/otp.route";
import { paymentsRoutes } from "@/routes/payments.route";
import { userRoutes } from "@/routes/user.route";
import { Server } from "socket.io";
import { auth } from "@/utils/auth";

FedaPay.setApiKey(env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment("sandbox");

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
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth/whatsapp", otpRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/cooperatives", cooperativesRoutes);
app.use("/api/user", userRoutes);

io.on("connection", (_) => {
  console.log("A user connected");
});

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export { io };
export default app;
