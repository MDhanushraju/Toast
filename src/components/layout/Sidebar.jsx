import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useBooklet } from '../../context/BookletContext';
import { PAGES } from '../../constants';
import { 
  FiHome, FiBookOpen, FiFileText, FiCheckSquare, 
  FiCalendar, FiPlay, FiAward, FiList, FiSettings, 
  FiMenu, FiX, FiPlus, FiChevronDown, FiDatabase, FiLogOut 
} from 'react-icons/fi';

export default function Sidebar() {
  const { booklets, activeBooklet, selectBooklet, createBooklet, currentUser, logoutUser } = useBooklet();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleCreateNew = () => {
    const title = prompt("Enter a title for the new Booklet:", "New Demo Meeting Booklet");
    if (title && title.trim() !== '') {
      const newId = createBooklet(title);
      navigate('/booklet/cover');
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      logoutUser();
      navigate('/');
    }
  };

  // Nav icons mapper
  const getIcon = (pageNum) => {
    switch (pageNum) {
      case 1: return FiBookOpen;
      case 2: return FiFileText;
      case 3: return FiCheckSquare;
      case 4: return FiCalendar;
      case 5: return FiPlay;
      case 6: return FiAward;
      case 7: return FiList;
      case 8: return FiDatabase;
      default: return FiFileText;
    }
  };

  return (
    <>
      {/* Mobile Toggle Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-blue/15">
            D
          </div>
          <span className="font-outfit font-extrabold text-slate-800 dark:text-slate-200 text-sm">District 228</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-805"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transform lg:transform-none transition-transform duration-300 ease-in-out no-print flex flex-col justify-between
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-navy flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-brand-blue/20">
                D
              </div>
              <div>
                <h1 className="font-outfit font-extrabold text-slate-900 dark:text-slate-100 text-base leading-tight">District 228</h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider">Booklet Hub</p>
              </div>
            </div>
            <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {/* Active booklet selector */}
          {activeBooklet && (
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 relative">
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-2">Active Booklet</div>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-left hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="truncate pr-2">
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-250 truncate">{activeBooklet.title}</div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-500 truncate">{activeBooklet.page3?.hostOrganization || 'No Host Org'}</div>
                </div>
                <FiChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {booklets.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        selectBooklet(b.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-b border-slate-100 dark:border-slate-900 last:border-0 ${b.id === activeBooklet.id ? 'bg-brand-blue/5 text-brand-blue font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      <div className="truncate">{b.title}</div>
                      <div className="text-[10px] text-slate-455">{b.createdAt} • {b.completedPercent}% complete</div>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      handleCreateNew();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left p-3 text-xs text-brand-blue hover:bg-brand-blue/5 transition-colors font-bold flex items-center gap-2 border-t border-slate-100 dark:border-slate-905"
                  >
                    <FiPlus size={14} /> Create New Booklet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250
                ${isActive 
                  ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20' 
                  : 'text-slate-605 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
            >
              <FiHome size={16} />
              <span>Dashboard</span>
            </NavLink>

            {activeBooklet && PAGES.map(item => {
              const Icon = getIcon(item.pageNum);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250
                    ${isActive 
                      ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20' 
                      : 'text-slate-605 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:text-slate-900 dark:hover:text-slate-200'}
                  `}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-250
                ${isActive 
                  ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20' 
                  : 'text-slate-605 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
            >
              <FiSettings size={16} />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* User Card & Completion Progress Widget */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-805 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
          
          {/* User profile details with Profile Avatar Icon and logout next to it */}
          {currentUser && (
            <div className="flex flex-col gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Profile Icon / Avatar */}
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue flex items-center justify-center font-extrabold text-xs shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-850 dark:text-slate-200 truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold truncate">
                    {currentUser.areaDirectorOf ? `${currentUser.areaDirectorOf} • ` : ''}
                    {currentUser.division || ''}
                  </div>
                </div>

                {/* Logout Button right next to it */}
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <FiLogOut size={14} />
                </button>
              </div>

              <div className="text-[8px] text-slate-450 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-805 pt-1 truncate">
                {currentUser.district || 'District 228'}
              </div>
            </div>
          )}

          {activeBooklet && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider">Booklet Progress</span>
                <span className="text-xs font-extrabold text-brand-blue">{activeBooklet.completedPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-blue h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${activeBooklet.completedPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
