const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const config = require("./config/env");
const connectDB = require("./config/db");

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
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();

// Set port from environment variable or default to 3000
const PORT = config.port;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
