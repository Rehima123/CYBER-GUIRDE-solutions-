const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const securityHeaders = require('./middleware/security');

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(securityHeaders);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Cyber Guard Solutions API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user if doesn't exist
    await createAdminUser();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    
    await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      emailVerified: true
    });
    
    console.log('Admin user created successfully');
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
║  🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}                      ║
║                                                   ║
║  🔒 Security Features:                            ║
║     • Helmet Security Headers                     ║
║     • Rate Limiting                               ║
║     • CORS Enabled                                ║
║     • Data Sanitization                           ║
║     • XSS Protection                              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
  });
});

module.exports = app;