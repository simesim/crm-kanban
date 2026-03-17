import * as cardsService from '../services/cards.service.js';

export const cardsController = {
  async getColumnCards(req, res, next) {
    try {
      const { columnId } = req.params;
      const cards = await cardsService.getColumnCards(columnId);
      res.json(cards);
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const card = await cardsService.getCardById(id);
      res.json(card);
    } catch (e) {
      next(e);
    }
  },

  async createCard(req, res, next) {
    try {
      const { columnId } = req.params;
      const card = await cardsService.createCard(columnId, req.body);
      res.status(201).json(card);
    } catch (e) {
      next(e);
    }
  },

  async updateCard(req, res, next) {
    try {
      const { id } = req.params;
      const card = await cardsService.updateCard(id, req.body);
      res.json(card);
    } catch (e) {
      next(e);
    }
  },

  async deleteCard(req, res, next) {
    try {
      const { id } = req.params;
      await cardsService.deleteCard(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },

  async reorderCards(req, res, next) {
    try {
      const { columnId } = req.params;
      const { orderedIds } = req.body;
      await cardsService.reorderCards(columnId, orderedIds);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },

  async moveCard(req, res, next) {
    try {
      const { id } = req.params;
      const { toColumnId, toIndex } = req.body;
      const result = await cardsService.moveCard(id, { toColumnId, toIndex });
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
};
