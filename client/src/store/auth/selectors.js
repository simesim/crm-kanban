export const selectUser = (s) => s.auth.user;
export const selectRole = (s) => s.auth.user?.role || null;
export const selectAuthLoading = (s) => s.auth.loading;
export const selectAuthError = (s) => s.auth.error;
export const selectAuthReady = (s) => s.auth.ready;
export const selectIsAuthed = (s) => !!s.auth.user;
