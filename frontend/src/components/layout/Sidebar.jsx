import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useBooklet } from '../../context/BookletContext';
import ToastmastersLogo from '../ui/ToastmastersLogo';
import { 
  FiHome, FiClipboard, FiClock, FiBarChart2, FiSettings, 
  FiPlus, FiUser, FiLogOut, FiUsers, FiZap, FiArchive,
  FiMic, FiAward, FiCheckSquare, FiShare2, FiX, FiLock,
  FiShield, FiKey, FiChevronUp, FiChevronDown, FiInfo
} from 'react-icons/fi';

import { AREA_DIRECTORS, DIVISION_DIRECTORS, DIVISION_AREA_OPTIONS } from '../../constants/contactsData';

export default function Sidebar() {
  const { activeBooklet, createBooklet, currentUser, logoutUser, hasCreatedDemoMeeting, unlockDemoMeeting } = useBooklet();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewBookletModal, setShowNewBookletModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

      if (isSegment3Edited || location.pathname.includes('/booklet/segment-3')) return 'yellow';
      return 'red';
    }

    return 'red';
  };

  return (
    <aside className="w-full lg:w-[20%] bg-[#1C4E6F] text-white flex flex-col justify-between shrink-0 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 z-40 shadow-xl no-print border-r border-[#153D57] font-sans">
      
      {/* Top Sidebar Header */}
      <div className="p-4 flex flex-col gap-4 border-b border-white/15">
        <div className="flex justify-center">
          <ToastmastersLogo 
            district="District 227" 
            subtitle="CLUB GROWTH DASHBOARD" 
            textColor="text-white"
            size="lg"
            className="justify-center" 
          />
        </div>

        <div>
          <button 
            onClick={handleOpenNewModal}
            className="w-full py-4 px-3.5 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-[18px] rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer font-montserrat uppercase tracking-wider"
          >
            <FiPlus size={24} /> Create New Demo Meeting
          </button>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <NavLink to="/" end className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[20px] font-black transition-all font-montserrat ${isActive ? 'bg-white/20 text-white shadow-md border-l-4 border-white' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}>
            <FiHome size={26} className="shrink-0 text-white" />
            <span className="flex-1 text-left text-white font-black text-[20px]">Home Dashboard</span>
          </NavLink>
        </div>

        {(() => {
          const isSuperAdmin = currentUser?.username === 'admin' || currentUser?.role === 'District Main Administrator';
          const hasActiveBooklet = Boolean(activeBooklet && activeBooklet.status !== 'completed');
          const isUnlocked = hasActiveBooklet;
          return (
            <div className="space-y-3 pt-4.5 border-t border-white/15">
              <div className="flex items-center justify-between px-2 font-montserrat text-left">
                <span className="text-[15px] font-black text-white/80 uppercase tracking-wider">MEETING SEGMENTS</span>
                {isSuperAdmin ? <span className="text-[13px] font-black text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">ADMIN ACCESS</span> : !isUnlocked ? <span className="text-[13px] font-black text-amber-300 bg-black/40 px-3 py-1 rounded-full flex items-center gap-1"><FiLock size={14} /> LOCKED</span> : null}
              </div>
              {!isUnlocked ? (
                <div className="p-4 bg-black/20 rounded-2xl border border-white/10 text-center text-[14px] text-white/80 font-bold font-montserrat">
                  Meeting segments hidden until demo created.
                </div>
              ) : (
                <div className="space-y-2 pt-0.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const status = getSegmentStatus(item.id);
                    let statusBadgeBg = status === 'green' ? 'bg-emerald-400 animate-pulse' : status === 'yellow' ? 'bg-amber-400' : 'bg-rose-500';
                    return (
                      <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all font-montserrat text-[20px] font-black ${isActive ? 'bg-white/20 text-white shadow-md border-l-4 border-white' : 'text-white/90 hover:bg-white/10'}`}>
                        <div className="flex items-center gap-4 min-w-0 flex-1"><Icon size={26} className="text-white" /> <span className="truncate">{item.name}</span></div>
                        <div className={`w-4.5 h-4.5 rounded-full border-2 ${statusBadgeBg}`} />
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        <div className="space-y-2 pt-4.5 border-t border-white/15">
          <div className="text-[15px] font-black text-white/80 uppercase tracking-wider px-2 pb-1 font-montserrat text-left">OVERVIEW & DIRECTORY</div>
          <NavLink to="/current-meetings" className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[20px] font-black transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <FiZap size={26} className="text-white" /> <span className="text-[20px]">Current Meetings</span>
          </NavLink>
          <NavLink to="/upcoming-meetings" className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[20px] font-black transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <FiClock size={26} className="text-white" /> <span className="text-[20px]">Upcoming Meetings</span>
          </NavLink>
          <NavLink to="/meeting-history" className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[20px] font-black transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <FiArchive size={26} className="text-white" /> <span className="text-[20px]">Meeting History</span>
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[20px] font-black transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <FiUsers size={26} className="text-white" /> <span className="text-[20px]">District 227 Contacts</span>
          </NavLink>
        </div>
      </div>

      {/* Bottom Footer — ONLY Log Out Button */}
      <div className="p-4 border-t border-white/15 font-sans">
        <button
          onClick={logoutUser}
          className="w-full flex items-center justify-center gap-3.5 px-4 py-3.5 rounded-2xl bg-rose-900/40 hover:bg-rose-900/90 text-white font-black text-[18px] transition-all cursor-pointer border border-rose-500/40 shadow-sm font-montserrat"
        >
          <FiLogOut size={24} className="shrink-0 text-white" />
          <span>Log Out</span>
        </button>
      </div>

      {showNewBookletModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 no-print overflow-y-auto">
          <div className="bg-white dark:bg-[#121e2d] border-4 border-[#006094] dark:border-sky-900 rounded-3xl p-8 sm:p-10 max-w-4xl sm:max-w-5xl w-full shadow-2xl space-y-7 text-slate-900 dark:text-white font-sans max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs sm:text-sm font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat block">
                  District 227 Toastmasters Setup
                </span>
                <h3 className="text-3xl sm:text-4xl font-montserrat font-black text-[#006094] dark:text-white mt-1">
                  Create New Demo Meeting
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewBookletModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer transition-all hover:bg-slate-100"
              >
                <FiX size={32} />
              </button>
            </div>

            <form onSubmit={handleConfirmCreateBooklet} className="space-y-6">

              {/* 2-Column Grid: Officer Directory & Leadership */}
              <div className="p-6 bg-[#E6F0F6]/80 dark:bg-slate-900/80 border-2 border-[#006094]/30 rounded-3xl space-y-4">
                <span className="text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat block border-b-2 border-[#006094]/20 pb-2">
                  OFFICER DIRECTORY & LEADERSHIP (DISTRICT 227)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      Area Director Name
                    </label>
                    <input
                      type="text"
                      list="modalAreaDirectorList"
                      value={newMeetingForm.areaDirector}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, areaDirector: e.target.value })}
                      placeholder="Type or select Area Director..."
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                    />
                    <datalist id="modalAreaDirectorList">
                      {AREA_DIRECTORS.map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      DIVISION / AREA
                    </label>
                    <select
                      value={newMeetingForm.division}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, division: e.target.value })}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 cursor-pointer"
                    >
                      {DIVISION_AREA_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      Division Director Name
                    </label>
                    <input
                      type="text"
                      list="modalDivisionDirectorList"
                      value={newMeetingForm.divisionDirector}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, divisionDirector: e.target.value })}
                      placeholder="Type or select Division Director..."
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                    />
                    <datalist id="modalDivisionDirectorList">
                      {DIVISION_DIRECTORS.map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      District *
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.district}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, district: e.target.value })}
                      placeholder="District 227"
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                    />
                  </div>
                </div>
              </div>

              {/* 2-Column Grid: Host Organization & Logistics */}
              <div className="p-6 bg-[#FAF5EF] dark:bg-slate-900/80 border-2 border-[#781327]/30 rounded-3xl space-y-4">
                <span className="text-sm sm:text-base font-black text-[#781327] dark:text-rose-400 uppercase tracking-wider font-montserrat block border-b-2 border-[#781327]/20 pb-2">
                  HOST ORGANIZATION & LOGISTICS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      Host Organization *
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.hostOrganization}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, hostOrganization: e.target.value })}
                      placeholder="e.g. Corporation Beta"
                      required
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#781327]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#781327]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      Venue / Link
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.venue}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, venue: e.target.value })}
                      placeholder="e.g. Auditorium A or Zoom Link"
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#781327]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#781327]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={newMeetingForm.date}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, date: e.target.value })}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#781327]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#781327]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 font-montserrat">
                      Meeting Start Time
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.time}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, time: e.target.value })}
                      placeholder="e.g. 11:00 AM"
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#781327]/40 text-base sm:text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#781327]/30"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBookletModal(false)}
                  className="px-6 py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-base rounded-2xl cursor-pointer hover:bg-slate-300 font-montserrat"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-lg rounded-2xl cursor-pointer shadow-xl font-montserrat uppercase tracking-wider"
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
