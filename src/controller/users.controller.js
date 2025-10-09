import pool from "../config/config.js";
import { userValidation } from "../validation/user.validation.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    console.log("req.body keldi:", req.body);
    const { value, error } = userValidation(req.body);

    if (error) {
      console.log("Validation xato:", error.details[0].message);
      return res.status(422).send(error.details[0].message);
    }

    const { name, email, password } = value;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(name, email, password) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    console.log("Foydalanuvchi yaratildi:", name, email);
    return res.status(201).send({ message: "User yaratildi" });
  } catch (err) {
    console.log("Xato:", err);
    res.json({ message: "Database error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0)
      return res.status(404).send({ message: "Bunday foydalanuvchi topilmadi" });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).send({ message: "Parol noto‘g‘ri" });

    console.log("✅Login muvaffaqiyatli:", user.email);
    res.send({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.log("Xato:", err);
    res.json({ message: "Database error" });
  }
};
