import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import compression from 'compression'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import routes
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import userRoutes from './routes/users.js'
import serviceRoutes from './routes/services.js'
import aiRoutes from './routes/ai.js'

// Import middleware
import errorHandler from './middleware/errorHandler.js'

const app = express()

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

// Body parsing
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Data sanitization
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

// Compression
app.use(compression())

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/users', userRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  })
})

// Error handler
app.use(errorHandler)

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1)
  }
}

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║         CYBER GUARD SOLUTIONS API                 ║
║                                                   ║
║  🚀 Server: http://localhost:${PORT}                  ║
║  🌍 Environment: ${process.env.NODE_ENV}                    ║
║  🗄️  Database: Connected                          ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `)
  })
})

export default app
