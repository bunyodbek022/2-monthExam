import pool from "../config/config.js";
import { boardValidation, boardValidationUpdate } from "../validation/boards.validation.js";

// CREATE
export const createBoard = async (req, res, next) => {
  try {
    const { value, error } = boardValidation(req.body);

    if (error) {
      console.log("Validation xato:", error.details[0].message);
      return res.status(422).send(error.details[0].message);
    }

    const { title } = value;
    const {id} = req.params

    await pool.query(
      `INSERT INTO boards(title, user_id) VALUES ($1, $2)`,
      [title, id]
    );

    console.log("Board yaratildi:", title);
    return res.status(201).send({ message: "board yaratildi" });
  } catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

// GET_ALL
export const getAllBoard = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM boards`);
    const board = result.rows;
    res.send({ message: "successful", board});
  }catch (err) {
    console.log("Xato:", err);
    next(err)
  }
};

// UPDATE
export const updateBoard = async (req, res, next)=>{
  try{
    const {user_id} = req.params
    const fields = []
    const values = []
    let idx = 1
    const boardCheck = await pool.query(`Select * from boards where id = $1;`, [user_id])
    if(boardCheck.rows.length === 0){
     return res.status(404).json({message: "board Not found"})
    }
    const {value, error} = boardValidationUpdate(req.body);
    const info = value
    if (error) {
      console.log("Validation xato:", error.details[0].message);
      return res.status(422).send(error.details[0].message);
    }

    const allowedFields = ["title"];
      for(const [key, value] of Object.entries(info)){
        if(allowedFields.includes(key)){
        fields.push(`${key}=$${idx}`);
        values.push(value);
        idx++;
      }  
    }
     if (fields.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }  
    values.push(id)
    const updatedboard = await pool.query(`Update boards SET ${fields.join(", ")} where id = $${idx} Returning *`, values)
    res.send({message: "board succesfully updated", board: updatedboard.rows[0]})
  }catch(err){
    console.log("Xato:", err);
    next(err);
  }
}

export const deleteBoard = async(req, res, next) => {
    try{
        const {id} = req.params;
    const boardCheck = await pool.query(`Select * from boards where id = $1;`, [d])
     if(boardCheck.rows.length === 0){
        return res.status(404).json({message: "board Not found"})
     }
     const deleted = await pool.query(`Delete from boards where id = $1;`, [id])
     res.send({message: "Board deleted succesfully", deleted});
    }catch(err){
        console.log(err);
        next(err);
    }
}

