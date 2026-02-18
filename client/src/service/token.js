const KEY = "crm_kanban_auth";

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function storeAuth({ accessToken, user }) {
  localStorage.setItem(KEY, JSON.stringify({ accessToken, user }));
}

export function clearStoredAuth() {
  localStorage.removeItem(KEY);
}

export function getAccessToken() {
  return getStoredAuth()?.accessToken || null;
}

export function getUser() {
  return getStoredAuth()?.user || null;
}
