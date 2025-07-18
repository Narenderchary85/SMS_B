import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from 'http';
import { Server } from 'socket.io'; 
import StudentAuth from './Routes/StudentAuth.js'
import oneSocket from './Routes/socketone.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || " http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
    origin: " http://localhost:5173",             
  }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
  
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("DB Connected");
  }).catch(err => {
    console.error("DB Connection Error:", err);
  });

app.use('/auth',StudentAuth)
oneSocket(io)

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});

