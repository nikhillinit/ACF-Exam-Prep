# Quick Start Checklist

## 📦 Files You Need to Download

From Claude, download these files:

- [ ] resourceLoader.js
- [ ] ResourceBrowser.jsx
- [ ] MarkdownViewer.jsx
- [ ] ReconView_Clean.jsx
- [ ] resourceRegistry.json
- [ ] guided_problem_solving_COMPLETE.json
- [ ] install.bat (automated installer)
- [ ] INSTALLATION_GUIDE.md (detailed instructions)

## ⚡ Quick Installation (Windows)

### Option 1: Automated (Recommended)

1. Download all files above to your **Downloads** folder
2. Double-click `install.bat`
3. Follow the prompts
4. Update `App.jsx` (see INSTALLATION_GUIDE.md Step 3)
5. Run `npm start`

### Option 2: Manual

1. Open Command Prompt
2. Follow steps in INSTALLATION_GUIDE.md
3. Copy files manually using the commands provided

## ✅ Verification Steps

After installation:

1. [ ] Open browser to http://localhost:3000
2. [ ] Click "Resources" tab
3. [ ] Select "By Category" → "Conceptual Learning"
4. [ ] Click on "ACF Q2 Conceptual Guide"
5. [ ] Markdown viewer should open with content

If all steps work → ✅ Installation successful!

## 🚨 Common Issues

**Issue: Files not copying**
- Solution: Make sure all files are in your Downloads folder

**Issue: Import errors in VS Code**
- Solution: Restart VS Code after copying files

**Issue: Resources tab shows "Loading..."**
- Solution: Check browser console (F12) for errors
- Verify resourceRegistry.json is in public/source-materials/

**Issue: "Cannot find module"**
- Solution: Run `npm install` in project directory

## 📚 What You Get

After integration:

✅ Resource Browser with multiple view modes
✅ Markdown viewer with table of contents
✅ PDF mock exam support
✅ Search functionality
✅ Archetype-based resource recommendations
✅ Category-based organization

## 🎯 Next Steps

1. **Test the system**: Click through different view modes
2. **Add your content**: Place PDF mock exams in public/source-materials/
3. **Customize**: Update resourceRegistry.json with your resources
4. **Integrate**: Connect resources to Reconnaissance tab

## 📖 Full Documentation

See INSTALLATION_GUIDE.md for:
- Detailed installation steps
- Code examples
- Troubleshooting guide
- Integration patterns
- Testing procedures

## 💡 Quick Tips

- Use "By Archetype" view when you know the problem type
- Use "Search" to find specific topics
- Add new resources by updating resourceRegistry.json
- PDFs open in new tabs (no loading needed)
- Markdown files render with syntax highlighting

---

**Ready?** Download the files and run install.bat to get started!
