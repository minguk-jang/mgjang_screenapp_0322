# Phase 7: Universal Deletion UX, Clipboard State, and True Settings

## 1. Universal Inline Deletion (Hover State)
- **Concept**: Items do not need a management screen to be deleted. Removing items happens contextually "in-place".
- **Implementation**: We will add a `<button className="opacity-0 group-hover:opacity-100 ..."><Trash2 /></button>` to each mapped item in:
  - `DesktopSurface.jsx` (files and folders)
  - `BottomDock.jsx` (quick links)
  - `Schedule.jsx` (schedule items)
  - `ToDo.jsx` (todo items - will add `removeTodo` to context)

## 2. Interactive Quick Clipboard
- **State**: Add `clipboardItems` to `DesktopContext.jsx` with `addClipboardItem` and `removeClipboardItem` functions. It will sync with the `hub-data.json`.
- **Sidebar Integration**: The right panel (`Sidebar.jsx`) will map over `clipboardItems`. At the bottom, a new inline `<input>` will capture `onKeyDown` (Enter) to inject new copied items. Existing items will get the hover-to-delete Trash icon.

## 3. True Settings Modal & Profile
- **Global Context**: Expand `DesktopContext.jsx` to manage `userName` (defaulting to "System Admin").
- **Sidebar**: The `userName` state will directly reflect in the profile badge in `Sidebar.jsx`.
- **SettingsModal Rewrite**:
  - Migrate out all the "data entry" logic since we're using Direct Manipulation.
  - Tab 1 (Profile): Display a simple form input setting the `userName`.
  - Tab 2 (System): Provide a high-contrast, prominent "Quit Desktop Hub" button.

## 4. Electron Backend
- **main.cjs**: Listen for the `quit-app` event over IPC (`ipcMain.on('quit-app', () => app.quit())`).
- **preload.cjs**: Expose the capability effectively `quitApp: () => ipcRenderer.send('quit-app')`.

## Trade-offs and Considerations
1. **Safety with Immediate Deletion**: By immediately destroying items on a single click of the Trash icon, users might accidentally misclick during a rapid hover. We assume the nature of this hub allows easy recreation (Direct Manipulation makes adding fast).
2. **Settings Isolation**: Repurposing `SettingsModal.jsx` cleanly splits the "administration" tasks (Profile, App Quit) from the "content management" tasks (Files, Links, Todos), reinforcing the UX boundaries.
