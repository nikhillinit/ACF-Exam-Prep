# Localhost Setup - Archetype Guides

## Quick Start

### Option 1: API Only (Fastest)

Start the API server to access guides via HTTP:

```bash
npm run api
```

The API will be available at `http://localhost:3001`

**Endpoints:**
- `GET http://localhost:3001/api/archetypes` - List all archetypes
- `GET http://localhost:3001/api/archetype-guide/A1` - Get guide for A1
- `GET http://localhost:3001/api/archetype-guide/A2A?format=markdown` - Get markdown format

**Test it:**
```bash
# In your browser:
http://localhost:3001/api/archetype-guide/A1

# Or with curl:
curl http://localhost:3001/api/archetype-guide/A1 | json_pp
```

### Option 2: Full Web App with Viewer

1. **Start API server** (Terminal 1):
```bash
npm run api
```

2. **Start React app** (Terminal 2):
```bash
npm start
```

3. **Add route to App.jsx**:
```jsx
import ArchetypeGuideViewer from './components/ArchetypeGuideViewer';

// In your routes:
<Route path="/guides" element={<ArchetypeGuideViewer />} />
```

4. **Navigate to**: `http://localhost:3000/guides`

## API Endpoints

### List All Archetypes
```http
GET /api/archetypes
```

**Response:**
```json
{
  "archetypes": [
    {
      "id": "A1",
      "name": "Capital Structure",
      "tier": 1,
      "priority": "HIGH",
      "timeAllocation": 12,
      "pointValue": "15-25"
    },
    ...
  ]
}
```

### Get Archetype Guide
```http
GET /api/archetype-guide/:archetypeId
```

**Query Parameters:**
- `examples` - Include examples (default: true). Set to `false` to exclude.
- `maxExamples` - Max number of examples (default: 3)
- `format` - Response format: `json` (default) or `markdown`

**Examples:**
```bash
# JSON format (default)
curl http://localhost:3001/api/archetype-guide/A1

# Markdown format
curl http://localhost:3001/api/archetype-guide/A1?format=markdown

# No examples
curl http://localhost:3001/api/archetype-guide/A2A?examples=false

# Limit examples
curl http://localhost:3001/api/archetype-guide/A3?maxExamples=1
```

**JSON Response Structure:**
```json
{
  "header": {
    "id": "A1",
    "name": "Capital Structure",
    "tier": 1,
    "priority": "HIGH",
    "timeAllocation": 12,
    "pointValue": "15-25",
    "examWeight": "80%"
  },
  "recognition": {
    "keywordsByStrength": {
      "INSTANT_TRIGGER": [...],
      "STRONG": [...],
      "MODERATE": [...],
      "WEAK": [...]
    },
    "strongSignals": [...],
    "hybridPatterns": [...]
  },
  "resources": {
    "excelTab": "1_Capital_Structure",
    "playbookSlides": [3, 4, 5],
    "timeStrategy": {...}
  },
  "examples": [...],
  "workflow": {
    "identify": {...},
    "extract": {...},
    "map": {...},
    "execute": {...},
    "check": {...}
  },
  "metadata": {...}
}
```

## React Component Usage

The `ArchetypeGuideViewer` component provides a full UI for browsing and viewing guides.

**Features:**
- Dropdown selector for all archetypes
- Two view modes: Formatted (styled) and Markdown (raw)
- Color-coded keyword strength indicators
- Collapsible sections
- Responsive layout

**Integration:**
```jsx
import ArchetypeGuideViewer from './components/ArchetypeGuideViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/guides" element={<ArchetypeGuideViewer />} />
      </Routes>
    </Router>
  );
}
```

## Troubleshooting

### API Server Won't Start

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:** Another process is using port 3001. Either:
1. Kill the other process
2. Change the port in `server.js`: `const PORT = process.env.PORT || 3002;`

### CORS Errors

**Error:** `Access to fetch at 'http://localhost:3001/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:** The server already includes CORS middleware. If you still see errors:
1. Make sure the API server is running (`npm run api`)
2. Check that `cors` is installed (`npm install cors`)
3. Verify the server console shows no errors

### Component Won't Load

**Error:** `Cannot read properties of undefined (reading 'format')`

**Solution:** The component is trying to import the CLI formatter in the browser. Use the API instead:
1. Remove the `require` from `ArchetypeGuideViewer.jsx`
2. Fetch markdown from API: `GET /api/archetype-guide/:id?format=markdown`

## Advanced Usage

### Custom API Integration

You can fetch guide data from any JavaScript code:

```javascript
async function getArchetypeGuide(archetypeId) {
  const response = await fetch(`http://localhost:3001/api/archetype-guide/${archetypeId}`);
  const guideData = await response.json();
  return guideData;
}

// Usage
const a1Guide = await getArchetypeGuide('A1');
console.log(a1Guide.header.name); // "Capital Structure"
console.log(a1Guide.recognition.keywordsByStrength.MODERATE);
```

### Embedding in Existing Components

You can use the API to enhance existing components:

```jsx
// In your existing component
const [guideData, setGuideData] = useState(null);

useEffect(() => {
  fetch(`http://localhost:3001/api/archetype-guide/${selectedArchetype}`)
    .then(res => res.json())
    .then(data => setGuideData(data));
}, [selectedArchetype]);

// Render specific sections
return (
  <div>
    <h2>{guideData?.header.name}</h2>
    <p>Time: {guideData?.header.timeAllocation} min</p>
    {/* Use any part of the guide data */}
  </div>
);
```

## Production Deployment

For production, you'll want to:

1. **Set environment variables:**
```bash
export PORT=8080  # API server port
export NODE_ENV=production
```

2. **Build the React app:**
```bash
npm run build
```

3. **Serve both from one server:**
- Update `server.js` to serve the built React app
- Add: `app.use(express.static(path.join(__dirname, 'dist')));`

4. **Use a process manager:**
```bash
npm install -g pm2
pm2 start server.js --name "acf-api"
```

## Summary

**CLI Tool (Terminal):**
```bash
npm run archetype-guide -- A1
```

**API Server (Localhost):**
```bash
npm run api
# Then: http://localhost:3001/api/archetype-guide/A1
```

**React Web App:**
```bash
# Terminal 1:
npm run api

# Terminal 2:
npm start

# Browser: http://localhost:3000/guides
```

---

**Next Steps:**
- Add the route to your App.jsx
- Style the component to match your app's theme
- Add authentication if needed
- Deploy to production server

