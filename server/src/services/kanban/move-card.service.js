import { moveCard } from "../cards.service.js";

export async function moveCardBetweenColumns(cardId, payload) {
  return moveCard(cardId, payload);
}
