import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { prisma } from "../db/prisma.js";

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
}

export async function issueRefreshToken(userId) {
  const raw = jwt.sign(
    { sub: userId, typ: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30}d` }
  );

  const tokenHash = await bcrypt.hash(raw, 10);

  const expiresAt = addDays(new Date(), Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30));

  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return { raw, expiresAt };
}

export async function rotateRefreshToken(rawToken) {
  // 1) verify signature
  let payload;
  try {
    payload = jwt.verify(rawToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
  if (payload?.typ !== "refresh" || !payload?.sub) return null;

  // 2) find matching stored token by bcrypt compare (we must scan user tokens)
  const userId = payload.sub;

  const tokens = await prisma.refreshToken.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  let matched = null;
  for (const t of tokens) {
    const ok = await bcrypt.compare(rawToken, t.tokenHash);
    if (ok) {
      matched = t;
      break;
    }
  }
  if (!matched) return null;

  // 3) revoke old token
  await prisma.refreshToken.update({
    where: { id: matched.id },
    data: { revokedAt: new Date() },
  });

  // 4) issue new token
  const next = await issueRefreshToken(userId);
  return { userId, nextRefresh: next };
}

export async function revokeAllRefreshTokens(userId) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
