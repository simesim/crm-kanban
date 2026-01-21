import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";

export function boardAccessMiddleware() {
  return async (req, res, next) => {
    try {
      const boardId = req.params.id || req.params.boardId;
      if (!boardId) return next(ApiError.badRequest("Board id is required"));

      const userId = req.user?.sub;
      if (!userId) return next(ApiError.unauthorized());

      const board = await prisma.board.findFirst({
        where: {
          id: boardId,
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
        select: { id: true, ownerId: true },
      });

      if (!board) return next(ApiError.forbidden("No access to this board"));

      req.board = board;
      return next();
    } catch (e) {
      return next(e);
    }
  };
}
