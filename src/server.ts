import express from 'express'
import dotenv from 'dotenv';
import cors from "cors";
import { Request,Response } from 'express';

dotenv.config();


const app =express();
app.use(express.json())
const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  console.log("comes to root route")
  res.json({ message: "message send from server" });
});

export default app;