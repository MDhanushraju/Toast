import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookletProvider } from './context/BookletContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import CurrentMeetings from './pages/CurrentMeetings';
import MeetingHistory from './pages/MeetingHistory';
import ContactsDirectory from './pages/ContactsDirectory';
import Segment1Before from './pages/Segment1Before';
import Segment2During from './pages/Segment2During';
import Segment3After from './pages/Segment3After';
import TimerConsole from './pages/TimerConsole';
import SpeakerPortal from './pages/SpeakerPortal';
import LiveAgenda from './pages/LiveAgenda';
import LiveVoting from './pages/LiveVoting';
import CertificateGenerator from './pages/CertificateGenerator';
import Settings from './pages/Settings';
import PrintView from './pages/PrintView';
import FullMeetingReport from './pages/FullMeetingReport';
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
              
              {/* Dedicated Full Pages */}
              <Route path="current-meetings" element={<CurrentMeetings />} />
              <Route path="meeting-history" element={<MeetingHistory />} />
              <Route path="contacts" element={<ContactsDirectory />} />

              {/* Specialized Role-Based Views & Portals */}
              <Route path="timer-console" element={<TimerConsole />} />
              <Route path="speaker-portal" element={<SpeakerPortal />} />
              <Route path="live-agenda" element={<LiveAgenda />} />
              <Route path="vote" element={<LiveVoting />} />
              <Route path="certificates" element={<CertificateGenerator />} />
              <Route path="meeting-report" element={<FullMeetingReport />} />
              <Route path="meeting-report/:id" element={<FullMeetingReport />} />

              {/* Simplified 3 Segments */}
              <Route path="booklet/segment-1" element={<Segment1Before />} />
              <Route path="booklet/segment-2" element={<Segment2During />} />
              <Route path="booklet/segment-3" element={<Segment3After />} />

              {/* Legacy Route Fallback Redirects */}
              <Route path="booklet/cover" element={<Navigate to="/booklet/segment-1" replace />} />
              <Route path="booklet/quick-reference" element={<Navigate to="/booklet/segment-1" replace />} />
              <Route path="booklet/before-meeting" element={<Navigate to="/booklet/segment-1" replace />} />
              <Route path="booklet/arrangements" element={<Navigate to="/booklet/segment-2" replace />} />
              <Route path="booklet/during-meeting" element={<Navigate to="/booklet/segment-2" replace />} />
              <Route path="booklet/outcome" element={<Navigate to="/booklet/segment-3" replace />} />
              <Route path="booklet/tracker" element={<Navigate to="/booklet/segment-3" replace />} />
              <Route path="booklet/data-sheet" element={<Navigate to="/booklet/segment-3" replace />} />

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
