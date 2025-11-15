import express from 'express'
import dotenv from 'dotenv';
import cors from "cors";
import { Request,Response } from 'express';
dotenv.config();

import cookieParser from "cookie-parser";

import authRoutes from './presentation/routes/auth.routes'; 
import adminRoutes from '@presentation/routes/admin.routes';
import providerRoutes from '@presentation/routes/provider.routes';


import morganMiddleware from "@infrastructure/services/logging/morgan.services";
import { errorMiddleware } from "@presentation/middlewares/error.middleware";
import { notFoundMiddleware } from "@presentation/middlewares/notfound.middleware";
import rateLimiter from "@presentation/middlewares/ratelimit.middleware";

const app =express();
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser());
app.use(morganMiddleware);

const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use('/',rateLimiter);

app.use('/auth', authRoutes);
app.use('/admin',adminRoutes)
app.use('/provider',providerRoutes);

app.get("/", (req: Request, res: Response) => {
  console.log("comes to root route")
  res.json({ message: "message send from server" });
});
app.use(errorMiddleware);
app.use(notFoundMiddleware);

export default app;