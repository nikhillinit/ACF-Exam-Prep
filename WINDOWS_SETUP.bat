@echo off
REM ACF Exam Prep - Windows Setup Script
REM Run this after copying files to C:\dev\School\ACF\ACF-Exam-Prep

echo ======================================
echo ACF Exam Prep - Windows Setup
echo ======================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)
echo checkmark Node.js found
echo.

echo [2/5] Installing dependencies (this may take 2-3 minutes)...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)
echo checkmark Dependencies installed
echo.

echo [3/5] Checking source materials...
if not exist "public\source-materials\Corporate_Finance_Templates.xlsx" (
    echo WARNING: Excel template not found
    echo Please add Corporate_Finance_Templates.xlsx to:
    echo   public\source-materials\
    echo.
) else (
    echo checkmark Excel template found
)

if not exist "public\source-materials\pdfs" (
    echo WARNING: PDFs folder not found
    mkdir public\source-materials\pdfs
    echo Created pdfs folder
    echo Please add exam PDFs to: public\source-materials\pdfs\
    echo.
)
echo.

echo [4/5] Creating environment file...
if not exist ".env" (
    copy .env.example .env
    echo checkmark .env created from template
) else (
    echo checkmark .env already exists
)
echo.

echo [5/5] Setup complete!
echo.
echo ======================================
echo Ready to start!
echo ======================================
echo.
echo To start the application, run:
echo   npm start
echo.
echo The app will open at http://localhost:3000
echo.
pause
