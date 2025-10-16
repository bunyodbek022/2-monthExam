import { Router } from "express";
import { tasksCreateSchema, tasksUpdateSchema } from "../validation/tasks.validation.js"
import { validate } from "../validation/validation.js";
import {createTask, getAllTask,getOneTask,  updateTask, deleteTask } from "../controller/tasks.controller.js";
const tasksRouter = Router()

//CREATE
tasksRouter.post("/", validate(tasksCreateSchema, "body"), createTask);
//GET_ONE
tasksRouter.get("/:id",  getOneTask);
//GET_ALL
tasksRouter.get("/",  getAllTask);
//UPDATE
tasksRouter.put("/:id",validate(tasksUpdateSchema, "body"), updateTask);
//DELETE
tasksRouter.delete("/:id", deleteTask);

export default tasksRouter;