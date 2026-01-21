import { boardsService } from "../services/boards.service.js";

export const boardsController = {
  async create(req, res, next) {
    try {
      const ownerId = req.user.sub;
      const { title } = req.body;

      const board = await boardsService.createBoard({ title, ownerId });
      return res.status(201).json(board);
    } catch (e) {
      return next(e);
    }
  },

  async list(req, res, next) {
    try {
      const userId = req.user.sub;
      const boards = await boardsService.listBoardsForUser(userId);
      return res.json(boards);
    } catch (e) {
      return next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const boardId = req.params.id;
      const board = await boardsService.getBoardById(boardId);
      return res.json(board);
    } catch (e) {
      return next(e);
    }
  },

  async addMember(req, res, next) {
    try {
      const boardId = req.params.id;
      const { userId } = req.body;

      const member = await boardsService.addMember({ boardId, userIdToAdd: userId });
      return res.status(201).json(member);
    } catch (e) {
      return next(e);
    }
  },
};
