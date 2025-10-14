import { baseClass } from "../helpers/baseClass.js";

// CREATE
export const createBoard = async (req, res, next) => {
  try {
    const { title, user_id } = req.body

    const info = {
      title,
      user_id
    }
    const checkStatus = await baseClass.checkId("users", user_id);
    if (checkStatus === 404) {
      res.status(404).send({message: "User_id is not found"})
    }
    const newBoard = await baseClass.create(info, "boards");
    res.status(201).json({
      message: "Board yaratildi",
      data: newBoard,
    });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};


// GET_ALL
export const getAllBoard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allBoards = await baseClass.get("boards");
    const totalCount = allBoards.length;

    const paginatedBoards = await baseClass.paginate("boards", limit, offset);

    res.status(200).json({
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: paginatedBoards
    });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

// UPDATE
export const updateBoard = async (req, res, next) => {
  try {
    const { id } = req.params
    const info = req.body
    const response = await baseClass.update(id, info, "boards")

    if (response == 404) {
      return res.json({ message: "Boards not found" })
    }
    if (response == 400) {
      return res.json({ message: "No valid fields to update" })
    }
    res.send({ message: "board succesfully updated", board: response.rows[0] })
  } catch (err) {
    console.log("Xato:", err);
    next(err);
  }
}

//DELETE
export const deleteBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await baseClass.delete(id, "boards");

    if (response == 404) {
      return res.json({ message: "Board not found" })
    }
    res.send({ message: "Board deleted succesfully", data: response.rows[0]});
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
    const result = await baseClass.search(queryKeys, queryValues, "boards")
    res.send(result.rows);

  } catch (error) {
    console.log(error);
    next(error)
  }
}