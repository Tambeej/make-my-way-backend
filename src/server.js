const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

//Routes 
//test api
app.get('/', (req, res) => {
  res.send('Welcome to the Trip Planner API!');
});

//Connect to mongo API
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});