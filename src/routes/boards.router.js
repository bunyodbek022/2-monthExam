import { Router } from "express";
import { getAllBoard, createBoard, updateBoard , deleteBoard, search} from "../controller/boards.controller.js";
import { boardCreateSchema, boardUpdateSchema} from "../validation/boards.validation.js";
import { validate } from "../validation/validation.js";
const boardRouter = Router()

//SEARCH
boardRouter.get("/search", search);
//CREATE
boardRouter.post("/",validate(boardCreateSchema, "body"),createBoard);
//GET
boardRouter.get("/",  getAllBoard);
//UPDATE
boardRouter.put("/:id",validate(boardUpdateSchema, "body"), updateBoard);
//DELETE
boardRouter.delete("/:id", deleteBoard);


export default boardRouter;
