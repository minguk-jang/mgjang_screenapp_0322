import Schedule from './components/Schedule';
import ToDo from './components/ToDo';

export default function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white overflow-hidden pointer-events-auto flex">
      {/* 
        Left-Aligned Permanent Widgets Column
        Adding some padding and a subtle fade mask for polish.
      */}
      <div className="flex flex-col h-full w-96 pl-8 py-8 shrink-0 overflow-y-auto no-scrollbar mask-image-fade">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <Schedule />
          <ToDo />
        </div>
      </div>
      
      {/* Center/Desktop Area for future Icons */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Placeholder text for the current state */}
        <h1 className="text-5xl font-bold text-white/10 select-none tracking-widest uppercase">
          Desktop Surface
        </h1>
      </div>
    </div>
  );
}
