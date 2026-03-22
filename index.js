const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const morgan = require('morgan');
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4545",
        "https://quize-game-h03k.onrender.com/"
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, './dist')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ message: 'API is healthy and running' });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/questions', require('./src/routes/questionRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// Catch-all to serve index.html (Client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB().catch(err => {
        console.error("Delayed MongoDB connection check failed:", err.message);
    });
});