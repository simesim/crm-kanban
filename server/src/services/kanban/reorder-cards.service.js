import { reorderCards } from "../cards.service.js";

export async function reorderCardsInColumn(columnId, orderedIds) {
  return reorderCards(columnId, orderedIds);
}
