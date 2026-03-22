import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { Calendar, Plus, X, Check } from 'lucide-react';

export default function Schedule() {
  const { schedule, addScheduleItem, removeScheduleItem } = useDesktop();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({ period: '', time: '', subject: '', room: '' });

  const handleAddClass = () => {
    if (!newClass.subject || !newClass.time) return;
    addScheduleItem(newClass);
    setNewClass({ period: '', time: '', subject: '', room: '' });
    setShowAddForm(false);
  };

  return (
    <section className="glass rounded-3xl p-6 w-full shadow-lg border border-white/5 flex flex-col max-h-[50vh]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-white/80 font-semibold text-xs opacity-80 uppercase tracking-widest">Daily Schedule</h2>
        <Calendar className="w-4 h-4 text-white/60" />
      </div>
      <div className="space-y-4 pt-2 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {schedule && schedule.length > 0 ? (
          schedule.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-start relative group pr-6">
              <div className="flex flex-col items-center w-12 text-center pt-1 flex-shrink-0">
                <span className="text-xs text-sky-200/80 font-mono tracking-tighter">{item.time}</span>
                {item.period && <span className="text-[9px] text-white/40 mt-1 uppercase">{item.period}</span>}
              </div>
              <div className={`flex-1 ${index > 0 ? "border-l-2 border-white/10 pl-4" : "border-l-2 border-transparent pl-4"}`}>
                <p className="text-sm font-medium text-white/90 drop-shadow-md truncate">{item.subject}</p>
                <p className="text-xs text-white/50 truncate w-32">{item.room}</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeScheduleItem(item.id);
                }}
                className="absolute top-1 right-0 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-500 shadow-lg active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-white/40 text-xs text-center py-4 italic">No schedule items yet.</div>
        )}
      </div>

      {/* Inline Direct Manipulation: Add Class Form */}
      <div className="mt-4 flex-shrink-0 border-t border-white/10 pt-4">
        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-white/50 hover:text-white/90 transition-all py-2 rounded-xl hover:bg-white/5"
          >
            <Plus className="w-4 h-4" /> Add Class
          </button>
        ) : (
          <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
            <div className="flex justify-between items-center mb-1 px-1">
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">New Class</span>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="text-white/40 hover:text-white/80 transition-colors p-1 rounded hover:bg-white/10 active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" placeholder="Period (e.g. 1st)" 
                value={newClass.period} onChange={e => setNewClass({...newClass, period: e.target.value})} 
                className="bg-white/5 text-xs text-white px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-white/20 w-full placeholder-white/30" 
              />
              <input 
                type="text" placeholder="09:00 - 09:50" 
                value={newClass.time} onChange={e => setNewClass({...newClass, time: e.target.value})} 
                className="bg-white/5 text-xs text-white px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-white/20 w-full placeholder-white/30" 
              />
            </div>
            <input 
              type="text" placeholder="Subject" 
              value={newClass.subject} onChange={e => setNewClass({...newClass, subject: e.target.value})} 
              className="bg-white/5 text-xs text-white px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-white/20 w-full placeholder-white/30" 
            />
            <div className="flex gap-2">
               <input 
                 type="text" placeholder="Room" 
                 value={newClass.room} onChange={e => setNewClass({...newClass, room: e.target.value})} 
                 onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
                 className="bg-white/5 text-xs text-white px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-white/20 flex-1 placeholder-white/30" 
               />
               <button 
                 onClick={handleAddClass} 
                 className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-200 px-4 rounded-lg flex items-center justify-center transition-colors active:scale-95"
               >
                 <Check className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
