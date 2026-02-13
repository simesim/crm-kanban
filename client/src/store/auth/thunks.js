import { loginApi, refreshApi, logoutApi } from "../../service/auth";
import { setAccessToken } from "../../service/http";
import { authLoading, authSet, authError, authClear } from "./actions";

export const loginThunk = (email, password) => async (dispatch) => {
  dispatch(authLoading());
  try {
    const data = await loginApi(email, password);
    setAccessToken(data.accessToken);
    dispatch(authSet({ accessToken: data.accessToken, user: data.user }));
  } catch (e) {
    dispatch(authError(e?.response?.data?.message ?? e.message));
  }
};

export const refreshThunk = () => async (dispatch) => {
  try {
    const data = await refreshApi();
    setAccessToken(data.accessToken);
    dispatch(authSet({ accessToken: data.accessToken, user: data.user }));
  } catch (e) {
    dispatch(authClear());
  }
};

export const logoutThunk = () => async (dispatch) => {
  try {
    await logoutApi();
  } finally {
    setAccessToken("");
    dispatch(authClear());
  }
};
