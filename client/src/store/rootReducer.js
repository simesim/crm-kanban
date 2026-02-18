import authReducer from "./auth/slice";
import boardsReducer from "./boards/slice";
import kanbanReducer from "./kanban/slice";

export const rootReducer = {
  auth: authReducer,
  boards: boardsReducer,
  kanban: kanbanReducer,
};
