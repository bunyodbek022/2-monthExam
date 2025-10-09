import { Router } from "express";
import { login, createUser, update } from "../controller/users.controller.js";

const userRouter = Router();

userRouter.post("/register", createUser);

userRouter.post("/login", login);

userRouter.put("/update/:id", update);

export default userRouter;
