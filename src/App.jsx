import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BookletProvider } from './context/BookletContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Page1Cover from './pages/Page1Cover';
import Page2Ref from './pages/Page2Ref';
import Page3Before from './pages/Page3Before';
import Page4Arrangements from './pages/Page4Arrangements';
import Page5During from './pages/Page5During';
import Page6Outcome from './pages/Page6Outcome';
import Page7Tracker from './pages/Page7Tracker';
import Page8DataSheet from './pages/Page8DataSheet';
import Settings from './pages/Settings';
import PrintView from './pages/PrintView';
import Auth from './pages/Auth';

export default function App() {
  return (
    <ToastProvider>
      <BookletProvider>
        <HashRouter>
          <Routes>
            {/* Main Application Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="booklet/cover" element={<Page1Cover />} />
              <Route path="booklet/quick-reference" element={<Page2Ref />} />
              <Route path="booklet/before-meeting" element={<Page3Before />} />
              <Route path="booklet/arrangements" element={<Page4Arrangements />} />
              <Route path="booklet/during-meeting" element={<Page5During />} />
              <Route path="booklet/outcome" element={<Page6Outcome />} />
              <Route path="booklet/tracker" element={<Page7Tracker />} />
              <Route path="booklet/data-sheet" element={<Page8DataSheet />} />
              <Route path="settings" element={<Settings />} />
              <Route path="auth" element={<Auth />} />
            </Route>

            {/* Standalone Printable View */}
            <Route path="/print" element={<PrintView />} />
          </Routes>
        </HashRouter>
      </BookletProvider>
    </ToastProvider>
  );
}
