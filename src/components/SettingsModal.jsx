import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { X, Trash2, Plus, Folder, Link as LinkIcon, Calendar, File } from 'lucide-react';

export default function SettingsModal() {
  const { 
    isSettingsOpen, toggleSettings, 
    folders, addFolder, removeFolder, addFileToFolder, removeFileFromFolder,
    quickLinks, addQuickLink, removeQuickLink,
    schedule, addScheduleItem, removeScheduleItem
  } = useDesktop();

  const [activeTab, setActiveTab] = useState('folders');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFile, setNewFile] = useState({ name: '', path: '', type: 'pdf', folderId: '' });
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: 'Globe' });
  const [newSchedule, setNewSchedule] = useState({ period: '', time: '', subject: '', room: '' });

  if (!isSettingsOpen) return null;

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim());
    setNewFolderName('');
  };

  const handleAddFile = () => {
    if (!newFile.name || !newFile.path || !newFile.folderId) return;
    addFileToFolder(newFile.folderId, { name: newFile.name, path: newFile.path, type: newFile.type });
    setNewFile({ name: '', path: '', type: 'pdf', folderId: newFile.folderId });
  };

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) return;
    addQuickLink(newLink);
    setNewLink({ name: '', url: '', icon: 'Globe' });
  };

  const handleAddSchedule = () => {
    if (!newSchedule.subject || !newSchedule.time) return;
    addScheduleItem(newSchedule);
    setNewSchedule({ period: '', time: '', subject: '', room: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 transition-all">
      <div className="glass w-full max-w-3xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white tracking-tighter">Settings</h2>
          <button onClick={toggleSettings} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-56 border-r border-white/10 p-4 space-y-2 bg-black/20">
            <button 
              onClick={() => setActiveTab('folders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'folders' ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Folder className="w-4 h-4" /> Folders & Files
            </button>
            <button 
              onClick={() => setActiveTab('links')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'links' ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <LinkIcon className="w-4 h-4" /> Quick Links
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'schedule' ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" /> Schedule
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            
            {/* Tab 1: Folders & Files */}
            {activeTab === 'folders' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Add Folder</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Folder Name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
                      className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <button onClick={handleAddFolder} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </section>

                {folders.length > 0 && (
                  <section>
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Add File to Folder</h3>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <select value={newFile.folderId} onChange={e => setNewFile(prev => ({...prev, folderId: e.target.value}))} className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30">
                        <option value="">Select Folder</option>
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                      <input type="text" placeholder="File Name" value={newFile.name} onChange={e => setNewFile(prev => ({...prev, name: e.target.value}))} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30" />
                      <div className="flex-1 flex gap-2">
                        <input type="text" placeholder="File Path" value={newFile.path} onChange={e => setNewFile(prev => ({...prev, path: e.target.value}))} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30" />
                        <button onClick={async () => {
                          if (window.api && window.api.showOpenDialog) {
                            const selectedPath = await window.api.showOpenDialog({ properties: ['openFile'] });
                            if (selectedPath) setNewFile(prev => ({...prev, path: selectedPath}));
                          }
                        }} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap">
                          Browse...
                        </button>
                      </div>
                      <select value={newFile.type} onChange={e => setNewFile(prev => ({...prev, type: e.target.value}))} className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30">
                        <option value="pdf">PDF</option>
                        <option value="word">Word</option>
                        <option value="excel">Excel</option>
                        <option value="other">Other</option>
                      </select>
                      <button onClick={handleAddFile} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Current Structure</h3>
                  <div className="space-y-4">
                    {folders.map(folder => (
                      <div key={folder.id} className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-3 text-white">
                          <div className="flex items-center gap-2 font-medium">
                            <Folder className="w-4 h-4 text-sky-400" /> {folder.name}
                          </div>
                          <button onClick={() => removeFolder(folder.id)} className="text-red-400/70 hover:text-red-400 transition-colors p-1 hover:bg-red-400/10 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-2 pl-6 border-l border-white/10 ml-2">
                          {folder.files.map(file => (
                            <div key={file.id} className="flex justify-between items-center text-sm group">
                              <div className="text-white/70 flex items-center gap-2 drop-shadow-md">
                                <File className="w-3 h-3 text-white/40" />
                                {file.name} <span className="text-[10px] text-white/30 font-mono hidden sm:inline truncate max-w-[200px]">({file.path})</span>
                              </div>
                              <button onClick={() => removeFileFromFolder(folder.id, file.id)} className="opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 transition-all p-1">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {folder.files.length === 0 && <div className="text-white/30 text-xs italic">Empty folder</div>}
                        </div>
                      </div>
                    ))}
                    {folders.length === 0 && <div className="text-white/40 text-center py-8">No folders yet.</div>}
                  </div>
                </section>
              </div>
            )}

            {/* Tab 2: Quick Links */}
            {activeTab === 'links' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Add Quick Link</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Site Name" value={newLink.name} onChange={e => setNewLink({ ...newLink, name: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 flex-1" />
                    <input type="text" placeholder="URL (https://...)" value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 flex-1" />
                    <select value={newLink.icon} onChange={e => setNewLink({ ...newLink, icon: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 w-32">
                      <option value="Globe">Globe</option>
                      <option value="MonitorPlay">Monitor</option>
                      <option value="GraduationCap">Cap</option>
                      <option value="Mail">Mail</option>
                      <option value="Network">Network</option>
                    </select>
                    <button onClick={handleAddLink} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Current Quick Links</h3>
                  <div className="space-y-2">
                    {quickLinks.map(link => (
                      <div key={link.id} className="flex justify-between items-center bg-black/20 rounded-xl p-3 border border-white/5 text-white/90 text-sm group">
                        <div className="flex items-center gap-4">
                          <span className="bg-white/10 p-2 rounded-lg"><LinkIcon className="w-4 h-4" /></span>
                          <span className="font-medium">{link.name}</span>
                          <span className="text-white/40 font-mono text-xs">{link.url}</span>
                        </div>
                        <button onClick={() => removeQuickLink(link.id)} className="opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 transition-all p-2 hover:bg-red-400/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {quickLinks.length === 0 && <div className="text-white/40 text-center py-8">No quick links yet.</div>}
                  </div>
                </section>
              </div>
            )}

            {/* Tab 3: Schedule */}
            {activeTab === 'schedule' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Add Schedule Item</h3>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <input type="text" placeholder="Period (e.g., 1st Period)" value={newSchedule.period} onChange={e => setNewSchedule({ ...newSchedule, period: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30 w-32" />
                    <input type="text" placeholder="Time (09:00 - 09:50)" value={newSchedule.time} onChange={e => setNewSchedule({ ...newSchedule, time: e.target.value })} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                    <input type="text" placeholder="Subject (Math)" value={newSchedule.subject} onChange={e => setNewSchedule({ ...newSchedule, subject: e.target.value })} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                    <input type="text" placeholder="Room 402" value={newSchedule.room} onChange={e => setNewSchedule({ ...newSchedule, room: e.target.value })} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                    <button onClick={handleAddSchedule} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Current Timetable</h3>
                  <div className="space-y-2">
                    {schedule && schedule.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-black/20 rounded-xl p-3 border border-white/5 text-white/90 text-sm group">
                        <div className="flex items-center gap-4">
                          <span className="bg-white/10 p-2 rounded-lg"><Calendar className="w-4 h-4" /></span>
                          <span className="text-sky-200/80 font-mono w-32">{item.time}</span>
                          <span className="font-medium min-w-[120px]">{item.subject}</span>
                          <span className="text-white/50 hidden sm:block">{item.room}</span>
                        </div>
                        <button onClick={() => removeScheduleItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 transition-all p-2 hover:bg-red-400/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!schedule || schedule.length === 0) && <div className="text-white/40 text-center py-8">No schedule items yet.</div>}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
