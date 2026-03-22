import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Globe, MonitorPlay, MessageCircle, Network, GraduationCap, Mail, Cloud, Terminal, Settings } from 'lucide-react';

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
  const { quickLinks } = useDesktop();
  const [errorLink, setErrorLink] = useState(null);

  // Use user-defined quickLinks if available; otherwise show defaults
  const displayLinks = quickLinks && quickLinks.length > 0 ? quickLinks : [
    { id: 'dock1', name: 'NEIS', icon: 'Network' },
    { id: 'dock2', name: 'Edufine', icon: 'GraduationCap' },
    { id: 'dock3', name: 'Mail', icon: 'Mail' },
    { id: 'dock4', name: 'Cloud', icon: 'Cloud' },
    { id: 'dock5', name: 'Terminal', icon: 'Terminal' },
    { id: 'dock6', name: 'Settings', icon: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 px-6 rounded-full glass border-white/10 flex items-center justify-center gap-4 z-50 shadow-2xl">
      {displayLinks.map((link, idx) => {
        const IconComponent = iconMap[link.icon] || Globe;
        return (
          <div key={link.id} className="group relative flex items-center">
            {idx === 2 && <div className="hidden group-hover:hidden" />} {/* For the separator logic, though let's keep it simple */}
            <div 
              onClick={async () => {
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
    </nav>
  );
}
