import { baseClass } from "../helpers/baseClass.js";

// CREATE
export const createTask = async (req, res, next) => {
    try {
        const { title, description, user_id, board_id, column_id } = req.body

        const info = {
            title,
            description,
            user_id,
            board_id,
            column_id
        }
        const checkDublicate = await baseClass.isDoublicate("tasks", { title, user_id, board_id, column_id });
        if (checkDublicate === 404) {
            const newTask = await baseClass.create(info, "tasks");
            return res.status(201).json({
                message: "Task yaratildi",
                data: newTask,
            });
        }
        if (checkDublicate === 409) {
            return res.status(409).send({ message: "This name is already used" });
        }
        const checkStatusUser = await baseClass.checkId("users", user_id);
        if (checkStatusUser === 404) {
            return res.status(404).send({ message: "User_id is not found" })
        };
        const checkStatusBoard = await baseClass.checkId("boards", board_id);
        if (checkStatusBoard === 404) {
            return res.status(404).send({ message: "Board_id is not found" })
        }
        const checkStatusColumn = await baseClass.checkId("columns", column_id);
        if (checkStatusColumn === 404) {
            return res.status(404).send({ message: "Column_id is not found" })
        }
        const newTask = await baseClass.create(info, "tasks");
        return res.status(201).json({
            message: "Task yaratildi",
            data: newTask,
        });
    } catch (err) {
        console.log("Xato:", err);
        next(err)
    }
};


// GET_ALL
export const getAllTask = async (req, res, next) => {
    try {
  const { limit, page, search } = req.query;
  const lim = limit ? parseInt(limit, 10) : 10;
  const pa = page ? parseInt(page, 10) : 1;
  const off = (pa - 1) * lim;

  const result = await baseClass.searchAndPaginate(search, "tasks", lim, off);

  const newResult = result.map(({ password, ...rest }) => rest);

  res.status(200).json({
    success: true,
    page: pa,
    limit: lim,
    data: newResult,
  });
} catch (err) {
  console.error("Xato:", err);
  next(err);
}

};

// GET_ONE
export const getOneTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const response = await baseClass.getOne("tasks", id);
        if (response === 404) {
            res.status(404).send({ message: "Task not found" })
        }
        res.send({ Succesfully: response })
    }
    catch (err) {
        console.log("GetOne xatolik :", err);
        next(err)
    }
}
// UPDATE
export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const info = req.body
        const response = await baseClass.update(id, info, "tasks")

        if (response == 404) {
            return res.status(404).json({ message: "Task not found" })
        }
        if (response == 400) {
            return res.status(400).json({ message: "No valid fields to update" })
        }
        res.send({ message: "Task succesfully updated", Task: response.rows[0] })
    } catch (err) {
        console.log("Xato:", err);
        next(err);
    }
}

//DELETE
export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await baseClass.delete(id, "tasks");

        if (response == 404) {
            return res.json({ message: "Task not found" })
        }
        res.send({ message: "Task deleted succesfully", data: response });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

