import express from "express";
import jwt from "jsonwebtoken";
import StudentDetails from "../Models/StudentDetails.js";

const router=express.Router();
const Skey="SMS";

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }
  
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, Skey);
      if (!decoded.id || typeof decoded.id !== "string") {
        return res.status(400).json({ message: "Invalid user ID format in token" });
      }
  
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
}


router.post("/signup", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Invalid request body" });
        }
  
        const { sname,email, password,id } = req.body;
  
        if (!sname ||!email || !password || !id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const older = await StudentDetails.findOne({ email });
        if (older) {
            return res.status(400).json({ message: "Student already exists" });
        }

  
        const newUser = new StudentDetails({ sname ,email, password, id });
        const user = await newUser.save();
        const token = jwt.sign(
            { sname: user.sname, id: user._id },
             Skey  ,
            { expiresIn: "3h" }
        );
  
        res.status(200).json({ message: "Signup Successful", token ,user:user._id});
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Signup Failed", error: err.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let errors = [];
  
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
  
        const user = await StudentDetails.findOne({ email });
  
        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }else {
          if (user.email !== email) {
            errors.push("Email is incorrect");
          }
          if (user.password !== password) {
            errors.push("Password is incorrect");
          }
        }
  
        if (errors.length > 0) {
          return res.status(401).json({ message: errors.join(", ") });
        }
  
        const isMatch=password===user.password
        if(!isMatch){
          return res.status(401).json({ message: "Invalid password" });
        }
  
        const token = jwt.sign(
            { username: user.username, id: user._id },
            Skey,
            { expiresIn: "3h" }
        );
  
        res.status(200).json({ message: "Login Successful", token, id: user._id});
  
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Failed Login", error: err.message });
    }
  });

  export default router;