import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
    app.listen(port, () => {
      console.log(`Server is Running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const studentDataSchema = new mongoose.Schema({
  students: [
    {
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
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      college: {
        type: String,
        required: true,
      },
      coursedetail: {
        type: String,
        required: true,
      },
      otherCourse: {
        type: String,
      },
      eduDesignation: {
        type: String,
        required: true,
      },
      analytics: {
        type: String,
        required: true,
      },
      friendName: {
        type: String,
      },
    },
  ],
});

const StudentsData = mongoose.model(
  "StudentsData",
  studentDataSchema,
  "students"
);

// console.log(StudentsData);

app.post("/submit", async (req, res) => {
  const studentData = new StudentsData({
    students: req.body,
  });
  console.log(studentData);
  try {
    await studentData.save();

    res.send(studentData);
  } catch (error) {
    console.log(error);
  }
});
///
app.get("/studentsData", async (req, res) => {
  try {
    const students = await StudentsData.find();
    res.send(students);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving student data");
  }
});
///
