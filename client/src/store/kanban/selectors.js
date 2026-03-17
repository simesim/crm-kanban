export const selectBoard = (s) => s.kanban.board;
export const selectColumns = (s) => s.kanban.columns;
export const selectCardsByColumn = (s) => s.kanban.cardsByColumn;
export const selectKanbanLoading = (s) => s.kanban.loading;
export const selectKanbanError = (s) => s.kanban.error;

export const selectActiveCardId = (s) => s.kanban.activeCardId;
export const selectActiveCard = (s) => s.kanban.activeCard;
export const selectActiveComments = (s) => s.kanban.activeComments;
export const selectActiveLoading = (s) => s.kanban.activeLoading;
export const selectActiveError = (s) => s.kanban.activeError;
