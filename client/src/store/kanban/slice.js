import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBoardApi } from "../../service/boards";
import { normalizeBoardPayload } from "../../utils/normalizeBoard";
import { createColumnApi, deleteColumnApi, updateColumnApi, reorderColumnsApi } from "../../service/columns";
import { createCardApi, deleteCardApi, getCardApi, moveCardApi, updateCardApi } from "../../service/cards";
import { createCommentApi, deleteCommentApi, listCommentsApi } from "../../service/comments";

function errMsg(e) {
  return e?.response?.data?.message || e?.response?.data?.error || e?.message || "Unknown error";
}

export const fetchBoardThunk = createAsyncThunk("kanban/fetchBoard", async (boardId, { rejectWithValue }) => {
  try {
    const data = await getBoardApi(boardId);
    return normalizeBoardPayload(data);
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const createColumnThunk = createAsyncThunk(
  "kanban/createColumn",
  async ({ boardId, title }, { rejectWithValue }) => {
    try {
      return await createColumnApi(boardId, title);
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  }
);

export const updateColumnThunk = createAsyncThunk("kanban/updateColumn", async ({ id, title }, { rejectWithValue }) => {
  try {
    return await updateColumnApi(id, title);
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const deleteColumnThunk = createAsyncThunk("kanban/deleteColumn", async (id, { rejectWithValue }) => {
  try {
    await deleteColumnApi(id);
    return { id };
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const reorderColumnsThunk = createAsyncThunk(
  "kanban/reorderColumns",
  async ({ boardId, orderedIds }, { rejectWithValue }) => {
    try {
      await reorderColumnsApi(boardId, orderedIds);
      return { ok: true };
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  }
);

export const createCardThunk = createAsyncThunk(
  "kanban/createCard",
  async ({ columnId, payload }, { rejectWithValue }) => {
    try {
      return await createCardApi(columnId, payload);
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  }
);

export const updateCardThunk = createAsyncThunk("kanban/updateCard", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateCardApi(id, payload);
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const deleteCardThunk = createAsyncThunk("kanban/deleteCard", async (id, { rejectWithValue }) => {
  try {
    await deleteCardApi(id);
    return { id };
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const moveCardThunk = createAsyncThunk(
  "kanban/moveCard",
  async ({ id, toColumnId, toIndex }, { rejectWithValue }) => {
    try {
      await moveCardApi(id, toColumnId, toIndex);
      return { ok: true };
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  }
);

export const fetchCardDetailsThunk = createAsyncThunk("kanban/cardDetails", async (id, { rejectWithValue }) => {
  try {
    const card = await getCardApi(id);
    // some servers don't include comments in card response
    const comments = await listCommentsApi(id);
    return { card, comments };
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

export const addCommentThunk = createAsyncThunk(
  "kanban/addComment",
  async ({ cardId, body, currentUser }, { rejectWithValue }) => {
    try {
      const c = await createCommentApi(cardId, body);
      return { ...c, author: c.author || { id: currentUser?.id, email: currentUser?.email }, authorId: c.authorId || currentUser?.id };
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  }
);

export const deleteCommentThunk = createAsyncThunk("kanban/deleteComment", async (commentId, { rejectWithValue }) => {
  try {
    await deleteCommentApi(commentId);
    return { id: commentId };
  } catch (e) {
    return rejectWithValue(errMsg(e));
  }
});

const slice = createSlice({
  name: "kanban",
  initialState: {
    board: null,
    columns: [],
    cardsByColumn: {},
    loading: false,
    error: null,

    activeCardId: null,
    activeCard: null,
    activeComments: [],
    activeLoading: false,
    activeError: null,
  },
  reducers: {
    openCard(state, action) {
      state.activeCardId = action.payload;
      state.activeCard = null;
      state.activeComments = [];
      state.activeError = null;
    },
    closeCard(state) {
      state.activeCardId = null;
      state.activeCard = null;
      state.activeComments = [];
      state.activeError = null;
    },
    moveCardLocal(state, action) {
      const { cardId, fromColumnId, toColumnId, toIndex } = action.payload;
      // move within same column (reorder)
      if (fromColumnId === toColumnId) {
        const arr = [...(state.cardsByColumn[fromColumnId] || [])];
        const idx = arr.findIndex((c) => c.id === cardId);
        if (idx === -1) return;
        const [moved] = arr.splice(idx, 1);
        let insertAt = toIndex;
        if (insertAt < 0) insertAt = 0;
        if (insertAt > arr.length) insertAt = arr.length;
        arr.splice(insertAt, 0, moved);
        state.cardsByColumn[fromColumnId] = arr;
        return;
      }

      // move across columns
      const from = [...(state.cardsByColumn[fromColumnId] || [])];
      const to = [...(state.cardsByColumn[toColumnId] || [])];

      const idx = from.findIndex((c) => c.id === cardId);
      if (idx === -1) return;

      const [moved] = from.splice(idx, 1);
      moved.columnId = toColumnId;

      let insertAt = toIndex;
      if (insertAt < 0) insertAt = 0;
      if (insertAt > to.length) insertAt = to.length;
      to.splice(insertAt, 0, moved);

      state.cardsByColumn[fromColumnId] = from;
      state.cardsByColumn[toColumnId] = to;
    },
    reorderColumnsLocal(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const cols = [...(state.columns || [])];
      if (fromIndex < 0 || fromIndex >= cols.length) return;
      if (toIndex < 0 || toIndex >= cols.length) return;
      const [moved] = cols.splice(fromIndex, 1);
      cols.splice(toIndex, 0, moved);
      // keep stable "order" for UI (server will persist)
      state.columns = cols.map((c, i) => ({ ...c, order: i + 1 }));
    },
    updateCardInBoard(state, action) {
      const card = action.payload;
      const colId = card.columnId;
      const arr = state.cardsByColumn[colId] || [];
      const i = arr.findIndex((c) => c.id === card.id);
      if (i !== -1) arr[i] = { ...arr[i], ...card };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchBoardThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchBoardThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.board = a.payload.board;
      s.columns = a.payload.columns;
      s.cardsByColumn = a.payload.cardsByColumn;
    });
    b.addCase(fetchBoardThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(createColumnThunk.fulfilled, (s, a) => {
      const col = a.payload;
      s.columns = [...s.columns, { id: col.id, title: col.title, order: col.order ?? s.columns.length }].sort(
        (x, y) => (x.order ?? 0) - (y.order ?? 0)
      );
      if (!s.cardsByColumn[col.id]) s.cardsByColumn[col.id] = [];
    });

    b.addCase(updateColumnThunk.fulfilled, (s, a) => {
      const i = s.columns.findIndex((c) => c.id === a.payload.id);
      if (i !== -1) s.columns[i] = { ...s.columns[i], ...a.payload };
    });

    b.addCase(deleteColumnThunk.fulfilled, (s, a) => {
      s.columns = s.columns.filter((c) => c.id !== a.payload.id);
      delete s.cardsByColumn[a.payload.id];
    });

    b.addCase(createCardThunk.fulfilled, (s, a) => {
      const colId = a.payload.columnId;
      const arr = s.cardsByColumn[colId] || [];
      // server assigns order at the end, keep UI in order
      s.cardsByColumn[colId] = [...arr, a.payload].sort((x, y) => (x.order ?? 0) - (y.order ?? 0));
    });

    b.addCase(updateCardThunk.fulfilled, (s, a) => {
      if (s.activeCard?.id === a.payload.id) s.activeCard = { ...s.activeCard, ...a.payload };
      const colId = a.payload.columnId;
      const arr = s.cardsByColumn[colId] || [];
      const i = arr.findIndex((c) => c.id === a.payload.id);
      if (i !== -1) arr[i] = { ...arr[i], ...a.payload };
    });

    b.addCase(deleteCardThunk.fulfilled, (s, a) => {
      for (const colId of Object.keys(s.cardsByColumn)) {
        s.cardsByColumn[colId] = (s.cardsByColumn[colId] || []).filter((c) => c.id !== a.payload.id);
      }
      if (s.activeCardId === a.payload.id) {
        s.activeCardId = null;
        s.activeCard = null;
        s.activeComments = [];
      }
    });

    b.addCase(fetchCardDetailsThunk.pending, (s) => {
      s.activeLoading = true;
      s.activeError = null;
    });
    b.addCase(fetchCardDetailsThunk.fulfilled, (s, a) => {
      s.activeLoading = false;
      s.activeCard = a.payload.card;
      s.activeComments = Array.isArray(a.payload.comments) ? a.payload.comments : [];
    });
    b.addCase(fetchCardDetailsThunk.rejected, (s, a) => {
      s.activeLoading = false;
      s.activeError = a.payload;
    });

    b.addCase(addCommentThunk.fulfilled, (s, a) => {
      s.activeComments = [...s.activeComments, a.payload];
    });

    b.addCase(deleteCommentThunk.fulfilled, (s, a) => {
      s.activeComments = s.activeComments.filter((c) => c.id !== a.payload.id);
    });
  },
});

export const { openCard, closeCard, moveCardLocal, reorderColumnsLocal, updateCardInBoard } = slice.actions;
export default slice.reducer;
