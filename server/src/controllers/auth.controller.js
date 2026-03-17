import { register, login, refresh, logout } from "../services/auth.service.js";
import { ApiError } from "../utils/api-error.js";

function setRefreshCookie(res, token) {
  const secure = (process.env.COOKIE_SECURE || "false") === "true";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/api/v1/auth/refresh",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30) * 24 * 60 * 60 * 1000,
  });
}

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const result = await register(email, password, role);
      setRefreshCookie(res, result.refreshToken);
      return res.json({ user: result.user, accessToken: result.accessToken });
    } catch (e) { next(e); }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await login(email, password);
      setRefreshCookie(res, result.refreshToken);
      return res.json({ user: result.user, accessToken: result.accessToken });
    } catch (e) { next(e); }
  },

  async refresh(req, res, next) {
    try {
      const raw = req.cookies?.refreshToken;
      if (!raw) return next(ApiError.unauthorized("No refresh token cookie"));

      const result = await refresh(raw);
      setRefreshCookie(res, result.refreshToken);
      return res.json({ user: result.user, accessToken: result.accessToken });
    } catch (e) { next(e); }
  },

  async logout(req, res, next) {
    try {
      // req.user будет если маршрут защищён authMiddleware
      await logout(req.user.sub);
      res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
      return res.json({ ok: true });
    } catch (e) { next(e); }
  },
};

