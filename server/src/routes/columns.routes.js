import { Router } from "express";
import { columnController } from "../controllers/column.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { boardAccessMiddleware } from "../middlewares/board-access.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";
import { columnAccessMiddleware } from "../middlewares/column-access.middleware.js";

export const columnsRouter = Router();

// all column endpoints require auth
columnsRouter.use(authMiddleware);

// Board columns
columnsRouter.get(
  "/boards/:boardId/columns",
  boardAccessMiddleware(),
  columnController.getBoardColumns
);

columnsRouter.post(
  "/boards/:boardId/columns",
  roleMiddleware([ROLES.LEAD]),
  boardAccessMiddleware(),
  columnController.createColumn
);

columnsRouter.patch(
  "/boards/:boardId/columns/reorder",
  roleMiddleware([ROLES.LEAD]),
  boardAccessMiddleware(),
  columnController.reorderColumns
);

// Single column
columnsRouter.patch(
  "/columns/:id",
  roleMiddleware([ROLES.LEAD]),
  columnAccessMiddleware(),
  columnController.updateColumn
);

columnsRouter.delete(
  "/columns/:id",
  roleMiddleware([ROLES.LEAD]),
  columnAccessMiddleware(),
  columnController.deleteColumn
);
