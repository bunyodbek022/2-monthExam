import { Crud } from "../helpers/CrudClass.js";

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
        const newTask = await Crud.create(info, "tasks");
        res.status(201).json({
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allTasks = await Crud.get("tasks");
    const totalCount = allTasks.length;

    const paginatedTasks = await Crud.paginate("tasks", limit, offset);

    res.status(200).json({
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: paginatedTasks
    });
    } catch (err) {
        console.log("Xato:", err);
        next(err)
    }
};

// UPDATE
export const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params
        const info = req.body
        const response = await Crud.update(id, info, "tasks")

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
        const response = await Crud.delete(id, "tasks");

        if (response == 404) {
            return res.json({ message: "Task not found" })
        }
        res.send({ message: "Task deleted succesfully", data: response.rows[0] });
    } catch (err) {
        console.log(err);
        next(err);
    }
}



// Search 
export const search = async (req, res, next) => {
    try {
        const queryKeys = Object.keys(req.query);
        const queryValues = Object.values(req.query);

        if (queryKeys.length === 0) {
            return res.status(400).json({ message: "Hech qanday qidiruv parametri yuborilmadi" });
        }
        const result = await Crud.search(queryKeys, queryValues, "tasks")
        res.send(result.rows);

    } catch (error) {
        console.log(error);
        next(error)
    }
}