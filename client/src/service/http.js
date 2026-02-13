import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  timeout: 15000,
});

export function setAccessToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
let isRefreshing = false;
let queue = [];

function resolveQueue(error, token) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original?._retry) {
      throw error;
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await api.post("/auth/refresh");
      const token = res.data?.accessToken;

      setAccessToken(token);
      resolveQueue(null, token);

      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (e) {
      resolveQueue(e, null);
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
);
