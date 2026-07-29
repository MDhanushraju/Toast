import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import {
  FiClock, FiAward, FiBookOpen, FiGlobe, FiUsers,
  FiCheckCircle, FiSend, FiBookmark, FiMapPin, FiEdit2, FiDownload
} from 'react-icons/fi';

export default function LiveAgenda() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const page3Data = activeBooklet?.page3 || {};
  const agendaItems = Array.isArray(page3Data.agendaItems) ? page3Data.agendaItems : [];

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const existingPage6 = activeBooklet?.page6 || {};
    const guestSubmissions = Array.isArray(existingPage6.guestSubmissions) ? existingPage6.guestSubmissions : [];

    const newGuest = {
      id: `g-${Date.now()}`,
      name: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      feedback: feedback.trim(),
      submittedAt: new Date().toLocaleTimeString()
    };

    updateBookletPage('page6', { guestSubmissions: [...guestSubmissions, newGuest] });
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">

      {/* Executive Header Banner */}
      <div className="bg-[#781327] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 text-center border-b-4 border-[#580d1b]">
        <ToastmastersLogo district={activeBooklet?.districtName || "DISTRICT 227"} size="md" className="mx-auto my-2" />
        <span className="text-xs font-black bg-white/20 px-3.5 py-1 rounded-full uppercase tracking-widest font-montserrat">
          👀 Live Attendee & Guest Agenda View
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-montserrat uppercase tracking-wider">
          {activeBooklet?.title || 'Toastmasters Meeting'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-white/90 font-montserrat">
          <span>Meeting #{page3Data.meetingNo || '1038'}</span>
          <span>•</span>
          <span>Date: {page3Data.date || 'Today'}</span>
          <span>•</span>
          <span>Host: {page3Data.hostOrganization || 'District 227'}</span>
          <span>•</span>
          <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-lg text-white">
            <FiMapPin size={13} className="text-amber-300" /> Venue: {page3Data.venue || 'Auditorium A'}
          </span>
        </div>
      </div>

      {/* 🎭 Theme, Word of the Day & Venue Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Theme Card */}
        <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#781327] dark:text-rose-400 uppercase tracking-wider font-montserrat">
            <FiAward size={16} /> Meeting Theme
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-montserrat italic">
            {page3Data.meetingTheme ? `"${page3Data.meetingTheme}"` : 'Theme not set yet'}
          </div>
        </div>

        {/* Word of Day Card */}
        <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
            <FiBookOpen size={16} /> Word of the Day
          </div>
          <div className="text-lg sm:text-xl font-black text-[#006094] dark:text-sky-300 font-montserrat">
            {page3Data.wordOfDay || 'Not set yet'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
            {page3Data.wordMeaning ? `"${page3Data.wordMeaning}"` : 'Definition pending...'}
          </p>
        </div>

        {/* 📍 Meeting Venue & Location Card */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-emerald-500/40 dark:border-emerald-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-montserrat">
              <FiMapPin size={16} /> Meeting Venue / Platform
            </div>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Editable Location
            </span>
          </div>
          <input
            type="text"
            value={page3Data.venue || ''}
            onChange={(e) => updateBookletPage('page3', { venue: e.target.value })}
            placeholder="e.g. Auditorium A / Zoom Link"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-black text-slate-900 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {page3Data.meetingLink && (
            <a
              href={page3Data.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#006094] hover:underline flex items-center gap-1 truncate block mt-1"
            >
              <FiGlobe size={12} /> {page3Data.meetingLink}
            </a>
          )}
        </div>
      </div>

      {/* 📋 Timed Meeting Agenda Timeline */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-[#006094] dark:text-white font-montserrat font-black text-base">
            <FiClock size={20} className="text-[#006094]" />
            <span>Meeting Agenda Schedule</span>
          </div>
          <span className="text-xs bg-[#E6F0F6] text-[#006094] font-black px-3 py-1 rounded-full font-montserrat">
            {agendaItems.length} Segments
          </span>
        </div>

        <div className="space-y-3">
          {agendaItems.map(item => (
            <div
              key={item.id}
              className="p-3.5 bg-[#FAF5EF]/70 dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-white bg-[#781327] px-2.5 py-1 rounded-xl font-mono shrink-0">
                  {item.time}
                </span>
                <div>
                  <div className="font-montserrat font-black text-xs text-[#006094] dark:text-sky-300">
                    {item.slot}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-extrabold mt-0.5">
                    {item.speaker} {item.notes ? `• ${item.notes}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📝 Guest Sign-Up & Feedback Form */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FiUsers size={20} className="text-[#006094]" />
          <h3 className="font-montserrat font-black text-base text-[#006094] dark:text-white">
            Guest Sign-Up & Feedback Form
          </h3>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <FiCheckCircle size={28} className="mx-auto text-emerald-600" />
            <h4 className="font-montserrat font-black text-sm">Thank You for Attending!</h4>
            <p className="text-xs font-bold">Your guest sign-up and feedback have been recorded for District 227.</p>
          </div>
        ) : (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="Your Full Name *"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full Name"
                required
              />
              <FormInput
                label="Email Address"
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="name@company.com"
              />
              <FormInput
                label="Phone / WhatsApp"
                id="guestPhone"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <FormTextarea
              label="Feedback & Chartering Interest"
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How was your Toastmasters meeting experience today? Interested in joining or chartering a new club?"
              rows={2}
            />

            <div className="text-right">
              <Button variant="primary" size="md" type="submit" className="bg-[#006094] hover:bg-[#003a5c] text-white font-black">
                <FiSend size={15} className="mr-2" /> Submit Guest Sign-Up
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 📘 Toastmasters Official Role Manual Download */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F0F6] dark:bg-slate-800 flex items-center justify-center text-[#006094] shrink-0">
            <FiDownload size={22} />
          </div>
          <div>
            <h4 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white">
              Toastmasters Official Member Manual
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Download "A Toastmaster Wears Many Hats" (Official Pathways Guide & Role Responsibilities)
            </p>
          </div>
        </div>

        <a
          href="https://ccdn.toastmasters.org//medias/files/pathways/toastmaster-wears-many-hats/1167d-a-toastmaster-wears-many-hats.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 border border-[#580d1b] cursor-pointer"
        >
          <FiDownload size={16} />
          <span>Download Manual</span>
        </a>
      </div>

    </div>
  );
}
