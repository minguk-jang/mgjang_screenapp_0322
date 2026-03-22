import { useDesktop } from '../context/DesktopContext';
import { Calendar } from 'lucide-react';

export default function Schedule() {
  const { weeklySchedule } = useDesktop();
  
  const todayIndex = new Date().getDay();
  const isWeekend = todayIndex === 0 || todayIndex === 6;
  
  const todaySchedule = !isWeekend && weeklySchedule?.grid ? weeklySchedule.grid[todayIndex] : [];
  
  // Check if there are any actual classes today
  const hasClasses = todaySchedule && todaySchedule.some(cell => cell && cell.subject && cell.subject.trim() !== '');

  return (
    <section className="glass rounded-3xl p-6 w-full shadow-lg border border-white/5 flex flex-col max-h-[50vh]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-white/80 font-semibold text-xs opacity-80 uppercase tracking-widest">오늘의 시간표</h2>
        <Calendar className="w-4 h-4 text-white/60" />
      </div>
      <div className="space-y-4 pt-2 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {!isWeekend && hasClasses ? (
          weeklySchedule.periods.map((period, index) => {
             const subject = todaySchedule[index]?.subject;
             if (!subject || subject.trim() === '') return null;

             return (
              <div key={index} className="flex gap-4 items-start relative group pr-2">
                <div className="flex flex-col items-center w-12 text-center pt-1 flex-shrink-0">
                  <span className="text-[11px] text-sky-200/90 font-mono tracking-tighter">{period.time.split('~')[0]}</span>
                  <span className="text-[9px] text-white/40 mt-1 uppercase">{period.name}</span>
                </div>
                <div className={`flex-1 ${index > 0 ? "border-l-2 border-white/10 pl-4" : "border-l-2 border-transparent pl-4"}`}>
                  <p className="text-[13px] font-medium text-white/90 drop-shadow-md truncate">{subject}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-white/40 text-[11px] text-center py-6 flex flex-col items-center gap-2">
             <div className="text-xl mb-1 opacity-50">{isWeekend ? '😴' : '☕'}</div>
             {isWeekend ? "주말입니다. 푹 쉬세요!" : "오늘 예정된 수업이 없습니다."}
          </div>
        )}
      </div>
    </section>
  );
}
