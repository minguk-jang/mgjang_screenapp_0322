import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Folder, FolderOpen, FileText, Image as ImageIcon, FileSpreadsheet, File, FolderPlus, FilePlus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DesktopIcon = ({ icon: Icon, label, color = "text-white/90", className = "", onClick, onRemove }) => (
  <div onClick={onClick} className={`group relative cursor-pointer flex flex-col items-center gap-2 ${className}`}>
    {onRemove && (
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 hover:scale-110 shadow-lg"
      >
        <X className="w-3 h-3" />
      </button>
    )}
    <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-xl">
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
    <span className="text-white drop-shadow-md font-medium text-sm mt-1">{label}</span>
  </div>
);

export default function DesktopSurface() {
  const { folders, activeFolder, toggleFolder, addFolder, addFileToFolder, removeFolder, removeFileFromFolder } = useDesktop();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState(null);
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const activeFolderData = folders.find(f => f.id === activeFolder);

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="w-10 h-10 text-red-400" />;
      case 'word': return <FileText className="w-10 h-10 text-blue-400" />;
      case 'excel': return <FileSpreadsheet className="w-10 h-10 text-green-400" />;
      default: return <File className="w-10 h-10 text-slate-400" />;
    }
  };

  const inferType = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'word';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'excel';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') return 'image';
    return 'other';
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName('');
    setShowFolderPrompt(false);
  };

  const handleAddFile = async () => {
    if (window.api && window.api.showOpenDialog) {
      const selectedPath = await window.api.showOpenDialog({ properties: ['openFile'] });
      if (selectedPath) {
        let targetFolderId = activeFolder;
        if (!targetFolderId && folders.length > 0) {
          targetFolderId = folders[0].id;
        }
        
        if (targetFolderId) {
          const fileName = selectedPath.split('\\').pop().split('/').pop();
          const fileType = inferType(selectedPath);
          addFileToFolder(targetFolderId, { name: fileName, path: selectedPath, type: fileType });
        } else {
          alert('Please create a folder first to add files.');
        }
      }
    }
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
              onRemove={() => removeFolder(folder.id)}
            />
          ))}
        </div>

        {/* Render files dynamically inside a beautiful glass container when a folder is active */}
        <div className={`absolute top-10 left-48 transition-all duration-500 ease-out origin-left ${activeFolder ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {activeFolderData && (
            <div className="glass rounded-3xl p-10 shadow-2xl flex flex-wrap gap-12 w-[600px] border border-white/10 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {activeFolderData.files.map(file => (
                <div 
                  key={file.id} 
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
                    {getFileIcon(file.type)}
                  </div>
                  <span className={`text-xs drop-shadow-md w-20 text-center truncate ${errorFile === file.id ? 'text-red-300 font-bold' : 'text-white/80 group-hover:text-white'}`}>
                    {errorFile === file.id ? "Not Found" : file.name}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFileFromFolder(activeFolder, file.id); }}
                    className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 hover:scale-110 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeFolderData.files.length === 0 && (
                <div className="w-full text-center text-white/40 italic mt-4">Empty Folder</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Action Bar (Direct Manipulation) */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4 z-50">
        <AnimatePresence>
          {showFolderPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass rounded-xl p-3 shadow-2xl border border-white/10 flex items-center gap-2 mb-2"
            >
              <input 
                autoFocus
                type="text" 
                placeholder="Folder Name..." 
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                className="bg-black/20 text-sm text-white px-3 py-1.5 rounded-lg border border-white/5 focus:outline-none focus:border-white/20 w-36"
              />
              <button 
                onClick={handleCreateFolder}
                className="p-1.5 bg-sky-500/20 hover:bg-sky-500/40 text-sky-200 rounded-lg transition-colors"
                title="Create"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowFolderPrompt(false)}
                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass rounded-full shadow-2xl border border-white/10 p-2 flex gap-2">
          <button 
            onClick={() => setShowFolderPrompt(!showFolderPrompt)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium ${showFolderPrompt ? 'bg-sky-500/20 text-sky-100 shadow-inner' : 'bg-white/5 text-white/70 hover:bg-white/20 hover:text-white'}`}
          >
            <FolderPlus className="w-5 h-5" /> 
            <span className="hidden group-hover:block transition-all pr-1">New Folder</span>
          </button>
          
          <button 
            onClick={handleAddFile}
            className="flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 text-sm font-medium bg-white/5 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <FilePlus className="w-5 h-5" />
            <span className="hidden group-hover:block transition-all pr-1">Add File</span>
          </button>
        </div>
      </div>
    </div>
  );
}
