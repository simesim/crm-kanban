import { api } from "./http";

export async function listCommentsApi(cardId) {
  const { data } = await api.get(`/cards/${cardId}/comments`);
  return data;
}

export async function createCommentApi(cardId, body) {
  const { data } = await api.post(`/cards/${cardId}/comments`, { body });
  return data;
}

export async function deleteCommentApi(commentId) {
  await api.delete(`/comments/${commentId}`);
}
