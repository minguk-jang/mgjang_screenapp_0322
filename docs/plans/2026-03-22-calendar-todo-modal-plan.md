# Calendar Todo Modal Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement a feature where users can click a date on the mini calendar to add future to-dos, which automatically roll over to today's list when the date arrives.

**Architecture:** Add `date` to todo items, add a filtering logic in `Todo.jsx` to only show items up to today, create a new `CalendarTodoModal.jsx` to manage to-dos for a specific future date, and update `DesktopContext` to handle the modal state.

**Tech Stack:** React, TailwindCSS, Lucide React

---

### Task 1: Update DesktopContext.jsx 

**Files:**
- Modify: `src/context/DesktopContext.jsx`

**Step 1: Write minimal implementation**
- Add `isCalendarTodoOpen` and `selectedCalendarDate` state variables.
- Add `toggleCalendarTodo(date)` function to open/close the modal and set the date.
- Update `addTodo(text, customDate)` to accept an optional `customDate` parameter. If not provided, it defaults to today's date (`new Date().toLocaleDateString('en-CA')` or similar ISO format YYYY-MM-DD).
- Ensure existing loaded todos get a default date if missing.

**Step 2: Commit**
```bash
git add src/context/DesktopContext.jsx
git commit -m "feat: add calendar modal state and custom date to todos"
```

### Task 2: Modify Todo.jsx Filtering Logic

**Files:**
- Modify: `src/components/Todo.jsx`

**Step 1: Write minimal implementation**
- Get today's date string: `const todayStr = new Date().toLocaleDateString('en-CA');`
- Filter `todos` before rendering: `const displayTodos = todos.filter(t => !t.date || t.date <= todayStr);`
- Render `displayTodos` instead of `todos`.
- Update the input to pass no date (so it defaults to today).

**Step 2: Commit**
```bash
git add src/components/Todo.jsx
git commit -m "feat: filter todos to show only today or past dates"
```

### Task 3: Create CalendarTodoModal.jsx Component

**Files:**
- Create: `src/components/CalendarTodoModal.jsx`

**Step 1: Write minimal implementation**
- Create a modal similar in style to `SettingsModal`.
- Consume `isCalendarTodoOpen`, `toggleCalendarTodo`, `selectedCalendarDate`, `todos`, `toggleTodo`, `addTodo`, `removeTodo`, `isLocked` from `useDesktop`.
- Filter `todos` to only show `item.date === selectedCalendarDate`.
- Provide an input Field to add new todos, calling `addTodo(text, selectedCalendarDate)`.
- Add close button `X` calling `toggleCalendarTodo()`.

**Step 2: Commit**
```bash
git add src/components/CalendarTodoModal.jsx
git commit -m "feat: create calendar todo modal component"
```

### Task 4: Modify MiniCalendar.jsx

**Files:**
- Modify: `src/components/MiniCalendar.jsx`

**Step 1: Write minimal implementation**
- Consume `toggleCalendarTodo` from `useDesktop()`.
- On clicking a valid `day` in the calendar grid, construct the date string `YYYY-MM-DD` (remember month is 0-indexed).
- Call `toggleCalendarTodo(dateString)`.
- Make the day cells `cursor-pointer`.

**Step 2: Commit**
```bash
git add src/components/MiniCalendar.jsx
git commit -m "feat: make calendar dates clickable to open todo modal"
```

### Task 5: Include CalendarTodoModal in App

**Files:**
- Modify: `src/App.tsx` (or `DesktopSurface.jsx` wherever modals are rendered)

**Step 1: Write minimal implementation**
- Import `CalendarTodoModal`.
- Place it at the root of the app where `SettingsModal` is (likely `App.tsx` or `DesktopSurface.jsx`).

**Step 2: Commit**
```bash
git add src/App.tsx
git commit -m "feat: render CalendarTodoModal in main app"
```
