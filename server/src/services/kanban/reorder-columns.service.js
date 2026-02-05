import { columnService } from "../column.service.js";

export async function reorderColumns(boardId, orderedIds) {
  return columnService.reorderColumns(boardId, orderedIds);
}
