import { api } from "./http";

// If your server uses different endpoints, change ONLY this file.
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
