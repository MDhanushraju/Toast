import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useBooklet } from '../../context/BookletContext';
import ToastmastersLogo from '../ui/ToastmastersLogo';
import { 
  FiHome, FiClipboard, FiClock, FiBarChart2, FiSettings, 
  FiPlus, FiUser, FiLogOut, FiUsers, FiZap, FiArchive,
  FiMic, FiAward, FiCheckSquare, FiShare2, FiX, FiLock
} from 'react-icons/fi';

import { AREA_DIRECTORS, DIVISION_DIRECTORS, DIVISION_AREA_OPTIONS } from '../../constants/contactsData';

export default function Sidebar() {
  const { activeBooklet, createBooklet, currentUser, logoutUser, hasCreatedDemoMeeting, unlockDemoMeeting } = useBooklet();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewBookletModal, setShowNewBookletModal] = useState(false);
  const [newMeetingForm, setNewMeetingForm] = useState({
    title: '',
    hostOrganization: '',
    venue: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    areaDirector: '',
    division: 'Division A',
    divisionDirector: '',
    district: 'District 227'
  });

  const handleOpenNewModal = () => {
    setNewMeetingForm({
      title: `District 227 Meeting #${Math.floor(1000 + Math.random() * 9000)}`,
      hostOrganization: '',
      venue: '',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      areaDirector: '',
      division: 'Division A',
      divisionDirector: '',
      district: 'District 227'
    });
    setShowNewBookletModal(true);
  };

  const handleConfirmCreateBooklet = (e) => {
    e.preventDefault();
    const computedTitle = newMeetingForm.hostOrganization.trim() 
      ? `${newMeetingForm.hostOrganization} Meeting` 
      : `District 227 Demo Meeting`;
    createBooklet(computedTitle, { ...newMeetingForm, title: computedTitle });
    unlockDemoMeeting();
    setShowNewBookletModal(false);
    navigate('/booklet/segment-1');
  };

  const navItems = [
    { id: 1, name: '1. Before Meeting', path: '/booklet/segment-1', icon: FiClipboard },
    { id: 2, name: '2. During Meeting', path: '/booklet/segment-2', icon: FiClock },
    { id: 3, name: '3. After Meeting', path: '/booklet/segment-3', icon: FiBarChart2 }
  ];

  const getSegmentStatus = (segmentId) => {
    if (!activeBooklet || activeBooklet.status === 'completed' || (activeBooklet.completedPercent || 0) === 100) return 'red';

    const p3 = activeBooklet.page3 || {};
    const p4 = activeBooklet.page4 || {};
    const p5 = activeBooklet.page5 || {};
    const p6 = activeBooklet.page6 || {};

    if (segmentId === 1) {
      // GREEN 🟢 ONLY once user presses Next Page (segment1Completed = true)
      if (activeBooklet.segment1Completed) {
        return 'green';
      }
      
      // Check if user edited even 1 slot on Segment 1
      const isChecklistTouched = p3.checklist?.some(c => c.checked);
      const isRolesTouched = Object.values(p3.roles || {}).some(r => (r || '').trim() !== '');
      const isThemeTouched = Boolean((p3.meetingTheme || '').trim() || (p3.wordOfDay || '').trim() || (p3.hostOrganization || '').trim() || (p3.venue || '').trim());
      const isSegment1Edited = isChecklistTouched || isRolesTouched || isThemeTouched || activeBooklet.segment1Edited;

      if (isSegment1Edited || location.pathname.includes('/booklet/segment-1')) {
        return 'yellow';
      }
      return 'red';
    }

    if (segmentId === 2) {
      // GREEN 🟢 ONLY once user presses Next Page (segment2Completed = true)
      if (activeBooklet.segment2Completed) {
        return 'green';
      }

      // Check if user edited even 1 slot on Segment 2
      const isGuestTouched = (p6.guestCount || 0) > 0;
      const isNotesTouched = Boolean((p5.notes || '').trim() || (p6.notes || '').trim());
      const isArrangementTouched = p4.rows?.some(r => r.ready || r.notes || r.owner);
      const isSegment2Edited = isGuestTouched || isNotesTouched || isArrangementTouched || activeBooklet.segment2Edited;

      if (isSegment2Edited || location.pathname.includes('/booklet/segment-2')) {
        return 'yellow';
      }
      return 'red';
    }

    if (segmentId === 3) {
      // GREEN 🟢 ONLY once finished / Next Page clicked (segment3Completed = true)
      if (activeBooklet.segment3Completed || activeBooklet.status === 'completed') {
        return 'green';
      }

      // Check if user edited even 1 slot on Segment 3
      const isSignTouched = Boolean((p3.preparedBy || '').trim() || (p3.approvalSignature || '').trim());
      const isSegment3Edited = isSignTouched || activeBooklet.segment3Edited;

      if (isSegment3Edited || location.pathname.includes('/booklet/segment-3')) {
        return 'yellow';
      }
      return 'red';
    }

    return 'red';
  };

  return (
    <aside className="w-full lg:w-[20%] bg-[#004165] text-white flex flex-col justify-between shrink-0 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 z-40 shadow-xl no-print border-r border-[#002b44]">
      
      {/* Header Container */}
      <div className="p-5 flex flex-col gap-4 border-b border-white/15">
        <div className="flex justify-center">
          <ToastmastersLogo 
            district="District 227" 
            subtitle="CLUB GROWTH DASHBOARD" 
            className="justify-center" 
          />
        </div>

        <div>
          <button 
            onClick={handleOpenNewModal}
            className="w-full py-3 px-4 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer font-montserrat uppercase tracking-wider"
          >
            <FiPlus size={18} /> Create New Demo Meeting
          </button>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans">
        
        {/* 1. Home Dashboard Link */}
        <div className="space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-base font-extrabold transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiHome size={20} className="shrink-0" />
            <span className="flex-1 text-left">Home Dashboard</span>
          </NavLink>
        </div>

        {/* 2. Active Booklet Meeting Segments */}
        {(() => {
          const isSuperAdmin = currentUser?.username === 'admin' || currentUser?.role === 'District Main Administrator';
          const hasActiveBooklet = Boolean(activeBooklet && activeBooklet.status !== 'completed');
          const isUnlocked = hasActiveBooklet;

          return (
            <div className="space-y-2 pt-3 border-t border-white/15">
              <div className="flex items-center justify-between px-2 font-montserrat text-left">
                <span className="text-xs sm:text-sm font-black text-white/80 uppercase tracking-wider">
                  MEETING SEGMENTS
                </span>
                {isSuperAdmin ? (
                  <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    👑 ADMIN ACCESS
                  </span>
                ) : !isUnlocked ? (
                  <span className="text-[10px] font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FiLock size={11} /> LOCKED
                  </span>
                ) : null}
              </div>

              {!isUnlocked ? (
                <div className="p-4 bg-black/15 rounded-2xl border border-white/10 text-center text-[12px] text-white/80 font-bold font-montserrat">
                  <div className="mb-2">Meeting segments are hidden until a demo meeting is created.</div>
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#781327]/80 px-3 py-2 text-[11px] uppercase tracking-widest text-rose-100 shadow-sm">
                    <FiLock size={12} /> Create a new meeting above to unlock
                  </div>
                </div>
              ) : hasActiveBooklet ? (
                <div className="space-y-1.5 pt-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const status = getSegmentStatus(item.id);

                    let statusBadgeBg = 'bg-rose-500 border-rose-300';
                    let statusText = 'Not Started (Red)';

                    if (status === 'green') {
                      statusBadgeBg = 'bg-emerald-400 border-emerald-200 shadow-emerald-400/50 animate-pulse';
                      statusText = 'Completed (Green)';
                    } else if (status === 'yellow') {
                      statusBadgeBg = 'bg-amber-400 border-amber-200';
                      statusText = 'Currently Editing (Yellow)';
                    }

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer font-montserrat text-sm sm:text-base font-extrabold ${
                            isActive
                              ? 'bg-[#781327] text-white shadow-md border-l-4 border-white'
                              : 'text-white/90 hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <Icon size={20} className="shrink-0 text-white" />
                          <span className="truncate text-left">{item.name}</span>
                        </div>

                        {/* Right Side Status Circle Indicator */}
                        <div className="flex items-center shrink-0 ml-2" title={statusText}>
                          <span className={`w-3.5 h-3.5 rounded-full border-2 shadow-sm ${statusBadgeBg}`} />
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 text-xs sm:text-sm text-white/80 bg-white/10 rounded-2xl text-center font-bold">
                  Select a meeting to view segments.
                </div>
              )}
            </div>
          );
        })()}

        {/* 3. Overview & Directory Links */}
        <div className="space-y-1.5 pt-4 border-t border-white/15">
          <div className="text-xs sm:text-sm font-black text-white/80 uppercase tracking-wider px-2 pb-1 font-montserrat text-left">
            OVERVIEW & DIRECTORY
          </div>

          <NavLink
            to="/current-meetings"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-base font-extrabold transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiZap size={20} className="text-white shrink-0" />
            <span className="flex-1 text-left">Current Meetings</span>
          </NavLink>

          <NavLink
            to="/upcoming-meetings"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-base font-extrabold transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiClock size={20} className="text-white shrink-0" />
            <span className="flex-1 text-left">Upcoming Meetings</span>
          </NavLink>

          <NavLink
            to="/meeting-history"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-base font-extrabold transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiArchive size={20} className="text-white shrink-0" />
            <span className="flex-1 text-left">Meeting History</span>
          </NavLink>

          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm sm:text-base font-extrabold transition-all font-montserrat ${
                isActive
                  ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <FiUsers size={20} className="text-white shrink-0" />
            <span className="flex-1 text-left">District 227 Contacts</span>
          </NavLink>
        </div>

      </div>

      {/* Footer Profile & Settings */}
      <div className="p-4 border-t border-white/15 space-y-2 font-sans">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-colors ${
              isActive ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'
            }`
          }
        >
          <FiSettings size={18} />
          <span>App Settings</span>
        </NavLink>

        <div className="flex items-center justify-between bg-white/12 p-3 rounded-2xl text-xs border border-white/20 shadow-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-white text-[#006094] font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="truncate leading-tight">
              <div className="font-black text-white text-xs truncate">{currentUser?.name || 'System Administrator'}</div>
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

      {/* Centered Create New Demo Meeting Modal */}
      {showNewBookletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print overflow-y-auto">
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094] dark:border-sky-900 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 text-slate-900 dark:text-white font-sans max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat block">
                  District 227 Toastmasters Setup
                </span>
                <h3 className="text-xl font-montserrat font-black text-[#006094] dark:text-white mt-0.5">
                  Create New Demo Meeting
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

              {/* 2-Column Grid: Officer Directory & Leadership */}
              <div className="p-4 bg-[#E6F0F6]/50 dark:bg-slate-900/60 border border-[#006094]/20 rounded-2xl space-y-3">
                <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat block border-b border-[#006094]/20 pb-1">
                  👥 Officer Directory & Leadership (District 227)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      Area Director Name
                    </label>
                    <input
                      type="text"
                      list="modalAreaDirectorList"
                      value={newMeetingForm.areaDirector}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, areaDirector: e.target.value })}
                      placeholder="Type or select Area Director..."
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#006094]"
                    />
                    <datalist id="modalAreaDirectorList">
                      {AREA_DIRECTORS.map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      DIVISION / AREA
                    </label>
                    <select
                      value={newMeetingForm.division}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, division: e.target.value })}
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#006094] cursor-pointer"
                    >
                      {DIVISION_AREA_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      Division Director Name
                    </label>
                    <input
                      type="text"
                      list="modalDivisionDirectorList"
                      value={newMeetingForm.divisionDirector}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, divisionDirector: e.target.value })}
                      placeholder="Type or select Division Director..."
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#006094]"
                    />
                    <datalist id="modalDivisionDirectorList">
                      {DIVISION_DIRECTORS.map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      District *
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.district}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, district: e.target.value })}
                      placeholder="District 227"
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#006094]"
                    />
                  </div>
                </div>
              </div>

              {/* 2-Column Grid: Host Organization & Logistics */}
              <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900/60 border border-[#781327]/20 rounded-2xl space-y-3">
                <span className="text-[10px] font-black text-[#781327] dark:text-rose-400 uppercase tracking-wider font-montserrat block border-b border-[#781327]/20 pb-1">
                  ⏰ Host Organization & Logistics
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      Host Organization *
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.hostOrganization}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, hostOrganization: e.target.value })}
                      placeholder="e.g. Corporation Beta"
                      required
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#781327]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      Venue / Link
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.venue}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, venue: e.target.value })}
                      placeholder="e.g. Auditorium A or Zoom Link"
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#781327]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={newMeetingForm.date}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, date: e.target.value })}
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#781327]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 font-montserrat">
                      Meeting Start Time
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.time}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, time: e.target.value })}
                      placeholder="e.g. 11:00 AM"
                      className="w-full bg-white dark:bg-slate-950 border border-[#e8ddd0] dark:border-slate-800 text-xs font-extrabold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#781327]"
                    />
                  </div>
                </div>
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
                  className="px-5 py-2.5 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-xs rounded-xl cursor-pointer shadow-md font-montserrat"
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
