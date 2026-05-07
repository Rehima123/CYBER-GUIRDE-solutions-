#!/bin/bash

echo "╔═══════════════════════════════════════════════════╗"
echo "║     Cyber Guard Solutions - Setup Script         ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ from nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
echo ""

npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

echo ""
echo "✅ Dependencies installed"

# Setup environment file
if [ ! -f backend/.env ]; then
    echo ""
    echo "📝 Creating environment file..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env with your configuration"
else
    echo "✅ Environment file already exists"
fi

# Check MongoDB
echo ""
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB detected"
else
    echo "⚠️  MongoDB not detected locally"
    echo "   You can use MongoDB Atlas (cloud) instead"
    echo "   Get connection string from mongodb.com/cloud/atlas"
fi

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║              Setup Complete! 🎉                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Visit http://localhost:3000"
echo ""
echo "For more information, see SETUP.md"
