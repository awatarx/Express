const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
const connectToDatabase = require('./database/connection');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const authenticate = require('./middleware/authMiddleware')
const cors = require('cors');


const app = express();

// Connect to MongoDB
connectToDatabase();

// Parse URL-encoded bodies (for x-www-form-urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors());
app.use('/auth', authRoutes);
app.use('/api', taskRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express started at: http://localhost:${PORT}`);
});
