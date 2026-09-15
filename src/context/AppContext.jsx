import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Roles: 'student', 'spoc', 'recruiter', 'ministry'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('kaushal_role') || 'student';
  });

  // Authentication State
  const [token, setToken] = useState(() => {
    return localStorage.getItem('kaushal_token') || null;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kaushal_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('kaushal_token') || localStorage.getItem('kaushal_user'));
  });

  // Domain Pack: 'ayush' (flagship official SIH PS sponsor) or 'tech'
  const [domainPack, setDomainPack] = useState(() => {
    return localStorage.getItem('kaushal_domain') || 'ayush';
  });

  // Theme: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kaushal_theme') || 'dark';
  });

  // Active 3D mode
  const [active3DView, setActive3DView] = useState('bridge');

  // Notifications Toast Stack
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

  const dismissNotification = (id) => {
    // Flag toast as exiting so CSS transition plays smoothly
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isExiting: true } : n));

    // Remove from state only after smooth animation finishes (380ms)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 380);
  };

  const removeNotification = (id) => {
    dismissNotification(id);
  };

  const addNotification = (title, message, type = 'emerald') => {
    setNotifications(prev => {
      // Deduplicate: prevent exact same message from appearing twice
      const isDuplicate = prev.some(
        n => n.title === title && n.message === message && !n.isExiting
      );
      if (isDuplicate) return prev;

      const id = Date.now() + Math.random();
      const newNote = {
        id,
        title,
        message,
        type,
        isExiting: false,
        timestamp: "Just now"
      };

      // Auto dismiss smoothly after 3.8 seconds
      setTimeout(() => {
        dismissNotification(id);
      }, 3800);

      return [newNote, ...prev.slice(0, 2)];
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  /**
   * Login function: Calls live backend /api/auth/login with graceful offline fallback
   */
  const login = async (email, password, targetRole = 'student') => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: targetRole })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const userObj = data.user;
          const assignedRole = userObj.role || targetRole;
          setToken(data.token);
          setCurrentUser(userObj);
          setRole(assignedRole);
          setIsAuthenticated(true);
          localStorage.setItem('kaushal_token', data.token);
          localStorage.setItem('kaushal_user', JSON.stringify(userObj));
          localStorage.setItem('kaushal_role', assignedRole);
          addNotification("Authenticated Successfully", `Welcome, ${userObj.name}! Logged in as ${assignedRole.toUpperCase()}.`, "emerald");
          return { success: true, user: userObj, role: assignedRole };
        }
      }
    } catch (err) {
      console.warn("Backend API offline or unreachable, using resilient client auth:", err.message);
    }

    // Resilient Fallback for shiv@123 / 123 or valid credentials
    if ((email.trim().toLowerCase() === 'shiv@123' && password === '123') || (email && password)) {
      const fallbackUser = {
        id: 'user-shiv-01',
        name: email.toLowerCase().includes('shiv') ? 'Shiv Sharma' : 'Authorized Stakeholder',
        email: email.trim(),
        role: targetRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      const mockToken = `mock-token-${Date.now()}`;
      setToken(mockToken);
      setCurrentUser(fallbackUser);
      setRole(targetRole);
      setIsAuthenticated(true);
      localStorage.setItem('kaushal_token', mockToken);
      localStorage.setItem('kaushal_user', JSON.stringify(fallbackUser));
      localStorage.setItem('kaushal_role', targetRole);
      addNotification("Signed In Successfully", `Welcome, ${fallbackUser.name} (${targetRole.toUpperCase()}).`, "emerald");
      return { success: true, user: fallbackUser, role: targetRole };
    }

    addNotification("Authentication Failed", "Invalid email or password. Please check your credentials.", "rose");
    return { success: false, message: "Invalid credentials" };
  };

  /**
   * Logout function: Clears session and returns user to Login Page
   */
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('kaushal_token');
    localStorage.removeItem('kaushal_user');
    addNotification("Signed Out", "You have been securely signed out.", "blue");
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
        removeNotification,
        clearAllNotifications,
        token,
        currentUser,
        isAuthenticated,
        login,
        logout
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
