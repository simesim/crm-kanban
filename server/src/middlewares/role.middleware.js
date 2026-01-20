import { ApiError } from "../utils/api-error.js";

export function roleMiddleware(roles = []) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    return next();
  };
}
