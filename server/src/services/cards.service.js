export async function getColumnCards(columnId) {
  return prisma.card.findMany({
    where: { columnId },
    orderBy: { order: 'asc' },
  });
}

export async function createCard(columnId, { title }) {
  if (!title?.trim()) throw ApiError.badRequest('Title is required');

  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { id: true, boardId: true },
  });
  if (!column) throw ApiError.badRequest('Column not found');

  const last = await prisma.card.findFirst({
    where: { columnId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const nextOrder = (last?.order ?? 0) + 1;

  return prisma.card.create({
    data: {
      title: title.trim(),
      columnId,
      boardId: column.boardId,
      order: nextOrder,
    },
  });
}

export async function updateCard(id, { title }) {
  if (!title?.trim()) throw ApiError.badRequest('Title is required');
  return prisma.card.update({ where: { id }, data: { title: title.trim() } });
}

export async function deleteCard(id) {
  await prisma.card.delete({ where: { id } });
}


export async function reorderCards(columnId, orderedIds) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw ApiError.badRequest('orderedIds must be non-empty array');
  }

  const uniq = new Set(orderedIds);
  if (uniq.size !== orderedIds.length) throw ApiError.badRequest('duplicates');

  const cards = await prisma.card.findMany({
    where: { columnId },
    select: { id: true },
  });

  if (cards.length !== orderedIds.length) throw ApiError.badRequest('length mismatch');

  const existing = new Set(cards.map(c => c.id));
  for (const id of orderedIds) {
    if (!existing.has(id)) throw ApiError.badRequest('Card does not belong to this column');
  }

  await prisma.$transaction(async (tx) => {
    // temp to avoid unique conflicts if you add @@unique([columnId, order]) later
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.card.update({ where: { id: orderedIds[i] }, data: { order: -(i + 1) } });
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.card.update({ where: { id: orderedIds[i] }, data: { order: i + 1 } });
    }
  });
}

export async function moveCard(cardId, { toColumnId, toIndex }) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { id: true, columnId: true, boardId: true },
  });
  if (!card) throw ApiError.badRequest('Card not found');

  const fromColumnId = card.columnId;

  // нормализуем индекс
  const idx = Number.isInteger(toIndex) ? toIndex : 0;

  const fromCards = await prisma.card.findMany({
    where: { columnId: fromColumnId },
    orderBy: { order: 'asc' },
    select: { id: true },
  });

  const toCards = (toColumnId === fromColumnId)
    ? fromCards
    : await prisma.card.findMany({
        where: { columnId: toColumnId },
        orderBy: { order: 'asc' },
        select: { id: true },
      });

  // убрать из from
  const fromIds = fromCards.map(c => c.id).filter(id => id !== cardId);

  // подготовить to
  let toIds = toCards.map(c => c.id);
  if (toColumnId === fromColumnId) {
    toIds = fromIds; // reorder внутри той же колонки
  } else {
    toIds = toIds.filter(id => id !== cardId); // на всякий
  }

  let insertAt = idx;
  if (insertAt < 0) insertAt = 0;
  if (insertAt > toIds.length) insertAt = toIds.length;

  toIds.splice(insertAt, 0, cardId);

  await prisma.$transaction(async (tx) => {
    // обновить from колонку (если колонка сменилась)
    if (toColumnId !== fromColumnId) {
      for (let i = 0; i < fromIds.length; i++) {
        await tx.card.update({
          where: { id: fromIds[i] },
          data: { order: i + 1 },
        });
      }
    }

    // обновить to колонку + перемещаемую карточку
    for (let i = 0; i < toIds.length; i++) {
      const id = toIds[i];
      await tx.card.update({
        where: { id },
        data: {
          order: i + 1,
          columnId: toColumnId,
        },
      });
    }
  });

  return { ok: true };
}
