import { api } from "./http";

export async function loginApi(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // ожидаем { accessToken, user }
}

export async function refreshApi() {
  const { data } = await api.post("/auth/refresh");
  return data; // { accessToken, user? }
}

export async function logoutApi() {
  const { data } = await api.post("/auth/logout");
  return data;
}
