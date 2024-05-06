import express from "express";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import { StudentsData } from "./index.js";
import jwt from "jsonwebtoken";

const Studentrouter = express.Router();

Studentrouter.post("/submit", async (req, res) => {
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

// studentlogin

Studentrouter.post("/studentLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await StudentsData.findOne({ email: email });

    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: student.email, userId: student._id },
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .json({ message: "User logged in successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/////
//reset password
Studentrouter.post("/resetPassword", async (req, res) => {
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
Studentrouter.get("/getHashValue", async (req, res) => {
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
export default Studentrouter;
