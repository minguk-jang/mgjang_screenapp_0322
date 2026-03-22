/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Calendar, 
  LayoutGrid, 
  Power, 
  Lock 
} from 'lucide-react';
import { motion } from 'motion/react';
import ToDo from './components/ToDo';
import DesktopSurface from './components/DesktopSurface';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import Schedule from './components/Schedule';
import MiniCalendar from './components/MiniCalendar';
import { useDesktop } from './context/DesktopContext';
import wallpaperImg from './assets/wallpaper.jpg';

const TopNav = () => {
  const { toggleSettings, schedule } = useDesktop();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDayStr = weekdays[now.getDay()];
  const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}. (${currentDayStr}) ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let currentBlock = null;
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  if (schedule && schedule.length > 0) {
    for (const item of schedule) {
      if (!item || !item.time) continue;
      const times = item.time.split('~');
      if (times.length === 2) {
        if (currentTimeStr >= times[0].trim() && currentTimeStr <= times[1].trim()) {
           currentBlock = `현재: ${item.period} ${item.subject}`;
           break;
        }
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full h-16 px-12 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/5 z-40">
      <div className="text-xl font-bold text-white tracking-tighter drop-shadow-md">쭈의 일터</div>
      <nav className="flex items-center gap-4">
        <span className="text-white/90 text-sm font-medium tracking-wider bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
          {dateStr}
        </span>
        {currentBlock && (
          <span className="text-sky-100 text-[13px] font-bold tracking-wide bg-sky-500/40 px-4 py-1.5 rounded-full border border-sky-400/50 animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            {currentBlock}
          </span>
        )}
      </nav>
      <div className="flex items-center gap-6">
        <Settings onClick={toggleSettings} className="w-5 h-5 text-white/60 cursor-pointer hover:text-white hover:rotate-90 hover:bg-white/10 p-1 box-content rounded-xl transition-all duration-300" />
      </div>
    </header>
  );
};

export default function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden font-sans">
      {/* Background Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${wallpaperImg})` }}
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
          <Schedule />
          <ToDo />
        </motion.div>

        {/* Center: Desktop Icons */}
        <DesktopSurface />

        {/* Right Column: Sidebar & MiniCalendar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-20 relative flex flex-col gap-8 w-80"
        >
          <Sidebar />
          <MiniCalendar />
        </motion.div>
      </div>


      <SettingsModal />
    </main>
  );
}
