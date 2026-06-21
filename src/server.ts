import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./presentation/routes/auth.routes";
import adminRoutes from "@presentation/routes/admin.routes";
import providerRoutes from "@presentation/routes/provider.routes";
import userRoutes from "@presentation/routes/user.routes";

import morganMiddleware from "@infrastructure/services/logging/morgan.services";
import { errorMiddleware } from "@presentation/middlewares/error.middleware";
import { notFoundMiddleware } from "@presentation/middlewares/notfound.middleware";
import rateLimiter from "@presentation/middlewares/ratelimit.middleware";
import { handleWebhookController } from "@di/container-resolver";

const app = express();

// ── stripe webhook — raw body MUST come before express.json() ──────────────
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => handleWebhookController.handle(req, res)
);

// ── global middleware ───────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_ORIGINS;
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morganMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use("/", rateLimiter);

// ── routes ──────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "message send from server" });
});

// ── error handling — always last ────────────────────────────────────────────
app.use(errorMiddleware);
app.use(notFoundMiddleware);

export default app;