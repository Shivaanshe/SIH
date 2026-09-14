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

  // Notifications Toast Stack
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Ministry of Ayush / AIIA Alignment",
      message: "AYUSH Domain Pack loaded with 7 core clinical competencies & AIIA guidelines.",
      type: "emerald",
      timestamp: "Just now"
    }
  ]);

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

  const addNotification = (title, message, type = 'emerald') => {
    const newNote = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: "Just now"
    };
    setNotifications(prev => [newNote, ...prev.slice(0, 4)]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
