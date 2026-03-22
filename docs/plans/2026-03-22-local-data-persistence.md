# Local Data Persistence Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement local JSON file storage with atomic writes and debouncing to replace hardcoded mock data in the Desktop context.

**Architecture:** We will use `fs.promises` in `electron/main.js` to handle `read-data` and `write-data` IPC handlers. Writing will use a temporary file renamed to the actual file for atomic behavior. `electron/preload.js` will expose these APIs via `contextBridge`. `src/context/DesktopContext.jsx` will handle the initial load and debounced saves upon state updates.

**Tech Stack:** Electron (fs, ipcMain, app, contextBridge), React (useEffect, useState), lodash (debounce) (or manual debounce if lodash isn't available).

---

### Task 1: Update Preload Script

**Files:**
- Modify: `electron/preload.js`

**Step 1: Write minimal implementation**
Ensure that `read-data` and `write-data` (or `loadData`/`saveData`) are exposed. Wait, `electronAPI.readData` and `electronAPI.writeData` already exist in the file. We should ensure they are correctly mapped to handle loading and saving JSON data. Let's rename them to match the prompt or keep them as is and make sure `main.js` handles them! The prompt asks for `window.api.loadData()` and `window.api.saveData(data)`, so we will update `preload.js` to match the exact names the user wants.

### Task 2: Implement Atomic Writes and Loading in main.js

**Files:**
- Modify: `electron/main.js`

**Step 1: Write main process implementation**
Add `ipcMain.handle('load-data')` that checks for `hub-data.json` inside `app.getPath('userData')`. If it exists, read it; otherwise, generate default data.
Add `ipcMain.handle('save-data')` that performs atomic write via `.tmp` file and `fs.promises.rename`.

### Task 3: Handle Debounced Saving and Initialization in Context

**Files:**
- Modify: `src/context/DesktopContext.jsx`

**Step 1: Write React logic**
On mount, fetch data using `window.api.loadData()` and populate `todos`, `folders`, `quickLinks`.
Create a debounced `saveStateToDisk` using a simple internal timeout (or lodash debounce if installed, but custom timeout is safer) to delay sending `window.api.saveData()` by 1000ms.
Whenever `todos`, `folders`, or `quickLinks` change, invoke the debounced `saveStateToDisk`.
