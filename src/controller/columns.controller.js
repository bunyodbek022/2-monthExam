import { baseClass } from "../helpers/baseClass.js";

// CREATE
export const createColumn = async (req, res, next) => {
  try {
    const { name, board_id } = req.body

    const info = {
      name,
      board_id
    }
    const newColumn = await baseClass.create(info, "columns");
    res.status(201).json({
      message: "Column yaratildi",
      data: newColumn,
    });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};


// GET_ALL
export const getAllColumn = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allColumns = await baseClass.get("columns");
    const totalCount = allColumns.length;

    const paginatedColumns = await baseClass.paginate("columns", limit, offset);

    res.status(200).json({
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: paginatedColumns
    });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

// UPDATE
export const updateColumn = async (req, res, next) => {
  try {
    const { id } = req.params
    const info = req.body
    const response = await baseClass.update(id, info, "columns")

    if (response == 404) {
      return res.status(404).json({ message: "Columns not found" })
    }
    if (response == 400) {
      return res.status(400).json({ message: "No valid fields to update" })
    }
    res.send({ message: "Column succesfully updated", Column: response.rows[0] })
  } catch (err) {
    console.log("Xato:", err);
    next(err);
  }
}

//DELETE
export const deleteColumn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await baseClass.delete(id, "columns");

    if (response == 404) {
      return res.status(404).json({ message: "Column not found" })
    }
    res.send({ message: "Column deleted succesfully", data: response.rows[0]});
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
    const result = await baseClass.search(queryKeys, queryValues, "columns")
    res.send(result.rows);

  } catch (error) {
    console.log(error);
    next(error)
  }
}