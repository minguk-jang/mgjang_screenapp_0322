import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const DesktopContext = createContext();

export function DesktopProvider({ children }) {
  const [activeFolder, setActiveFolder] = useState(null);
  
  const [todos, setTodos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef(null);

  const toggleSettings = () => setIsSettingsOpen(prev => !prev);

  useEffect(() => {
    const initializeData = async () => {
      if (window.api && window.api.loadData) {
        const data = await window.api.loadData();
        setTodos(data.todos || []);
        setFolders(data.folders || []);
        setQuickLinks(data.quickLinks || []);
        setSchedule(data.schedule || []);
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
        await window.api.saveData({ todos, folders, quickLinks, schedule });
        console.log('Data saved successfully');
      } catch (err) {
        console.error('Failed to save data:', err);
      }
    }, 1000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [todos, folders, quickLinks, schedule, isLoaded]);

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleFolder = (id) => {
    setActiveFolder(prev => prev === id ? null : id);
  };

  const addFolder = (folderData) => {
    setFolders(prev => [...prev, { id: 'folder_' + Date.now(), name: folderData.name, absolutePath: folderData.absolutePath }]);
  };

  const removeFolder = (id) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const addQuickLink = (link) => {
    setQuickLinks(prev => [...prev, { ...link, id: 'link_' + Date.now() }]);
  };

  const removeQuickLink = (id) => {
    setQuickLinks(prev => prev.filter(l => l.id !== id));
  };

  const addScheduleItem = (item) => {
    setSchedule(prev => [...prev, { ...item, id: 'sched_' + Date.now() }]);
  };

  const removeScheduleItem = (id) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  const updateSchedule = (newSchedule) => {
    setSchedule(newSchedule);
  };

  // Optionally render a loading state or nothing until data is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <DesktopContext.Provider value={{ 
      activeFolder, toggleFolder, todos, toggleTodo, folders, quickLinks, schedule,
      isSettingsOpen, toggleSettings, addFolder, removeFolder,
      addQuickLink, removeQuickLink, addScheduleItem, removeScheduleItem, updateSchedule
    }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  return useContext(DesktopContext);
}
