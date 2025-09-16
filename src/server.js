import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import connectDB from "./config/db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
//test api
app.get("/", (req, res) => {
  res.send("Welcome to the Trip Planner API!");
});

//Connect to mongo API
const startServer = async () => {
  await connectDB(); // Connect to DB
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();

// Set port from environment variable or default to 3000
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
