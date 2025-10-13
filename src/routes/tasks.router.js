import { Router } from "express";
import { tasksCreateSchema, tasksUpdateSchema } from "../validation/tasks.validation.js"
import { validate } from "../validation/validation.js";
import { search, createTask, getAllTask, updateTask, deleteTask } from "../controller/tasks.controller.js";
const tasksRouter = Router()

//SEARCH
tasksRouter.get("/search", search);
//CREATE
tasksRouter.post("/",validate(tasksCreateSchema, "body"),createTask);
//GET
tasksRouter.get("/",  getAllTask);
//UPDATE
tasksRouter.put("/:id",validate(tasksUpdateSchema, "body"), updateTask);
//DELETE
tasksRouter.delete("/:id", deleteTask);

export default tasksRouter;