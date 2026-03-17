import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/api-error.js';

/**
 * Ensures board access via comment -> card -> board.
 * Sets req.comment and req.card.
 */
export function commentAccessMiddleware() {
  return async (req, res, next) => {
    try {
      const commentId = req.params.id;
      if (!commentId) return next(ApiError.badRequest('Comment id is required'));

      const userId = req.user?.sub;
      if (!userId) return next(ApiError.unauthorized());

      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { id: true, authorId: true, cardId: true },
      });
      if (!comment) return next(ApiError.badRequest('Comment not found'));

      const card = await prisma.card.findUnique({
        where: { id: comment.cardId },
        select: { id: true, boardId: true },
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
      req.comment = comment;
      return next();
    } catch (e) {
      return next(e);
    }
  };
}
