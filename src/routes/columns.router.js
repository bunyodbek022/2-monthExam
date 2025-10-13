import { Router } from "express";
import { columnsCreateSchema, columnsUpdateSchema } from "../validation/columns.validation.js"
import { search, createColumn, getAllColumn, updateColumn, deleteColumn} from "../controller/columns.controller.js";
import { validate } from "../validation/validation.js";
const columnsRouter = Router()

//SEARCH
columnsRouter.get("/search", search);
//CREATE
columnsRouter.post("/",validate(columnsCreateSchema, "body"),createColumn);
//GET
columnsRouter.get("/",  getAllColumn);
//UPDATE
columnsRouter.put("/:id",validate(columnsUpdateSchema, "body"), updateColumn);
//DELETE
columnsRouter.delete("/:id", deleteColumn);

export default columnsRouter;