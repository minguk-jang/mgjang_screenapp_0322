import React from 'react';
import { Clock } from 'lucide-react';

const scheduleData = [
  { time: '08:30', name: 'Homeroom', current: false, past: true },
  { time: '09:00', name: 'Math (Class 1)', current: false, past: true },
  { time: '10:00', name: 'Science (Class 2)', current: true, past: false },
  { time: '11:00', name: 'Planning Period', current: false, past: false },
  { time: '12:00', name: 'Lunch', current: false, past: false },
];

export default function Schedule() {
  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Clock className="w-6 h-6 text-indigo-300" />
        <h2 className="text-xl font-semibold text-white tracking-wide">Daily Schedule</h2>
      </div>
      
      <div className="flex flex-col gap-4 relative">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/10 rounded-full" />
        
        {scheduleData.map((item, index) => (
          <div key={index} className={`flex items-start gap-4 relative z-10 transition-opacity ${item.past ? 'opacity-50' : 'opacity-100'}`}>
            <div className={`mt-1.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.current ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-slate-800 border-2 border-slate-600'}`}>
              {item.current && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
            
            <div className={`flex flex-col flex-1 p-3 rounded-2xl transition-all ${item.current ? 'bg-white/10 border border-white/30 shadow-lg' : 'hover:bg-white/5 border border-transparent'}`}>
              <span className={`text-xs font-mono font-medium ${item.current ? 'text-indigo-200' : 'text-slate-400'}`}>
                {item.time}
              </span>
              <span className={`text-sm ${item.current ? 'text-white font-semibold' : 'text-slate-200 font-medium'}`}>
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
