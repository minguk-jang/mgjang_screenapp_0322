# Native File & URL Execution Design

## Overview
This design covers the implementation of Phase 4: Native File & URL Execution for the Desktop Hub application. The goal is to allow users to open real local files (PDFs, Word documents, etc.) and web URLs using their native OS default applications, bridging the gap between a web interface and a true Desktop Hub experience.

## Architecture & Security
For security reasons, React cannot natively open local files. We will use Electron's `shell` module via our established IPC bridge to securely handle these interactions.

We will create a specific IPC channel `open-item` that handles both local file paths and web URLs.

## Decisions

### 1. File Interaction (OS-Style Paradigm)
- **DesktopSurface:** To maintain the "Native OS" feel, files and folders on the desktop surface will require a **single-click to select** (highlight) and a **double-click to execute/open**.
- **Visual Feedback:** Selected items will have a subtle background highlight (e.g., `bg-white/20`) to clearly indicate selection state without breaking the glassmorphism aesthetic.
- **BottomDock:** Quick Links in the bottom dock will remain **single-click** to match the behavior of standard docks (like the macOS Dock).

### 2. Error Handling (Elegant Validation)
- **Backend (main.js):** The IPC handler will catch any errors (e.g., file not found). Instead of crashing or showing a jarred native OS popup, it will gracefully return `false`.
- **Frontend (React):** If `window.api.openItem` returns `false`, the UI will provide a brief, elegant visual feedback mechanism. The icon or text might temporarily turn red or shake to indicate the path is invalid, preventing silent failures and keeping the user informed without breaking immersion.

## Implementation Scope
1. **electron/main.js:** Add `shell` import and create the `ipcMain.handle('open-item')` function.
2. **electron/preload.js:** Expose `openItem` API to the renderer process.
3. **src/components/DesktopSurface.jsx:** Implement `selectedFile` state, apply highlight styles, and add `onDoubleClick` execution logic with elegant error feedback.
4. **src/components/BottomDock.jsx:** Update the `onClick` handler for Quick Links to use `api.openItem` with error handling feedback.
