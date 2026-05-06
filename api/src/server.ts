import "dotenv/config";
import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import { env } from "config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import { auth } from "utils/auth";
import { paymentsRoutes } from "routes/payments.route";
import { FedaPay } from "fedapay";

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
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/payments", paymentsRoutes);

io.on("connection", (_) => {
  console.log("A user connected");
});

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export { io };
export default app;
