# Phase 2: Interactivity and State Design

## 1. Data & State Management (Context API)
- **Location:** `src/context/DesktopContext.jsx`
- **Global State Structure:**
  - `activeFolder` (default: `null`): The currently open folder ID.
  - `todos`: List of tasks with `id`, `text`, and `completed` status.
  - `folders`: Array of desktop folders (e.g. 'Classes', 'Homeroom') and their nested files (e.g. PDFs, Word docs).
  - `quickLinks`: Array of quick link shortcuts for the Bottom Dock.
- **Actions:**
  - `toggleTodo(id)`: Toggles the completion status of a specific task.
  - `setActiveFolder(folderId)`: Opens a folder. If the same folder is clicked again, it closes (`null`).

## 2. Component Structure & Reactivity
- **App.jsx**:
  - Wraps the entire application in `<DesktopProvider>`.
  - Maintains the existing layout structure but delegates center and bottom sections to new components.
- **ToDo.jsx**:
  - Refactored to consume `todos` and `toggleTodo` from `DesktopContext` rather than maintaining internal state.
- **DesktopSurface.jsx (New)**:
  - Renders the central desktop area.
  - Subscribes to context to render the large `folders`.
  - Conditionally renders inner files/shortcuts when `activeFolder` is set.
- **BottomDock.jsx (New)**:
  - Renders the bottom quick links dock.
  - Uses `quickLinks` from context.
  - Includes `hover:scale-110` transition and dummy `onClick` handlers.

## 3. Aesthetics
- Maintain the dark glassmorphism aesthetic strictly across all new components (`backdrop-blur`, `bg-black/20`, modern hover states, Lucide icons).
