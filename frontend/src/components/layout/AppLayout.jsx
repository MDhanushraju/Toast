import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Auth from '../../pages/Auth';
import { useBooklet } from '../../context/BookletContext';
import { FiHome, FiClipboard, FiClock, FiCheckSquare, FiMenu } from 'react-icons/fi';

export default function AppLayout() {
  const { 
    currentUser, undo, redo, 
    openMobileSidebar, closeMobileSidebar, toggleMobileSidebar,
    activeBooklet
  } = useBooklet();

  const location = useLocation();

  // Listen to keyboard shortcuts (Ctrl+Z and Ctrl+Y)
  useEffect(() => {
    if (!currentUser) return;
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, currentUser]);

  // Listen to mobile touch swipe gestures (Swipe right from left edge to open, swipe left to close)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);

      if (diffY < 75) {
        if (touchStartX < 50 && diffX > 50) {
          // Swiped right from left edge -> Open drawer
          openMobileSidebar();
        } else if (diffX < -60) {
          // Swiped left -> Close drawer
          closeMobileSidebar();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [openMobileSidebar, closeMobileSidebar]);

  // If no user is logged in, show the Login/Signup page first
  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#FAF5EF] dark:bg-[#0b1320] transition-colors duration-300">
      {/* Sidebar Navigation Drawer */}
      <Sidebar />

      {/* Main Panel Content - Takes 100% width on mobile, 80 width offset on desktop */}
      <div className="flex flex-col flex-1 min-h-screen w-full lg:pl-80 overflow-x-hidden">
        <Header />

        {/* Main Canvas */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 flex flex-col bg-[#FAF5EF] dark:bg-[#0b1320] pb-24 lg:pb-8 w-full max-w-full overflow-x-hidden">
          <div className="flex-1 w-full flex flex-col max-w-full overflow-x-hidden">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* 📱 MOBILE BOTTOM NAVIGATION DOCK (PWA Native Feel) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1C4E6F] text-white border-t-2 border-[#153D57] shadow-2xl flex items-center justify-around py-2 px-1 font-montserrat no-print backdrop-blur-md">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isActive ? 'text-amber-300 font-black scale-105' : 'text-white/80 hover:text-white font-bold'}`}
        >
          <FiHome size={22} />
          <span className="text-[11px]">Home</span>
        </NavLink>

        <NavLink 
          to="/booklet/segment-1" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isActive ? 'text-amber-300 font-black scale-105' : 'text-white/80 hover:text-white font-bold'}`}
        >
          <FiClipboard size={22} />
          <span className="text-[11px]">1. Before</span>
        </NavLink>

        <NavLink 
          to="/booklet/segment-2" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isActive ? 'text-amber-300 font-black scale-105' : 'text-white/80 hover:text-white font-bold'}`}
        >
          <FiClock size={22} />
          <span className="text-[11px]">2. During</span>
        </NavLink>

        <NavLink 
          to="/booklet/segment-3" 
          className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isActive ? 'text-amber-300 font-black scale-105' : 'text-white/80 hover:text-white font-bold'}`}
        >
          <FiCheckSquare size={22} />
          <span className="text-[11px]">3. After</span>
        </NavLink>

        <button 
          type="button"
          onClick={toggleMobileSidebar}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-white/80 hover:text-white font-bold transition-all cursor-pointer"
        >
          <FiMenu size={22} />
          <span className="text-[11px]">Menu</span>
        </button>
      </div>

    </div>
  );
}
