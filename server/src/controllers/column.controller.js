import { columnService } from "../services/column.service.js";

export const columnController = {
  async getBoardColumns(req, res, next) {
    try {
      const { boardId } = req.params;
      const columns = await columnService.getBoardColumns(boardId);
      return res.json(columns);
    } catch (e) {
      return next(e);
    }
  },

  async createColumn(req, res, next) {
    try {
      const { boardId } = req.params;
      const column = await columnService.createColumn(boardId, req.body);
      return res.status(201).json(column);
    } catch (e) {
      return next(e);
    }
  },

  async updateColumn(req, res, next) {
    try {
      const { id } = req.params;
      const column = await columnService.updateColumn(id, req.body);
      return res.json(column);
    } catch (e) {
      return next(e);
    }
  },

  async deleteColumn(req, res, next) {
    try {
      const { id } = req.params;
      await columnService.deleteColumn(id);
      return res.status(204).send();
    } catch (e) {
      return next(e);
    }
  },

  async reorderColumns(req, res, next) {
    try {
      const { boardId } = req.params;
      const { orderedIds } = req.body;
      await columnService.reorderColumns(boardId, orderedIds);
      return res.json({ ok: true });
    } catch (e) {
      return next(e);
    }
  },
};
