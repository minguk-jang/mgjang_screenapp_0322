# Native File & URL Execution Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement native file and URL execution using Electron's shell module via IPC bridge.

**Architecture:** We use IPC channels to communicate from React to Electron to open files securely using `shell.openPath` and `shell.openExternal`.

**Tech Stack:** React, Electron main/renderer processes, Tailwind CSS.

---

### Task 1: Update Main Process (main.js)
**Files:**
- Modify: `electron/main.js`

**Step 1/2:** Add shell import and open-item IPC handler.

### Task 2: Update Preload Script (preload.js)
**Files:**
- Modify: `electron/preload.js`

**Step 1:** Expose `openItem` in the `api` object.

### Task 3: Implement Quick Link execution
**Files:**
- Modify: `src/components/BottomDock.jsx`

**Step 1:** Add visual error feedback using `useState`. Update `onClick` to call `window.api.openItem`.

### Task 4: Implement File Execution
**Files:**
- Modify: `src/components/DesktopSurface.jsx`

**Step 1:** Add `selectedFile` state and `errorFile` state. Add `onClick` for highlighting and `onDoubleClick` for execution.
