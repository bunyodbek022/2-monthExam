import { Router } from "express";
import { columnsCreateSchema, columnsUpdateSchema } from "../validation/columns.validation.js"
import { search, createColumn, getAllColumn, getOneColumn, updateColumn, deleteColumn} from "../controller/columns.controller.js";
import { validate } from "../validation/validation.js";
const columnsRouter = Router()

//SEARCH
columnsRouter.get("/search", search);
//CREATE
columnsRouter.post("/", validate(columnsCreateSchema, "body"), createColumn);
//GET_ONE
columnsRouter.get("/:id",  getOneColumn);
//GET_ALL
columnsRouter.get("/",  getAllColumn);
//UPDATE
columnsRouter.put("/:id",validate(columnsUpdateSchema, "body"), updateColumn);
//DELETE
columnsRouter.delete("/:id", deleteColumn);

export default columnsRouter;