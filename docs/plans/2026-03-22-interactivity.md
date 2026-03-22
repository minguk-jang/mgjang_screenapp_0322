# Phase 2: Interactivity and State Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement the React Context API to provide global state (todos, active folders, quick links) and bind interactivity to the Desktop Hub.

**Architecture:** Create a central `DesktopContext` providing mock data to all widgets. Isolate the central area to `DesktopSurface` and the bottom dock to `BottomDock`, both consuming the context.

**Tech Stack:** React (Context API, Hooks), Tailwind CSS (for conditionals and hover states), Lucide React (icons).

---

### Task 1: Create DesktopContext

**Files:**
- Create: `src/context/DesktopContext.jsx`

**Step 1: Write context provider with mock data**

```jsx
import React, { createContext, useState, useContext } from 'react';

const DesktopContext = createContext();

export function DesktopProvider({ children }) {
  const [activeFolder, setActiveFolder] = useState(null);
  
  const [todos, setTodos] = useState([
    { id: 1, text: 'Submit weekly attendance', completed: true },
    { id: 2, text: 'Grade math worksheets', completed: false },
    { id: 3, text: 'Email parents about field trip', completed: false },
    { id: 4, text: 'Prepare tomorrow\\'s slides', completed: false },
  ]);

  const [folders] = useState([
    {
      id: 'f1',
      name: 'Classes',
      files: [
        { id: 'file1', name: 'Math Syllabus.pdf', type: 'pdf' },
        { id: 'file2', name: 'Student Roster.xlsx', type: 'excel' }
      ]
    },
    {
      id: 'f2',
      name: 'Homeroom',
      files: [
        { id: 'file3', name: 'Morning Routine.docx', type: 'word' },
        { id: 'file4', name: 'Attendance Sheet.pdf', type: 'pdf' }
      ]
    }
  ]);

  const [quickLinks] = useState([
    { id: 'q1', name: 'NEIS', icon: 'Globe' },
    { id: 'q2', name: 'EBS', icon: 'MonitorPlay' },
    { id: 'q3', name: 'Messenger', icon: 'MessageCircle' },
  ]);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleFolder = (id) => {
    setActiveFolder(prev => prev === id ? null : id);
  };

  return (
    <DesktopContext.Provider value={{ activeFolder, toggleFolder, todos, toggleTodo, folders, quickLinks }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  return useContext(DesktopContext);
}
```

### Task 2: Create DesktopSurface Component

**Files:**
- Create: `src/components/DesktopSurface.jsx`

**Step 1: Write minimal implementation**

```jsx
import React from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Folder, FileText, FileSpreadsheet, File } from 'lucide-react';

export default function DesktopSurface() {
  const { folders, activeFolder, toggleFolder } = useDesktop();

  const activeFolderData = folders.find(f => f.id === activeFolder);

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-400" />;
      case 'excel': return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
      case 'word': return <FileText className="w-8 h-8 text-blue-400" />;
      default: return <File className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12 p-8">
      {/* Main Folders */}
      <div className="flex gap-16">
        {folders.map(folder => (
          <button 
            key={folder.id}
            onClick={() => toggleFolder(folder.id)}
            className={`flex flex-col items-center gap-4 transition-all duration-300 hover:scale-110 ${
              activeFolder === folder.id ? 'opacity-100 scale-110' : activeFolder ? 'opacity-40' : 'opacity-90 hover:opacity-100'
            }`}
          >
            <div className="bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl group-hover:bg-white/10 group-hover:border-white/20">
              <Folder className="w-16 h-16 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]" />
            </div>
            <span className="text-white font-medium tracking-wide drop-shadow-md">{folder.name}</span>
          </button>
        ))}
      </div>

      {/* Conditional Files View */}
      <div className={`h-64 transition-all duration-500 ease-out ${activeFolder ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        {activeFolderData && (
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex gap-8">
            {activeFolderData.files.map(file => (
              <button key={file.id} className="flex flex-col items-center gap-3 w-24 group hover:scale-110 transition-transform">
                <div className="bg-white/5 p-4 rounded-2xl border border-transparent group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                  {getFileIcon(file.type)}
                </div>
                <span className="text-xs text-center text-slate-300 group-hover:text-white transition-colors">{file.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Task 3: Create BottomDock Component

**Files:**
- Create: `src/components/BottomDock.jsx`

**Step 1: Write minimal implementation**

```jsx
import React from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Globe, MonitorPlay, MessageCircle } from 'lucide-react';

const iconMap = {
  Globe: Globe,
  MonitorPlay: MonitorPlay,
  MessageCircle: MessageCircle
};

export default function BottomDock() {
  const { quickLinks } = useDesktop();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex gap-4">
        {quickLinks.map(link => {
          const IconComponent = iconMap[link.icon] || Globe;
          return (
            <button 
              key={link.id}
              onClick={() => console.log(`Opening ${link.name}`)}
              className="group relative p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-125 hover:-translate-y-2 z-10"
            >
              <IconComponent className="w-6 h-6 text-slate-300 group-hover:text-white drop-shadow-lg" />
              {/* Tooltip */}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl whitespace-nowrap">
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

### Task 4: Refactor ToDo.jsx

**Files:**
- Modify: `src/components/ToDo.jsx`

**Step 1: Update ToDo component to consume context**

```jsx
import React from 'react';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { useDesktop } from '../context/DesktopContext';

export default function ToDo() {
  const { todos, toggleTodo } = useDesktop();

  return (
    <div className="w-full bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <ListTodo className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white tracking-wide">To-Do Ledger</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {todos.map(task => (
          <button 
            key={task.id}
            onClick={() => toggleTodo(task.id)}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-left w-full group border ${
              task.completed 
                ? 'bg-transparent border-transparent' 
                : 'hover:bg-white/5 border-transparent hover:border-white/10 hover:shadow-lg'
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 group-hover:text-emerald-300 transition-colors flex-shrink-0" />
            )}
            
            <span className={`flex-1 text-sm font-medium transition-all ${
              task.completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}>
              {task.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Task 5: Refactor App.jsx

**Files:**
- Modify: `src/App.jsx`

**Step 1: Wrap App with Provider and render new components**

```jsx
import Schedule from './components/Schedule';
import ToDo from './components/ToDo';
import DesktopSurface from './components/DesktopSurface';
import BottomDock from './components/BottomDock';
import { DesktopProvider } from './context/DesktopContext';

export default function App() {
  return (
    <DesktopProvider>
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white overflow-hidden pointer-events-auto flex relative">
        {/* Left-Aligned Permanent Widgets Column */}
        <div className="flex flex-col h-full w-96 pl-8 py-8 shrink-0 overflow-y-auto no-scrollbar mask-image-fade relative z-10">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <Schedule />
            <ToDo />
          </div>
        </div>
        
        {/* Center/Desktop Area */}
        <DesktopSurface />

        {/* Bottom Dock */}
        <BottomDock />
      </div>
    </DesktopProvider>
  );
}
```
