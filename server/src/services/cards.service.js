import { prisma } from "../db/prisma.js";
import { ApiError } from "../utils/api-error.js";

/**
 * Cards are ordered inside a column by `order` (1..N).
 * We keep @@unique([columnId, order]) in schema, so reorder/move uses safe transaction.
 */

export async function getColumnCards(columnId) {
  return prisma.card.findMany({
    where: { columnId },
    orderBy: { order: "asc" },
  });
}

export async function getCardById(id) {
  return prisma.card.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, email: true } } },
      },
    },
  });
}

export async function createCard(columnId, payload) {
  const title = payload?.title;
  if (!title?.trim()) throw ApiError.badRequest("Title is required");

  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { id: true, boardId: true },
  });
  if (!column) throw ApiError.badRequest("Column not found");

  const last = await prisma.card.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const nextOrder = (last?.order ?? 0) + 1;

  return prisma.card.create({
    data: {
      title: title.trim(),
      description: payload?.description ?? null,

      // CRM fields (optional)
      phone: payload?.phone ?? null,
      email: payload?.email ?? null,
      age: payload?.age ?? null,
      course: payload?.course ?? null,
      source: payload?.source ?? null,
      timePreferences: payload?.timePreferences ?? null,
      tags: payload?.tags ?? null,
      checklist: payload?.checklist ?? null,

      columnId,
      boardId: column.boardId,
      order: nextOrder,
      userId: payload?.userId ?? null,
    },
  });
}

export async function updateCard(id, payload) {
  const data = {};
  const allowed = [
    "title",
    "description",
    "phone",
    "email",
    "age",
    "course",
    "source",
    "timePreferences",
    "tags",
    "checklist",
  ];

  for (const key of allowed) {
    if (payload?.[key] !== undefined) data[key] = payload[key];
  }

  if (data.title !== undefined) {
    if (!data.title?.trim()) throw ApiError.badRequest("Title is required");
    data.title = data.title.trim();
  }

  return prisma.card.update({ where: { id }, data });
}

export async function deleteCard(id) {
  const card = await prisma.card.findUnique({
    where: { id },
    select: { id: true, columnId: true, order: true },
  });
  if (!card) throw ApiError.badRequest("Card not found");

  await prisma.$transaction(async (tx) => {
    await tx.card.delete({ where: { id } });

    // close the gap in the column
    await tx.card.updateMany({
      where: { columnId: card.columnId, order: { gt: card.order } },
      data: { order: { decrement: 1 } },
    });
  });
}

export async function reorderCards(columnId, orderedIds) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw ApiError.badRequest("orderedIds must be non-empty array");
  }

  const uniq = new Set(orderedIds);
  if (uniq.size !== orderedIds.length) throw ApiError.badRequest("duplicates");

  const cards = await prisma.card.findMany({
    where: { columnId },
    select: { id: true },
    orderBy: { order: "asc" },
  });

  if (cards.length !== orderedIds.length) throw ApiError.badRequest("length mismatch");

  const existing = new Set(cards.map((c) => c.id));
  for (const id of orderedIds) {
    if (!existing.has(id)) throw ApiError.badRequest("Card does not belong to this column");
  }

  await prisma.$transaction(async (tx) => {
    // temp to avoid unique conflicts
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.card.update({ where: { id: orderedIds[i] }, data: { order: -(i + 1) } });
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.card.update({ where: { id: orderedIds[i] }, data: { order: i + 1 } });
    }
  });
}

/**
 * Move card between columns or within same column.
 * toIndex is 0-based UI index.
 */
export async function moveCard(cardId, { toColumnId, toIndex }) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { id: true, columnId: true, boardId: true },
  });
  if (!card) throw ApiError.badRequest("Card not found");

  const fromColumnId = card.columnId;

  const targetColumn = await prisma.column.findUnique({
    where: { id: toColumnId },
    select: { id: true, boardId: true },
  });
  if (!targetColumn) throw ApiError.badRequest("Target column not found");
  if (targetColumn.boardId !== card.boardId) throw ApiError.badRequest("Target column is from another board");

  const idx = Number.isInteger(toIndex) ? toIndex : 0;

  const fromCards = await prisma.card.findMany({
    where: { columnId: fromColumnId },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  const toCards =
    toColumnId === fromColumnId
      ? fromCards
      : await prisma.card.findMany({
          where: { columnId: toColumnId },
          orderBy: { order: "asc" },
          select: { id: true },
        });

  // remove card from source list
  const fromIds = fromCards.map((c) => c.id).filter((id) => id !== cardId);

  // destination list without moved card
  let toIds = toCards.map((c) => c.id).filter((id) => id !== cardId);

  let insertAt = idx;
  if (insertAt < 0) insertAt = 0;
  if (insertAt > toIds.length) insertAt = toIds.length;

  toIds.splice(insertAt, 0, cardId);

  await prisma.$transaction(async (tx) => {
    // reindex source column if moved out
    if (toColumnId !== fromColumnId) {
      for (let i = 0; i < fromIds.length; i++) {
        await tx.card.update({
          where: { id: fromIds[i] },
          data: { order: i + 1 },
        });
      }
    }

    // reindex destination column and set columnId
    for (let i = 0; i < toIds.length; i++) {
      await tx.card.update({
        where: { id: toIds[i] },
        data: {
          order: i + 1,
          columnId: toColumnId,
        },
      });
    }
  });

  return { ok: true };
}
