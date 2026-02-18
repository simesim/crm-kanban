import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const boardsService = {
  async createBoard({ title, ownerId }) {
    if (!title?.trim()) throw ApiError.badRequest("Title is required");

    const board = await prisma.board.create({
      data: { title: title.trim(), ownerId },
    });


    return board;
  },

  async listBoardsForUser(userId) {
    return prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async getBoardById(boardId) {
    return prisma.board.findUnique({
      where: { id: boardId },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },


  async getBoardKanban(boardId) {
    return prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            cards: { orderBy: { order: "asc" } },
          },
        },
      },
    });
  },

  async addMember({ boardId, userIdToAdd }) {
    const user = await prisma.user.findUnique({
      where: { id: userIdToAdd },
      select: { id: true, role: true },
    });
    if (!user) throw ApiError.badRequest("User to add not found");

    return prisma.boardMember.upsert({
      where: {
        boardId_userId: {
          boardId,
          userId: userIdToAdd,
        },
      },
      update: {},
      create: {
        boardId,
        userId: userIdToAdd,
        // Keep BoardMember.role aligned with account role
        role: user.role,
      },
    });
  },
};
