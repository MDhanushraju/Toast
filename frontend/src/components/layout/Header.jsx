import React, { useState, useRef, useEffect } from 'react';
import { useBooklet } from '../../context/BookletContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiPrinter, FiSearch, FiUser, FiShield, FiKey, 
  FiSettings, FiLogOut, FiChevronDown, FiInfo 
} from 'react-icons/fi';
import ToastmastersLogo from '../ui/ToastmastersLogo';
import UserAvatar from '../ui/UserAvatar';

export default function Header() {
  const { 
    activeBooklet, booklets, selectBooklet, currentUser, logoutUser, backendStatus, backendUrl
  } = useBooklet();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Close search & profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
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

  // Find booklets matching search queries
  const matchingBooklets = searchQuery.trim() === '' ? [] : booklets.filter(b => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (b.page3?.hostOrganization && b.page3.hostOrganization.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between min-h-[110px] py-5 px-8 md:px-12 bg-[#781327] text-white border-b-4 border-[#580d1b] shadow-2xl no-print font-sans transition-all gap-y-4">
      
      {/* Toastmasters Logo & District Brand Lockup - Larger Scale */}
      <div className="flex flex-wrap items-center gap-4 min-w-0">
        <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="lg" className="min-w-0" />
        
        {/* Render Live Backend Indicator */}
        <a 
          href={backendUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          title={`Backend Server: ${backendUrl}`}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/20 text-xs font-bold font-montserrat hover:bg-black/50 transition-all text-white/90"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : backendStatus === 'checking' ? 'bg-amber-400 animate-spin' : 'bg-rose-400'}`}></span>
          <span>Render API: {backendStatus === 'online' ? 'Online' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}</span>
        </a>
      </div>

      {/* Right Actions Toolbar & Top Right Profile Dropdown - Larger Scale */}
      <div className="flex items-center gap-6">
        
        {/* Global Search Bar - Larger */}
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
            className="w-72 lg:w-96 px-5 py-3.5 pl-12 text-sm sm:text-base font-bold rounded-2xl bg-white/15 border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-md font-montserrat"
          />
          <FiSearch size={22} className="absolute left-4 top-4 text-white/90" />
          
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
                    className="w-full text-left p-3 text-sm sm:text-base hover:bg-[#781327] rounded-2xl transition-colors cursor-pointer text-white font-montserrat"
                  >
                    <div className="font-black text-white truncate">{b.title}</div>
                    <div className="text-xs text-white/80 truncate font-bold mt-0.5">{b.page3?.hostOrganization || 'No Host'}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Print Booklet button - Larger */}
        {location.pathname.startsWith('/booklet/') && (
          <button
            onClick={handlePrint}
            title="Print preview"
            className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border-2 border-white/30 transition-colors flex items-center gap-2.5 text-sm sm:text-base font-black shadow-md cursor-pointer font-montserrat"
          >
            <FiPrinter size={22} />
            <span className="hidden sm:inline">Print Booklet</span>
          </button>
        )}

        {/* TOP RIGHT PROFILE CARD & INTERACTIVE DROPDOWN MENU - Larger Scale */}
        <div ref={profileRef} className="relative border-l-2 border-white/25 pl-6">
          <div
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-4 px-4 py-2 rounded-2xl hover:bg-white/15 transition-all cursor-pointer group"
          >
            <UserAvatar user={currentUser} size="lg" className="group-hover:scale-105 transition-transform" />

            <div className="hidden sm:flex flex-col text-left leading-tight min-w-0">
              <div className="text-base sm:text-lg font-black text-white font-montserrat truncate">{currentUser?.name || 'System Administrator'}</div>
              <span className="text-xs sm:text-sm text-white/90 font-bold block truncate mt-0.5">{currentUser?.district || 'Toastmasters International'}</span>
            </div>

            <FiChevronDown size={24} className={`text-white transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Interactive Slide-Down Profile Menu - Deep Blue Background */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-84 bg-[#004165] border-2 border-white/30 rounded-3xl p-4 shadow-2xl z-50 space-y-1.5 font-montserrat text-white">
              
              {/* Profile Header inside Dropdown */}
              <div className="p-3.5 border-b border-white/20 flex items-center gap-4">
                <UserAvatar user={currentUser} size="md" />
                <div className="truncate leading-tight">
                  <div className="font-black text-white text-lg truncate tracking-tight">{currentUser?.name || 'System Administrator'}</div>
                  <div className="text-xs text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE • MAIN ADMIN
                  </div>
                </div>
              </div>

              {/* Dropdown Action Links */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileDropdown(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 text-white text-base font-extrabold transition-all text-left cursor-pointer"
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
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 text-white text-base font-extrabold transition-all text-left cursor-pointer"
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
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 text-white text-base font-extrabold transition-all text-left cursor-pointer"
              >
                <FiSettings size={22} className="text-rose-300 shrink-0" />
                <span>Console Preferences</span>
              </button>

              <div className="pt-2 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logoutUser();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-rose-900/50 hover:bg-rose-900/90 text-rose-200 hover:text-white text-base font-black transition-all text-left cursor-pointer border border-rose-500/40"
                >
                  <FiLogOut size={22} className="shrink-0" />
                  <span>Log Out System</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
