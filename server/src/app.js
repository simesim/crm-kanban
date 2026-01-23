import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { apiRouter } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
console.log("ACCESS_TOKEN_EXPIRES_IN:", process.env.ACCESS_TOKEN_EXPIRES_IN);

export function createApp() {
  const app = express();

  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (req, res) => res.json({ ok: true }));
  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/v1", apiRouter);

  app.use(errorMiddleware);
  return app;
}
