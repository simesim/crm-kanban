// Server might return nested columns/cards, or separate arrays.
// This normalizer tries to be tolerant.

export function normalizeBoardPayload(payload) {
  if (!payload) return { board: null, columns: [], cardsByColumn: {} };

  const board = {
    id: payload.id,
    title: payload.title,
  };

  // Preferred: payload.columns = [{id,title,order,cards:[...]}]
  let columns = Array.isArray(payload.columns) ? payload.columns : [];
  columns = columns
    .map((c) => ({
      id: c.id,
      title: c.title,
      order: Number.isFinite(c.order) ? c.order : 0,
    }))
    .sort((a, b) => a.order - b.order);

  const cardsByColumn = {};

  if (Array.isArray(payload.columns)) {
    for (const c of payload.columns) {
      cardsByColumn[c.id] = (c.cards || [])
        .map((x) => ({
          ...x,
          order: Number.isFinite(x.order) ? x.order : 0,
          columnId: x.columnId || c.id,
        }))
        .sort((a, b) => a.order - b.order);
    }
  }

  // Alternative: payload.cards = [...]
  if (Array.isArray(payload.cards) && columns.length) {
    for (const col of columns) cardsByColumn[col.id] = [];
    for (const card of payload.cards) {
      const colId = card.columnId;
      if (!cardsByColumn[colId]) cardsByColumn[colId] = [];
      cardsByColumn[colId].push({ ...card, order: Number.isFinite(card.order) ? card.order : 0 });
    }
    for (const colId of Object.keys(cardsByColumn)) {
      cardsByColumn[colId].sort((a, b) => a.order - b.order);
    }
  }

  return { board, columns, cardsByColumn };
}
