require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require('./config/db');
const userRoutes = require('./routes/user');
const userMediaRoutes = require('./routes/userMedia')

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);


// database connection
ConnectDB();

// Routes
app.use('/api', userRoutes);
app.use('/api', userMediaRoutes);


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
