# Quick Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB installed (or MongoDB Atlas account)
- Git installed
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Node.js
```bash
# Check if Node.js is installed
node --version

# If not installed, download from nodejs.org
# Or use nvm (recommended):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. Install MongoDB

#### Option A: Local MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download from mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier)
4. Get connection string
5. Use in .env file

### 3. Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd cyber-guard-solutions

# Install all dependencies
npm run install-all
```

### 4. Configure Environment

```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit backend/.env with your settings
nano backend/.env
```

Required settings:
```env
MONGODB_URI=mongodb://localhost:27017/cyberguard
JWT_SECRET=your-random-secret-key-here
```

Optional (for full features):
```env
OPENAI_API_KEY=sk-...
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 5. Start Development

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 6. Test the Application

Open browser and visit:
- Homepage: http://localhost:3000
- API Health: http://localhost:5000/api/health

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install-all
```

### AI Assistant Not Working
- Check if OPENAI_API_KEY or GEMINI_API_KEY is set
- Verify API key is valid
- Check API quota/billing
- AI will work with fallback responses if no key is set

## Getting API Keys

### OpenAI API Key
1. Go to platform.openai.com
2. Sign up/login
3. Go to API Keys section
4. Create new key
5. Add to backend/.env: `OPENAI_API_KEY=sk-...`

### Google Gemini API Key
1. Go to makersuite.google.com/app/apikey
2. Create API key
3. Add to backend/.env: `GEMINI_API_KEY=...`

### Gmail App Password (for email)
1. Enable 2-factor authentication on Gmail
2. Go to myaccount.google.com/apppasswords
3. Generate app password
4. Add to backend/.env:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=generated-app-password
   ```

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Run Both Simultaneously
```bash
# From root directory
npm run dev
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Backend
```bash
cd backend
npm start
```

## Next Steps

1. ✅ Customize the content in frontend/src/pages/
2. ✅ Add your branding/logo
3. ✅ Configure email settings
4. ✅ Set up AI assistant with API key
5. ✅ Test all features
6. ✅ Deploy (see DEPLOYMENT.md)

## Useful Commands

```bash
# Install dependencies
npm run install-all

# Start development
npm run dev

# Build frontend
npm run build

# Start backend only
npm run server

# Start frontend only
npm run client
```

## Project Structure

```
cyber-guard-solutions/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── App.jsx     # Main app
│   └── package.json
├── backend/            # Node.js API
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── server.js       # Entry point
└── package.json        # Root config
```

## Support

Need help? 
- 📧 Email: info@cyberguard.com
- 📱 Phone: +251 925 259 536
- 📖 Docs: See README.md and API.md
