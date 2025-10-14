import { Router } from "express";
import { userRouter, boardRouter, columnsRouter, tasksRouter } from "./index.js"
const mainRouter = Router();

mainRouter.use("/users", userRouter);

mainRouter.use("/boards", boardRouter);

mainRouter.use("/tasks", tasksRouter);

mainRouter.use("/columns", columnsRouter);

export default mainRouter;