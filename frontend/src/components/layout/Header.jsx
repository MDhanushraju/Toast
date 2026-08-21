import React, { useState, useRef, useEffect } from 'react';
import { useBooklet } from '../../context/BookletContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiPrinter, FiSearch, FiUser, FiShield, FiKey, 
  FiSettings, FiLogOut, FiChevronDown, FiInfo, FiMenu, FiX 
} from 'react-icons/fi';
import ToastmastersLogo from '../ui/ToastmastersLogo';
import UserAvatar from '../ui/UserAvatar';

export default function Header() {
  const { 
    activeBooklet, booklets, selectBooklet, currentUser, logoutUser, backendStatus, backendUrl,
    isMobileSidebarOpen, toggleMobileSidebar
  } = useBooklet();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const matchingBooklets = searchQuery.trim() === '' ? [] : booklets.filter(b => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (b.page3?.hostOrganization && b.page3.hostOrganization.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-20 lg:h-24 px-3 sm:px-6 lg:px-12 bg-[#781327] text-white border-b-4 border-[#580d1b] shadow-2xl no-print font-sans transition-all w-full max-w-full">
      
      {/* Toastmasters Logo & District Brand Lockup */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        
        {/* Mobile Sidebar Hamburger Toggle Button (lg:hidden) */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0"
          title={isMobileSidebarOpen ? "Close Sidebar Menu" : "Open Sidebar Menu"}
        >
          {isMobileSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Header Logo: Only shown on mobile & tablet screens (< lg), hidden on desktop (lg:) since fixed sidebar displays main logo */}
        <div className="block lg:hidden">
          <div className="hidden xs:block">
            <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="md" className="min-w-0" />
          </div>
          <div className="xs:hidden">
            <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="sm" showText={false} className="min-w-0" />
          </div>
        </div>
        
        {/* Render Live Backend Indicator */}
        <a 
          href={backendUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          title={`Backend Server: ${backendUrl}`}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/30 border border-white/20 text-xs lg:text-sm font-bold font-montserrat hover:bg-black/50 transition-all text-white/90 shadow-sm"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : backendStatus === 'checking' ? 'bg-amber-400 animate-spin' : 'bg-rose-400'}`}></span>
          <span>Render API: {backendStatus === 'online' ? 'Online' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}</span>
        </a>
      </div>

      {/* Right Actions Toolbar & Top Right Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        
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
            className="w-48 lg:w-96 px-4 py-2.5 lg:py-3 pl-11 text-sm lg:text-base font-bold rounded-2xl bg-white/15 border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-md font-montserrat"
          />
          <FiSearch size={20} className="absolute left-3.5 top-3 lg:top-3.5 text-white/90" />
          
          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute right-0 mt-3 w-80 lg:w-96 bg-[#580d1b] border-2 border-white/20 rounded-3xl shadow-2xl z-50 p-4 max-h-72 overflow-y-auto text-white">
              <div className="text-xs font-black text-white/80 uppercase tracking-widest px-2 pb-2 border-b border-white/20 mb-2 font-montserrat">Search Results</div>
              {matchingBooklets.length === 0 ? (
                <div className="text-sm text-white/70 p-3 text-center font-bold">No booklets match queries</div>
              ) : (
                matchingBooklets.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      selectBooklet(b.id);
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                      navigate('/booklet/segment-1');
                    }}
                    className="w-full text-left p-3 text-sm hover:bg-[#781327] rounded-2xl transition-colors cursor-pointer text-white font-montserrat"
                  >
                    <div className="font-black text-white truncate">{b.title}</div>
                    <div className="text-xs text-white/80 truncate font-bold mt-0.5">{b.page3?.hostOrganization || 'No Host'}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Print Booklet button */}
        {location.pathname.startsWith('/booklet/') && (
          <button
            onClick={handlePrint}
            title="Print preview"
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-colors flex items-center gap-2 text-xs sm:text-sm font-black shadow-md cursor-pointer font-montserrat"
          >
            <FiPrinter size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
        )}

        {/* TOP RIGHT PROFILE CARD & INTERACTIVE DROPDOWN MENU */}
        <div ref={profileRef} className="relative border-l border-white/20 pl-3 sm:pl-5">
          <div
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 sm:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl hover:bg-white/15 transition-all cursor-pointer group"
          >
            <UserAvatar user={currentUser} size="lg" className="group-hover:scale-105 transition-transform" />

            <div className="hidden md:flex flex-col text-left leading-tight min-w-0">
              <div className="text-base font-black text-white font-montserrat truncate">{currentUser?.name || 'System Administrator'}</div>
              <span className="text-xs sm:text-sm text-white/90 font-bold block truncate mt-0.5">{currentUser?.district || 'Toastmasters International'}</span>
            </div>

            <FiChevronDown size={20} className={`text-white transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Interactive Slide-Down Profile Menu — Scaled Larger & Prominent */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3.5 w-80 sm:w-96 bg-[#004165] border-2 border-white/30 rounded-3xl p-5 sm:p-6 shadow-2xl z-50 space-y-3 font-montserrat text-white">
              
              {/* Profile Header inside Dropdown */}
              <div className="p-3.5 border-b border-white/20 flex items-center gap-3.5">
                <UserAvatar user={currentUser} size="lg" />
                <div className="truncate leading-tight">
                  <div className="font-black text-white text-lg sm:text-xl truncate tracking-tight">{currentUser?.name || 'System Administrator'}</div>
                  <div className="text-xs sm:text-sm text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-2 mt-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span> ONLINE • {currentUser?.role || 'OFFICER'}
                  </div>
                </div>
              </div>

              {/* Dropdown Action Links */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/10 text-white text-base sm:text-lg font-extrabold transition-all text-left cursor-pointer"
                >
                  <FiUser size={22} className="text-sky-300 shrink-0" />
                  <span>View Member Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate('/security');
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/10 text-white text-base sm:text-lg font-extrabold transition-all text-left cursor-pointer"
                >
                  <FiShield size={22} className="text-amber-300 shrink-0" />
                  <span>Account & Security</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/10 text-white text-base sm:text-lg font-extrabold transition-all text-left cursor-pointer"
                >
                  <FiSettings size={22} className="text-rose-300 shrink-0" />
                  <span>Console Preferences</span>
                </button>
              </div>

              <div className="pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logoutUser();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-rose-900/60 hover:bg-rose-900/90 text-white text-base sm:text-lg font-black transition-all text-left cursor-pointer border border-rose-500/40 shadow-md"
                >
                  <FiLogOut size={22} className="shrink-0 text-white" />
                  <span>Log Out</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
