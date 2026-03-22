import { useState } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { X, Check, Plus, Calendar } from 'lucide-react';

export default function CalendarTodoModal() {
  const { isCalendarTodoOpen, toggleCalendarTodo, selectedCalendarDate, todos, toggleTodo, addTodo, removeTodo, isLocked } = useDesktop();
  const [newTodo, setNewTodo] = useState('');

  if (!isCalendarTodoOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      addTodo(newTodo.trim(), selectedCalendarDate);
      setNewTodo('');
    }
  };

  const displayTodos = todos.filter(t => t.date === selectedCalendarDate);

  // Formatting date nicely (e.g. 2026-03-24 -> 2026년 3월 24일)
  // Fix off-by-one by parsing purely safely or using string manipulation.
  const [year, month, day] = selectedCalendarDate.split('-');
  const displayDateText = `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl p-4 transition-all">
      <div className="glass w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tighter">{displayDateText} 스케줄</h2>
          </div>
          <button onClick={() => toggleCalendarTodo()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col overflow-hidden bg-black/10">
          <ul className="space-y-3 overflow-y-auto custom-scrollbar flex-1 mb-4 pr-2">
            {displayTodos.map(task => (
              <li 
                key={task.id} 
                onClick={() => toggleTodo(task.id)}
                className={`flex items-center gap-3 text-sm group cursor-pointer ${task.completed ? 'text-white/80' : 'text-white/60'}`}
              >
                {task.completed ? (
                  <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors flex-shrink-0"></div>
                )}
                <span className={task.completed ? 'line-through opacity-50 text-white truncate' : 'text-white truncate'}>
                  {task.text}
                </span>
                {!isLocked && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTodo(task.id);
                    }}
                    className="ml-auto bg-red-500/80 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 active:scale-95"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
            {displayTodos.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm mt-10">
                등록된 일정이 없습니다.
              </div>
            )}
          </ul>
          
          {!isLocked && (
            <div className="relative mt-auto flex-shrink-0">
              <input 
                type="text" 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="일정을 입력하고 Enter 키를 누르세요..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all shadow-inner"
              />
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
