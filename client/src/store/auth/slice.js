import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, logoutApi, refreshApi } from "../../service/auth";
import { clearStoredAuth, getStoredAuth, storeAuth } from "../../service/token";

function errMsg(e) {
  return e?.response?.data?.message || e?.response?.data?.error || e?.message || "Unknown error";
}

export const refreshThunk = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const data = await refreshApi();
    storeAuth({ accessToken: data.accessToken, user: data.user });
    return data;
  } catch (e) {
    clearStoredAuth();
    return rejectWithValue(errMsg(e));
  }
});

export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginApi(email, password);
    storeAuth({ accessToken: data.accessToken, user: data.user });
    return data;
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } catch {
    // ignore
  }
  clearStoredAuth();
  return { ok: true };
});

const stored = getStoredAuth();
const initialState = {
  user: stored?.user || null,
  accessToken: stored?.accessToken || null,
  loading: false,
  error: null,
  ready: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(refreshThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(refreshThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.ready = true;
      s.user = a.payload.user;
      s.accessToken = a.payload.accessToken;
    });
    b.addCase(refreshThunk.rejected, (s, a) => {
      s.loading = false;
      s.ready = true;
      s.user = null;
      s.accessToken = null;
      s.error = a.payload || "Refresh failed";
    });

    b.addCase(loginThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload.user;
      s.accessToken = a.payload.accessToken;
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Login failed";
    });

    b.addCase(logoutThunk.fulfilled, (s) => {
      s.user = null;
      s.accessToken = null;
    });
  },
});

export default slice.reducer;
