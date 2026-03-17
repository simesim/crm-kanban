import { Router } from "express";
import { boardsController } from "../controllers/boards.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { boardAccessMiddleware } from "../middlewares/board-access.middleware.js";
import { ROLES } from "../constants/roles.js";


export const boardsRouter = Router();

boardsRouter.use(authMiddleware);

boardsRouter.get("/", boardsController.list);

boardsRouter.post("/", roleMiddleware([ROLES.LEAD]), boardsController.create);

boardsRouter.get("/:id", boardAccessMiddleware(), boardsController.getById);

boardsRouter.post(
  "/:id/members",
  roleMiddleware([ROLES.LEAD]),
  boardAccessMiddleware(),
  boardsController.addMember
);
