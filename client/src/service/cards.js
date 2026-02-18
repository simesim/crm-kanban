import { api } from "./http";

// If your server uses different endpoints, change ONLY this file.
export async function createCardApi(columnId, payload) {
  const { data } = await api.post(`/columns/${columnId}/cards`, payload);
  return data;
}

export async function getCardApi(id) {
  const { data } = await api.get(`/cards/${id}`);
  return data;
}

export async function updateCardApi(id, payload) {
  const { data } = await api.patch(`/cards/${id}`, payload);
  return data;
}

export async function deleteCardApi(id) {
  await api.delete(`/cards/${id}`);
}

export async function moveCardApi(id, toColumnId, toIndex) {
  const { data } = await api.patch(`/cards/${id}/move`, { toColumnId, toIndex });
  return data;
}
