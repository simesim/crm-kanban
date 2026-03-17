import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";

// Checks that the current user has access to the board that owns the column.
// Used for /columns/:id endpoints where boardId is not present in params.
export function columnAccessMiddleware() {
  return async (req, res, next) => {
    try {
      const columnId = req.params.id;
      if (!columnId) return next(ApiError.badRequest("Column id is required"));

      const userId = req.user?.sub;
      if (!userId) return next(ApiError.unauthorized());

      const column = await prisma.column.findUnique({
        where: { id: columnId },
        select: { id: true, boardId: true },
      });
      if (!column) return next(ApiError.badRequest("Column not found"));

      const board = await prisma.board.findFirst({
        where: {
          id: column.boardId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true, ownerId: true },
      });

      if (!board) return next(ApiError.forbidden("No access to this board"));

      req.board = board;
      req.column = column;
      return next();
    } catch (e) {
      return next(e);
    }
  };
}
