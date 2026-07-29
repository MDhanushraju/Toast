import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useBooklet } from '../../context/BookletContext';
import { 
  FiHome, FiClipboard, FiClock, FiBarChart2, FiSettings, 
  FiPlus, FiUser, FiLogOut, FiUsers, FiZap, FiArchive,
  FiMic, FiAward, FiCheckSquare, FiShare2, FiX
} from 'react-icons/fi';

export default function Sidebar() {
  const { activeBooklet, createBooklet, currentUser, logoutUser } = useBooklet();
  const navigate = useNavigate();
  const [showNewBookletModal, setShowNewBookletModal] = useState(false);
  const [bookletTitle, setBookletTitle] = useState('');

  const handleOpenNewModal = () => {
    setBookletTitle(`District 227 Meeting #${Math.floor(1000 + Math.random() * 9000)}`);
    setShowNewBookletModal(true);
  };

  const handleConfirmCreateBooklet = (e) => {
    e.preventDefault();
    const title = bookletTitle.trim() || "District Meeting Booklet";
    createBooklet(title);
    setShowNewBookletModal(false);
    setBookletTitle('');
    navigate('/booklet/segment-1');
  };

  const navItems = [
    { name: '1. Before Meeting', path: '/booklet/segment-1', icon: FiClipboard },
    { name: '2. During Meeting', path: '/booklet/segment-2', icon: FiClock },
    { name: '3. After Meeting', path: '/booklet/segment-3', icon: FiBarChart2 }
  ];

  return (
    <aside className="w-full lg:w-72 bg-[#006094] text-white flex flex-col justify-between shrink-0 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 z-40 shadow-xl no-print border-r border-[#003a5c]">
      
      {/* Header Container */}
      <div className="p-6 flex flex-col gap-3.5 border-b border-white/15">
        <div className="text-left">
          <span className="text-[11px] font-black text-white/80 uppercase tracking-widest block font-montserrat">
            TOASTMASTERS INTERNATIONAL
          </span>
          <h1 className="text-xl font-black font-montserrat text-white uppercase tracking-wider mt-0.5">
            DISTRICT 227
          </h1>
        </div>

        <div>
          <button 
            onClick={handleOpenNewModal}
            className="w-full py-2.5 px-4 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer font-montserrat uppercase tracking-wider"
          >
            <FiPlus size={16} /> Create New Booklet
          </button>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        
        {/* 1. Home Dashboard Link */}
        <div className="space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiHome size={18} className="shrink-0" />
            <span>Home Dashboard</span>
          </NavLink>
        </div>

        {/* 2. Active Booklet Meeting Segments */}
        <div className="space-y-1.5 pt-2 border-t border-white/15">
          <div className="text-xs font-black text-white/80 uppercase tracking-wider px-2 font-montserrat">
            <span>MEETING SEGMENTS</span>
          </div>

          {activeBooklet ? (
            <div className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer font-montserrat text-xs sm:text-sm font-black ${
                        isActive
                          ? 'bg-[#781327] text-white shadow-md border-l-4 border-rose-300'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0 text-white" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ) : (
            <div className="p-3 text-xs text-white/80 bg-white/10 rounded-2xl text-center font-bold">
              Select a meeting to view segments.
            </div>
          )}
        </div>

        {/* 3. Specialized Role-Based Views & Portals */}
        <div className="space-y-1 pt-3 border-t border-white/15">
          <div className="text-xs font-black text-white/80 uppercase tracking-wider px-2 pb-1 font-montserrat">
            ROLE PORTALS & TOOLS
          </div>

          <NavLink
            to="/live-agenda"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiCheckSquare size={18} className="text-emerald-300 shrink-0" />
            <span>Live Agenda View</span>
          </NavLink>

          <NavLink
            to="/vote"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-rose-300'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiAward size={18} className="text-rose-300 shrink-0" />
            <span>Digital Voting</span>
          </NavLink>

          <NavLink
            to="/certificates"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-amber-300'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiAward size={18} className="text-amber-300 shrink-0" />
            <span>Award Certificates</span>
          </NavLink>
        </div>

        {/* 4. Overview & Directory Links */}
        <div className="space-y-1 pt-3 border-t border-white/15">
          <div className="text-xs font-black text-white/80 uppercase tracking-wider px-2 pb-1 font-montserrat">
            OVERVIEW & DIRECTORY
          </div>

          <NavLink
            to="/current-meetings"
            className={({ isActive }) =>
              `flex items-center gap-[#006094] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiZap size={18} className="text-amber-300 shrink-0" />
            <span>Current Meetings</span>
          </NavLink>

          <NavLink
            to="/meeting-history"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiArchive size={18} className="text-slate-300 shrink-0" />
            <span>Meeting History</span>
          </NavLink>

          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiUsers size={18} className="text-sky-300 shrink-0" />
            <span>District 227 Contacts</span>
          </NavLink>
        </div>

      </div>

      {/* Footer Profile & Settings */}
      <div className="p-4 border-t border-white/15 space-y-2 font-sans">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-black transition-colors ${
              isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
            }`
          }
        >
          <FiSettings size={16} />
          <span>App Settings</span>
        </NavLink>

        <div className="flex items-center justify-between bg-white/12 p-3 rounded-2xl text-xs border border-white/20 shadow-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-white text-[#006094] font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="truncate leading-tight">
              <div className="font-black text-white text-xs truncate">{currentUser?.name || 'Pramod K Murthy'}</div>
              <div className="text-[10px] text-white/70 truncate font-bold">{currentUser?.district || 'District 227'}</div>
            </div>
          </div>
          <button 
            onClick={logoutUser}
            title="Log out"
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>

      {/* Centered Create New Booklet Modal */}
      {showNewBookletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094] dark:border-sky-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-900 dark:text-white font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat block">
                  District 227 Toastmasters
                </span>
                <h3 className="text-xl font-montserrat font-black text-[#006094] dark:text-white mt-0.5">
                  Create New Meeting Booklet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewBookletModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmCreateBooklet} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider mb-1.5 font-montserrat">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={bookletTitle}
                  onChange={(e) => setBookletTitle(e.target.value)}
                  placeholder="e.g. District 227 Meeting #1040"
                  required
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[#006094]/30 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#006094]"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                  Creates a clean booklet without dummy strings ready for your meeting details.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBookletModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-xs rounded-xl cursor-pointer shadow-md font-montserrat"
                >
                  Done (Start Meeting Setup)
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </aside>
  );
}
