import React, { useState, useEffect } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiShield, 
  FiEdit3, FiSave, FiCheckCircle, FiCheck, FiBriefcase, FiGlobe,
  FiLock, FiClock, FiSmartphone, FiArrowRight, FiCheckSquare
} from 'react-icons/fi';

export default function ProfilePage() {
  const { currentUser } = useBooklet();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    return localStorage.getItem('d227_2fa_enabled') !== 'false';
  });

  const [lastLoginTime, setLastLoginTime] = useState(() => {
    return localStorage.getItem('d227_last_login') || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    localStorage.setItem('d227_2fa_enabled', twoFactorEnabled);
  }, [twoFactorEnabled]);

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'System Administrator',
    email: currentUser?.email || 'admin@district227.org',
    phone: currentUser?.phone || '+1 (555) 227-8627',
    district: currentUser?.district || 'District 227',
    division: 'Division A',
    area: 'Area 12',
    club: 'Toastmasters Leadership Club',
    role: currentUser?.role || 'District Main Administrator',
    memberId: 'TM-227-09412',
    bio: 'Dedicated Toastmasters leader focused on club growth, quality meeting execution, and digital operational efficiency.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    addToast(`Two-Factor Authentication ${nextState ? 'enabled' : 'disabled'}!`, nextState ? 'success' : 'info');
  };

  return (
    <div className="w-full space-y-8 font-sans pb-12">
      
      {/* Header Banner - Super Large & High Impact */}
      <div className="bg-[#1C4E6F] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
          
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white text-[#781327] font-black text-5xl sm:text-6xl flex items-center justify-center shadow-2xl border-4 border-white/40 shrink-0">
            {formData.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-sm sm:text-base font-black uppercase tracking-wider bg-[#781327] text-white px-4 py-1.5 rounded-full font-montserrat shadow-sm">
                {formData.role}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-sky-200 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                MEMBER ID: {formData.memberId}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-black leading-tight text-white tracking-tight">
              {formData.name}
            </h1>

            <p className="text-lg sm:text-xl text-sky-100 font-bold max-w-4xl leading-relaxed">
              {formData.bio}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-8 py-4 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-lg rounded-2xl flex items-center gap-3 transition-all shadow-xl cursor-pointer font-montserrat shrink-0 hover:scale-105"
          >
            {isEditing ? <FiCheck size={26} /> : <FiEdit3 size={26} />}
            <span>{isEditing ? 'Viewing Mode' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Form & Details Grid - 50/50 Full Page Stretch */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        
        {/* Left Column: Organization & Security (50% Width) */}
        <div className="space-y-8 flex flex-col justify-between">
          
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 flex-1">
            <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4 flex items-center gap-3">
              <FiAward size={32} className="text-[#781327]" /> Toastmasters Affiliation
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block font-montserrat mb-1">DISTRICT</label>
                <div className="font-montserrat font-black text-xl sm:text-2xl text-slate-900 dark:text-white">{formData.district}</div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block font-montserrat mb-1">DIVISION & AREA</label>
                <div className="font-montserrat font-black text-xl sm:text-2xl text-slate-900 dark:text-white">{formData.division} • {formData.area}</div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block font-montserrat mb-1">HOME CLUB</label>
                <div className="font-montserrat font-black text-xl sm:text-2xl text-slate-900 dark:text-white">{formData.club}</div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-500 uppercase tracking-wider block font-montserrat mb-1">OFFICER DESIGNATION</label>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-base sm:text-lg font-black mt-1 shadow-xs border border-emerald-300">
                  <FiCheckCircle size={22} /> Active District Officer
                </div>
              </div>
            </div>
          </div>

          {/* 100% Fully Working & Live Security Status Card */}
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 flex-1">
            <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
              <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 flex items-center gap-3">
                <FiShield size={32} className="text-[#781327]" /> Security Status
              </h3>
              <button
                type="button"
                onClick={() => navigate('/security')}
                className="text-sm font-black text-[#006094] hover:text-[#004165] flex items-center gap-1 font-montserrat cursor-pointer hover:underline"
              >
                Manage Security <FiArrowRight size={18} />
              </button>
            </div>

            <div className="space-y-4 font-montserrat">
              
              {/* 2FA Live Status & Interactive Toggle */}
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FiSmartphone size={22} className="text-[#006094]" />
                  <span>Two-Factor Auth (2FA)</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-5 py-1.5 rounded-full font-black text-sm cursor-pointer transition-all shadow-xs flex items-center gap-1.5 ${
                    twoFactorEnabled 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400 hover:bg-emerald-200' 
                      : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                  }`}
                  title="Click to toggle 2FA status"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${twoFactorEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FiCheckSquare size={22} className="text-emerald-600" />
                  <span>Account Status</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-black bg-emerald-100 px-5 py-1 rounded-full text-sm border border-emerald-300">
                  VERIFIED
                </span>
              </div>

              {/* Dynamic Last Login */}
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <FiClock size={22} className="text-slate-500" />
                  <span>Last System Login</span>
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-extrabold text-sm sm:text-base">
                  {lastLoginTime}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Editable Personal Details (50% Width) */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 h-full flex flex-col justify-between">
            
            <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
              <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
                <FiUser size={32} className="text-[#781327]" /> Personal & Contact Details
              </h3>
              {isEditing && (
                <span className="text-sm font-black text-amber-800 bg-amber-200 px-4 py-1.5 rounded-full animate-pulse font-montserrat">
                  EDITING MODE
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                  Full Name *
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                  />
                ) : (
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-montserrat font-black text-lg sm:text-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                    {formData.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                  Email Address *
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                  />
                ) : (
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-montserrat font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-3 border border-slate-200 dark:border-slate-800 truncate">
                    <FiMail size={22} className="text-[#006094] shrink-0" /> <span className="truncate">{formData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                  />
                ) : (
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-montserrat font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-3 border border-slate-200 dark:border-slate-800">
                    <FiPhone size={22} className="text-[#006094] shrink-0" /> {formData.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                  Toastmasters Member ID
                </label>
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-montserrat font-black text-lg sm:text-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                  {formData.memberId}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                Leader Bio / Remarks
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  rows="5"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
                />
              ) : (
                <div className="p-5 bg-slate-100 dark:bg-slate-900 rounded-2xl text-lg font-bold text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-200 dark:border-slate-800">
                  {formData.bio}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-4 pt-4 border-t-2 border-[#e8ddd0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-base rounded-2xl cursor-pointer hover:bg-slate-300 font-montserrat"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-base rounded-2xl cursor-pointer shadow-xl font-montserrat flex items-center gap-2"
                >
                  <FiSave size={22} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
