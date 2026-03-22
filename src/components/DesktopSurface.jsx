import { useState, useEffect } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Folder, FolderOpen, FileText, Image as ImageIcon, FileSpreadsheet, File, FolderPlus, X, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DesktopIcon = ({ icon: Icon, label, color = "text-white/90", className = "", onClick, onDoubleClick, onRemove }) => (
  <div onClick={onClick} onDoubleClick={onDoubleClick} className={`group relative cursor-pointer flex flex-col items-center gap-2 ${className}`}>
    {onRemove && (
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 hover:scale-110 shadow-lg"
      >
        <X className="w-3 h-3" />
      </button>
    )}
    <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-xl">
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
    <span className="text-white drop-shadow-md font-medium text-sm mt-1">{label}</span>
  </div>
);

export default function DesktopSurface() {
  const { folders, activeFolder, toggleFolder, addFolder, removeFolder, quickLinks, addQuickLink, removeQuickLink } = useDesktop();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState(null);
  const [currentFolderContents, setCurrentFolderContents] = useState([]);
  const [showAddWebLink, setShowAddWebLink] = useState(false);
  const [newWebLink, setNewWebLink] = useState({ name: '', url: '' });
  
  const activeFolderData = folders.find(f => f.id === activeFolder);

  useEffect(() => {
    let active = true;
    async function fetchContents() {
      if (activeFolderData && activeFolderData.absolutePath && window.api && window.api.readDirectory) {
        const contents = await window.api.readDirectory(activeFolderData.absolutePath);
        if (active) setCurrentFolderContents(contents || []);
      } else {
        if (active) setCurrentFolderContents([]);
      }
    }
    fetchContents();
    return () => { active = false; };
  }, [activeFolderData]);

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="w-10 h-10 text-red-400" />;
      case 'word': return <FileText className="w-10 h-10 text-blue-400" />;
      case 'excel': return <FileSpreadsheet className="w-10 h-10 text-green-400" />;
      case 'image': return <ImageIcon className="w-10 h-10 text-purple-400" />;
      default: return <File className="w-10 h-10 text-slate-400" />;
    }
  };

  const handleLinkFolder = async () => {
    if (window.api && window.api.showOpenDialog) {
      const selectedPath = await window.api.showOpenDialog({ properties: ['openDirectory'] });
      if (selectedPath) {
        const folderName = selectedPath.split('\\').pop().split('/').pop();
        addFolder({ name: folderName, absolutePath: selectedPath });
      }
    }
  };

  const handleAddWebLink = () => {
    if (!newWebLink.name || !newWebLink.url) return;
    addQuickLink({ ...newWebLink, icon: 'Globe' });
    setNewWebLink({ name: '', url: '' });
    setShowAddWebLink(false);
  };

  return (
    <div className="flex-grow relative mx-12 h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full h-full relative"
      >
        {/* Render main folders dynamically */}
        <div className="absolute top-10 left-10 flex flex-col gap-12 text-white">
          {folders.map(folder => (
            <DesktopIcon 
              key={folder.id}
              icon={activeFolder === folder.id ? FolderOpen : Folder} 
              label={folder.name} 
              color={activeFolder === folder.id ? "text-sky-300" : "text-white/90"}
              onClick={() => toggleFolder(folder.id)} 
              onDoubleClick={async (e) => {
                e.stopPropagation();
                if (window.api && window.api.openItem) {
                  const success = await window.api.openItem(folder.absolutePath, false);
                  if (!success) {
                    setErrorFile(folder.id);
                    setTimeout(() => setErrorFile(null), 1500);
                  }
                }
              }}
              onRemove={() => removeFolder(folder.id)}
            />
          ))}
          {quickLinks.map(link => (
            <DesktopIcon 
              key={link.id}
              icon={Link2} 
              label={link.name} 
              color="text-emerald-300"
              onClick={async () => {
                const urlToOpen = link.url;
                const success = await window.api.openItem(urlToOpen, true);
                if (!success) {
                  setErrorFile(link.id);
                  setTimeout(() => setErrorFile(null), 1500);
                }
              }}
              onRemove={() => removeQuickLink(link.id)}
            />
          ))}
        </div>

        {/* Render files dynamically inside a beautiful glass container when a folder is active */}
        <div className={`absolute top-10 left-48 transition-all duration-500 ease-out origin-left ${activeFolder ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {activeFolderData && (
            <div className="glass rounded-3xl p-10 shadow-2xl flex flex-wrap gap-12 w-[600px] border border-white/10 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {currentFolderContents.map(file => (
                <div 
                  key={file.path} 
                  className={`group relative cursor-pointer flex flex-col items-center gap-3 hover:scale-105 transition-all p-2 rounded-xl border border-transparent ${selectedFile === file.id ? 'bg-white/20 border-white/20 shadow-inner' : ''}`}
                  onClick={() => setSelectedFile(file.id)}
                  onDoubleClick={async () => {
                    const filePath = file.path || 'C:\\path\\does\\not\\exist'; 
                    const success = await window.api.openItem(filePath, false);
                    if (!success) {
                      setErrorFile(file.id);
                      setTimeout(() => setErrorFile(null), 1500);
                    }
                  }}
                >
                  <div className={`w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border transition-colors ${errorFile === file.id ? 'border-red-400 bg-red-500/20' : 'border-white/10 group-hover:bg-white/10'}`}>
                    {file.isDirectory ? <Folder className="w-10 h-10 text-sky-400" /> : getFileIcon(file.type)}
                  </div>
                  <span className={`text-xs drop-shadow-md w-20 text-center truncate ${errorFile === file.id ? 'text-red-300 font-bold' : 'text-white/80 group-hover:text-white'}`}>
                    {errorFile === file.id ? "찾을 수 없음" : file.name}
                  </span>
                </div>
              ))}
              {currentFolderContents.length === 0 && (
                <div className="w-full text-center text-white/40 italic mt-4">빈 폴더</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Action Bar (Direct Manipulation) */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4 z-50">
        {showAddWebLink && (
          <div className="glass rounded-2xl p-4 shadow-2xl border border-white/10 mb-2 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">웹 링크 추가</h3>
            <div className="space-y-3">
              <input 
                type="text" placeholder="이름 (예: Notion)" 
                value={newWebLink.name} onChange={e => setNewWebLink({...newWebLink, name: e.target.value})}
                autoFocus
                className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <input 
                type="text" placeholder="URL (https://...)" 
                value={newWebLink.url} onChange={e => setNewWebLink({...newWebLink, url: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleAddWebLink()}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button 
                onClick={handleAddWebLink}
                className="w-full bg-white/10 hover:bg-white/20 text-white text-sm py-2 rounded-xl transition-all font-medium mt-1 active:scale-95"
              >
                링크 추가
              </button>
            </div>
          </div>
        )}
        
        <div className="glass rounded-full shadow-2xl border border-white/10 p-2 flex gap-2">
          <button 
            onClick={() => setShowAddWebLink(!showAddWebLink)}
            className="flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium bg-white/5 text-white/70 hover:bg-white/20 hover:text-white group"
          >
            <Link2 className="w-5 h-5" /> 
            <span className="hidden group-hover:block transition-all pr-1">웹 링크 추가</span>
          </button>
          <button 
            onClick={handleLinkFolder}
            className="flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium bg-white/5 text-white/70 hover:bg-white/20 hover:text-white group"
          >
            <FolderPlus className="w-5 h-5" /> 
            <span className="hidden group-hover:block transition-all pr-1">폴더 연결</span>
          </button>
        </div>
      </div>
    </div>
  );
}
