import { useDesktop } from '../context/DesktopContext';
import { Calendar } from 'lucide-react';

export default function Schedule() {
  const { schedule } = useDesktop();

  return (
    <section className="glass rounded-3xl p-6 w-full shadow-lg border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/80 font-semibold text-xs opacity-80 uppercase tracking-widest">Daily Schedule</h2>
        <Calendar className="w-4 h-4 text-white/60" />
      </div>
      <div className="space-y-4 pt-2">
        {schedule && schedule.length > 0 ? (
          schedule.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="flex flex-col items-center w-12 text-center pt-1">
                <span className="text-xs text-sky-200/80 font-mono tracking-tighter">{item.time}</span>
                {item.period && <span className="text-[9px] text-white/40 mt-1 uppercase">{item.period}</span>}
              </div>
              <div className={`flex-1 ${index > 0 ? "border-l-2 border-white/10 pl-4" : ""}`}>
                <p className="text-sm font-medium text-white/90 drop-shadow-md">{item.subject}</p>
                <p className="text-xs text-white/50">{item.room}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white/40 text-xs text-center py-4 italic">No schedule items yet.</div>
        )}
      </div>
    </section>
  );
}
