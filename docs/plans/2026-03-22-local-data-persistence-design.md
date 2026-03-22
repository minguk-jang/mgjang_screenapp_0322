# Local Data Persistence (JSON File Storage) Design

## Objective
Replace the hardcoded mock data in `DesktopContext.jsx` with real persistent data stored locally on the user's machine.

## Architecture & Constraints
- **Storage Location**: Store a file named `hub-data.json` inside the user's `userData` path via Electron's `app.getPath('userData')`. Do NOT store in the project directory.
- **Module**: Use Node's native `fs` and `fs/promises` in `main.js`.
- **Preload**: Expose data loading and saving securely via `contextBridge` in `preload.js`.
- **State Updates**: Data should be loaded on initial mount, and saved on every state update using a debounced write.

## Features
1. **Debounced Saves**: The React UI will combine rapid sequential updates (e.g., from a Scratchpad or to-do check list) into discrete save events delayed by 1000ms.
2. **Atomic Writes**: `ipcMain` handler will use a temporary file (`hub-data.tmp`) which will then be renamed (`fs.renameSync` or `fs.promises.rename`) to the `hub-data.json` upon successful write. This prevents half-written files or corruption in the event of a process kill or crash during writing.

## Implementation Steps
1. Add `ipcMain.handle('load-data')` and `'save-data'` to `electron/main.js`.
2. Update `electron/preload.js` to expose `window.electronAPI.loadData` and `window.electronAPI.saveData`.
3. Update `src/context/DesktopContext.jsx` to load data via `useEffect`, debounce subsequent state changes, and save securely.
