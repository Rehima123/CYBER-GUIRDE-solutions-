const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/contact', require('./routes/contact'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Cyber Guard Solutions API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
    });
}

// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found!`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════╗
║            CYBER GUARD SOLUTIONS API              ║
║                                                   ║
║  🚀 Server running in ${process.env.NODE_ENV} mode        ║
║  📡 Port: ${PORT}                                 ║
║  🌐 URL: http://localhost:${PORT}                    ║
║  🗄️  Database: Connected                          ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
        `);
    });
});

module.exports = app;