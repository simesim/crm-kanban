import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { boardAccessMiddleware } from '../middlewares/board-access.middleware.js';
import { cardAccessMiddleware } from '../middlewares/card-access.middleware.js';
import { cardsController } from '../controllers/cards.controller.js';

const router = Router();

// list/create within column
router.get('/columns/:columnId/cards', authMiddleware, cardsController.getColumnCards);
router.post('/columns/:columnId/cards', authMiddleware, boardAccessMiddleware, cardsController.createCard);

// card by id
router.patch('/cards/:id', authMiddleware, cardAccessMiddleware, cardsController.updateCard);
router.delete('/cards/:id', authMiddleware, cardAccessMiddleware, cardsController.deleteCard);

// reorder within a column
router.patch('/columns/:columnId/cards/reorder', authMiddleware, boardAccessMiddleware, cardsController.reorderCards);

// move card between columns (or within same column)
router.patch('/cards/:id/move', authMiddleware, cardAccessMiddleware, cardsController.moveCard);

export default router;
