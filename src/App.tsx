/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { useDesktop } from './context/DesktopContext';
import wallpaperImg from './assets/wallpaper.jpg';

const TopNav = () => {
  const { toggleSettings } = useDesktop();
  return (
    <header className="fixed top-0 left-0 w-full h-16 px-12 flex justify-between items-center bg-black/50 backdrop-blur-3xl z-40">
      <div className="text-xl font-bold text-white tracking-tighter">쭈의 일터</div>
      <nav className="flex gap-8">
        <a className="text-white border-b-2 border-white/50 pb-1" href="#">Workspace</a>
      </nav>
      <div className="flex items-center gap-6">
        <Settings onClick={toggleSettings} className="w-5 h-5 text-white/80 cursor-pointer hover:bg-white/10 rounded-lg transition-all" />
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


      <SettingsModal />
    </main>
  );
}
