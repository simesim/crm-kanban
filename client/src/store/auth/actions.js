export const authLoading = () => ({ type: "AUTH/LOADING" });
export const authSet = (payload) => ({ type: "AUTH/SET", payload });
export const authError = (payload) => ({ type: "AUTH/ERROR", payload });
export const authClear = () => ({ type: "AUTH/CLEAR" });
