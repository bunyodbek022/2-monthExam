import pool from "../config/config.js";
import { baseClass } from "../helpers/baseClass.js";
import bcrypt from "bcrypt";

// CREATE
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmail = await pool.query(`Select * from users where email = $1`, [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(409).send({ message: "User already exists" });
    }
    const result = await pool.query(
      `INSERT INTO users(name, email, password) VALUES ($1, $2, $3) Returning *`,
      [name, email, hashedPassword]
    );
    const newResult = result.rows[0]
    delete newResult.password
    console.log("Foydalanuvchi yaratildi:", name, email);
    return res.status(201).send({ message: "User yaratildi", user: newResult});
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

// GET_USER
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0)
      return res.status(404).send({ message: "Bunday foydalanuvchi topilmadi" });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).send({ message: "Parol noto'g'ri" });

    console.log("Login muvaffaqiyatli:", user.email);
    res.send({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

//GET ALL USERS
export const getAllUsers = async (req, res, next) => {
  try {
  const { limit, page, search } = req.query;
  const lim = limit ? parseInt(limit, 10) : 10;
  const pa = page ? parseInt(page, 10) : 1;
  const off = (pa - 1) * lim;

  const result = await baseClass.searchAndPaginate(search, "users", lim, off);

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

export const getOneUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const response = await baseClass.getOne("users", id);
        if (response === 404) {
            return res.status(404).send({ message: "User not found" })
        }
      if (response === 400) {
          return res.status(400).send({message: "UUID xato kiritldi"})
      }
      delete response.password;
        res.send({ Succesfully: response })
    }
    catch (err) {
        console.log("GetOne xatolik :", err);
        next(err)
    }
}

// UPDATE
export const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const info = req.body
    const response = await baseClass.update(id, info, "users")
    if (response == 404) {
      return res.json({ message: "users not found" })
    }
    if (response == 400) {
      return res.json({ message: "No valid fields to update" })
    }
    const { name, email } = response.rows[0];
    const newRes = {id, name, email}
    res.send({ message: "user succesfully updated", user: newRes })
  } catch (err) {
    console.log("Xato:", err);
    next(err);
  }
}


// DELETE
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await baseClass.delete(id, "users");
    delete response.password

    if (response == 404) {
      return res.json({ message: "user not found" })
    }
    res.send({ message: "User deleted succesfully", response });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

