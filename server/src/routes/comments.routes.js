import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { cardAccessMiddleware } from "../middlewares/card-access.middleware.js";
import { commentAccessMiddleware } from "../middlewares/comment-access.middleware.js";
import { commentsController } from "../controllers/comments.controller.js";

export const commentsRouter = Router();

commentsRouter.use(authMiddleware);

// list/create for card
commentsRouter.get("/cards/:id/comments", cardAccessMiddleware(), commentsController.list);
commentsRouter.post("/cards/:id/comments", cardAccessMiddleware(), commentsController.create);

// delete comment (author or LEAD). Access: via cardAccess? We don't have comment->card middleware, so rely on role/author check in service.
// If you want strict board access, add a comment-access middleware later.
commentsRouter.delete("/comments/:id", commentAccessMiddleware(), commentsController.delete);

export default commentsRouter;
