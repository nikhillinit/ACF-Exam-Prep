# ACF Exam Prep - Problem Library Setup Script
# Run this from your ACF-Exam-Prep directory

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ACF Exam Prep - Problem Library Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Please run this script from your ACF-Exam-Prep directory." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Found package.json" -ForegroundColor Green

# Step 1: Check if components directory exists
if (!(Test-Path "src\components")) {
    Write-Host "Creating src\components directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "src\components" -Force | Out-Null
}
Write-Host "✓ Components directory ready" -ForegroundColor Green

# Step 2: Check if source-materials directory exists
if (!(Test-Path "public\source-materials")) {
    Write-Host "Creating public\source-materials directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public\source-materials" -Force | Out-Null
}
Write-Host "✓ Source materials directory ready" -ForegroundColor Green

# Step 3: Check for JSON files
$guidedExists = Test-Path "public\source-materials\guided_examples_v11.json"
$mockExists = Test-Path "public\source-materials\mock_questions_v11.json"

if ($guidedExists) {
    Write-Host "✓ Found guided_examples_v11.json" -ForegroundColor Green
} else {
    Write-Host "⚠ guided_examples_v11.json not found" -ForegroundColor Yellow
}

if ($mockExists) {
    Write-Host "✓ Found mock_questions_v11.json" -ForegroundColor Green
} else {
    Write-Host "⚠ mock_questions_v11.json not found" -ForegroundColor Yellow
}

# Step 4: Install dependencies
Write-Host "`nInstalling better-react-mathjax..." -ForegroundColor Yellow
npm install better-react-mathjax
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 5: Backup existing App.jsx
if (Test-Path "src\App.jsx") {
    Write-Host "`nBacking up existing App.jsx..." -ForegroundColor Yellow
    Copy-Item "src\App.jsx" "src\App.jsx.backup" -Force
    Write-Host "✓ Backup created: src\App.jsx.backup" -ForegroundColor Green
}

# Step 6: Auto-detect and copy files from Downloads
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FILE DETECTION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$downloadsPath = [Environment]::GetFolderPath("UserProfile") + "\Downloads"
$requiredFiles = @(
    "ProblemLibrary.jsx",
    "ProblemDisplay.jsx", 
    "ProblemLibrary.css",
    "App.jsx"
)

$filesFound = @()
$filesMissing = @()

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $downloadsPath $file
    if (Test-Path $fullPath) {
        Write-Host "✓ Found: $file" -ForegroundColor Green
        $filesFound += @{Name=$file; Path=$fullPath}
    } else {
        Write-Host "✗ Missing: $file" -ForegroundColor Red
        $filesMissing += $file
    }
}

if ($filesFound.Count -eq $requiredFiles.Count) {
    Write-Host "`n✓ All required files found in Downloads folder!" -ForegroundColor Green
    Write-Host "`nWould you like to automatically copy them? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "`nCopying files..." -ForegroundColor Yellow
        
        foreach ($fileInfo in $filesFound) {
            $fileName = $fileInfo.Name
            $sourcePath = $fileInfo.Path
            
            if ($fileName -eq "App.jsx") {
                $destPath = "src\App.jsx"
            } else {
                $destPath = "src\components\$fileName"
            }
            
            try {
                Copy-Item $sourcePath $destPath -Force
                Write-Host "  ✓ Copied: $fileName → $destPath" -ForegroundColor Green
            } catch {
                Write-Host "  ✗ Failed to copy: $fileName" -ForegroundColor Red
                Write-Host "    Error: $_" -ForegroundColor Red
            }
        }
        
        Write-Host "`n✓ Files copied successfully!" -ForegroundColor Green
    } else {
        Write-Host "`nSkipping auto-copy. Please copy files manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⚠ Not all files found in Downloads folder." -ForegroundColor Yellow
    Write-Host "Missing files: $($filesMissing -join ', ')" -ForegroundColor Red
}

# Step 7: Run JSON validation if available
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "JSON VALIDATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if (Test-Path "validate_json.js") {
    Write-Host "Running JSON validation..." -ForegroundColor Yellow
    node validate_json.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ JSON validation passed!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠ JSON validation found issues. Please review the output above." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ validate_json.js not found. Skipping validation." -ForegroundColor Yellow
    Write-Host "To validate your JSON files later, copy validate_json.js to this directory and run:" -ForegroundColor Yellow
    Write-Host "  node validate_json.js" -ForegroundColor Cyan
}

# Step 8: Instructions for next steps
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1. Verify all files are in place" -ForegroundColor White
Write-Host "  2. Start the development server: npm start" -ForegroundColor White
Write-Host "  3. Navigate to: http://localhost:3000/library" -ForegroundColor White

Write-Host "`nIf you didn't auto-copy files, copy them manually:" -ForegroundColor Yellow
Write-Host '  copy "Downloads\ProblemLibrary.jsx" "src\components\"' -ForegroundColor Cyan
Write-Host '  copy "Downloads\ProblemDisplay.jsx" "src\components\"' -ForegroundColor Cyan
Write-Host '  copy "Downloads\ProblemLibrary.css" "src\components\"' -ForegroundColor Cyan
Write-Host '  copy "Downloads\App.jsx" "src\"' -ForegroundColor Cyan

Write-Host "`nSetup script complete!" -ForegroundColor Green
Write-Host "Good luck with your ACF exam prep! 🎯`n" -ForegroundColor Green
