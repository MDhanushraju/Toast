import React, { useState, useRef, useEffect } from 'react';
import { useBooklet } from '../../context/BookletContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiSun, FiMoon, FiPrinter, FiBell, FiSearch, 
  FiChevronDown, FiCornerUpLeft, FiCornerUpRight, FiX, FiCheckSquare 
} from 'react-icons/fi';

export default function Header() {
  const { 
    activeBooklet, theme, setTheme, canUndo, canRedo, undo, redo, 
    notifications, clearNotifications, markNotificationsAsRead, booklets, selectBooklet
  } = useBooklet();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handlePrint = () => {
    if (location.pathname.startsWith('/booklet/')) {
      navigate('/print');
    } else {
      window.print();
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'SaaS booklet Hub';
      case '/settings': return 'App Configurations';
      case '/print': return 'Print Layout';
      case '/booklet/cover': return 'Cover Details';
      case '/booklet/quick-reference': return 'Quick Reference Guide';
      case '/booklet/before-meeting': return 'Before Meeting Prep';
      case '/booklet/arrangements': return 'Logistics Checklist';
      case '/booklet/during-meeting': return 'Session Execution';
      case '/booklet/outcome': return 'Outcome Capture';
      case '/booklet/tracker': return 'Demo Tracker Sheet';
      case '/booklet/data-sheet': return 'Booklet Data Sheet';
      default: return 'District 228 Manager';
    }
  };

  // Find booklets matching search queries
  const matchingBooklets = searchQuery.trim() === '' ? [] : booklets.filter(b => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (b.page3?.hostOrganization && b.page3.hostOrganization.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print">
      {/* Title */}
      <div className="flex flex-col">
        <h2 className="text-sm font-bold font-outfit text-slate-850 dark:text-slate-200 leading-tight">
          {getPageTitle()}
        </h2>
        {activeBooklet && location.pathname.startsWith('/booklet/') && (
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate max-w-[150px] sm:max-w-md">
            Editing: <span className="text-slate-600 dark:text-slate-350 font-bold">{activeBooklet.title}</span>
          </p>
        )}
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Undo / Redo controls */}
        <div className="flex items-center border-r border-slate-200 dark:border-slate-800 pr-3 sm:pr-4 gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            aria-label="Undo"
          >
            <FiCornerUpLeft size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            aria-label="Redo"
          >
            <FiCornerUpRight size={16} />
          </button>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search booklets..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-48 lg:w-64 px-4 py-1.5 pl-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
          <FiSearch size={14} className="absolute left-3.5 top-2.5 text-slate-450" />
          
          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 max-h-60 overflow-y-auto">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-1 border-b border-slate-100 dark:border-slate-900 mb-1">Search Results</div>
              {matchingBooklets.length === 0 ? (
                <div className="text-[10px] text-slate-400 p-2 text-center">No booklets match queries</div>
              ) : (
                matchingBooklets.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      selectBooklet(b.id);
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                      navigate('/booklet/cover');
                    }}
                    className="w-full text-left p-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <div className="font-semibold text-slate-850 dark:text-slate-200 truncate">{b.title}</div>
                    <div className="text-[9px] text-slate-400 truncate">{b.page3?.hostOrganization || 'No Host'}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2">
          {/* Print preview button */}
          {location.pathname.startsWith('/booklet/') && (
            <button
              onClick={handlePrint}
              title="Print preview"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <FiPrinter size={15} />
              <span className="hidden sm:inline">Print Booklet</span>
            </button>
          )}

          {/* Theme Toggler */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-655 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-colors"
            title="Toggle color theme"
          >
            {theme === 'light' ? <FiMoon size={15} /> : <FiSun size={15} />}
          </button>

          {/* Notifications Panel */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                markNotificationsAsRead();
              }}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-655 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-colors relative"
              title="Notifications panel"
            >
              <FiBell size={15} />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full flex items-center justify-center text-[7px] text-white font-bold">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-900 mb-1">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Alert Messages</span>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-[9px] text-red-500 hover:text-red-655 font-bold hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="text-[10px] text-slate-405 p-3 text-center">No alerts logged</div>
                ) : (
                  <div className="space-y-1.5">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2 rounded-lg text-[10px] ${n.read ? 'bg-transparent text-slate-500' : 'bg-brand-blue/5 text-slate-800 dark:text-slate-200 font-semibold'}`}>
                        <div className="leading-snug">{n.message}</div>
                        <div className="text-[8px] text-slate-400 mt-0.5">{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Block */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3 sm:pl-4">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex items-center justify-center font-bold text-xs text-brand-blue">
            PK
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Pramod K Murthy</div>
            <span className="text-[9px] text-slate-400 font-semibold">District 228 Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
