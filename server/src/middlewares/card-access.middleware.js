import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/api-error.js';

export async function cardAccessMiddleware(req, res, next) {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id },
      select: { boardId: true },
    });

    if (!card) throw ApiError.badRequest('Card not found');

    // чтобы boardAccessMiddleware знал, что проверять:
    req.params.boardId = card.boardId;

    next();
  } catch (e) {
    next(e);
  }
}
