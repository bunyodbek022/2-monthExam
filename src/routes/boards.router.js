import { Router } from "express";
import { getAllBoard, createBoard, updateBoard } from "../controller/boards.controller.js";

const boardRouter = Router()

boardRouter.post("/",createBoard);

boardRouter.get("/", getAllBoard);

boardRouter.put("/:id", updateBoard);

export default boardRouter;
