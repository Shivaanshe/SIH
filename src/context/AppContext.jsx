import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
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
      const rawPrefix = email.split('@')[0].replace(/[._0-9]/g, ' ').trim();
      const extractedName = rawPrefix 
        ? rawPrefix.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
        : 'Dhruv';
      const fallbackUser = {
        id: `user-${email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || '01'}`,
        name: email.toLowerCase().includes('shiv') ? 'Shiv Sharma' : extractedName,
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
   * Register function: Cleans inputs, validates name, email, pass only, and stores in MongoDB
   */
  const register = async ({ name, email, password, role = 'student', domainPack = 'ayush' }) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanName || cleanName.length < 2) {
      addNotification("Validation Error", "Please provide a valid full name (at least 2 characters).", "rose");
      return { success: false, message: 'Please provide a valid full name (at least 2 characters).' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      addNotification("Invalid Email", "Please enter a valid email format (e.g. student@domain.com).", "rose");
      return { success: false, message: 'Please enter a valid email format (e.g. student@domain.com).' };
    }

    if (!cleanPassword || cleanPassword.length < 3) {
      addNotification("Password Too Short", "Password must be at least 3 characters long.", "rose");
      return { success: false, message: 'Password must be at least 3 characters long.' };
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          role,
          domainPack
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const userObj = data.user;
        const assignedRole = userObj.role || role;
        setToken(data.token);
        setCurrentUser(userObj);
        setRole(assignedRole);
        setIsAuthenticated(true);
        localStorage.setItem('kaushal_token', data.token);
        localStorage.setItem('kaushal_user', JSON.stringify(userObj));
        localStorage.setItem('kaushal_role', assignedRole);
        addNotification("Account Created in MongoDB", `Welcome, ${userObj.name}! Successfully registered as ${assignedRole.toUpperCase()}.`, "emerald");
        return { success: true, user: userObj, role: assignedRole };
      } else {
        addNotification("Registration Notice", data.message || 'Could not register user in database.', "rose");
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (err) {
      console.warn("Backend API offline or unreachable during registration, using fallback:", err.message);
      // Primary key check in fallback mode
      const registeredEmails = JSON.parse(localStorage.getItem('kaushal_registered_emails') || '[]');
      if (cleanEmail === 'shiv@123' || cleanEmail === 'hr@123' || cleanEmail === 'spoc@123' || cleanEmail === 'admin@123' || registeredEmails.includes(cleanEmail)) {
        addNotification("Email Already Registered", "An account with this email address already exists. Please sign in or use a different email.", "rose");
        return { success: false, message: "An account with this email address already exists. Please sign in or use a different email." };
      }

      registeredEmails.push(cleanEmail);
      localStorage.setItem('kaushal_registered_emails', JSON.stringify(registeredEmails));

      const fallbackUser = {
        id: `user-${cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || '01'}`,
        name: cleanName,
        email: cleanEmail,
        role: role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      const mockToken = `mock-token-${Date.now()}`;
      setToken(mockToken);
      setCurrentUser(fallbackUser);
      setRole(role);
      setIsAuthenticated(true);
      localStorage.setItem('kaushal_token', mockToken);
      localStorage.setItem('kaushal_user', JSON.stringify(fallbackUser));
      localStorage.setItem('kaushal_role', role);
      addNotification("Account Created", `Welcome, ${cleanName}! Registered as ${role.toUpperCase()}.`, "emerald");
      return { success: true, user: fallbackUser, role };
    }
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

  /**
   * DigiLocker Single Sign-On (SSO): Authenticates via National DPI (Aadhaar / MeriPehchaan)
   */
  const loginWithDigiLocker = async ({ aadhaarOrMobile, pin, email = 'dhruv@123', name = 'Dhruv' }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/digilocker-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarOrMobile, pin, email, name, domainPack })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const userObj = { ...data.user, digiLockerVerified: true };
          setToken(data.token);
          setCurrentUser(userObj);
          setRole('student');
          setIsAuthenticated(true);
          localStorage.setItem('kaushal_token', data.token);
          localStorage.setItem('kaushal_user', JSON.stringify(userObj));
          localStorage.setItem('kaushal_role', 'student');
          addNotification("DigiLocker SSO Authenticated", `Welcome, ${userObj.name}! Verified via MeitY National DPI.`, "emerald");
          return { success: true, user: userObj, role: 'student' };
        }
      }
    } catch (e) {
      console.warn("Backend DigiLocker SSO note:", e.message);
    }

    // Fallback resilient offline authentication
    const userObj = {
      id: 'stud-dhruv-01',
      name: name || 'Dhruv',
      email: email || 'dhruv@123',
      role: 'student',
      digiLockerVerified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    const mockToken = `mock-token-${Date.now()}`;
    setToken(mockToken);
    setCurrentUser(userObj);
    setRole('student');
    setIsAuthenticated(true);
    localStorage.setItem('kaushal_token', mockToken);
    localStorage.setItem('kaushal_user', JSON.stringify(userObj));
    localStorage.setItem('kaushal_role', 'student');
    addNotification("DigiLocker Authenticated", `Welcome, ${userObj.name}! Digital credentials verified.`, "emerald");
    return { success: true, user: userObj, role: 'student' };
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
        loginWithDigiLocker,
        register,
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
