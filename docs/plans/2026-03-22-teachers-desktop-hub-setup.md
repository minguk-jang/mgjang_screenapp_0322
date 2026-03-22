# Teacher's Desktop Hub Setup Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Set up the native Electron solid-surface environment and connect it to a React/Vite development server.

**Architecture:** A single, frameless, full-screen Electron `BrowserWindow` loading a Vite React app as the desktop master surface. IPC is set up through a secure `preload.js` script.

**Tech Stack:** Electron, Node.js `fs`, React, Vite, Tailwind CSS

---

### Task 1: Install Electron Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

Run: `npm install -D electron concurrently wait-on cross-env`
Expected: PASS

**Step 2: Verify installation**

Run: `npm ls electron`
Expected: PASS with electron version listed

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install electron dependencies"
```

### Task 2: Configure package.json Scripts

**Files:**
- Modify: `package.json`

**Step 1: Update main and scripts**

Modify `package.json` to include `"main": "electron/main.js"` at the root level, and update the scripts block:

```json
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "electron:start": "electron .",
    "dev:electron": "cross-env VITE_DEV_SERVER_URL=http://localhost:3000 concurrently \"npm run dev\" \"wait-on http://localhost:3000 && npm run electron:start\"",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "chore: configure electron dev scripts and main entry"
```

### Task 3: Create Preload Script

**Files:**
- Create: `electron/preload.js`

**Step 1: Write preload context bridge**

Create `electron/preload.js`:

```javascript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  readData: () => ipcRenderer.invoke('read-data'),
  writeData: (data) => ipcRenderer.invoke('write-data', data)
});
```

**Step 2: Commit**

```bash
git add electron/preload.js
git commit -m "feat: add ipc context bridge"
```

### Task 4: Create Main Process

**Files:**
- Create: `electron/main.js`

**Step 1: Write main.js logic**

Create `electron/main.js`:

```javascript
import { app, BrowserWindow, ipcMain } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    skipTaskbar: true,
    type: process.platform === 'darwin' ? 'desktop' : 'normal', // Use normal temporarily, move to bottom via custom native bindings if needed later
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

**Step 2: Commit**

```bash
git add electron/main.js
git commit -m "feat: setup frameless fullscreen main process"
```

### Task 5: Setup Solid Surface UI Base

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Delete: `src/App.css`

**Step 1: Clear CSS**

Replace the contents of `src/index.css` with Tailwind directives:
```css
@import "tailwindcss";

html, body, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```
Remove `src/App.css`.

**Step 2: Write basic solid surface App wrapper**

Replace `src/App.jsx` with:
```jsx
export default function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center text-white overflow-hidden pointer-events-auto">
      <h1 className="text-4xl font-bold bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
        Teacher's Desktop Hub Initialized
      </h1>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/App.jsx src/index.css
git rm src/App.css
git commit -m "feat: configure solid surface base layer UI"
```
