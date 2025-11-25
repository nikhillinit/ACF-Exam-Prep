# De Novo Problem Analysis - Installation & Verification Checklist

This checklist will help you verify that all the de novo problem analysis features are properly installed and working.

## Step 1: Install Required Package

First, make sure you have the `html-webpack-plugin` installed:

```bash
cd C:\Users\nikhi\ACF-Exam-Prep
npm install --save-dev html-webpack-plugin
```

## Step 2: Copy Files to Your Project

Copy the following files from this package to your project:

### Core Files (REQUIRED)

- [ ] `webpack.config.js` → Copy to project root (replace existing)
- [ ] `src/QuickAnalysisView.jsx` → Copy to `src/components/`
- [ ] `src/ArchetypeAnalysisPanel.jsx` → Copy to `src/components/`
- [ ] `src/staticGuidance.js` → Copy to `src/utils/`
- [ ] `src/archetypeRouting.js` → Copy to `src/utils/`

### Verify App.jsx Has the Route

Open `src/App.jsx` and verify it includes:

```javascript
import QuickAnalysisView from './components/QuickAnalysisView';

// In the Routes section:
<Route path="/quick-analysis" element={<QuickAnalysisView />} />

// In the navigation:
<Link to="/quick-analysis">Quick Analysis</Link>
```

If not, you'll need to add these manually.

## Step 3: Test the Application

1. **Start the dev server:**
   ```bash
   npm start
   ```

2. **Verify the homepage loads** (should show the Reconnaissance tab)

3. **Navigate to Quick Analysis:**
   - Click on the "Quick Analysis" link in the navigation
   - OR go directly to: http://localhost:8080/quick-analysis

4. **Test the de novo analysis:**
   - Paste this example problem:
     ```
     HAL Corporation is considering issuing $100M of debt with a 5% annual coupon rate. 
     The debt will be amortizing over 5 years with equal annual payments. The corporate 
     tax rate is 30%. There is a 10% probability of default each year (hazard rate model). 
     In default, bondholders recover 40% of face value. Calculate the expected return on 
     debt E[r_D] and the present value of tax shields.
     ```
   - Click "Analyze Problem"
   - You should see:
     - Detected archetype: A1 (Capital Structure)
     - Confidence score
     - Matched keywords
     - Quick guide with formulas
     - Link to guided practice

## Step 4: Troubleshooting

### Issue: Blank Page

**Cause:** Webpack config is missing HtmlWebpackPlugin

**Fix:** 
1. Make sure you copied the `webpack.config.js` from this package
2. Run `npm install --save-dev html-webpack-plugin`
3. Restart the dev server

### Issue: "Cannot find module 'staticGuidance'"

**Cause:** The utility files weren't copied correctly

**Fix:**
1. Verify `src/utils/staticGuidance.js` exists
2. Verify `src/utils/archetypeRouting.js` exists
3. Restart the dev server

### Issue: Quick Analysis tab doesn't appear

**Cause:** App.jsx wasn't updated with the new route

**Fix:**
1. Open `src/App.jsx`
2. Add the import and route as shown in Step 2
3. Restart the dev server

### Issue: Analysis doesn't show results

**Cause:** The staticGuidance.js file may be missing or the data structure changed

**Fix:**
1. Check the browser console for errors (F12)
2. Verify `src/utils/staticGuidance.js` has the `detectArchetype` function
3. Make sure `src/data/archetype-signals.json` exists

## Step 5: Verification Complete ✅

If you can:
- [ ] Load the homepage without errors
- [ ] Navigate to the Quick Analysis tab
- [ ] Paste a problem and see analysis results
- [ ] See the "Guided Practice" button when confidence is high

Then the de novo problem analysis feature is working correctly!

## Next Steps

Once everything is working, you can:
1. Add more content to `staticGuidance.js` to improve detection accuracy
2. Customize the analysis panel UI in `ArchetypeAnalysisPanel.jsx`
3. Add more archetypes to the routing logic in `archetypeRouting.js`
