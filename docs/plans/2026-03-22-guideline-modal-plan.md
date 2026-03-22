# Guideline Modal Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement a sleek, tabbed Guideline Modal using CSS and Lucide-React illustrations to explain the App's features, accessible via a top navigation icon.

**Architecture:** We will add global state (`isGuidelineOpen`) to `DesktopContext.jsx`, create a new `GuidelineModal.jsx` component that displays the content with minimalist visual illustrations, and mount the button/modal in `App.tsx`.

**Tech Stack:** React, Tailwind CSS, framer-motion, lucide-react

---

### Task 1: Add Guideline State to Context

**Files:**
- Modify: `src/context/DesktopContext.jsx`

**Step 1: Write context update**
Add `isGuidelineOpen` and `toggleGuideline` to the DesktopProvider context.

```javascript
// In src/context/DesktopContext.jsx

// 1) Add to useState declarations:
const [isGuidelineOpen, setIsGuidelineOpen] = useState(false);

// 2) Add toggle handler:
const toggleGuideline = () => setIsGuidelineOpen(prev => !prev);

// 3) Add to Provider value object:
// isGuidelineOpen, toggleGuideline,
```

**Step 2: Commit**
```bash
git add src/context/DesktopContext.jsx
git commit -m "feat(context): add guideline modal state"
```

### Task 2: Create GuidelineModal Component

**Files:**
- Create: `src/components/GuidelineModal.jsx`

**Step 1: Write component code**
Create the `GuidelineModal.jsx` file using `framer-motion` for animations and a tabbed interface.
*Note: Due to length, the full explicit code will be generated during the execution phase, containing 5 tabs with dummy/placeholder UI composed of lucide-react icons.*

It must include:
- A `motion.div` overlay and panel.
- A state for `activeTab` (1 to 5).
- Left Sidebar for tabs.
- Right Content area displaying the selected tab's explanation and a CSS/Icon illustration.

**Step 2: Commit**
```bash
git add src/components/GuidelineModal.jsx
git commit -m "feat(components): implement GuidelineModal component"
```

### Task 3: Integrate Guideline Modal into App

**Files:**
- Modify: `src/App.tsx` (Ensure using correct extension, `App.tsx`)

**Step 1: Write integration code**
```tsx
// In src/App.tsx

// 1) Import BookOpen and Component:
import { Settings, BookOpen, /* other icons */ } from 'lucide-react';
import GuidelineModal from './components/GuidelineModal';

// 2) In TopNav:
const { toggleSettings, toggleGuideline, schedule } = useDesktop();

// ...
// 3) Next to Settings icon:
<BookOpen onClick={toggleGuideline} className="w-5 h-5 text-white/60 cursor-pointer hover:text-white hover:-translate-y-1 hover:bg-white/10 p-1 box-content rounded-xl transition-all duration-300" />
<Settings onClick={toggleSettings} className="..." />

// 4) End of App JSX, next to SettingsModal:
<GuidelineModal />
```

**Step 2: Visually Test**
Run: the dev server is already running.
Expected: Clicking the BookOpen icon next to Settings opens the GuidelineModal. Clicking the backdrop closes it. The tabs correctly switch the content.

**Step 3: Commit**
```bash
git add src/App.tsx
git commit -m "feat(app): integrate GuidelineModal trigger into TopNav"
```
