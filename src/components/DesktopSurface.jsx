import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Folder, FolderOpen, FileText, Image as ImageIcon, FileSpreadsheet, File } from 'lucide-react';
import { motion } from 'motion/react';

const DesktopIcon = ({ icon: Icon, label, color = "text-white/90", className = "", onClick }) => (
  <div onClick={onClick} className={`group cursor-pointer flex flex-col items-center gap-2 ${className}`}>
    <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform shadow-xl">
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
    <span className="text-white drop-shadow-md font-medium text-sm mt-1">{label}</span>
  </div>
);

export default function DesktopSurface() {
  const { folders, activeFolder, toggleFolder } = useDesktop();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorFile, setErrorFile] = useState(null);
  const activeFolderData = folders.find(f => f.id === activeFolder);

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="w-10 h-10 text-red-400" />;
      case 'word': return <FileText className="w-10 h-10 text-blue-400" />;
      case 'excel': return <FileSpreadsheet className="w-10 h-10 text-green-400" />;
      default: return <File className="w-10 h-10 text-slate-400" />;
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
            />
          ))}
        </div>

        {/* Render files dynamically inside a beautiful glass container when a folder is active */}
        <div className={`absolute top-10 left-48 transition-all duration-500 ease-out origin-left ${activeFolder ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {activeFolderData && (
            <div className="glass rounded-3xl p-10 shadow-2xl flex flex-wrap gap-12 w-[600px] border border-white/10">
              {activeFolderData.files.map(file => (
                <div 
                  key={file.id} 
                  className={`group cursor-pointer flex flex-col items-center gap-3 hover:scale-105 transition-all p-2 rounded-xl border border-transparent ${selectedFile === file.id ? 'bg-white/20 border-white/20 shadow-inner' : ''}`}
                  onClick={() => setSelectedFile(file.id)}
                  onDoubleClick={async () => {
                    // Try to open with actual path, fallback to something reliably erroneous if undefined
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
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
