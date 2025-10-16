import { baseClass } from "../helpers/baseClass.js";

// CREATE
export const createColumn = async (req, res, next) => {
  try {
    const { name, board_id } = req.body

    const info = {
      name,
      board_id
    }
    const checkStatus = await baseClass.checkId("boards", board_id);
    if (checkStatus === 404) {
      return res.status(404).send({ message: "Board_id is not found" })
    }
    const checkDublicate = await baseClass.isDoublicate("columns", { name, board_id });
    if (checkDublicate === 404) {
      const newColumn = await baseClass.create(info, "columns");
    return res.status(201).json({
      message: "Column yaratildi",
      data: newColumn,
    });
    }
    if (checkDublicate === 409) {
      return res.status(409).send({ message: "This name is already used" });
    }
    
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};


// GET_ALL
export const getAllColumn = async (req, res, next) => {
  try {
  const { limit, page, search } = req.query;
  const lim = limit ? parseInt(limit, 10) : 10;
  const pa = page ? parseInt(page, 10) : 1;
  const off = (pa - 1) * lim;

  const result = await baseClass.searchAndPaginate(search, "columns", lim, off);

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
export const getOneColumn = async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await baseClass.getOne("columns", id);
    if (response === 404) {
      res.status(404).send({ message: "Column not found" })
    }
    res.send({ Succesfully: response })
  }
  catch (err) {
    console.log("GetOne xatolik :", err);
    next(err)
  }
}

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
    res.send({ message: "Column deleted succesfully", data: response});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

