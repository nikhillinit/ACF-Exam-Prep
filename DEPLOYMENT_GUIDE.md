# Deployment Guide - Move to C:\dev\School\ACF

## Option 1: Copy Entire Structure (Recommended)

### Step 1: Copy Files
```bash
# From this directory, copy everything to your target location
cp -r /home/claude/ACF-Exam-Prep/* C:/dev/School/ACF/ACF-Exam-Prep/

# Or on Windows Command Prompt:
xcopy /E /I /H /Y "\\wsl$\Ubuntu\home\claude\ACF-Exam-Prep" "C:\dev\School\ACF\ACF-Exam-Prep"
```

### Step 2: Install Dependencies
```bash
cd C:\dev\School\ACF\ACF-Exam-Prep
npm install
```

### Step 3: Add Source Materials
Place these files in `C:\dev\School\ACF\ACF-Exam-Prep\public\source-materials\`:
- Corporate_Finance_Templates.xlsx
- Mock_Solutions.md
- pdfs/Fall_2024_Final.pdf
- pdfs/Fall_2022_Final.pdf
- pdfs/Mock_29.pdf

### Step 4: Configure Environment
```bash
cd C:\dev\School\ACF\ACF-Exam-Prep
copy .env.example .env
# Edit .env if needed
```

### Step 5: Start Application
```bash
npm start
```

## Option 2: Download as ZIP

### If You Want a Clean ZIP Archive

```bash
# Create a ZIP file (run from /home/claude)
cd /home/claude
zip -r ACF-Exam-Prep.zip ACF-Exam-Prep/ -x "*.git*" -x "*node_modules*"

# Copy to Windows Downloads
cp ACF-Exam-Prep.zip /mnt/c/Users/[YourUsername]/Downloads/
```

Then extract on Windows:
1. Navigate to Downloads folder
2. Right-click → Extract All
3. Extract to `C:\dev\School\ACF\`
4. Follow Steps 2-5 from Option 1

## Verification After Deployment

### Quick Health Check

Run this in PowerShell/CMD:
```powershell
cd C:\dev\School\ACF\ACF-Exam-Prep

# Check Node.js
node --version
# Should show: v16.0.0 or higher

# Check structure
dir src\components
# Should list: practice, reconnaissance, review

# Check data files
dir src\data
# Should list: 5 JSON files

# Install and start
npm install
npm start
```

Application should open at `http://localhost:3000`

## Troubleshooting

### Issue: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 in use
```bash
# Use different port
set PORT=3001 && npm start
```

### Issue: Excel files not found
- Verify files are in `public/source-materials/`
- Check `.env` file paths
- Ensure no typos in filenames

## Windows-Specific Setup Script

Save this as `setup.bat` in `C:\dev\School\ACF\ACF-Exam-Prep\`:

```batch
@echo off
echo ======================================
echo ACF Exam Prep - Windows Setup
echo ======================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 16+
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [3/5] Checking source materials...
if not exist "public\source-materials\Corporate_Finance_Templates.xlsx" (
    echo WARNING: Excel template not found
    echo Please add Corporate_Finance_Templates.xlsx to public\source-materials\
)
echo.

echo [4/5] Creating .env file...
if not exist ".env" (
    copy .env.example .env
    echo ✓ .env created from template
) else (
    echo ✓ .env already exists
)
echo.

echo [5/5] Starting application...
echo.
echo Opening http://localhost:3000 in your browser...
echo Press Ctrl+C to stop the server
echo.
start http://localhost:3000
call npm start
```

## Post-Deployment Checklist

After deployment, verify these work:

- [ ] `npm start` launches without errors
- [ ] Browser opens to localhost:3000
- [ ] Reconnaissance page loads
- [ ] Can paste text and click "Scan & Identify Archetypes"
- [ ] Scanner returns results with archetypes
- [ ] Excel launcher shows correct file path
- [ ] Navigation between modes works (Reconnaissance, Practice, Review)

## Next Steps

1. Read `docs/USAGE.md` for operational guide
2. Try reconnaissance on a sample problem
3. Configure first practice session
4. Review `docs/ARCHETYPE_GUIDE.md` for archetype details

## Support

If you encounter issues:
1. Check `DIRECTORY_STRUCTURE.txt` for file organization
2. Review `docs/SETUP.md` for detailed setup
3. Verify all files copied correctly
4. Check console for error messages
