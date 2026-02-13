import authReducer from "./auth/reducer";
import boardsReducer from "./boards/reducer";
import kanbanReducer from "./kanban/reducer";
import uiReducer from "./ui/reducer";

export const rootReducer = {
  auth: authReducer,
  boards: boardsReducer,
  kanban: kanbanReducer,
  ui: uiReducer,
};
