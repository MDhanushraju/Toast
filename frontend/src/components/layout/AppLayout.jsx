import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Auth from '../../pages/Auth';
import { useBooklet } from '../../context/BookletContext';

export default function AppLayout() {
  const { currentUser, undo, redo } = useBooklet();

  // Listen to keyboard shortcuts (Ctrl+Z and Ctrl+Y)
  useEffect(() => {
    if (!currentUser) return; // Only listen if logged in
    
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

  // If no user is logged in, show the Login/Signup page first
  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-[#FAF5EF] dark:bg-[#0b1320] transition-colors duration-300">
      {/* Sidebar Panel - Wider 72 size (288px) */}
      <Sidebar />

      {/* Main Panel Content - Adjusted left padding to 20% (lg:pl-[20%]) */}
      <div className="flex flex-col flex-1 min-h-screen lg:pl-[20%]">
        <Header />

        {/* Main Canvas occupying maximum length and width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#FAF5EF] dark:bg-[#0b1320] pb-8">
          <div className="flex-1 w-full flex flex-col">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
