import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBoardApi, listBoardsApi } from "../../service/boards";

function errMsg(e) {
  return e?.response?.data?.message || e?.response?.data?.error || e?.message || "Unknown error";
}

export const fetchBoardsThunk = createAsyncThunk("boards/list", async (_, { rejectWithValue }) => {
  try {
    return await listBoardsApi();
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const createBoardThunk = createAsyncThunk("boards/create", async (title, { rejectWithValue }) => {
  try {
    return await createBoardApi(title);
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

const slice = createSlice({
  name: "boards",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBoardsThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchBoardsThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.items = Array.isArray(a.payload) ? a.payload : [];
    });
    b.addCase(fetchBoardsThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(createBoardThunk.fulfilled, (s, a) => {
      s.items = [a.payload, ...s.items];
    });
  },
});

export default slice.reducer;
