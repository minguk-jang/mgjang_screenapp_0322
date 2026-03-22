# Calendar Todo Modal Design (2026-03-22)

## Overview
This design covers adding a feature to the Mini Calendar where clicking a specific date opens a modal to view and add to-dos for that day. Future to-dos automatically become "today's to-dos" when their date arrives. Uncompleted past to-dos stay visible in today's to-do list.

## Architecture & Data Flow

### 1. Data Structure (`todos`)
- The existing `todos` state in `DesktopContext` will be updated so that each todo item includes a `date` property (e.g., `"2026-03-24"`).
- Default to-dos for "today" when added from the main screen will automatically get today's date string.
- New to-dos added in the calendar modal will get the clicked date string.

### 2. Display Logic
- **Main Todo Component (`Todo.jsx`)**: Filters the `todos` array and renders only items where `item.date <= today`.
  - This ensures past uncompleted to-dos naturally roll over without data manipulation.
- **Calendar Todo Modal (`CalendarTodoModal.jsx`)**: Filters the `todos` array and renders only items where `item.date === clickedDate`.

### 3. Components
- **`MiniCalendar.jsx`**:
  - Add `onClick` to date cells to dispatch an action opening the new modal with the selected date string.
- **`DesktopContext.jsx`**:
  - State: `isCalendarTodoOpen` (boolean), `selectedCalendarDate` (string, e.g., "YYYY-MM-DD").
  - Actions: `openCalendarTodo(date)`, `closeCalendarTodo()`, updated `addTodo(text, date)` to accept an optional date parameter.
- **`CalendarTodoModal.jsx`**:
  - A new component styled similarly to `SettingsModal` (glassmorphism).
  - Shows the date in the header.
  - Contains a list of todos matching `selectedCalendarDate` and an input identical to `Todo.jsx` to add new ones.

## Error Handling & Edge Cases
- **Midnight Rollover**: The `MiniCalendar` and top nav components already have interval timers checking for date changes. When the date changes, the filtering logic in `Todo.jsx` naturally brings in the previous future to-dos whose date is now `<= today`.
- **Deleting Todos**: The normal `removeTodo(id)` function handles deletion, impacting the master `todos` array dynamically regardless of where it was triggered.
- **Empty Todos/Missing Date**: Old to-dos without a `date` field can be safely defaulted to today's date during rendering or migration using a simple fallback if they lack the `date` attribute (e.g., `item.date || todayDateString`).
