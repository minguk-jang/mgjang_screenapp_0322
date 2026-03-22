import React, { useState } from 'react';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

export default function ToDo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit weekly attendance', completed: true },
    { id: 2, text: 'Grade math worksheets', completed: false },
    { id: 3, text: 'Email parents about field trip', completed: false },
    { id: 4, text: 'Prepare tomorrow\\'s slides', completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="w-full bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <ListTodo className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white tracking-wide">To-Do Ledger</h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {tasks.map(task => (
          <button 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-left w-full group border ${
              task.completed 
                ? 'bg-transparent border-transparent' 
                : 'hover:bg-white/5 border-transparent hover:border-white/10 hover:shadow-lg'
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 group-hover:text-emerald-300 transition-colors flex-shrink-0" />
            )}
            
            <span className={`flex-1 text-sm font-medium transition-all ${
              task.completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}>
              {task.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
