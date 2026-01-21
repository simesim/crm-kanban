import { ApiError } from "../utils/api-error.js";

export function errorMiddleware(err, req, res, next) {
  console.error("ERROR:", err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
}

