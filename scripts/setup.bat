@echo off
echo ╔═══════════════════════════════════════════════════╗
echo ║     Cyber Guard Solutions - Setup Script         ║
echo ╚═══════════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 18+ from nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

echo ✅ npm detected
npm --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
echo.

call npm install
cd frontend
call npm install
cd ..\backend
call npm install
cd ..

echo.
echo ✅ Dependencies installed

REM Setup environment file
if not exist backend\.env (
    echo.
    echo 📝 Creating environment file...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
    echo ⚠️  Please edit backend\.env with your configuration
) else (
    echo ✅ Environment file already exists
)

echo.
echo ╔═══════════════════════════════════════════════════╗
echo ║              Setup Complete! 🎉                   ║
echo ╚═══════════════════════════════════════════════════╝
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Run 'npm run dev' to start development servers
echo 3. Visit http://localhost:3000
echo.
echo For more information, see SETUP.md
echo.
pause
