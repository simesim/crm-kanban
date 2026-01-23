import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { boardsRouter } from "./boards.routes.js";
import { columnsRouter } from "./columns.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/boards", boardsRouter);
apiRouter.use(columnsRouter);
