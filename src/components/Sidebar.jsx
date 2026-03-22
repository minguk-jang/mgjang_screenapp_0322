import { useState } from 'react';
import { LayoutGrid, Calendar, Power, Lock, X, Plus } from 'lucide-react';
import { useDesktop } from '../context/DesktopContext';

export default function Sidebar() {
  const { userName, clipboardItems, addClipboardItem, removeClipboardItem } = useDesktop();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [copiedId, setCopiedId] = useState(null);
  const [scratchpadText, setScratchpadText] = useState('');
  const [newClip, setNewClip] = useState('');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddClip = () => {
    if (!newClip.trim()) return;
    addClipboardItem(newClip.trim());
    setNewClip('');
  };

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
            <p className="text-white text-sm font-semibold">{userName}</p>
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
        <div className="mt-4 pt-6 border-t border-white/5 flex flex-col flex-1 h-full max-h-[40vh]">
          <h3 className="text-on-surface font-semibold text-xs opacity-60 uppercase tracking-widest mb-4">Quick Clipboard</h3>
          
          <div className="glass-well rounded-xl p-3 space-y-2 relative overflow-y-auto custom-scrollbar flex-1 mb-3">
            {clipboardItems && clipboardItems.map(item => (
              <div 
                key={item.id} 
                className="group relative flex items-center justify-between text-[11px] p-2 rounded border text-white/70 bg-white/5 border-white/5 hover:bg-white/10 transition-colors"
              >
                <span 
                  onClick={() => handleCopy(item.id, item.text)}
                  className="truncate w-full cursor-pointer"
                >
                  {copiedId === item.id ? 'Copied! ✅' : item.text}
                </span>
                <button 
                  onClick={() => removeClipboardItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/20 p-1 rounded transition-all ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {(!clipboardItems || clipboardItems.length === 0) && (
              <div className="text-white/30 text-xs text-center py-4">Empty clipboard.</div>
            )}
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={newClip}
              onChange={(e) => setNewClip(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddClip()}
              placeholder="Paste or type new clip..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 pr-8"
            />
            <button 
              onClick={handleAddClip} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
            >
              <Plus className="w-3 h-3"/>
            </button>
          </div>
        </div>

        {/* Scratchpad */}
        <div className="mt-4 border-t border-white/5 pt-4">
          <h3 className="text-on-surface font-semibold text-xs opacity-60 uppercase tracking-widest mb-4">Scratchpad</h3>
          <textarea 
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            className="w-full h-24 glass-well rounded-xl text-xs text-white p-3 resize-none focus:ring-1 focus:ring-sky-400/50 focus:bg-white/10 transition-colors focus:outline-none placeholder:text-white/20" 
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
