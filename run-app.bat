@echo off
echo ========================================
echo    Phonetic Service Center Simulation
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Check if TypeScript is compiled
if not exist "dist" (
    echo Building TypeScript...
    npm run build
    if %errorlevel% neq 0 (
        echo ERROR: Failed to build TypeScript
        pause
        exit /b 1
    )
    echo.
)

echo Starting the application...
echo.

REM Run the application
npm start

echo.
echo Application finished.
pause
