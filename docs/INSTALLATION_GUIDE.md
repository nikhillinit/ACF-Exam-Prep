# ACF Exam Prep - Resource Integration Installation Guide

## Overview
This guide will help you integrate the resource system into your ACF-Exam-Prep application at:
`C:\Users\nikhi\ACF-Exam-Prep`

## Prerequisites
- Existing React application at C:\Users\nikhi\ACF-Exam-Prep
- Node.js and npm installed
- Files downloaded from Claude

---

## Installation Steps

### Step 1: Create Directory Structure

Open Command Prompt or PowerShell and run:

```cmd
cd C:\Users\nikhi\ACF-Exam-Prep

:: Create utils directory if it doesn't exist
if not exist "src\utils" mkdir src\utils

:: Create resources components directory
if not exist "src\components\resources" mkdir src\components\resources

:: Create source-materials directory in public
if not exist "public\source-materials" mkdir public\source-materials
```

### Step 2: Copy Downloaded Files

Assuming you've downloaded the files to your Downloads folder:

```cmd
:: Copy the resource loader utility
copy "%USERPROFILE%\Downloads\resourceLoader.js" "C:\Users\nikhi\ACF-Exam-Prep\src\utils\"

:: Copy React components
copy "%USERPROFILE%\Downloads\ResourceBrowser.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\"
copy "%USERPROFILE%\Downloads\MarkdownViewer.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\"
copy "%USERPROFILE%\Downloads\ReconView_Clean.jsx" "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources\"

:: Copy data files to public folder
copy "%USERPROFILE%\Downloads\resourceRegistry.json" "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\"
copy "%USERPROFILE%\Downloads\guided_problem_solving_COMPLETE.json" "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\"
```

**Verify the files copied successfully:**

```cmd
dir "C:\Users\nikhi\ACF-Exam-Prep\src\utils\resourceLoader.js"
dir "C:\Users\nikhi\ACF-Exam-Prep\src\components\resources"
dir "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials"
```

### Step 3: Update App.jsx

Your main App.jsx needs to integrate the new components. Here's what to add:

**File: `C:\Users\nikhi\ACF-Exam-Prep\src\App.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import './App.css';

// Import existing components
import ReconView from './components/ReconView'; // or wherever it is
// ... other existing imports

// NEW: Import resource components
import ResourceBrowser from './components/resources/ResourceBrowser';
import { initializeResourceLoader } from './utils/resourceLoader';

function App() {
  const [activeTab, setActiveTab] = useState('reconnaissance');
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  // Initialize resource loader on app start
  useEffect(() => {
    async function init() {
      const success = await initializeResourceLoader();
      setResourcesLoaded(success);
      if (!success) {
        console.error('Failed to load resources');
      }
    }
    init();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 ACF Exam Prep System</h1>
      </header>

      {/* Tab Navigation */}
      <nav className="tabs">
        <button 
          className={activeTab === 'reconnaissance' ? 'active' : ''}
          onClick={() => setActiveTab('reconnaissance')}
        >
          🔍 Reconnaissance
        </button>
        <button 
          className={activeTab === 'practice' ? 'active' : ''}
          onClick={() => setActiveTab('practice')}
        >
          💪 Practice
        </button>
        <button 
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          📚 Resources
        </button>
        <button 
          className={activeTab === 'review' ? 'active' : ''}
          onClick={() => setActiveTab('review')}
        >
          📊 Review
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'reconnaissance' && <ReconView />}
        {activeTab === 'practice' && <div>Practice View - Coming Soon</div>}
        {activeTab === 'resources' && (
          resourcesLoaded ? 
            <ResourceBrowser /> : 
            <div>Loading resources...</div>
        )}
        {activeTab === 'review' && <div>Review View - Coming Soon</div>}
      </div>
    </div>
  );
}

export default App;
```

### Step 4: Add Basic Styling (Optional)

Add this to your `App.css` or create a new file `resources.css`:

```css
/* Tab Navigation */
.tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tabs button:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.tabs button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Tab Content */
.tab-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Card Styles */
.card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}
```

### Step 5: Install Required Dependencies

Make sure you have React Router and any other dependencies:

```cmd
cd C:\Users\nikhi\ACF-Exam-Prep

:: Install dependencies if needed
npm install
```

### Step 6: Start the Development Server

```cmd
npm start
```

The app should now open in your browser at `http://localhost:3000`

---

## Verification Checklist

After installation, verify that:

- [ ] ✅ App loads without errors
- [ ] ✅ You can see all four tabs (Reconnaissance, Practice, Resources, Review)
- [ ] ✅ Clicking "Resources" tab shows the ResourceBrowser component
- [ ] ✅ You can switch between different view modes (Category, Archetype, Type, Search)
- [ ] ✅ Browser console shows no errors about missing files

---

## Troubleshooting

### Problem: "Cannot find module './utils/resourceLoader'"

**Solution:**
```cmd
:: Verify the file exists
dir "C:\Users\nikhi\ACF-Exam-Prep\src\utils\resourceLoader.js"

:: If missing, copy again
copy "%USERPROFILE%\Downloads\resourceLoader.js" "C:\Users\nikhi\ACF-Exam-Prep\src\utils\"
```

### Problem: "Failed to load resource registry"

**Solution:**
```cmd
:: Check if resourceRegistry.json is in public folder
dir "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\resourceRegistry.json"

:: If missing, copy it
copy "%USERPROFILE%\Downloads\resourceRegistry.json" "C:\Users\nikhi\ACF-Exam-Prep\public\source-materials\"
```

### Problem: Resources tab is empty or shows "No resources found"

**Possible causes:**
1. resourceRegistry.json is not in the correct location
2. The path in resourceLoader.js needs adjustment
3. Resources haven't loaded yet

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify the fetch request to `/source-materials/resourceRegistry.json` succeeds
4. If you see a 404 error, the file path is wrong

### Problem: Import paths not working

**Solution:**
If you see errors like "Module not found", you may need to adjust import paths:

```javascript
// In resourceLoader.js, line 12-13, change:
resourceRegistry = require('../../public/source-materials/resourceRegistry.json');

// To use absolute path if your project supports it:
resourceRegistry = require('/source-materials/resourceRegistry.json');
```

---

## Testing the Integration

### Test 1: Browse Resources by Category

1. Click "Resources" tab
2. Click "📂 By Category" button
3. Select "Conceptual Learning" from dropdown
4. You should see the ACF Q2 Conceptual Guide listed

### Test 2: Search Resources

1. Click "🔍 Search" button
2. Type "tax shields" in search box
3. You should see resources related to tax shields

### Test 3: View Markdown Content

1. Find a markdown resource (like ACF Q2 Conceptual Guide)
2. Click on it
3. A modal should open showing the content with table of contents

### Test 4: Open PDF Resource

1. Browse to find a PDF resource (mock exam)
2. Click "📄 Open Exam"
3. PDF should open in a new browser tab

---

## Next Steps

Once the basic integration is working:

1. **Add More Resources**: Place PDF mock exams in `public/source-materials/` and register them in `resourceRegistry.json`

2. **Connect to Reconnaissance Tab**: Update your ReconView component to show recommended resources after scanning

3. **Add Practice Tab**: Integrate the worked examples from `guided_problem_solving_COMPLETE.json`

4. **Customize Styling**: Match the components to your app's design system

---

## File Structure After Installation

```
C:\Users\nikhi\ACF-Exam-Prep\
├── public\
│   └── source-materials\
│       ├── resourceRegistry.json              ✅ NEW
│       └── guided_problem_solving_COMPLETE.json  ✅ NEW
├── src\
│   ├── components\
│   │   ├── resources\
│   │   │   ├── ResourceBrowser.jsx           ✅ NEW
│   │   │   ├── MarkdownViewer.jsx            ✅ NEW
│   │   │   └── ReconView_Clean.jsx           ✅ NEW
│   │   └── ReconView.jsx                     (existing)
│   ├── utils\
│   │   └── resourceLoader.js                 ✅ NEW
│   ├── App.jsx                                (modified)
│   └── App.css                                (modified)
├── package.json
└── README.md
```

---

## Support

If you encounter issues:

1. Check the browser console for errors (F12 → Console tab)
2. Verify all files are in the correct locations
3. Ensure npm dependencies are installed (`npm install`)
4. Try clearing browser cache and restarting dev server

---

## Summary

You've successfully integrated:
- ✅ Resource loader utility
- ✅ Resource browser component
- ✅ Markdown viewer component
- ✅ Resource registry data
- ✅ Tab-based navigation

Your app can now:
- 📚 Browse resources by category, archetype, or type
- 🔍 Search resources by keyword
- 📖 View markdown guides with table of contents
- 📄 Open PDF mock exams
- 🎯 Show recommended resources based on context
