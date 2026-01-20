import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(ApiError.unauthorized());

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { sub, role, email }
    return next();
  } catch {
    return next(ApiError.unauthorized("Invalid or expired access token"));
  }
}
