/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Settings, 
  User, 
  Calendar, 
  LayoutGrid, 
  Power, 
  Lock 
} from 'lucide-react';
import { motion } from 'motion/react';
import ToDo from './components/ToDo';
import DesktopSurface from './components/DesktopSurface';
import BottomDock from './components/BottomDock';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import Schedule from './components/Schedule';
import { useDesktop } from './context/DesktopContext';

const TopNav = () => {
  const { toggleSettings } = useDesktop();
  return (
    <header className="fixed top-0 left-0 w-full h-16 px-12 flex justify-between items-center bg-black/15 backdrop-blur-3xl z-40">
      <div className="text-xl font-bold text-white tracking-tighter">Ethereal Desktop</div>
      <nav className="flex gap-8">
        <a className="text-white border-b-2 border-white/50 pb-1" href="#">Files</a>
        <a className="text-white/60 hover:text-white transition-colors" href="#">Widgets</a>
        <a className="text-white/60 hover:text-white transition-colors" href="#">Sync</a>
        <a className="text-white/60 hover:text-white transition-colors" href="#">History</a>
      </nav>
      <div className="flex items-center gap-6">
        <Settings onClick={toggleSettings} className="w-5 h-5 text-white/80 cursor-pointer hover:bg-white/10 rounded-lg transition-all" />
        <User className="w-5 h-5 text-white/80 cursor-pointer hover:bg-white/10 rounded-lg transition-all" />
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
          <Schedule />
          <ToDo />
        </motion.div>

        {/* Center: Desktop Icons */}
        <DesktopSurface />

        {/* Right Column: Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-20 relative"
        >
          <Sidebar />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <BottomDock />
      </motion.div>

      <SettingsModal />
    </main>
  );
}
