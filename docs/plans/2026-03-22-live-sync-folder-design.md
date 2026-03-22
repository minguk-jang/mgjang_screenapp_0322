# Live Sync Folder Design

## Overview
This document outlines the design for updating the Desktop Hub's folder management from a snapshot-based approach to a real-time Live Sync architecture.

## Approach: Live Sync (Option B)
The Desktop Hub will act as a true mirror of the native OS folders. Instead of storing a static array of files, the application will solely store the absolute path of the linked OS directory. When a folder is activated in the UI, the app will read the contents from the native filesystem in real-time, ensuring that any external changes (e.g., adding a new PDF via Windows Explorer) are immediately reflected without requiring user intervention.

## Requirements & Changes

### 1. UI Simplification (`DesktopSurface.jsx`)
- Remove the `[ + Add File ]` functionality and button.
- Retain the `[ + New Folder ]` action but repurpose it as `[ 🔗 Link Local Folder ]`.
- Trigger `window.api.showOpenDialog({ properties: ['openDirectory'] })` when clicking the link folder button.

### 2. State & Data Structure (`DesktopContext.jsx`)
- Modify the `folders` schema in `hub-data.json`.
- Stop storing individual file listings within the `folders` state.
- Each linked folder entry will possess: `{ id, name, absolutePath }`.

### 3. Native File System Read (`main.cjs` & `preload.cjs`)
- Implement a new IPC handler in `main.cjs`: `ipcMain.handle('read-directory', async (event, folderPath) => { ... })`.
- Utilize `fs.promises.readdir(folderPath, { withFileTypes: true })` inside the handler to fetch folder contents.
- Map the contents to array objects: `{ name, path, isDirectory, type }`, where `type` reflects the file extension or 'folder'.
- Expose the API to the renderer process via `preload.cjs` as `window.api.readDirectory(path)`.

### 4. Dynamic Rendering (`DesktopSurface.jsx`)
- Upon single-clicking a linked folder, set it as the `activeFolder`.
- Use a `useEffect` hook triggering `window.api.readDirectory(activeFolder.absolutePath)` to fetch real-time contents.
- Maintain the fetched contents in local state (e.g., `currentFolderContents`) to drive the files grid rendering.
- For items where `isDirectory === true`, render a distinct folder icon. Double-clicking a subfolder will invoke `window.api.openItem` to open it in standard OS Explorer rather than traversing it conceptually inside the Hub UI.

## Trade-offs and Considerations
- **Performance:** Reading directories sequentially upon click acts asynchronously and could be marginally slower than memory, but filesystem reads on local machines are negligible.
- **Robustness:** Handles synchronization naturally by delegating the source of truth to the operating system file structure.
