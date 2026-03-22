# Weekly Schedule & UI Enhancement Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement a dynamic top navigation, a mini calendar widget, and a weekly schedule system editable via settings.

**Architecture:** We will add `weeklySchedule` to `DesktopContext`. We'll build a `MiniCalendar` component. We'll update the `TopNav` component in `App.tsx` to display real-time date and current schedule block. We'll update `SettingsModal.jsx` with a new 'Schedule' tab containing an editable grid. Finally, we'll refactor `Schedule.jsx` to pull from the new `weeklySchedule` state dynamically based on the current day.

**Tech Stack:** React, TailwindCSS, Lucide-React, Native JS Date.

---

### Task 1: Update DesktopContext for Weekly Schedule

**Files:**
- Modify: `src/context/DesktopContext.jsx`

**Step 1: Implement Context Changes**

Add `weeklySchedule` to the context state, load/save logic, and exposed values.

```javascript
// In DesktopContext.jsx
const defaultSchedule = {
  periods: [
    { name: "1교시", time: "09:00~09:40" },
    { name: "2교시", time: "09:50~10:30" },
    { name: "3교시", time: "10:40~11:20" },
    { name: "4교시", time: "11:30~12:10" },
    { name: "5교시", time: "13:00~13:40" },
    { name: "6교시", time: "13:50~14:30" }
  ],
  grid: {
    1: [], // Monday 0-indexed day is 1
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: []  // Friday
  }
};
// Add state
const [weeklySchedule, setWeeklySchedule] = useState(defaultSchedule);

// Update loadData
setWeeklySchedule(data.weeklySchedule || defaultSchedule);

// Update saveData
await window.api.saveData({ ..., weeklySchedule });
```

**Step 2: Commit**
```bash
git add src/context/DesktopContext.jsx
git commit -m "feat: add weeklySchedule state to DesktopContext"
```

### Task 2: Implement MiniCalendar Component

**Files:**
- Create: `src/components/MiniCalendar.jsx`
- Modify: `src/App.tsx`

**Step 1: Write MiniCalendar component**
Create a simple read-only calendar for the current month highlighting today's date using native JS Date objects.

**Step 2: Integrate into App.tsx**
Render `<MiniCalendar />` in the bottom-right corner.

**Step 3: Commit**
```bash
git add src/components/MiniCalendar.jsx src/App.tsx
git commit -m "feat: implement mini calendar in bottom right"
```

### Task 3: Top Navigation Date & Schedule Banner

**Files:**
- Modify: `src/App.tsx` (TopNav component)

**Step 1: Implement Time and Schedule Logic**
Update `TopNav` to use `setInterval` every minute to update current `Date`.
Calculate current period based on `weeklySchedule` and today's day/time, and render it.

**Step 2: Commit**
```bash
git add src/App.tsx
git commit -m "feat: update top nav with dynamic date and current schedule"
```

### Task 4: Weekly Schedule Settings View

**Files:**
- Modify: `src/components/SettingsModal.jsx`

**Step 1: Implement Schedule Grid UI**
Add a third tab in `SettingsModal` called "시간표".
Render a grid table. Row = period, Col = Day (Mon-Fri).
Allow inline editing of subject/room. Save updates to `setWeeklySchedule`.

**Step 2: Commit**
```bash
git add src/components/SettingsModal.jsx
git commit -m "feat: add editable weekly schedule grid to settings"
```

### Task 5: Refactor Schedule Widget

**Files:**
- Modify: `src/components/Schedule.jsx`

**Step 1: Implement automatic daily view**
Remove the manual + form from `Schedule.jsx`.
Read `weeklySchedule` and today's day (0-6).
Render the schedule for the current day. Show empty state for weekends.

**Step 2: Commit**
```bash
git add src/components/Schedule.jsx
git commit -m "feat: automate schedule widget based on weekly schedule"
```
