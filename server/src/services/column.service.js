import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";


export const columnService = {
  async getBoardColumns(boardId) {
    return prisma.column.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });
  },

  async createColumn(boardId, { title }) {
    if (!title?.trim()) throw ApiError.badRequest('Title is required');

    // убедимся, что доска существует
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) throw ApiError.badRequest('Board not found');

    const last = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (last?.order ?? 0) + 1;

    return prisma.column.create({
      data: { title: title.trim(), boardId, order: nextOrder },
    });
  },

  async updateColumn(id, { title }) {
    if (!title?.trim()) throw ApiError.badRequest('Title is required');

    const column = await prisma.column.findUnique({ where: { id } });
    if (!column) throw ApiError.badRequest('Column not found');

    return prisma.column.update({
      where: { id },
      data: { title: title.trim() },
    });
  },

  async deleteColumn(id) {
    const column = await prisma.column.findUnique({
      where: { id },
      include: { cards: { select: { id: true } } },
    });
    if (!column) throw ApiError.badRequest('Column not found');

    // вариант B: запрещаем удаление если есть карточки
    if (column.cards.length > 0) {
      throw ApiError.badRequest('Column is not empty');
    }

    await prisma.column.delete({ where: { id } });
  },

  async reorderColumns(boardId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw ApiError.badRequest('orderedIds must be a non-empty array');
    }

    // проверка дублей
    const uniq = new Set(orderedIds);
    if (uniq.size !== orderedIds.length) {
      throw ApiError.badRequest('orderedIds has duplicates');
    }

    const columns = await prisma.column.findMany({
      where: { boardId },
      select: { id: true },
      orderBy: { order: 'asc' },
    });

    if (columns.length !== orderedIds.length) {
      throw ApiError.badRequest('orderedIds length mismatch');
    }

    const existingIds = new Set(columns.map(c => c.id));
    for (const id of orderedIds) {
      if (!existingIds.has(id)) {
        throw ApiError.badRequest('Column does not belong to this board');
      }
    }

    // безопасный reorder, чтобы не словить unique(boardId, order)
    await prisma.$transaction(async (tx) => {
      // temp
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.column.update({
          where: { id: orderedIds[i] },
          data: { order: -(i + 1) },
        });
      }
      // final
      for (let i = 0; i < orderedIds.length; i++) {
        await tx.column.update({
          where: { id: orderedIds[i] },
          data: { order: i + 1 },
        });
      }
    });
  },
};
