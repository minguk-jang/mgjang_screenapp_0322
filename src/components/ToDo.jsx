import { ListTodo, Check } from 'lucide-react';
import { useDesktop } from '../context/DesktopContext';

export default function ToDo() {
  const { todos, toggleTodo } = useDesktop();

  return (
    <section className="glass rounded-3xl p-6 w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-on-surface font-semibold text-xs opacity-80 uppercase tracking-widest">To-Do Ledger</h2>
        <ListTodo className="w-4 h-4 opacity-60 text-white" />
      </div>
      <ul className="space-y-3">
        {todos.map(task => (
          <li 
            key={task.id} 
            onClick={() => toggleTodo(task.id)}
            className={`flex items-center gap-3 text-sm group cursor-pointer ${task.completed ? 'text-on-surface' : 'text-on-surface-variant'}`}
          >
            {task.completed ? (
              <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded border border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors"></div>
            )}
            <span className={task.completed ? 'line-through opacity-50 text-white' : 'text-white'}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
