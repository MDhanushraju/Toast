import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { FiUser, FiPhone, FiMail, FiCheckCircle, FiStar, FiBriefcase, FiSend, FiAward } from 'react-icons/fi';

export default function GuestSignup() {
  const { activeBooklet, updateBookletPage, showToast } = useBooklet();

  const [formData, setFormData] = useState({
    name: '',
    club: '',
    phone: '',
    email: '',
    interested: 'yes',
    review: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please fill in your Name and Phone Number.");
      return;
    }

    if (activeBooklet) {
      const p6 = activeBooklet.page6 || {};
      const currentGuestCount = parseInt(p6.guestCount || 0, 10);
      const currentInterestedCount = parseInt(p6.interestedGuests || 0, 10);
      const existingGuestList = Array.isArray(p6.guestList) ? p6.guestList : [];

      const newGuestEntry = {
        id: `g-${Date.now()}`,
        name: formData.name.trim(),
        club: formData.club.trim() || 'Guest Visitor',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        interested: formData.interested,
        review: formData.review.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const isInterested = formData.interested === 'yes' || formData.interested === 'maybe';

      updateBookletPage('page6', {
        guestCount: currentGuestCount + 1,
        interestedGuests: isInterested ? currentInterestedCount + 1 : currentInterestedCount,
        guestList: [newGuestEntry, ...existingGuestList]
      });

      if (showToast) {
        showToast(`Thank you ${formData.name}! Attendance registered live.`, "success");
      }
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] dark:bg-[#0c1421] py-8 px-4 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white dark:bg-[#121e2d] border-2 border-[#006094]/30 rounded-3xl shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3 pb-4 border-b border-[#e8ddd0] dark:border-slate-800">
          <ToastmastersLogo size="md" className="mx-auto" />
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase font-montserrat text-[#781327] dark:text-rose-400">
              District 227 Executive Meeting
            </span>
            <h1 className="text-xl font-montserrat font-black text-[#006094] dark:text-white mt-1">
              Guest Sign-up & Feedback Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Welcome! Please complete this quick form to register your attendance live.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <FiCheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-montserrat font-black text-slate-900 dark:text-white">
              Attendance Registered!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold px-4">
              Thank you, <strong className="text-[#006094] dark:text-sky-300">{formData.name}</strong>! Your attendance has been live-counted in the District 227 meeting records.
            </p>
            <div className="p-4 bg-[#E6F0F6] dark:bg-slate-800 rounded-2xl text-xs text-[#006094] dark:text-sky-300 font-montserrat font-extrabold border border-[#006094]/20">
              Where Leaders Are Made • Toastmasters International
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', club: '', phone: '', email: '', interested: 'yes', review: '' });
              }}
              className="px-4 py-2 text-xs font-montserrat font-bold text-[#006094] hover:underline cursor-pointer"
            >
              Sign up another guest
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-montserrat">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Full Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#006094]"
                />
              </div>
            </div>

            {/* Club / Organization */}
            <div className="space-y-1">
              <label className="block font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Club / Organization Name *
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-3 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Infosys TM Club / Guest Visitor"
                  value={formData.club}
                  onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#006094]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Phone Number *
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-slate-400" size={14} />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#006094]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Email Address (Optional)
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-slate-400" size={14} />
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#006094]"
                />
              </div>
            </div>

            {/* Interested in Joining Toastmasters */}
            <div className="space-y-1">
              <label className="block font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Interested in Joining Toastmasters?
              </label>
              <select
                value={formData.interested}
                onChange={(e) => setFormData({ ...formData, interested: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#006094]"
              >
                <option value="yes">Yes, I want to join!</option>
                <option value="maybe">Maybe / Want more info</option>
                <option value="no">Just visiting as guest</option>
              </select>
            </div>

            {/* Review & Feedback */}
            <div className="space-y-1">
              <label className="block font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Meeting Review & Comments (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="How was your experience at today's meeting?"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#006094]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-[#580d1b] mt-2"
            >
              <FiSend size={16} />
              <span>Submit Registration & Count Attendance</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
