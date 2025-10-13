import express from "express";
import dotenv from "dotenv";
import {userRouter, boardRouter, columnsRouter, tasksRouter} from "./src/routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/users", userRouter);

app.use("/boards", boardRouter);

app.use("/tasks", tasksRouter);

app.use("/columns", columnsRouter);



app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(500).send({ message: "Serverda xatolik yuz berdi" });
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
