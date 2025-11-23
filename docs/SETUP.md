# Setup Guide

## System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Screen Resolution**: 1280x720 minimum (1920x1080 recommended)
- **Microsoft Excel**: 2016 or higher (for template integration)

## Installation Steps

### 1. Environment Setup

```bash
# Navigate to project directory
cd C:\dev\School\ACF\ACF-Exam-Prep

# Verify Node.js installation
node --version  # Should show v16.0.0+

# Install dependencies
npm install
```

### 2. Source Materials Setup

Create the following directory structure in `public/source-materials/`:

```
public/source-materials/
├── Corporate_Finance_Templates.xlsx
├── Mock_Solutions.md
└── pdfs/
    ├── Fall_2024_Final.pdf
    ├── Fall_2022_Final.pdf
    └── Mock_29.pdf
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update paths:

```bash
cp .env.example .env
```

Edit `.env`:
```
EXCEL_TEMPLATES_PATH=./public/source-materials/Corporate_Finance_Templates.xlsx
MOCK_EXAMS_PATH=./public/source-materials/pdfs/
ENABLE_EXCEL_INTEGRATION=true
```

### 4. First Run

```bash
npm start
```

The application will open at `http://localhost:3000`

## Verification Checklist

After installation, verify:

- [ ] App loads without errors
- [ ] Reconnaissance mode accepts text input
- [ ] Archetype scanner returns results
- [ ] Excel launcher shows correct file path
- [ ] All 10 archetypes load in data files
- [ ] Mock exam index displays available exams

## Troubleshooting

### Issue: npm install fails

**Solution**: 
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Use different port
PORT=3001 npm start
```

### Issue: Excel files not loading

**Solution**:
- Verify file paths in `.env`
- Ensure Excel files are in `public/source-materials/`
- Check file permissions

## Next Steps

1. Read [USAGE.md](./USAGE.md) for operational guide
2. Review [ARCHETYPE_GUIDE.md](./ARCHETYPE_GUIDE.md) for archetype details
3. Configure your first practice session
