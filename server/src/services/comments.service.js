import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const commentsService = {
  async listByCard(cardId) {
    return prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, email: true } } },
    });
  },

  async create(cardId, authorId, { body }) {
    if (!body?.trim()) throw ApiError.badRequest("Body is required");

    // ensure card exists
    const card = await prisma.card.findUnique({ where: { id: cardId }, select: { id: true } });
    if (!card) throw ApiError.badRequest("Card not found");

    return prisma.comment.create({
      data: {
        cardId,
        authorId,
        body: body.trim(),
      },
    });
  },

  async delete(commentId, currentUser) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });
    if (!comment) throw ApiError.badRequest("Comment not found");

    const isLead = currentUser?.role === "LEAD";
    const userId = currentUser?.sub;

    if (!isLead && comment.authorId !== userId) {
      throw ApiError.forbidden("Only author or LEAD can delete comment");
    }

    await prisma.comment.delete({ where: { id: commentId } });
  },
};
