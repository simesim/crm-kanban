import { commentsService } from "../services/comments.service.js";

export const commentsController = {
  async list(req, res, next) {
    try {
      const { id: cardId } = req.params;
      const comments = await commentsService.listByCard(cardId);
      res.json(comments);
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const { id: cardId } = req.params;
      const authorId = req.user.sub;
      const comment = await commentsService.create(cardId, authorId, req.body);
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await commentsService.delete(id, req.user);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};
