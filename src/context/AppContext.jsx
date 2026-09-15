import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Roles: 'student', 'spoc', 'recruiter', 'ministry'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('kaushal_role') || 'student';
  });

  // Domain Pack: 'ayush' (flagship official SIH PS sponsor) or 'tech'
  const [domainPack, setDomainPack] = useState(() => {
    return localStorage.getItem('kaushal_domain') || 'ayush';
  });

  // Theme: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kaushal_theme') || 'dark';
  });

  // 3D Experience Mode: 'bridge' (Hero Bridge), 'constellation' (Skill Galaxy 3D), 'anatomy' (Holographic Clinical)
  const [active3DView, setActive3DView] = useState('bridge');

  // Notifications Toast Stack (Starts empty, auto-dismisses after 4 seconds)
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem('kaushal_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('kaushal_domain', domainPack);
  }, [domainPack]);

  useEffect(() => {
    localStorage.setItem('kaushal_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (title, message, type = 'emerald') => {
    const id = Date.now() + Math.random();
    const newNote = {
      id,
      title,
      message,
      type,
      timestamp: "Just now"
    };

    setNotifications(prev => [newNote, ...prev.slice(0, 2)]);

    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        domainPack,
        setDomainPack,
        theme,
        setTheme,
        active3DView,
        setActive3DView,
        notifications,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
