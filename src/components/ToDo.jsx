import { useState } from 'react';
import { ListTodo, Check, Plus, X } from 'lucide-react';
import { useDesktop } from '../context/DesktopContext';

export default function ToDo() {
  const { todos, toggleTodo, addTodo, removeTodo } = useDesktop();
  const [newTodo, setNewTodo] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <section className="glass rounded-3xl p-6 w-full mt-8 flex flex-col h-full max-h-[50vh]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-on-surface font-semibold text-xs opacity-80 uppercase tracking-widest">To-Do Ledger</h2>
        <ListTodo className="w-4 h-4 opacity-60 text-white" />
      </div>
      <ul className="space-y-3 overflow-y-auto custom-scrollbar flex-1 mb-4 pr-2">
        {todos.map(task => (
          <li 
            key={task.id} 
            onClick={() => toggleTodo(task.id)}
            className={`flex items-center gap-3 text-sm group cursor-pointer ${task.completed ? 'text-on-surface' : 'text-on-surface-variant'}`}
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
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeTodo(task.id);
              }}
              className="ml-auto bg-red-500/80 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 active:scale-95"
            >
              <X className="w-3 h-3" />
            </button>
          </li>
        ))}
      </ul>
      <div className="relative mt-auto flex-shrink-0">
        <input 
          type="text" 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type task and press Enter..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all shadow-inner"
        />
        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      </div>
    </section>
  );
}
