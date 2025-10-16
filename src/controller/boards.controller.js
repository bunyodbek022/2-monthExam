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
      return res.status(404).send({ message: "User_id is not found" })
    }
    const checkDublicate = await baseClass.isDoublicate("boards", { title, user_id });
    if (checkDublicate === 404) {
      const newBoard = await baseClass.create(info, "boards");
      return res.status(201).json({
        message: "Board yaratildi",
        data: newBoard,
      });
    }
    if (checkDublicate === 409) {
      return res.status(409).send({ message: "This name is already used" });
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
  const { limit, page, search } = req.query;
  const lim = limit ? parseInt(limit, 10) : 10;
  const pa = page ? parseInt(page, 10) : 1;
  const off = (pa - 1) * lim;

  const result = await baseClass.searchAndPaginate(search, "boards", lim, off);

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
export const getOneBoard = async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await baseClass.getOne("boards", id);
    if (response === 404) {
      res.status(404).send({ message: "Board not found" })
    }
    res.send({ Succesfully: response })
  }
  catch (err) {
    console.log("GetOne xatolik :", err);
    next(err)
  }
}

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
    res.send({ message: "Board deleted succesfully", data: response});
  } catch (err) {
    console.log(err);
    next(err);
  }
}



// Search 
export const search = async (req, res, next) => {
  try {
    const { limit, offset, ...filters } = req.query; 

    const queryKeys = Object.keys(filters);     
    const queryValues = Object.values(filters); 

    const lim = limit ? parseInt(limit, 10) : undefined;
    const off = offset ? parseInt(offset, 10) : undefined;

    const result = await baseClass.searchAndPaginate(
      queryKeys,
      queryValues,
      "boards",
      lim,
      off
    );

    res.status(200).json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};