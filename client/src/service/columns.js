import { api } from "./http";

// If your server uses different endpoints, change ONLY this file.
export async function createColumnApi(boardId, title) {
  const { data } = await api.post(`/boards/${boardId}/columns`, { title });
  return data;
}

export async function updateColumnApi(id, title) {
  const { data } = await api.patch(`/columns/${id}`, { title });
  return data;
}

export async function deleteColumnApi(id) {
  await api.delete(`/columns/${id}`);
}

export async function reorderColumnsApi(boardId, orderedIds) {
  const { data } = await api.patch(`/boards/${boardId}/columns/reorder`, { orderedIds });
  return data;
}
