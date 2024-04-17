import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();
console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  password: {
    type: String,
    required: true,
  },
  hashvalue: {
    type: String,
  },
});
// const studentRegisterSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });
const StudentsData = mongoose.model(
  "StudentsData",
  studentDataSchema,
  "students"
);

// console.log(StudentsData);

app.post("/submit", async (req, res) => {
  try {
    const studentData = new StudentsData(req.body);
    const studentEmail = req.body.email;
    const password = req.body.password;

    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);
    studentData.hashvalue = hash;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: studentEmail,
      from: "rohit@fullstacklearning.com",
      subject: "Student registered successfully",
      text: "and easy to do anywhere, even with Node.js",
      html: `<strong>and easy to do anywhere, even with Node.js</strong> here is your one time password <b>${password}</b>
      <p><a href='http://localhost:5173/login/?hash=${hash}&email=${studentEmail}'>Login</a></p>`,
    };

    await sgMail.send(msg);

    await studentData.save();
    console.log(studentData, "170");
    console.log("Email sent and data saved successfully");
    res.send(studentData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting data");
  }
});

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
// userlogin
app.post("/studentLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await StudentsData.findOne({ email: email });
    console.log(student, req.body, "login");
    if (!student && student.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({ message: "user logged in succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
/////
//reset password
app.post("/resetPassword", async (req, res) => {
  try {
    const { oldPassword, newPassword, email } = req.body;
    const UpdatedStudent = await StudentsData.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true }
    );
    console.log(UpdatedStudent, "228");
    if (!UpdatedStudent) {
      return res
        .status(404)
        .json({ message: "Student not found", statusCode: 404 });
    }
    return res
      .status(200)
      .json({ message: "Password updated successfully", statusCode: 200 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// to check hashvalue
app.get("/getHashValue", async (req, res) => {
  try {
    const email = req.query.email; // Get email from query parameters
    const student = await StudentsData.findOne({ email: email }); // Find student by email
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.send(student);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving student data");
  }
});
