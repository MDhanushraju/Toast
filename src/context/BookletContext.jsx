import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createDefaultBooklet, createCleanBooklet, getInitialBooklets } from '../data/defaultBooklet';
import { calculateBookletProgress } from '../utils/progress';
import { useToast } from './ToastContext';

const BookletContext = createContext(null);

export function BookletProvider({ children }) {
  const { showToast } = useToast();
  
  // Local storage state keys
  const [booklets, setBooklets] = useLocalStorage('d227_booklets_v3', getInitialBooklets());
  const [activeBookletId, setActiveBookletId] = useLocalStorage('d227_active_booklet_id_v3', 'corp-alpha-booklet');
  const [theme, setTheme] = useLocalStorage('d227_theme_v3', 'light');
  
  // Auth state
  const [users, setUsers] = useLocalStorage('d227_users_v3', [
    {
      username: 'admin',
      password: 'password',
      name: 'Pramod K Murthy',
      email: 'admin@d227.org',
      areaDirectorOf: 'Area 12',
      division: 'Division A',
      divisionDirectorName: 'Prashant',
      district: 'District 227'
    }
  ]);
  const [currentUser, setCurrentUser] = useLocalStorage('d227_current_user_v3', null);

  // Booklet Undo/Redo stack state
  const [pastStates, setPastStates] = useState([]);
  const [futureStates, setFutureStates] = useState([]);

  // Notifications and Recent Activity state
  const [notifications, setNotifications] = useLocalStorage('d227_notifications', [
    { id: 'not-1', message: 'Corporation Alpha Booklet initialized', time: '10 mins ago', read: false },
    { id: 'not-2', message: 'Welcome to District 227 Booklet App', time: '1 hour ago', read: true }
  ]);
  const [activities, setActivities] = useLocalStorage('d227_activities', [
    { id: 'act-1', message: 'Updated Cover Page settings', time: 'Just now' },
    { id: 'act-2', message: 'Signed off Page 3 approvals', time: 'Yesterday' }
  ]);

  // Sync dark mode HTML tag class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Get active booklet
  const activeBooklet = booklets.find(b => b.id === activeBookletId) || booklets[0] || null;

  // Add notification helper
  const addNotification = useCallback((message) => {
    const newNot = {
      id: `not-${Date.now()}`,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNot, ...prev]);
  }, [setNotifications]);

  // Add activity helper
  const addActivity = useCallback((message) => {
    const newAct = {
      id: `act-${Date.now()}`,
      message,
      time: 'Just now'
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]); // Cap at 20 items
  }, [setActivities]);

  // Auth functions (Bypassed credentials check as requested!)
  const loginUser = (username, password) => {
    const mockUser = {
      username: username || 'admin',
      password: password || 'password',
      name: username || 'Pramod K Murthy',
      email: `${username || 'admin'}@d227.org`,
      areaDirectorOf: 'Area 12',
      division: 'Division A',
      divisionDirectorName: 'Prashant',
      district: 'District 227'
    };
    setCurrentUser(mockUser);
    showToast(`Welcome, ${mockUser.name}!`, "success");
    addActivity(`Logged in as ${mockUser.name}`);
    return { success: true };
  };

  const registerUser = (userData) => {
    const mockUser = {
      username: userData.username || 'admin',
      password: userData.password || 'password',
      name: userData.name || 'District Officer',
      email: userData.email || 'officer@d227.org',
      areaDirectorOf: userData.areaDirectorOf || 'Area 12',
      division: userData.division || 'Division A',
      divisionDirectorName: userData.divisionDirectorName || 'Prashant',
      district: userData.district || 'District 227'
    };
    setCurrentUser(mockUser);
    showToast(`Welcome, ${mockUser.name}!`, "success");
    addActivity(`Registered and logged in as ${mockUser.name}`);
    return { success: true };
  };

  const logoutUser = () => {
    if (currentUser) {
      addActivity(`Logged out from profile: ${currentUser.name}`);
    }
    setCurrentUser(null);
    showToast("Logged out successfully", "info");
  };

  // Push state to undo history
  const pushStateToUndo = useCallback((currentState) => {
    setPastStates(prev => [...prev, JSON.parse(JSON.stringify(currentState))]);
    setFutureStates([]); // Clear redo stack on new action
  }, []);

  // Global Undo Action
  const undo = useCallback(() => {
    if (pastStates.length === 0) return;
    
    const prev = pastStates[pastStates.length - 1];
    const newPast = pastStates.slice(0, pastStates.length - 1);
    
    setFutureStates(f => [JSON.parse(JSON.stringify(booklets)), ...f]);
    setPastStates(newPast);
    setBooklets(prev);
    showToast("Action undone", "info");
  }, [pastStates, booklets, setBooklets, showToast]);

  // Global Redo Action
  const redo = useCallback(() => {
    if (futureStates.length === 0) return;
    
    const next = futureStates[0];
    const newFuture = futureStates.slice(1);
    
    setPastStates(p => [...p, JSON.parse(JSON.stringify(booklets))]);
    setFutureStates(newFuture);
    setBooklets(next);
    showToast("Action redone", "info");
  }, [futureStates, booklets, setBooklets, showToast]);

  const selectBooklet = (id) => {
    if (booklets.some(b => b.id === id)) {
      setActiveBookletId(id);
      addActivity(`Switched active booklet to "${booklets.find(b => b.id === id).title}"`);
    }
  };

  const createBooklet = (title) => {
    pushStateToUndo(booklets);
    const newBooklet = createCleanBooklet(null, title);
    setBooklets(prev => [newBooklet, ...prev]);
    setActiveBookletId(newBooklet.id);
    addNotification(`Created new booklet "${title}"`);
    addActivity(`Created booklet "${title}"`);
    showToast("New booklet created successfully!");
    return newBooklet.id;
  };

  const duplicateBooklet = (id) => {
    pushStateToUndo(booklets);
    const source = booklets.find(b => b.id === id);
    if (!source) return;
    const duplicated = {
      ...JSON.parse(JSON.stringify(source)),
      id: `booklet-${Date.now()}`,
      title: `${source.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setBooklets(prev => [duplicated, ...prev]);
    setActiveBookletId(duplicated.id);
    addNotification(`Duplicated booklet "${source.title}"`);
    addActivity(`Duplicated booklet "${source.title}"`);
    showToast("Booklet duplicated successfully!");
  };

  const deleteBooklet = (id) => {
    pushStateToUndo(booklets);
    const target = booklets.find(b => b.id === id);
    const remaining = booklets.filter(b => b.id !== id);
    setBooklets(remaining);
    
    if (activeBookletId === id) {
      if (remaining.length > 0) {
        setActiveBookletId(remaining[0].id);
      } else {
        const fallback = createDefaultBooklet(null, "District Meeting Booklet");
        setBooklets([fallback]);
        setActiveBookletId(fallback.id);
      }
    }

    if (target) {
      addNotification(`Deleted booklet "${target.title}"`);
      addActivity(`Deleted booklet "${target.title}"`);
      showToast(`Booklet "${target.title}" deleted.`);
    }
  };

  const resetBooklet = (id) => {
    pushStateToUndo(booklets);
    const target = booklets.find(b => b.id === id);
    if (!target) return;
    const blank = createDefaultBooklet(id, target.title);
    updateBooklet(id, blank);
    addActivity(`Reset booklet "${target.title}" content`);
    showToast("Active booklet reset to template.");
  };

  // Functional updateBooklet ensuring atomic state updates
  const updateBooklet = useCallback((id, updatedData) => {
    setBooklets(prevBooklets => {
      return prevBooklets.map(b => {
        if (b.id === id) {
          const merged = { 
            ...b, 
            ...updatedData, 
            updatedAt: new Date().toISOString().split('T')[0] 
          };
          merged.completedPercent = calculateBookletProgress(merged);
          return merged;
        }
        return b;
      });
    });
  }, [setBooklets]);

  const updateBookletPage = useCallback((pageName, pageData) => {
    if (!activeBookletId) return;
    setBooklets(prevBooklets => {
      return prevBooklets.map(b => {
        if (b.id === activeBookletId) {
          const updatedPageObj = {
            ...b[pageName],
            ...pageData
          };
          const merged = {
            ...b,
            [pageName]: updatedPageObj,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          merged.completedPercent = calculateBookletProgress(merged);
          return merged;
        }
        return b;
      });
    });
  }, [activeBookletId, setBooklets]);

  const resetAllData = () => {
    pushStateToUndo(booklets);
    setBooklets(getInitialBooklets());
    setActiveBookletId('corp-alpha-booklet');
    addNotification("Restored systems to mock seeds");
    addActivity("Wiped database, re-seeded elements");
    showToast("All data reset to seeds.");
  };

  const clearNotifications = () => setNotifications([]);
  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Export all booklets data to a JSON file
  const exportBookletsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(booklets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `District227_Booklets_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📥 Booklet data exported to JSON file!");
  };

  // Import booklets data from a JSON file
  const importBookletsJSON = (importedData) => {
    try {
      if (Array.isArray(importedData) && importedData.length > 0) {
        setBooklets(importedData);
        setActiveBookletId(importedData[0].id);
        showToast("📤 Sample booklet dataset successfully loaded!");
      } else {
        showToast("Invalid JSON file format", "error");
      }
    } catch (err) {
      showToast("Failed to parse imported JSON file", "error");
    }
  };

  return (
    <BookletContext.Provider
      value={{
        booklets,
        activeBooklet,
        activeBookletId,
        selectBooklet,
        createBooklet,
        duplicateBooklet,
        deleteBooklet,
        resetBooklet,
        updateBooklet,
        updateBookletPage,
        resetAllData,
        exportBookletsJSON,
        importBookletsJSON,
        theme,
        setTheme,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        canUndo: pastStates.length > 0,
        canRedo: futureStates.length > 0,
        undo,
        redo,
        notifications,
        addNotification,
        clearNotifications,
        markNotificationsAsRead,
        activities
      }}
    >
      {children}
    </BookletContext.Provider>
  );
}

export function useBooklet() {
  const context = useContext(BookletContext);
  if (!context) {
    throw new Error('useBooklet must be used within a BookletProvider');
  }
  return context;
}
