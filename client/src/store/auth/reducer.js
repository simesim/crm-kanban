const initialState = {
  isAuth: false,
  accessToken: "",
  user: null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "AUTH/LOADING":
      return { ...state, loading: true, error: null };
    case "AUTH/SET":
      return {
        ...state,
        loading: false,
        error: null,
        accessToken: action.payload.accessToken,
        user: action.payload.user ?? null,
        isAuth: !!action.payload.accessToken,
      };
    case "AUTH/ERROR":
      return { ...state, loading: false, error: action.payload };
    case "AUTH/CLEAR":
      return { ...initialState };
    default:
      return state;
  }
}
