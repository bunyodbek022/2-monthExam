import { Router } from "express";
import { login, createUser } from "../controller/users.controller.js";

const userRouter = Router();


userRouter.post("/register", createUser);

userRouter.post("/login", login);

export default userRouter;
