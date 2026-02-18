import axios from "axios";
import { clearStoredAuth, getAccessToken, getUser, storeAuth } from "./token";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Prevent infinite loops, handle parallel 401 correctly
let isRefreshing = false;
let waiters = [];

function flushWaiters(error, token) {
  waiters.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  waiters = [];
}

const raw = axios.create({ baseURL, withCredentials: true, timeout: 15000 });

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original || original._retry) throw error;
    if (error.response?.status !== 401) throw error;

    // don't try to refresh if the refresh endpoint itself failed
    if (original.url?.includes("/auth/refresh")) {
      clearStoredAuth();
      throw error;
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push({
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
      const { data } = await raw.post("/auth/refresh");
      const token = data?.accessToken;
      storeAuth({ accessToken: token, user: data?.user ?? getUser() });
      flushWaiters(null, token);

      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (e) {
      flushWaiters(e, null);
      clearStoredAuth();
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
);
