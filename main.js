import express from "express";
import dotenv from "dotenv";
import userRouter from "./src/routes/users.router.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/user", userRouter);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(500).send({ message: "Serverda xatolik yuz berdi" });
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
