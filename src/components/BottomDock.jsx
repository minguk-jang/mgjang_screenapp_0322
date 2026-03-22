import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Globe, MonitorPlay, MessageCircle, Network, GraduationCap, Mail, Cloud, Terminal, Settings, Plus, X } from 'lucide-react';

const iconMap = {
  Globe: Globe,
  MonitorPlay: MonitorPlay,
  MessageCircle: MessageCircle,
  Network: Network,
  GraduationCap: GraduationCap,
  Mail: Mail,
  Cloud: Cloud,
  Terminal: Terminal,
  Settings: Settings
};

export default function BottomDock() {
  const { quickLinks, toggleSettings, addQuickLink, removeQuickLink } = useDesktop();
  const [errorLink, setErrorLink] = useState(null);
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  // Use user-defined quickLinks if available; otherwise show defaults
  const displayLinks = quickLinks && quickLinks.length > 0 ? quickLinks : [
    { id: 'dock1', name: 'NEIS', icon: 'Network' },
    { id: 'dock2', name: 'Edufine', icon: 'GraduationCap' },
    { id: 'dock3', name: 'Mail', icon: 'Mail' },
    { id: 'dock4', name: 'Cloud', icon: 'Cloud' },
    { id: 'dock5', name: 'Terminal', icon: 'Terminal' },
    { id: 'dock6', name: 'Settings', icon: 'Settings' }
  ];

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) return;
    addQuickLink({ ...newLink, icon: 'Globe' });
    setNewLink({ name: '', url: '' });
    setShowAddPopover(false);
  };

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 px-6 rounded-full glass border-white/10 flex items-center justify-center gap-4 z-50 shadow-2xl relative">
      {displayLinks.map((link, idx) => {
        const IconComponent = iconMap[link.icon] || Globe;
        return (
          <div key={link.id} className="group relative flex items-center">
            {idx === 2 && <div className="hidden group-hover:hidden" />} {/* For the separator logic, though let's keep it simple */}
            
            {(link.id !== 'dock6' && link.name !== 'Settings') && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeQuickLink(link.id);
                }}
                className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 hover:scale-110 shadow-lg"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            <div 
              onClick={async () => {
                if (link.name === 'Settings' || link.id === 'dock6') {
                  toggleSettings();
                  return;
                }
                const urlToOpen = link.url || 'https://google.com';
                const success = await window.api.openItem(urlToOpen, true);
                if (!success) {
                  setErrorLink(link.id);
                  setTimeout(() => setErrorLink(null), 1500);
                }
              }}
              className="p-3 text-white/70 hover:bg-white/10 hover:scale-110 transition-all duration-300 hover:-translate-y-2 cursor-pointer rounded-full active:scale-90"
            >
              <IconComponent className="w-8 h-8" />
              <span className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 font-sans text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap z-50 ${errorLink === link.id ? 'opacity-100 bg-red-500/80 ring-2 ring-red-400 font-bold' : 'opacity-0 group-hover:opacity-100'}`}>
                {errorLink === link.id ? "Link Error" : link.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Inline Direct Manipulation: Add Quick Link */}
      <div className="relative border-l border-white/10 pl-4 flex items-center h-full">
        <button 
          onClick={() => setShowAddPopover(!showAddPopover)}
          className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 ${showAddPopover ? 'bg-white/20 text-white shadow-inner scale-110' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
        >
          {showAddPopover ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
        
        {/* Glassmorphic Popover */}
        {showAddPopover && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 glass rounded-2xl p-4 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">Add Quick Link</h3>
            <div className="space-y-3">
              <input 
                type="text" placeholder="Name (e.g., Notion)" 
                value={newLink.name} onChange={e => setNewLink({...newLink, name: e.target.value})}
                autoFocus
                className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <input 
                type="text" placeholder="URL (https://...)" 
                value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button 
                onClick={handleAddLink}
                className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-xl transition-all font-medium mt-1 active:scale-95"
              >
                Add to Dock
              </button>
            </div>
            {/* Popover Arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 glass border-r border-b border-white/10 rotate-45 transform z-[-1]"></div>
          </div>
        )}
      </div>
    </nav>
  );
}
