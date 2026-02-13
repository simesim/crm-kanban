import { BOARDS_LOADING, BOARDS_SET, BOARDS_ERROR, BOARDS_ADD } from "./types";

export const boardsLoading = () => ({ type: BOARDS_LOADING });
export const boardsSet = (items) => ({ type: BOARDS_SET, payload: items });
export const boardsAdd = (item) => ({ type: BOARDS_ADD, payload: item });
export const boardsError = (msg) => ({ type: BOARDS_ERROR, payload: msg });
