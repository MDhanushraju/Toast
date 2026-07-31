import React, { useState, useRef, useEffect } from 'react';
import { useBooklet } from '../../context/BookletContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiPrinter, FiSearch } from 'react-icons/fi';
import ToastmastersLogo from '../ui/ToastmastersLogo';

export default function Header() {
  const { 
    activeBooklet, booklets, selectBooklet, currentUser
  } = useBooklet();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
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

  // Find booklets matching search queries
  const matchingBooklets = searchQuery.trim() === '' ? [] : booklets.filter(b => {
    return b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (b.page3?.hostOrganization && b.page3.hostOrganization.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between min-h-[96px] py-4 px-6 md:px-10 bg-[#781327] text-white border-b-2 border-[#580d1b] shadow-xl no-print font-sans transition-all gap-y-3">
      {/* Toastmasters Logo & District Brand Lockup - Single Clean Lockup */}
      <div className="flex items-center gap-3 min-w-0">
        <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="sm" className="min-w-0" />
      </div>

      {/* Right Actions: Minimal & Clean with Taller Touch Targets */}
      <div className="flex items-center gap-5">
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
            className="w-56 lg:w-72 px-4 py-2.5 pl-11 text-xs sm:text-sm font-bold rounded-2xl bg-white/15 border border-white/25 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-xs"
          />
          <FiSearch size={18} className="absolute left-3.5 top-3 text-white/80" />
          
          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute right-0 mt-2 w-72 bg-[#580d1b] border border-white/20 rounded-2xl shadow-2xl z-50 p-3 max-h-64 overflow-y-auto text-white">
              <div className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest px-2 pb-1 border-b border-white/20 mb-1 font-montserrat">Search Results</div>
              {matchingBooklets.length === 0 ? (
                <div className="text-xs text-white/70 p-2 text-center">No booklets match queries</div>
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
                    className="w-full text-left p-2.5 text-xs sm:text-sm hover:bg-[#781327] rounded-xl transition-colors cursor-pointer text-white"
                  >
                    <div className="font-extrabold text-white truncate">{b.title}</div>
                    <div className="text-[10px] text-white/70 truncate">{b.page3?.hostOrganization || 'No Host'}</div>
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
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-colors flex items-center gap-2 text-xs sm:text-sm font-extrabold shadow-sm cursor-pointer font-montserrat"
          >
            <FiPrinter size={18} />
            <span className="hidden sm:inline">Print Booklet</span>
          </button>
        )}

        {/* Clean Profile Badge */}
        <div className="flex items-center gap-3.5 border-l border-white/25 pl-5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-white text-[#781327] flex items-center justify-center font-black text-sm shadow-md shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden xl:flex flex-col text-left leading-tight min-w-0">
            <div className="text-xs sm:text-sm font-black text-white font-montserrat truncate">{currentUser?.name || 'System Administrator'}</div>
            <span className="text-[10px] text-white/80 font-bold block truncate">{currentUser?.district || 'District 227'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
