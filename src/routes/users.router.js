import { Router } from "express";
import { login, createUser, update, deleteUser, getAllUsers, getOneUser} from "../controller/users.controller.js";
import { userCreateSchema, userUpdateSchema } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";

const userRouter = Router();
//GET_ONE
userRouter.get("/:id",  getOneUser);
//GET_ALL
userRouter.get("/", getAllUsers);
// REGISTER
userRouter.post("/register", validate(userCreateSchema, "body"), createUser);
//LOGIN
userRouter.post("/login", login);
// UPDATE
userRouter.put("/:id", validate(userUpdateSchema, "body"), update);
// DELETE 
userRouter.delete("/:id", deleteUser);

export default userRouter;
