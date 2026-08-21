import React, { useState, useEffect } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useToast } from '../context/ToastContext';
import { 
  FiShield, FiKey, FiLock, FiSmartphone, FiClock, 
  FiCheckCircle, FiAlertTriangle, FiTrash2, FiRefreshCw,
  FiX, FiCheck, FiEye, FiEyeOff, FiGrid
} from 'react-icons/fi';

export default function SecurityPage() {
  const { currentUser, updateCurrentUser, changeUserPassword } = useBooklet();
  const { addToast } = useToast();

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Auto-Lock State
  const [autoLockTimeout, setAutoLockTimeout] = useState(() => {
    return localStorage.getItem('d227_autolock_time') || '15';
  });
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');

  useEffect(() => {
    localStorage.setItem('d227_autolock_time', autoLockTimeout);
  }, [autoLockTimeout]);

  // Password Strength Calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: 'Empty', color: 'bg-slate-200', width: '0%' };
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: '25%' };
    if (pwd.length < 8) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
    return { label: 'Good', color: 'bg-[#006094]', width: '75%' };
  };

  const strength = getPasswordStrength(newPassword);

  // Handle Password Update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    if (changeUserPassword) {
      const res = await changeUserPassword(currentPassword, newPassword);
      if (res?.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } else {
      if (updateCurrentUser) {
        updateCurrentUser({ password: newPassword });
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Security password updated successfully!', 'success');
    }
  };

  // Handle Unlock Screen
  const handleUnlockScreen = (e) => {
    e.preventDefault();
    if (!unlockPassword.trim()) {
      addToast('Please enter your password to unlock.', 'error');
      return;
    }
    setIsScreenLocked(false);
    setUnlockPassword('');
    addToast('Screen unlocked successfully!', 'success');
  };

  return (
    <div className="w-full space-y-8 font-sans pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#004165] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-[#781327] text-white flex items-center justify-center shrink-0 shadow-xl">
            <FiShield size={32} className="sm:hidden" />
            <FiShield size={42} className="hidden sm:block lg:hidden" />
            <FiShield size={52} className="hidden lg:block" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-montserrat font-black leading-tight text-white">
              Account Security & Access Protection
            </h1>
            <p className="text-xs sm:text-base lg:text-xl text-sky-100 font-bold mt-1 sm:mt-2">
              Manage live authentication credentials, auto-lock security, and account protection preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full">
        
        {/* Card 1: Live Change Password (50% Width) */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
            <h3 className="font-montserrat font-black text-lg sm:text-2xl lg:text-3xl text-[#006094] dark:text-white flex items-center gap-2 sm:gap-3">
              <FiKey size={28} className="text-[#781327] shrink-0 lg:w-8 lg:h-8" /> Change Security Password
            </h3>
            <button 
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs sm:text-sm lg:text-base font-bold text-slate-500 hover:text-[#006094] flex items-center gap-1.5 cursor-pointer font-montserrat shrink-0"
            >
              {showPasswords ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              <span>{showPasswords ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm lg:text-base font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                Current Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-base sm:text-lg lg:text-xl font-black rounded-2xl p-3.5 sm:p-4 lg:p-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm lg:text-base font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat">
                  New Password *
                </label>
                {newPassword && (
                  <span className="text-xs lg:text-sm font-black uppercase tracking-wider font-montserrat text-slate-600">
                    Strength: <span className="text-[#006094]">{strength.label}</span>
                  </span>
                )}
              </div>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Enter minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-base sm:text-lg lg:text-xl font-black rounded-2xl p-3.5 sm:p-4 lg:p-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
              />
              {/* Strength Meter Bar */}
              {newPassword && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm lg:text-base font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                Confirm New Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-base sm:text-lg lg:text-xl font-black rounded-2xl p-3.5 sm:p-4 lg:p-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#781327] hover:bg-[#580d1b] text-white font-black text-base sm:text-lg lg:text-xl py-4 sm:py-4.5 lg:py-5 rounded-2xl cursor-pointer shadow-xl font-montserrat hover:scale-[1.01] transition-all"
              >
                Update Security Password
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Live Inactivity Auto-Lock (50% Width) */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Inactivity Auto-Lock Card */}
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
              <h3 className="font-montserrat font-black text-lg sm:text-2xl lg:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
                <FiClock size={28} className="text-[#006094] lg:w-8 lg:h-8" /> Inactivity Auto-Lock
              </h3>
            </div>

            <div>
              <label className="block text-xs sm:text-sm lg:text-base font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-3">
                Automatic Session Timeout Period
              </label>
              <select
                value={autoLockTimeout}
                onChange={(e) => {
                  setAutoLockTimeout(e.target.value);
                  addToast(`Inactivity auto-lock set to ${e.target.value} minutes.`, 'success');
                }}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-base sm:text-lg lg:text-xl font-black rounded-2xl p-4 lg:p-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 cursor-pointer font-montserrat"
              >
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes (Recommended)</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsScreenLocked(true)}
                className="w-full py-4 sm:py-4.5 lg:py-5 px-4 bg-[#1C4E6F] hover:bg-[#153D57] text-white font-black text-base sm:text-lg lg:text-xl rounded-2xl transition-all shadow-md cursor-pointer font-montserrat flex items-center justify-center gap-3.5 hover:scale-[1.01]"
              >
                <FiLock size={22} /> Test Lock Screen Now
              </button>
            </div>
          </div>

        </div>

      </div>





      {/* Screen Lock Simulator Overlay */}
      {isScreenLocked && (
        <div className="fixed inset-0 z-50 bg-[#121e2d]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1c2b3e] border-4 border-[#781327] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 text-slate-900 dark:text-white font-sans">
            <div className="w-20 h-20 rounded-full bg-[#781327] text-white flex items-center justify-center mx-auto shadow-xl">
              <FiLock size={40} />
            </div>

            <div>
              <h2 className="text-3xl font-montserrat font-black text-[#781327] dark:text-rose-400">
                Console Locked
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-bold mt-1">
                Enter your password to unlock the District 227 session.
              </p>
            </div>

            <form onSubmit={handleUnlockScreen} className="space-y-4">
              <input
                type="password"
                placeholder="Enter password to unlock..."
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#781327] text-lg font-black rounded-2xl p-4 text-center text-slate-900 dark:text-white"
              />

              <button
                type="submit"
                className="w-full py-4 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-lg rounded-2xl shadow-xl cursor-pointer font-montserrat"
              >
                Unlock Session
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
