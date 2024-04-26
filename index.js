import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import sgMail from "@sendgrid/mail";
import StudentRouter from "./StudentRouter.js";
import "dotenv/config";

const app = express();
console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/student", StudentRouter);

const port = 8080;

mongoose
  .connect("mongodb://127.0.0.1:27017/fsl")
  .then(() => {
    console.log("connected to mongodb");
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const studentDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },

  parentName: {
    type: String,
    required: true,
  },
  parentNo: {
    type: Number,
    required: true,
  },
  localAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  eduDesignation: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
  },
  year: {
    type: String,
  },
  college: {
    type: String,
  },
  coursedetail: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  Company: {
    type: String,
  },
  otherCourse: {
    type: String,
  },
  analytics: {
    type: String,
    required: true,
  },
  friendName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  hashvalue: {
    type: String,
  },
});

export const StudentsData = mongoose.model(
  "StudentsData",
  studentDataSchema,
  "students"
);

///get api all studentsdata
app.get("/studentsData", async (req, res) => {
  try {
    const students = await StudentsData.find();
    res.send(students);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving student data");
  }
});
//upload api
app.post("/upload", upload.array("file"), function (req, res) {
  const filePath = [];
  console.log(req.body);
  console.log(req.files);
  console.log(req.files.path);
  req.files.forEach((file) => {
    console.log(file, "160");
    filePath.push(file.path);
  });

  res
    .status(200)
    .json({ "file uploaded successfully": true, filePath: req.files });
});


