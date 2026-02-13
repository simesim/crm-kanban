import { listBoardsApi, createBoardApi } from "../../service/boards";
import { boardsLoading, boardsSet, boardsAdd, boardsError } from "./actions";

export const fetchBoardsThunk = () => async (dispatch) => {
  dispatch(boardsLoading());
  try {
    const data = await listBoardsApi();
    // ожидаем массив досок
    dispatch(boardsSet(data));
  } catch (e) {
    dispatch(boardsError(e?.response?.data?.message ?? e.message));
  }
};

export const createBoardThunk = (title) => async (dispatch) => {
  try {
    const created = await createBoardApi(title);
    dispatch(boardsAdd(created));
  } catch (e) {
    dispatch(boardsError(e?.response?.data?.message ?? e.message));
    throw e;
  }
};
