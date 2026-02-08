import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { apiRouter } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Infra healthcheck (public)
  app.get("/health", (req, res) => res.json({ ok: true }));

  // API
  app.use("/api/v1", apiRouter);

  app.use(errorMiddleware);
  return app;
}
