import { api } from "./http";

export async function loginApi(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { user, accessToken }
}

export async function refreshApi() {
  const { data } = await api.post("/auth/refresh");
  return data;
}

export async function logoutApi() {
  const { data } = await api.post("/auth/logout");
  return data;
}
