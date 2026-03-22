/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Settings, 
  User, 
  Calendar, 
  ListTodo, 
  Check, 
  Folder, 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  LayoutGrid, 
  Power, 
  Lock, 
  Network, 
  GraduationCap, 
  Mail, 
  Cloud, 
  Terminal 
} from 'lucide-react';
import { motion } from 'motion/react';

const TopNav = () => (
  <header className="fixed top-0 left-0 w-full h-16 px-12 flex justify-between items-center bg-black/15 backdrop-blur-3xl z-50">
    <div className="text-xl font-bold text-white tracking-tighter">Ethereal Desktop</div>
    <nav className="flex gap-8">
      <a className="text-white border-b-2 border-white/50 pb-1" href="#">Files</a>
      <a className="text-white/60 hover:text-white transition-colors" href="#">Widgets</a>
      <a className="text-white/60 hover:text-white transition-colors" href="#">Sync</a>
      <a className="text-white/60 hover:text-white transition-colors" href="#">History</a>
    </nav>
    <div className="flex items-center gap-6">
      <Settings className="w-5 h-5 text-white/80 cursor-pointer hover:bg-white/10 rounded-lg transition-all" />
      <User className="w-5 h-5 text-white/80 cursor-pointer hover:bg-white/10 rounded-lg transition-all" />
    </div>
  </header>
);

const ScheduleWidget = () => (
  <section className="glass rounded-3xl p-6 w-full">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-on-surface font-semibold text-xs opacity-80 uppercase tracking-widest">Daily Schedule</h2>
      <Calendar className="w-4 h-4 opacity-60" />
    </div>
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <span className="text-xs text-primary/60 pt-1">09:00</span>
        <div>
          <p className="text-sm font-medium text-on-surface">Curriculum Sync</p>
          <p className="text-xs text-on-surface-variant">Lab 402 • Academic Hub</p>
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <span className="text-xs text-primary/60 pt-1">11:30</span>
        <div className="border-l-2 border-primary/30 pl-3">
          <p className="text-sm font-medium text-on-surface">Homeroom Prep</p>
          <p className="text-xs text-on-surface-variant">Virtual Classroom</p>
        </div>
      </div>
    </div>
  </section>
);

const TodoWidget = () => (
  <section className="glass rounded-3xl p-6 w-full">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-on-surface font-semibold text-xs opacity-80 uppercase tracking-widest">To-Do Ledger</h2>
      <ListTodo className="w-4 h-4 opacity-60" />
    </div>
    <ul className="space-y-3">
      <li className="flex items-center gap-3 text-sm text-on-surface-variant group cursor-pointer">
        <div className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors"></div>
        <span>Finalize Edufine report</span>
      </li>
      <li className="flex items-center gap-3 text-sm text-on-surface group cursor-pointer">
        <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-black" />
        </div>
        <span className="line-through opacity-50">Class 3B attendance</span>
      </li>
      <li className="flex items-center gap-3 text-sm text-on-surface-variant group cursor-pointer">
        <div className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors"></div>
        <span>NEIS Portal Sync</span>
      </li>
    </ul>
  </section>
);

const DesktopIcon = ({ icon: Icon, label, color = "text-white/90", className = "" }: { icon: any, label: string, color?: string, className?: string }) => (
  <div className={`group cursor-pointer flex flex-col items-center gap-2 ${className}`}>
    <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
    <span className="desktop-icon-label">{label}</span>
  </div>
);

const Sidebar = () => (
  <aside className="w-72 flex flex-col gap-6">
    <div className="glass rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <img 
          src="https://picsum.photos/seed/admin/100/100" 
          alt="User Avatar" 
          className="w-10 h-10 rounded-full border border-white/20"
          referrerPolicy="no-referrer"
        />
        <div>
          <p className="text-white text-sm font-semibold">System Admin</p>
          <p className="text-white/40 text-[10px] uppercase tracking-tighter">Active Session</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white/40 text-[10px] font-bold uppercase mb-2">Workspace</h3>
        <div className="bg-white/15 text-white rounded-xl p-3 flex items-center gap-3">
          <LayoutGrid className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </div>
        <div className="text-white/40 hover:text-white/80 p-3 flex items-center gap-3 transition-all duration-200 hover:bg-white/5 rounded-xl cursor-pointer">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Schedule</span>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-white/5">
        <h3 className="text-on-surface font-semibold text-xs opacity-60 uppercase tracking-widest mb-4">Quick Clipboard</h3>
        <div className="glass-well rounded-xl p-4 space-y-3">
          <div className="text-[11px] text-white/70 bg-white/5 p-2 rounded border border-white/5 cursor-pointer hover:bg-white/10">
            0x7F2A...99C1
          </div>
          <div className="text-[11px] text-white/70 bg-white/5 p-2 rounded border border-white/5 cursor-pointer hover:bg-white/10">
            academic.neis.go.kr/portal/main
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-on-surface font-semibold text-xs opacity-60 uppercase tracking-widest mb-4">Scratchpad</h3>
        <textarea 
          className="w-full h-32 glass-well rounded-xl text-xs text-white p-3 resize-none focus:ring-1 focus:ring-white/20 focus:outline-none placeholder:text-white/20" 
          placeholder="Type quick notes here..."
        />
      </div>

      <div className="mt-auto flex justify-between pt-4 border-t border-white/5">
        <button className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors">
          <Power className="w-4 h-4" />
          <span className="text-xs">Power</span>
        </button>
        <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <Lock className="w-4 h-4" />
          <span className="text-xs">Lock</span>
        </button>
      </div>
    </div>
  </aside>
);

const Dock = () => (
  <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 px-6 rounded-full glass border-white/10 flex items-center justify-center gap-4 z-50 shadow-2xl">
    <div className="group relative">
      <div className="p-3 text-white/70 hover:bg-white/10 hover:scale-110 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-full active:scale-90">
        <Network className="w-8 h-8" />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">NEIS</span>
      </div>
    </div>
    <div className="group relative">
      <div className="bg-white/20 rounded-full p-3 scale-110 shadow-lg hover:-translate-y-2 transition-all duration-300 active:scale-90 active-dot cursor-pointer">
        <GraduationCap className="w-8 h-8 text-white" />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edufine</span>
      </div>
    </div>
    <div className="w-px h-8 bg-white/10 mx-2" />
    <div className="group relative">
      <div className="p-3 text-white/70 hover:bg-white/10 hover:scale-110 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-full active:scale-90">
        <Mail className="w-8 h-8" />
      </div>
    </div>
    <div className="group relative">
      <div className="p-3 text-white/70 hover:bg-white/10 hover:scale-110 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-full active:scale-90">
        <Cloud className="w-8 h-8" />
      </div>
    </div>
    <div className="group relative">
      <div className="p-3 text-white/70 hover:bg-white/10 hover:scale-110 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-full active:scale-90">
        <Terminal className="w-8 h-8" />
      </div>
    </div>
    <div className="group relative">
      <div className="p-3 text-white/70 hover:bg-white/10 hover:scale-110 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-full active:scale-90">
        <Settings className="w-8 h-8" />
      </div>
    </div>
  </nav>
);

export default function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden font-sans">
      {/* Background Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/ethereal/1920/1080?blur=4")' }}
      />
      <div className="absolute inset-0 bg-black/20 z-1" />

      <TopNav />

      <div className="relative z-10 w-full h-full pt-24 px-12 pb-32 flex justify-between">
        {/* Left Column: Widgets */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8 w-80"
        >
          <ScheduleWidget />
          <TodoWidget />
        </motion.div>

        {/* Center: Desktop Icons */}
        <div className="flex-grow relative mx-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <DesktopIcon icon={Folder} label="Classes" className="absolute top-10 left-10" />
            <DesktopIcon icon={FolderOpen} label="Homeroom" className="absolute top-48 left-32" />
            
            <DesktopIcon icon={FileText} label="Semester_P..." color="text-red-400" className="absolute top-20 right-20 scale-75" />
            <DesktopIcon icon={FileText} label="Lesson_Not..." color="text-blue-400" className="absolute bottom-40 left-20 scale-75" />
            <DesktopIcon icon={ImageIcon} label="Class_Photo..." color="text-amber-400" className="absolute top-80 right-40 scale-75" />
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Sidebar />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Dock />
      </motion.div>
    </main>
  );
}
