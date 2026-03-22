# Live Sync Folder Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Refactor the folder/file management to use a Live Sync approach where Desktop Hub acts as a mirror of native OS folders.

**Architecture:** Remove manual file addition. The user will link an existing OS folder. The app stores the folder's absolute path and retrieves its contents dynamically via the Electron main process each time the folder is opened. Subfolders will be displayed but will open in the native OS Explorer upon double-click.

**Tech Stack:** React, Electron (IPC), Node `fs.promises`.

---

### Task 1: Implement Dynamic Directory Reading (Main Process)

**Files:**
- Modify: `electron/main.cjs`
- Modify: `electron/preload.cjs`

**Step 1: Add IPC handler to `main.cjs`**

Update `electron/main.cjs` to include a new `read-directory` handler:

```javascript
  ipcMain.handle('read-directory', async (event, folderPath) => {
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      return entries.map(entry => {
        const isDirectory = entry.isDirectory();
        let type = 'other';
        if (isDirectory) {
          type = 'folder';
        } else {
          const ext = entry.name.split('.').pop().toLowerCase();
          if (ext === 'pdf') type = 'pdf';
          else if (['doc', 'docx'].includes(ext)) type = 'word';
          else if (['xls', 'xlsx', 'csv'].includes(ext)) type = 'excel';
          else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) type = 'image';
        }
        return {
          id: entry.name, // Use name as ID for now
          name: entry.name,
          path: join(folderPath, entry.name),
          isDirectory,
          type
        };
      });
    } catch (error) {
      console.error('Failed to read directory:', error);
      return [];
    }
  });

// Also make sure to import `fs` logic if not fully imported for readdir: 
// It's already `const fs = require('fs/promises');` so `fs.readdir` works.
```

**Step 2: Expose API in `preload.cjs`**

Update `electron/preload.cjs` to expose `readDirectory`:

```javascript
  readDirectory: (folderPath) => ipcRenderer.invoke('read-directory', folderPath),
```

**Step 3: Commit**

```bash
git add electron/main.cjs electron/preload.cjs
git commit -m "feat: add readDirectory IPC handler for Live Sync"
```

---

### Task 2: Update State Management (Desktop Context)

**Files:**
- Modify: `src/context/DesktopContext.jsx`

**Step 1: Update adding logic**

Refactor `DesktopContext.jsx` to remove `addFileToFolder` and `removeFileFromFolder`. Update `addFolder` to accept an object with `name` and `absolutePath`, and storing an empty files array isn't strictly necessary anymore but we can keep the structure simple: `{ id, name, absolutePath }`.

```javascript
  const addFolder = (folderData) => {
    setFolders([...folders, { 
      id: crypto.randomUUID(), 
      name: folderData.name,
      absolutePath: folderData.absolutePath
    }]);
  };
```

Remove `addFileToFolder` and `removeFileFromFolder` entirely. Check exports in the `useDesktop` context provider and remove them.

**Step 2: Commit**

```bash
git add src/context/DesktopContext.jsx
git commit -m "refactor: update DesktopContext for Live Sync and remove manual file state"
```

---

### Task 3: Refactor UI for Live Sync (Desktop Surface)

**Files:**
- Modify: `src/components/DesktopSurface.jsx`

**Step 1: Simplify action buttons**

Remove `showFolderPrompt` and `handleAddFile` logic. Update bottom-right actions:

```javascript
  const handleLinkFolder = async () => {
    if (window.api && window.api.showOpenDialog) {
      const selectedPath = await window.api.showOpenDialog({ properties: ['openDirectory'] });
      if (selectedPath) {
        // Extract folder name from path
        const folderName = selectedPath.split('\\').pop().split('/').pop();
        addFolder({ name: folderName, absolutePath: selectedPath });
      }
    }
  };
```
Remove the text input prompt. Keep only one button labeled "Link Local Folder" triggering `handleLinkFolder`.

**Step 2: Implement dynamic rendering of folder contents**

Add local state to track dynamic contents:

```javascript
  const [currentFolderContents, setCurrentFolderContents] = useState([]);

  useEffect(() => {
    async function loadContents() {
      if (activeFolderData && activeFolderData.absolutePath && window.api && window.api.readDirectory) {
        const contents = await window.api.readDirectory(activeFolderData.absolutePath);
        setCurrentFolderContents(contents);
      } else {
        setCurrentFolderContents([]);
      }
    }
    loadContents();
  }, [activeFolderData]);
```

Update the grid mapping (`activeFolderData.files.map(...)`) to use `currentFolderContents.map(...)`.
For the icons, map `type === 'folder'` to a `Folder` icon. Remove the `removeFileFromFolder` button on files since these are native files and deleting them should happen via OS Explorer for now.

```javascript
      {/* File or Sub-folder icon mapping */}
      {currentFolderContents.map(file => (
        <div key={file.path} ... >
           {/* If file.isDirectory render a Folder icon, else render getFileIcon(file.type) */}
        </div>
      ))}
```

*(You will complete the exact react code execution during the execute phase).*

**Step 3: Commit**

```bash
git add src/components/DesktopSurface.jsx
git commit -m "feat: implement live sync folder rendering and UI in DesktopSurface"
```
