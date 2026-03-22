# Screen Lock & Quit App Design
Date: 2026-03-22

## Overview
Implement the missing "Quit App" and "Screen Lock" functionality on the desktop UI's right Sidebar. "Screen Lock" in this context refers to a Read-Only mode across the application, preventing item creation or deletion when active.

## State Management
1. **Context Updates**: Update `DesktopContext.jsx` to introduce a new top-level boolean state `isLocked`.
   - `isLocked` initialized to `false`.
   - Create `toggleLock` to easily swap between states.
2. **Data Operations Safety**: Add early returns (`if (isLocked) return;`) to all mutation functions in `DesktopContext.jsx`:
   - `addTodo`, `removeTodo`
   - `addFolder`, `removeFolder`
   - `addQuickLink`, `removeQuickLink`
   - `addClipboardItem`, `removeClipboardItem`
   - `addScheduleItem`, `removeScheduleItem`

## UI Component Updates
The following components will consume `isLocked` to hide mutative UI elements:
1. **Sidebar.jsx**:
   - Tie "앱 종료" to `window.api.quitApp()`.
   - Tie "화면 잠금" to `toggleLock()`. Switch icon/text conditionally (Lock -> Unlock).
   - Hide the new clipboard item input and the `X` deletion buttons when `isLocked`.
2. **ToDo.jsx**: Hide the input field and delete buttons when `isLocked`.
3. **Schedule.jsx**: Hide add/delete UI.
4. **BottomDock / DesktopSurface** (assuming they exist): Hide `+` add buttons and deletion context items.

## Implementation Steps
1. Add state and data operation guards to `DesktopContext.jsx`.
2. Update `Sidebar.jsx` (Hook up `quitApp` and `toggleLock`, hide clipboard edits).
3. Update `ToDo.jsx` & `Schedule.jsx` iteratively to respect `isLocked`.
4. Optionally update `BottomDock` and `DesktopSurface` to respect `isLocked`.
