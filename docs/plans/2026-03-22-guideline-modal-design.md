# Guideline Modal Design

## Overview
A new modal component (`GuidelineModal.jsx`) that explains the core features of the "Ethereal Desktop" (쭈의 일터) application. It will use a tabbed interface with CSS and Lucide-React icons to provide visually appealing, lightweight illustrations for each feature.

## Architecture & State
- **Trigger**: A new `BookOpen` or `HelpCircle` icon next to the Settings icon in the `<TopNav>` within `App.tsx`.
- **State Control**: `isGuidelineOpen` and `toggleGuideline` state added to `DesktopContext.jsx` for global visibility control.

## Components
**1. App.tsx (TopNav)**
- Import `BookOpen` from `lucide-react`.
- Add `BookOpen` icon next to `Settings`.
- Add `<GuidelineModal />` inside the main layout.

**2. DesktopContext.jsx**
- Add `isGuidelineOpen` and `toggleGuideline` state variables and context values.

**3. GuidelineModal.jsx**
- **Overlay**: Full screen black/40 backdrop.
- **Modal Container**: Glassmorphism panel (similar to `SettingsModal`).
- **Layout**: Left column for tab navigation (Category List), Right column for content display.
- **Illustration Style**: Combinations of `lucide-react` icons inside styled CSS boxes with border-radius and subtle backgrounds to simulate actual app components abstractly.

## Content Tabs
1. **화면 제어 (Screen & System)**
   - Illustration: Lock icon toggling.
   - Docs: Screen lock, app zoom, auto-save.
2. **시간표 (Schedule)**
   - Illustration: Grid with days and subjects.
   - Docs: Weekly setup, daily display.
3. **할 일 & 캘린더 (To-Do)**
   - Illustration: Checkbox list and a mini calendar pop-out.
   - Docs: Daily tasks, future task booking via bottom-right calendar.
4. **폴더 및 파일 (Files & Folders)**
   - Illustration: Folder icon with file list underneath opening external apps.
   - Docs: Live sync, native file execution.
5. **유틸리티 (Utilities)**
   - Illustration: Dock '+' icon and a clipboard memo.
   - Docs: Bottom dock quick links, quick clipboard.

## Data Flow & Animation
- Uses `framer-motion` for smooth modal entering and exiting animations (`opacity`, `scale`).
- State is boolean, meaning no complex data fetching or saving is required for the guideline itself.
