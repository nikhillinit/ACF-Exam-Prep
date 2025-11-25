# 🎯 Installation Order Guide

## Complete Step-by-Step Installation Process

Follow these steps **in exact order** for a smooth installation.

---

## 📋 STEP 0: Pre-Installation Checklist

### Verify You Have These Files Downloaded:

- [ ] resourceLoader.js
- [ ] ResourceBrowser.jsx
- [ ] MarkdownViewer.jsx
- [ ] ReconView_Clean.jsx
- [ ] resourceRegistry.json
- [ ] guided_problem_solving_COMPLETE.json
- [ ] App.jsx (example)
- [ ] App.css (styling)
- [ ] install.bat (optional - for automation)

**Save all files to:** `C:\Users\nikhi\Downloads\`

---

## 🚀 STEP 1: Create Directory Structure

Open Command Prompt and run these commands:

```cmd
cd C:\Users\nikhi\ACF-Exam-Prep

:: Create utils folder
if not exist "src\utils" mkdir src\utils

:: Create resources components folder
if not exist "src\components\resources" mkdir src\components\resources

:: Create source-materials folder in public
if not exist "public\source-materials" mkdir public\source-materials
```

**Verify:**
```cmd
dir src\utils
dir src\components\resources
dir public\source-materials
```

All three should exist with no errors.

---

## 📁 STEP 2: Copy Data Files to Public Folder

These files go in the `public` folder so they can be fetched at runtime:

```cmd
:: Copy resource registry
copy "%USERPROFILE%\Downloads\resourceRegistry.json" "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\"

:: Copy worked examples
copy "%USERPROFILE%\Downloads\guided_problem_solving_COMPLETE.json" "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\"
```

**Verify:**
```cmd
dir "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\*.json"
```

Should show 2 JSON files.

---

## 💻 STEP 3: Copy Utility File

```cmd
:: Copy resourceLoader.js to utils
copy "%USERPROFILE%\Downloads\resourceLoader.js" "C:\Users\nikhi\ACF-Exam-Prep\src\utils\"
```

**Verify:**
```cmd
dir "C:\Users\nikhi\ACF-Exam-Prep\src\utils\resourceLoader.js"
```

Should show the file with size ~10-12 KB.

---

## 🎨 STEP 4: Copy React Components

```cmd
:: Copy all three React components
copy "%USERPROFILE%\Downloads\ResourceBrowser.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\"
copy "%USERPROFILE%\Downloads\MarkdownViewer.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\"
copy "%USERPROFILE%\Downloads\ReconView_Clean.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\"
```

**Verify:**
```cmd
dir "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\*.jsx"
```

Should show 3 JSX files.

---

## 📝 STEP 5: Update App.jsx

### Option A: If you DON'T have an existing App.jsx

```cmd
:: Backup first (just in case)
copy "C:\Users\nikhi\ACF-Exam-Prep\src\App.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\App.jsx.backup"

:: Copy the example
copy "%USERPROFILE%\Downloads\App.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\"
```

### Option B: If you HAVE an existing App.jsx (recommended)

**Manually edit** `C:\Users\nikhi\ACF-Exam-Prep\src\App.jsx`

Add these imports at the top:
```javascript
import ResourceBrowser from './components/resources/ResourceBrowser';
import { initializeResourceLoader } from './utils/resourceLoader';
```

Add this useEffect hook inside your App component:
```javascript
const [resourcesLoaded, setResourcesLoaded] = useState(false);

useEffect(() => {
  async function init() {
    console.log('Initializing resource loader...');
    const success = await initializeResourceLoader();
    setResourcesLoaded(success);
    
    if (success) {
      console.log('✅ Resources loaded successfully');
    } else {
      console.error('❌ Failed to load resources');
    }
  }
  init();
}, []);
```

Add a "Resources" tab button:
```javascript
<button 
  className={activeTab === 'resources' ? 'active' : ''}
  onClick={() => setActiveTab('resources')}
>
  📚 Resources
</button>
```

Add the Resources tab content:
```javascript
{activeTab === 'resources' && (
  resourcesLoaded ? 
    <ResourceBrowser /> : 
    <div>Loading resources...</div>
)}
```

---

## 🎨 STEP 6: Update App.css (Styling)

### Option A: No existing custom styles

```cmd
:: Backup first
copy "C:\Users\nikhi\ACF-Exam-Prep\src\App.css" "C:\Users\nikhi\ACF-Exam-Prep\src\App.css.backup"

:: Copy new styles
copy "%USERPROFILE%\Downloads\App.css" "C:\Users\nikhi\ACF-Exam-Prep\src\"
```

### Option B: Have existing styles

**Append** the contents of the downloaded `App.css` to your existing file, or:

```cmd
:: Append new styles to existing
type "%USERPROFILE%\Downloads\App.css" >> "C:\Users\nikhi\ACF-Exam-Prep\src\App.css"
```

---

## 🔍 STEP 7: Verify File Structure

Run this command to see the complete structure:

```cmd
tree /F C:\Users\nikhi\ACF-Exam-Prep\src C:\Users\nikhi\ACF-Exam-Prep\public
```

**Expected structure:**
```
C:\Users\nikhi\ACF-Exam-Prep
├── public
│   └── source-materials
│       ├── resourceRegistry.json              ✅
│       └── guided_problem_solving_COMPLETE.json  ✅
└── src
    ├── components
    │   └── resources
    │       ├── ResourceBrowser.jsx            ✅
    │       ├── MarkdownViewer.jsx             ✅
    │       └── ReconView_Clean.jsx            ✅
    ├── utils
    │   └── resourceLoader.js                  ✅
    ├── App.jsx                                 ✅ (modified)
    └── App.css                                 ✅ (modified)
```

---

## 📦 STEP 8: Install Dependencies (if needed)

```cmd
cd C:\Users\nikhi\ACF-Exam-Prep

:: Install or update dependencies
npm install
```

**This ensures all React dependencies are present.**

---

## 🚀 STEP 9: Start Development Server

```cmd
cd C:\Users\nikhi\ACF-Exam-Prep

:: Start the dev server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view acf-exam-prep in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ✅ STEP 10: Verify in Browser

### A. Check Browser Opens

- Browser should automatically open to `http://localhost:3000`
- App should load without errors

### B. Check Browser Console

1. Press `F12` to open DevTools
2. Click "Console" tab
3. Look for:
   ```
   Initializing resource loader...
   ✅ Resource registry loaded successfully
   ```

### C. Test Resources Tab

1. Click "📚 Resources" tab
2. Should show Resource Browser interface
3. Try switching view modes:
   - Click "📂 By Category"
   - Select "Conceptual Learning"
   - Should show resources

### D. Test Search

1. Click "🔍 Search"
2. Type "tax shields"
3. Should show matching resources

---

## 🎉 STEP 11: Success Confirmation

If all of the following are true, you're done! ✅

- [ ] Dev server started without errors
- [ ] Browser shows app at localhost:3000
- [ ] Console shows "Resources loaded successfully"
- [ ] Resources tab is visible in navigation
- [ ] Clicking Resources tab shows Resource Browser
- [ ] Can switch between view modes
- [ ] Search finds resources

---

## 🚨 Troubleshooting Common Issues

### Issue: "Cannot find module './utils/resourceLoader'"

**Cause:** File not in correct location

**Fix:**
```cmd
:: Verify file exists
dir "C:\Users\nikhi\ACF-Exam-Prep\src\utils\resourceLoader.js"

:: If missing, copy again
copy "%USERPROFILE%\Downloads\resourceLoader.js" "C:\Users\nikhi\ACF-Exam-Prep\src\utils\"
```

---

### Issue: "Failed to load registry: 404"

**Cause:** resourceRegistry.json not in public folder

**Fix:**
```cmd
:: Verify file exists
dir "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\resourceRegistry.json"

:: If missing, copy again
copy "%USERPROFILE%\Downloads\resourceRegistry.json" "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\"
```

---

### Issue: Resources tab shows "Loading..." forever

**Causes:**
1. resourceRegistry.json not loading
2. initializeResourceLoader() not being called

**Fix:**
1. Check browser console (F12) for errors
2. Verify you added the useEffect hook in App.jsx
3. Check network tab - should see request to `/source-materials/resourceRegistry.json`
4. If 404, file is in wrong location

---

### Issue: Styling looks broken

**Cause:** CSS not loaded or conflicting styles

**Fix:**
1. Verify App.css is imported in App.jsx: `import './App.css';`
2. Check browser DevTools → Sources → see if App.css is loaded
3. Clear browser cache: `Ctrl + Shift + Delete`
4. Hard refresh: `Ctrl + Shift + R`

---

### Issue: npm start fails

**Common causes:**
1. Not in project directory
2. node_modules missing
3. Package.json issues

**Fix:**
```cmd
:: Make sure you're in project directory
cd C:\Users\nikhi\ACF-Exam-Prep

:: Remove node_modules and reinstall
rmdir /s /q node_modules
npm install

:: Try starting again
npm start
```

---

## 📊 Installation Time Estimates

- **Step 0-2** (File setup): 2-3 minutes
- **Step 3-4** (Copy files): 2 minutes
- **Step 5** (Update App.jsx): 5-10 minutes
- **Step 6** (Update App.css): 2 minutes
- **Step 7-9** (Install & start): 3-5 minutes
- **Step 10** (Testing): 5 minutes

**Total: 20-30 minutes**

---

## 🎯 Quick Reference: File Destinations

| File | Destination |
|------|-------------|
| resourceLoader.js | `src/utils/` |
| ResourceBrowser.jsx | `src/components/resources/` |
| MarkdownViewer.jsx | `src/components/resources/` |
| ReconView_Clean.jsx | `src/components/resources/` |
| resourceRegistry.json | `public/source-materials/` |
| guided_problem_solving_COMPLETE.json | `public/source-materials/` |
| App.jsx | `src/` (modify existing) |
| App.css | `src/` (modify existing) |

---

## ✅ Final Checklist

After completing all steps:

- [ ] All files copied to correct locations
- [ ] App.jsx updated with imports and useEffect
- [ ] App.css updated with new styles
- [ ] npm install completed successfully
- [ ] npm start runs without errors
- [ ] Browser opens to localhost:3000
- [ ] Console shows "Resources loaded successfully"
- [ ] Resources tab works
- [ ] Can browse and search resources

**All checked?** 🎉 **Integration complete!**

---

## 📖 Next Steps

After successful installation:

1. **Add Content**: Place your mock exam PDFs in `public/source-materials/`
2. **Register Resources**: Update `resourceRegistry.json` with new entries
3. **Customize**: Adjust styling in `App.css` to match your design
4. **Integrate**: Connect resources to Reconnaissance tab
5. **Test**: Run through VERIFICATION_CHECKLIST.md

---

**Questions or issues?** Check the troubleshooting section or ask for help!
