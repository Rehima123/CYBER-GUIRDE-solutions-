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
import dotenv from 'dotenv'

dotenv.config()

// ── Routes ───────────────────────────────────────────
import authRoutes from './routes/auth.js'
import contactRoutes from './routes/contact.js'
import userRoutes from './routes/users.js'
import serviceRoutes from './routes/services.js'
import aiRoutes from './routes/ai.js'
import newsletterRoutes from './routes/newsletter.js'
import adminRoutes from './routes/admin.js'

// ── Middleware ───────────────────────────────────────
import errorHandler from './middleware/errorHandler.js'

const app = express()

// ── Security Headers ─────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
)

// ── CORS ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Rate Limiting ────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { status: 'error', message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'error', message: 'Too many auth attempts. Please try again in 15 minutes.' },
})

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { status: 'error', message: 'Too many contact submissions. Please try again later.' },
})

app.use('/api', globalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth/forgot-password', authLimiter)
app.use('/api/contact', contactLimiter)

// ── Body Parsing ─────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── Data Sanitization ────────────────────────────────
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

// ── Compression & Logging ────────────────────────────
app.use(compression())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── API Routes ───────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/users', userRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/admin', adminRoutes)

// ── Health Check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'CyberGuard API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  })
})

// ── 404 Handler ──────────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  })
})

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler)

// ── Database Connection ──────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    console.error('   Make sure MongoDB is running: mongod')
    process.exit(1)
  }
}

// ── Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║          CYBER GUARD SOLUTIONS — API SERVER          ║
╠══════════════════════════════════════════════════════╣
║  🚀  Server:  http://localhost:${PORT}                   ║
║  🌍  Env:     ${(process.env.NODE_ENV || 'development').padEnd(38)}║
║  🗄️   DB:     Connected                              ║
╠══════════════════════════════════════════════════════╣
║  📡  Endpoints:                                      ║
║      POST  /api/auth/register                        ║
║      POST  /api/auth/login                           ║
║      POST  /api/contact                              ║
║      GET   /api/services                             ║
║      POST  /api/ai/chat                              ║
║      POST  /api/newsletter/subscribe                 ║
║      GET   /api/admin/stats  (admin only)            ║
║      GET   /api/health                               ║
╚══════════════════════════════════════════════════════╝
    `)
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message)
  process.exit(1)
})

export default app
