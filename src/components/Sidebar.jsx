import { useState } from 'react';
import { LayoutGrid, Calendar, Power, Lock } from 'lucide-react';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [copiedId, setCopiedId] = useState(null);
  const [scratchpadText, setScratchpadText] = useState('');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const clipboardItems = [
    { id: '1', text: '0x7F2A...99C1' },
    { id: '2', text: 'academic.neis.go.kr/portal/main' }
  ];

  return (
    <aside className="w-72 flex flex-col gap-6">
      <div className="glass rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
        {/* User Profile */}
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
        
        {/* Workspace Navigation */}
        <div className="space-y-1">
          <h3 className="text-white/40 text-[10px] font-bold uppercase mb-2">Workspace</h3>
          
          <div 
            onClick={() => setActiveTab('Dashboard')}
            className={`${activeTab === 'Dashboard' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'} p-3 flex items-center gap-3 transition-all duration-200 rounded-xl cursor-pointer`}
          >
            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Dashboard</span>
          </div>

          <div 
            onClick={() => setActiveTab('Schedule')}
            className={`${activeTab === 'Schedule' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'} p-3 flex items-center gap-3 transition-all duration-200 rounded-xl cursor-pointer`}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Schedule</span>
          </div>
        </div>

        {/* Quick Clipboard */}
        <div className="mt-4 pt-6 border-t border-white/5">
          <h3 className="text-on-surface font-semibold text-xs opacity-60 uppercase tracking-widest mb-4">Quick Clipboard</h3>
          <div className="glass-well rounded-xl p-4 space-y-3 relative overflow-hidden">
            {clipboardItems.map(item => (
              <div 
                key={item.id}
                onClick={() => handleCopy(item.id, item.text)}
                className={`text-[11px] p-2 rounded transition-all duration-300 flex items-center justify-center cursor-pointer border ${
                  copiedId === item.id 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] scale-105' 
                    : 'text-white/70 bg-white/5 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate w-full text-center">
                  {copiedId === item.id ? 'Copied! ✅' : item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scratchpad */}
        <div className="mt-4">
          <h3 className="text-on-surface font-semibold text-xs opacity-60 uppercase tracking-widest mb-4">Scratchpad</h3>
          <textarea 
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            className="w-full h-32 glass-well rounded-xl text-xs text-white p-3 resize-none focus:ring-1 focus:ring-sky-400/50 focus:bg-white/10 transition-colors focus:outline-none placeholder:text-white/20" 
            placeholder="Type quick notes here..."
          />
        </div>

        {/* Footer Actions */}
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
}
