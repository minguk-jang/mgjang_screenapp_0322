# Weekly Schedule & UI Enhancement Design

## Overview
This design covers the implementation of three new features to improve the daily usability of the Teacher's Desktop Hub:
1. Dynamic Top Navigation showing date/time and the current period.
2. A Mini Calendar widget in the bottom-right corner for quick date reference.
3. An automated Weekly Schedule widget populated from a grid-based Settings interface.

## 1. Top Navigation (`TopNav` in `App.tsx`)
- **Current State**: Displays a static "Workspace" text.
- **New State**:
  - Replaces "Workspace" with a real-time Date & Time display: `YYYY. MM. DD. (Weekday) HH:mm`. Update interval: 60s.
  - Adds a dynamic `Current Class` badge next to the date.
  - Logic: Compares current time to the weekly schedule to determine if the user is currently in a class period. Example: `[현재: 1교시 체육]`.

## 2. Mini Calendar (`MiniCalendar.jsx`)
- **Location**: Bottom-right of the desktop (absolute positioning).
- **Design**: Glassmorphism aesthetic. A non-interactive monthly calendar view.
- **Functionality**:
  - Highlights today's date.
  - Read-only quick reference.

## 3. Weekly Schedule Settings (`SettingsModal.jsx`)
- **Current State**: User adds daily tasks manually via the `Schedule.jsx` widget.
- **New State**:
  - Add a new "시간표 (Schedule)" tab in `SettingsModal`.
  - Provide a 2D editable Grid (Rows: Periods 1~6+, Columns: Mon~Fri).
  - Users can click on a grid cell to input Subject and Location (e.g., "체육 (체육관)").
  - Configuration of row times (e.g., 1교시: 09:00~09:40) optionally editable or fixed defaults.
  - Save to `DesktopContext` as `weeklySchedule`. Data will persist via the application's JSON store.

## 4. Automated Schedule Widget (`Schedule.jsx`)
- **New State**: 
  - Removes manual "Add/Delete" functionality.
  - Automatically loads today's schedule based on the day of the week from the `weeklySchedule` state.
  - Renders the list of periods for the current day dynamically. Shows "예정된 주간 일정이 없습니다." on weekends.

## Data Structure
```json
{
  "weeklySchedule": {
    "periods": ["09:00 - 09:40", "09:50 - 10:30", "10:40 - 11:20", "11:30 - 12:10", "13:00 - 13:40", "13:50 - 14:30"],
    "grid": {
      "mon": [{ "subject": "국어", "room": "교실" }, ...],
      "tue": [...],
      "wed": [...],
      "thu": [...],
      "fri": [...]
    }
  }
}
```
