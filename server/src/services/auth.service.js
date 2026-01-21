import bcrypt from "bcryptjs";

import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken, issueRefreshToken, rotateRefreshToken, revokeAllRefreshTokens } from "./token.service.js";

export async function register(email, password, role = "MANAGER") {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw ApiError.badRequest("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true },
  });

  const accessToken = signAccessToken(user);
  const refresh = await issueRefreshToken(user.id);
  return { user, accessToken, refreshToken: refresh.raw };
}

export async function login(email, password) {
  const userFull = await prisma.user.findUnique({ where: { email } });
  if (!userFull) throw ApiError.unauthorized("Invalid credentials");

  const ok = await bcrypt.compare(password, userFull.passwordHash);
  if (!ok) throw ApiError.unauthorized("Invalid credentials");

  const user = { id: userFull.id, email: userFull.email, role: userFull.role };
  const accessToken = signAccessToken(user);
  const refresh = await issueRefreshToken(user.id);
  return { user, accessToken, refreshToken: refresh.raw };
}

export async function refresh(rawRefreshToken) {
  const rotated = await rotateRefreshToken(rawRefreshToken);
  if (!rotated) throw ApiError.unauthorized("Invalid refresh token");

  const user = await prisma.user.findUnique({
    where: { id: rotated.userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) throw ApiError.unauthorized();

  const accessToken = signAccessToken(user);
  return { user, accessToken, refreshToken: rotated.nextRefresh.raw };
}

export async function logout(userId) {
  await revokeAllRefreshTokens(userId);
  return true;
}
