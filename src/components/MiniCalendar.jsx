import React, { useState, useEffect } from 'react';
import { useDesktop } from '../context/DesktopContext';

export default function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toggleCalendarTodo } = useDesktop();

  // Update date naturally if the user leaves the app open across midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="w-full glass rounded-3xl p-5 shadow-xl border border-white/5 backdrop-blur-md">
      {/* Month & Year Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white/90 font-bold text-sm tracking-widest">
          {year}. {String(month + 1).padStart(2, '0')}.
        </h2>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, idx) => (
          <div 
            key={day} 
            className={`text-center text-[10px] font-semibold ${idx === 0 ? 'text-red-400/80' : idx === 6 ? 'text-blue-400/80' : 'text-white/50'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isToday = day === today;
          const isSunday = idx % 7 === 0;
          const isSaturday = idx % 7 === 6;
          
          let dayStyle = "text-white/70";
          if (isToday) {
            dayStyle = "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20";
          } else if (day && isSunday) {
            dayStyle = "text-red-300/80";
          } else if (day && isSaturday) {
            dayStyle = "text-blue-300/80";
          }

          return (
            <div 
              key={idx}
              onClick={() => {
                if (day) {
                  const mm = String(month + 1).padStart(2, '0');
                  const dd = String(day).padStart(2, '0');
                  toggleCalendarTodo(`${year}-${mm}-${dd}`);
                }
              }}
              className={`flex items-center justify-center h-8 rounded-lg text-xs transition-all ${
                day ? `cursor-pointer ${isToday ? dayStyle : `${dayStyle} hover:bg-white/10`}` : ''
              }`}
            >
              {day || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
