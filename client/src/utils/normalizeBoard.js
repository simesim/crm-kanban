export function normalizeBoardPayload(payload) {
  if (!payload) return { board: null, columns: [], cardsByColumn: {} };

  const board = { id: payload.id, title: payload.title };
  const columnsRaw = Array.isArray(payload.columns) ? payload.columns : [];

  const columns = columnsRaw
    .map((c) => ({
      id: c.id,
      title: c.title,
      order: Number.isFinite(c.order) ? c.order : 0,
    }))
    .sort((a, b) => a.order - b.order);

  const cardsByColumn = {};
  for (const col of columnsRaw) {
    cardsByColumn[col.id] = (col.cards || [])
      .map((x) => ({
        ...x,
        order: Number.isFinite(x.order) ? x.order : 0,
        columnId: x.columnId || col.id,
      }))
      .sort((a, b) => a.order - b.order);
  }

  return { board, columns, cardsByColumn };
}
