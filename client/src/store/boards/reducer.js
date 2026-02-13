import { BOARDS_LOADING, BOARDS_SET, BOARDS_ERROR, BOARDS_ADD } from "./types";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function boardsReducer(state = initialState, action) {
  switch (action.type) {
    case BOARDS_LOADING:
      return { ...state, loading: true, error: null };
    case BOARDS_SET:
      return { ...state, loading: false, items: action.payload, error: null };
    case BOARDS_ADD:
      return { ...state, items: [action.payload, ...state.items] };
    case BOARDS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
