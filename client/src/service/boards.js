import { api } from "./http";

export async function listBoardsApi() {
  const { data } = await api.get("/boards");
  return data;
}

export async function createBoardApi(title) {
  const { data } = await api.post("/boards", { title });
  return data;
}

export async function getBoardApi(id) {
  const { data } = await api.get(`/boards/${id}`);
  return data;
}

// LEAD only: add member to board by userId
export async function addBoardMemberApi(boardId, userId) {
  const { data } = await api.post(`/boards/${boardId}/members`, { userId });
  return data;
}
