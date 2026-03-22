# Screen Lock and Quit App Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement an app-wide read-only mode (Screen Lock) and connect the "Quit App" button to the existing electron IPC handler.

**Architecture:** Introduce `isLocked` and `toggleLock` to `DesktopContext.jsx`. Guard all context mutation methods with `if (isLocked) return;`. Update `Sidebar.jsx`, `ToDo.jsx`, and `Schedule.jsx` to conditionally render mutation UI (add/delete buttons, input fields) based on the `isLocked` state.

**Tech Stack:** React, Electron

---

### Task 1: DesktopContext State Updates

**Files:**
- Modify: `src/context/DesktopContext.jsx`

**Step 1: Add isLocked and toggleLock state**
Add `const [isLocked, setIsLocked] = useState(false);` and `const toggleLock = () => setIsLocked(prev => !prev);`.

**Step 2: Guard Mutation Operations**
Add `if (isLocked) return;` at the top of:
- `toggleTodo`, `addTodo`, `removeTodo`
- `addClipboardItem`, `removeClipboardItem`
- `toggleFolder`, `addFolder`, `removeFolder`
- `addQuickLink`, `removeQuickLink`
- `addScheduleItem`, `removeScheduleItem`, `updateSchedule`

**Step 3: Expose new state/functions**
Add `isLocked` and `toggleLock` to the `DesktopContext.Provider` value object.

**Step 4: Commit**
```bash
git add src/context/DesktopContext.jsx
git commit -m "feat: add isLocked to DesktopContext with operation guards"
```

---

### Task 2: Sidebar Updates

**Files:**
- Modify: `src/components/Sidebar.jsx`

**Step 1: Get states from context**
Extract `isLocked` and `toggleLock` from `useDesktop()`.

**Step 2: Connect Quit App Button**
Change the "앱 종료" button's `onClick` to `() => window.api.quitApp()`.

**Step 3: Connect and style Screen Lock Button**
Change the "화면 잠금" button's `onClick` to `toggleLock`.
Conditionally render text "화면 잠금" / "잠금 해제" based on `isLocked`.

**Step 4: Conditionally render Clipboard inputs and remove buttons**
Hide the `<div className="relative">...</div>` (clipboard input area) when `isLocked` is true.
Hide the `<button>` with `<X />` inside the clipboard list when `isLocked` is true.

**Step 5: Commit**
```bash
git add src/components/Sidebar.jsx
git commit -m "feat: wire up Quit App and Screen Lock in Sidebar"
```

---

### Task 3: ToDo Component Updates

**Files:**
- Modify: `src/components/ToDo.jsx` (I will view this file during execution to find exact lines)

**Step 1: Get isLocked from context**
Extract `isLocked` from `useDesktop()`.

**Step 2: Hide Delete buttons**
Render the ToDo item deletion buttons only if `!isLocked`.

**Step 3: Hide or Disable Add Inputs**
Render the text input and Add (+) button area at the bottom only if `!isLocked`.

**Step 4: Commit**
```bash
git add src/components/ToDo.jsx
git commit -m "feat: enforce read-only lock in ToDo component"
```

---

### Task 4: Schedule Component Updates

**Files:**
- Modify: `src/components/Schedule.jsx` (I will view this file during execution to find exact lines)

**Step 1: Get isLocked from context**
Extract `isLocked` from `useDesktop()`.

**Step 2: Hide Delete buttons**
Render schedule item deletion buttons only if `!isLocked`.

**Step 3: Hide or Disable Add Inputs**
Render the schedule add inputs (title/time) and Add button only if `!isLocked`.

**Step 4: Commit**
```bash
git add src/components/Schedule.jsx
git commit -m "feat: enforce read-only lock in Schedule component"
```
