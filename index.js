import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const port = 8080;

mongoose
  .connect("mongodb://127.0.0.1:27017/fsl")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log(error);
  });
app.post("/submit", (req, res) => {
  console.log(req.body);
  res.send("DONE");
});
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

const studentDataSchema = new mongoose.Schema({
  students: [
    {
      name: {
        type: string,
        required: true,
      },
      email: {
        type: string,
        required: true,
      },
    },
  ],
});
