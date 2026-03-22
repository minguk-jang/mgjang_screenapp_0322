import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const DesktopContext = createContext();

export function DesktopProvider({ children }) {
  const [activeFolder, setActiveFolder] = useState(null);
  const [userName, setUserName] = useState("System Admin");
  const [clipboardItems, setClipboardItems] = useState([]);
  
  const [todos, setTodos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const defaultWeeklySchedule = {
    periods: [
      { name: "1교시", time: "09:00~09:40" },
      { name: "2교시", time: "09:50~10:30" },
      { name: "3교시", time: "10:40~11:20" },
      { name: "4교시", time: "11:30~12:10" },
      { name: "5교시", time: "13:00~13:40" },
      { name: "6교시", time: "13:50~14:30" }
    ],
    grid: {
      1: [{ subject: '국어', room: '1반' }, { subject: '영어', room: '1반' }, { subject: '수학', room: '1반' }, { subject: '사회', room: '1반' }, { subject: '체육', room: '운동장' }, { subject: '음악', room: '음악실' }], // Mon
      2: [{ subject: '수학', room: '1반' }, { subject: '과학', room: '과학실' }, { subject: '국어', room: '1반' }, { subject: '미술', room: '미술실' }, { subject: '미술', room: '미술실' }, { subject: '영어', room: '1반' }], // Tue
      3: [{ subject: '체육', room: '강당' }, { subject: '수학', room: '1반' }, { subject: '창체', room: '1반' }, { subject: '창체', room: '1반' }, { subject: '', room: '' }, { subject: '', room: '' }], // Wed
      4: [{ subject: '영어', room: '1반' }, { subject: '국어', room: '1반' }, { subject: '실과', room: '실습실' }, { subject: '실과', room: '실습실' }, { subject: '수학', room: '1반' }, { subject: '도덕', room: '1반' }], // Thu
      5: [{ subject: '과학', room: '과학실' }, { subject: '수학', room: '1반' }, { subject: '국어', room: '1반' }, { subject: '자율', room: '1반' }, { subject: '동아리', room: '1반' }, { subject: '동아리', room: '1반' }]  // Fri
    }
  };
  const [weeklySchedule, setWeeklySchedule] = useState(defaultWeeklySchedule);
  const [lastScheduleDate, setLastScheduleDate] = useState("");


  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const saveTimeoutRef = useRef(null);

  const toggleLock = () => setIsLocked(prev => !prev);

  const toggleSettings = () => setIsSettingsOpen(prev => !prev);

  useEffect(() => {
    const initializeData = async () => {
      if (window.api && window.api.loadData) {
        const data = await window.api.loadData();
        setTodos(data.todos || []);
        setFolders(data.folders || []);
        setQuickLinks(data.quickLinks || []);
        const loadedWeekly = data.weeklySchedule || defaultWeeklySchedule;
        setWeeklySchedule(loadedWeekly);
        
        const todayStr = new Date().toDateString();
        // If it's a new day, load from weekly template
        if (data.lastScheduleDate !== todayStr) {
          const todayIdx = new Date().getDay();
          const baseGrid = loadedWeekly.grid[todayIdx] || [];
          const periods = loadedWeekly.periods;
          
          const newTodaySchedule = baseGrid.map((cell, idx) => {
             if (!cell || !cell.subject || cell.subject.trim() === '') return null;
             return { id: 'sched_' + Date.now() + '_' + idx, period: periods[idx].name, time: periods[idx].time, subject: cell.subject, room: cell.room || '' };
          }).filter(Boolean);
          
          setSchedule(newTodaySchedule);
          setLastScheduleDate(todayStr);
        } else {
          setSchedule(data.schedule || []);
          setLastScheduleDate(data.lastScheduleDate || todayStr);
        }
        
        setUserName(data.userName || "System Admin");
        setClipboardItems(data.clipboardItems || []);
      }
      setIsLoaded(true);
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (!isLoaded || !window.api || !window.api.saveData) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await window.api.saveData({ todos, folders, quickLinks, schedule, weeklySchedule, userName, clipboardItems, lastScheduleDate });
        console.log('Data saved successfully');
      } catch (err) {
        console.error('Failed to save data:', err);
      }
    }, 1000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [todos, folders, quickLinks, schedule, weeklySchedule, userName, clipboardItems, lastScheduleDate, isLoaded]);

  const toggleTodo = (id) => {
    if (isLocked) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = (text) => {
    if (isLocked) return;
    setTodos(prev => [...prev, { id: 'todo_' + Date.now(), text, completed: false }]);
  };

  const removeTodo = (id) => {
    if (isLocked) return;
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const addClipboardItem = (text) => {
    if (isLocked) return;
    setClipboardItems(prev => [...prev, { id: 'clip_' + Date.now(), text }]);
  };

  const removeClipboardItem = (id) => {
    if (isLocked) return;
    setClipboardItems(prev => prev.filter(c => c.id !== id));
  };

  const toggleFolder = (id) => {
    if (isLocked) return;
    setActiveFolder(prev => prev === id ? null : id);
  };

  const addFolder = (folderData) => {
    if (isLocked) return;
    setFolders(prev => [...prev, { id: 'folder_' + Date.now(), name: folderData.name, absolutePath: folderData.absolutePath }]);
  };

  const removeFolder = (id) => {
    if (isLocked) return;
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const addQuickLink = (link) => {
    if (isLocked) return;
    setQuickLinks(prev => [...prev, { ...link, id: 'link_' + Date.now() }]);
  };

  const removeQuickLink = (id) => {
    if (isLocked) return;
    setQuickLinks(prev => prev.filter(l => l.id !== id));
  };

  const addScheduleItem = (item) => {
    if (isLocked) return;
    setSchedule(prev => [...prev, { ...item, id: 'sched_' + Date.now() }]);
  };

  const removeScheduleItem = (id) => {
    if (isLocked) return;
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const updateSchedule = (newSchedule) => {
    if (isLocked) return;
    setSchedule(newSchedule);
  };

  const updateWeeklySchedule = (newWeeklySchedule) => {
    if (isLocked) return;
    setWeeklySchedule(newWeeklySchedule);
  };

  // Optionally render a loading state or nothing until data is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <DesktopContext.Provider value={{ 
      activeFolder, toggleFolder, todos, toggleTodo, addTodo, removeTodo, folders, quickLinks, schedule,
      userName, setUserName, clipboardItems, addClipboardItem, removeClipboardItem,
      isSettingsOpen, toggleSettings, addFolder, removeFolder,
      addQuickLink, removeQuickLink, addScheduleItem, removeScheduleItem, updateSchedule,
      weeklySchedule, updateWeeklySchedule,
      isLocked, toggleLock
    }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  return useContext(DesktopContext);
}
