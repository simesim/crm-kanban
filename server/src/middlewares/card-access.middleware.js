import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/api-error.js';

/**
 * Ensures that current user has access to the board containing the card.
 * Sets req.boardId and req.card.
 */
export function cardAccessMiddleware() {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return next(ApiError.badRequest('Card id is required'));

      const userId = req.user?.sub;
      if (!userId) return next(ApiError.unauthorized());

      const card = await prisma.card.findUnique({
        where: { id },
        select: { id: true, boardId: true, columnId: true },
      });

      if (!card) return next(ApiError.badRequest('Card not found'));

      const board = await prisma.board.findFirst({
        where: {
          id: card.boardId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true, ownerId: true },
      });

      if (!board) return next(ApiError.forbidden('No access to this board'));

      req.board = board;
      req.card = card;
      req.params.boardId = card.boardId;
      return next();
    } catch (e) {
      return next(e);
    }
  };
}
