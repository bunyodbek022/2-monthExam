import { Router } from "express";
import { login, createUser, update, deleteUser, search, getAllUsers} from "../controller/users.controller.js";
import { userCreateSchema, userUpdateSchema } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";

const userRouter = Router();
//SEARCH
userRouter.get("/search", search);
//GET_ALL
userRouter.get("/", getAllUsers);
// REGISTER
userRouter.post("/register", validate(userCreateSchema, "body"), createUser);
//LOGIN
userRouter.post("/login", login);
// UPDATE
userRouter.put("/update/:id", validate(userUpdateSchema, "body"), update);
// DELETE 
userRouter.delete("/:id", deleteUser);

export default userRouter;
