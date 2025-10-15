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
      res.status(409).send({ message: "User already exists" });
    }
    await pool.query(
      `INSERT INTO users(name, email, password) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    console.log("Foydalanuvchi yaratildi:", name, email);
    return res.status(201).send({ message: "User yaratildi" });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allUsers = await baseClass.get("users");
    const totalCount = allUsers.length;
    const paginatedUsers = await baseClass.paginate("users", limit, offset);
    const newPaginatedUsers = paginatedUsers.map(({ password, ...rest }) => rest);
    res.status(200).json({
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: newPaginatedUsers
    });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

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

    if (response == 404) {
      return res.json({ message: "user not found" })
    }
    res.send({ message: "User deleted succesfully", response });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// SEARCH
export const search = async (req, res, next) => {
  try {
    const queryKeys = Object.keys(req.query);
    const queryValues = Object.values(req.query);

    if (queryKeys.length === 0) {
      return res.status(400).json({ message: "Hech qanday qidiruv parametri yuborilmadi" });
    }
    const result = await baseClass.search(queryKeys, queryValues, "users")
    res.send(result.rows);

  } catch (error) {
    console.log(error);
    next(error)
  }
}