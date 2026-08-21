import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createDefaultBooklet, createCleanBooklet, getInitialBooklets } from '../data/defaultBooklet';
import { calculateBookletProgress } from '../utils/progress';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const BookletContext = createContext(null);

export function BookletProvider({ children }) {
  const { showToast } = useToast();
  
  // Render Backend Connectivity State
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  // Mobile Navigation Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Production local storage state keys initialized with 100% clean empty slate
  const [booklets, setBooklets] = useLocalStorage('d227_booklets_v900', []);
  const [activeBookletId, setActiveBookletId] = useLocalStorage('d227_active_booklet_id_v900', null);
  const [hasCreatedDemoMeeting, setHasCreatedDemoMeeting] = useLocalStorage('d227_has_created_demo_v900', false);
  const [theme, setTheme] = useLocalStorage('d227_theme_v3', 'light');

  // Check health of Render backend on startup
  useEffect(() => {
    api.checkHealth()
      .then(res => {
        if (res?.status === 'ONLINE') {
          setBackendStatus('online');
          console.log('[Backend] Deployed Render API connected:', api.baseUrl);
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => {
        setBackendStatus('offline');
      });
  }, []);

  // Purge all legacy local storage keys containing mock booklets from past versions
  useEffect(() => {
    const legacyKeys = [
      'd227_booklets_v200', 'd227_active_booklet_id_v200', 'd227_has_created_demo_v2',
      'd227_booklets_v100', 'd227_active_booklet_id_v100', 'd227_booklets',
      'd227_booklets_v300', 'd227_active_booklet_id_v300',
      'd227_booklets_v500', 'd227_active_booklet_id_v500'
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
    
    setBooklets(prev => {
      const mockIds = ['district-demo-1', 'up-1', 'up-2', 'up-3', 'comp-1', 'comp-2', 'comp-3', 'district-demo-booklet', 'corp-alp', 'corp-bet', 'district'];
      return (prev || []).filter(b => !mockIds.includes(b.id));
    });
  }, [setBooklets]);
  
  // Auth state with 5 official pre-configured Toastmasters Officer Users
  const INITIAL_OFFICERS = [
    {
      username: 'admin',
      password: 'password',
      name: 'System Administrator',
      email: 'admin@toastmasters.org',
      role: 'District Main Administrator',
      division: 'Div A / Area 01',
      district: 'Toastmasters International'
    },
    {
      username: 'nitasha',
      password: 'password',
      name: 'Nitasha Kumar',
      email: 'nitasha@toastmasters.org',
      role: 'District Director',
      division: 'Div A / Area 01',
      district: 'Toastmasters International'
    },
    {
      username: 'prashanth',
      password: 'password',
      name: 'Prashanth K',
      email: 'prashanth@toastmasters.org',
      role: 'Club Growth Director',
      division: 'Div B / Area 01',
      district: 'Toastmasters International'
    },
    {
      username: 'nagesh',
      password: 'password',
      name: 'Nagesh Ramamurthy',
      email: 'nagesh@toastmasters.org',
      role: 'CGB Pillar Lead',
      division: 'Div C / Area 01',
      district: 'Toastmasters International'
    },
    {
      username: 'pramod',
      password: 'password',
      name: 'Pramod K',
      email: 'pramod@toastmasters.org',
      role: 'DMO Task Force Lead',
      division: 'Div D / Area 01',
      district: 'Toastmasters International'
    }
  ];

  const [users, setUsers] = useLocalStorage('d227_users_v10', INITIAL_OFFICERS);
  const [currentUser, setCurrentUser] = useLocalStorage('d227_current_user_v10', null);

  // Booklet Undo/Redo stack state
  const [pastStates, setPastStates] = useState([]);
  const [futureStates, setFutureStates] = useState([]);

  // Notifications and Recent Activity state (Start 100% Clean)
  const [notifications, setNotifications] = useLocalStorage('d227_notifications_v10', []);
  const [activities, setActivities] = useLocalStorage('d227_activities_v10', []);

  // Sync dark mode HTML tag class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Filter booklets visible to current user (Draft privacy & no data overlap across logins)
  const visibleBooklets = booklets.filter(b => {
    if (!currentUser || currentUser.username === 'admin' || currentUser.role === 'District Main Administrator') {
      return true; // Super admin sees all booklets
    }
    // Creators see their own booklets (drafts & in-progress)
    if (b.createdBy === currentUser?.username) {
      return true;
    }
    // Non-creators only see completed/published booklets
    return b.status === 'completed' || b.completedPercent === 100;
  });

  // Get active booklet (ONLY select non-completed ongoing booklets for active segment forms)
  const ongoingBooklets = visibleBooklets.filter(b => b.status !== 'completed' && (b.completedPercent || 0) < 100);
  const isSuperAdmin = currentUser?.username === 'admin' || currentUser?.role === 'District Main Administrator';
  const activeBooklet = (hasCreatedDemoMeeting || isSuperAdmin)
    ? ongoingBooklets.find(b => b.id === activeBookletId) || ongoingBooklets[0] || null
    : null;

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

  // Auth functions with Password Validation & Change Password
  const loginUser = (username, password) => {
    const searchKey = (username || '').toLowerCase().trim();
    
    if (!password) {
      showToast("Please enter your password", "warning");
      return { success: false, error: 'Password is required.' };
    }

    let targetUser = users.find(u => u.username.toLowerCase() === searchKey);
    
    // Check preset admin fallback
    if (!targetUser && searchKey === 'admin') {
      targetUser = {
        username: 'admin',
        password: 'password',
        name: 'System Administrator',
        email: 'admin@toastmasters.org',
        role: 'District Main Administrator',
        division: 'Div A / Area 01',
        district: 'Toastmasters International'
      };
    }

    if (targetUser) {
      // Validate password match
      if (targetUser.password && targetUser.password !== password) {
        showToast("Invalid password. Please check your password.", "error");
        return { success: false, error: 'Invalid password. Please check your password.' };
      }
    } else {
      // Auto-register fallback for new username
      targetUser = {
        username: searchKey || 'officer',
        password: password || 'password',
        name: username || 'Toastmasters Leader',
        email: `${searchKey || 'officer'}@toastmasters.org`,
        role: 'Toastmasters Leader',
        division: 'Div A / Area 01',
        district: 'Toastmasters International'
      };
    }

    setCurrentUser(targetUser);
    
    // Fire API login to backend server
    api.login(username, password).catch(err => {
      console.warn('[API Auth Login]', err.message);
    });

    showToast(`Welcome back, ${targetUser.name}!`, "success");
    addActivity(`Logged in as ${targetUser.name} (${targetUser.role})`);
    return { success: true, user: targetUser };
  };

  const registerUser = (userData) => {
    const cleanUsername = (userData.username || '').toLowerCase().trim();
    const existing = users.find(u => u.username.toLowerCase() === cleanUsername);
    
    if (existing) {
      showToast(`Username "${userData.username}" is already taken.`, "warning");
      return { success: false, error: 'Username is already taken. Please sign in.' };
    }

    const newUser = {
      username: (userData.username || 'user').trim(),
      password: userData.password || 'password',
      name: userData.name || 'Toastmasters Leader',
      email: userData.email || 'officer@toastmasters.org',
      role: userData.role || 'Toastmasters Leader',
      division: userData.division || 'Div A / Area 01',
      district: userData.district || 'Toastmasters International'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    // Fire API register to backend
    api.register(newUser).catch(err => {
      console.warn('[API Auth Register]', err.message);
    });

    showToast(`Registered and logged in as ${newUser.name}!`, "success");
    addActivity(`Registered and logged in as ${newUser.name}`);
    return { success: true, user: newUser };
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    if (!currentUser) return { success: false, error: 'No user is currently logged in' };
    
    if (currentUser.password && currentUser.password !== currentPassword) {
      showToast("Current password is incorrect.", "error");
      return { success: false, error: 'Current password is incorrect' };
    }

    if (!newPassword || newPassword.length < 6) {
      showToast("New password must be at least 6 characters long.", "warning");
      return { success: false, error: 'New password must be at least 6 characters long' };
    }

    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.username === updatedUser.username ? updatedUser : u));

    try {
      await api.changePassword(currentPassword, newPassword);
    } catch (err) {
      console.warn('[API Change Password]', err.message);
    }

    showToast("Password updated successfully!", "success");
    addActivity(`Changed account password for ${currentUser.name}`);
    return { success: true };
  };

  const logoutUser = () => {
    if (currentUser) {
      addActivity(`Logged out from profile: ${currentUser.name}`);
    }
    setCurrentUser(null);
    showToast("Logged out successfully", "info");
  };

  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const mergedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(mergedUser);
    
    // Also update users array
    setUsers(prev => prev.map(u => u.username === mergedUser.username ? mergedUser : u));

    // Sync to MongoDB database via REST API
    api.updateProfile(mergedUser).catch(err => {
      console.warn('[Profile DB Sync] Saved locally, DB sync queued:', err.message);
    });

    showToast("Profile avatar & settings updated!", "success");
    addActivity(`Updated profile picture / settings for ${mergedUser.name}`);
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

  const createBooklet = (title, initialData = {}) => {
    pushStateToUndo(booklets);
    const creator = currentUser?.username || 'admin';
    const newBooklet = createCleanBooklet(null, title, { ...initialData, createdBy: creator });
    newBooklet.createdBy = creator;
    newBooklet.segment1Completed = false;
    newBooklet.segment2Completed = false;
    newBooklet.segment3Completed = false;

    setBooklets(prev => [newBooklet, ...prev]);
    setActiveBookletId(newBooklet.id);
    setHasCreatedDemoMeeting(true);
    addNotification(`Created new clean booklet "${title}"`);
    addActivity(`Created booklet "${title}"`);
    showToast("New clean booklet created! Previous meeting archived to History.");
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
        setActiveBookletId(null);
        setHasCreatedDemoMeeting(false);
      }
    }

    if (remaining.length === 0) {
      setHasCreatedDemoMeeting(false);
      setActiveBookletId(null);
    }

    if (target) {
      addNotification(`Deleted booklet "${target.title}"`);
      addActivity(`Deleted booklet "${target.title}"`);
      showToast(`Meeting "${target.title}" deleted. Workspace reset to clean state.`, "success");
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
    showToast("Booklet data exported to JSON file!");
  };

  // Import booklets data from a JSON file
  const importBookletsJSON = (importedData) => {
    try {
      if (Array.isArray(importedData) && importedData.length > 0) {
        setBooklets(importedData);
        setActiveBookletId(importedData[0].id);
        showToast("Sample booklet dataset successfully loaded!");
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
        booklets: visibleBooklets,
        allBooklets: booklets,
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
        updateUserProfile,
        changeUserPassword,
        canUndo: pastStates.length > 0,
        canRedo: futureStates.length > 0,
        undo,
        redo,
        hasCreatedDemoMeeting,
        setHasCreatedDemoMeeting,
        unlockDemoMeeting: () => setHasCreatedDemoMeeting(true),
        notifications,
        addNotification,
        clearNotifications,
        markNotificationsAsRead,
        activities,
        backendStatus,
        backendUrl: api.baseUrl,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        openMobileSidebar: () => setIsMobileSidebarOpen(true),
        closeMobileSidebar: () => setIsMobileSidebarOpen(false),
        toggleMobileSidebar: () => setIsMobileSidebarOpen(prev => !prev)
      }}
    >
      {children}
    </BookletContext.Provider>
  );
}

export function useBooklet() {
  const context = useContext(BookletContext);
  if (!context) {
    return {
      booklets: [],
      activeBooklet: null,
      currentUser: { id: 'usr-1', username: 'Toastmaster Leader', role: 'District Main Administrator', email: 'leader@d227.org' },
      selectBooklet: () => {},
      updateBookletPage: () => {},
      createBooklet: () => {},
      deleteBooklet: () => {},
      loginUser: () => {},
      logoutUser: () => {},
      undo: () => {},
      redo: () => {}
    };
  }
  return context;
}
