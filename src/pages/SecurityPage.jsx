import React, { useState, useEffect } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useToast } from '../context/ToastContext';
import { 
  FiShield, FiKey, FiLock, FiSmartphone, FiClock, 
  FiCheckCircle, FiAlertTriangle, FiTrash2, FiRefreshCw,
  FiX, FiCheck, FiEye, FiEyeOff, FiGrid
} from 'react-icons/fi';

export default function SecurityPage() {
  const { currentUser, updateCurrentUser } = useBooklet();
  const { addToast } = useToast();

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    return localStorage.getItem('d227_2fa_enabled') === 'true';
  });
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Auto-Lock State
  const [autoLockTimeout, setAutoLockTimeout] = useState(() => {
    return localStorage.getItem('d227_autolock_time') || '15';
  });
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');

  // Active Sessions State
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11', ip: '192.168.1.104', location: 'District 227 HQ', active: true, time: 'Current Session' },
    { id: 2, device: 'Safari on iPhone 15 Pro', ip: '172.56.21.90', location: 'Mobile Gateway', active: false, time: '2 hours ago' },
    { id: 3, device: 'Edge on Surface Laptop', ip: '192.168.1.112', location: 'Meeting Hall B', active: false, time: 'Yesterday' }
  ]);

  // Persist 2FA and Auto-Lock settings
  useEffect(() => {
    localStorage.setItem('d227_2fa_enabled', twoFactorEnabled);
  }, [twoFactorEnabled]);

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
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    if (updateCurrentUser) {
      updateCurrentUser({ password: newPassword });
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast('Security password updated successfully!', 'success');
  };

  // Handle 2FA Modal Verification
  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      addToast('Please enter a valid 6-digit verification code.', 'error');
      return;
    }
    setTwoFactorEnabled(true);
    setShow2FAModal(false);
    setOtpCode('');
    addToast('Two-Factor Authentication activated successfully!', 'success');
  };

  // Handle Disable 2FA
  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable Two-Factor Authentication?')) {
      setTwoFactorEnabled(false);
      addToast('Two-Factor Authentication disabled.', 'info');
    }
  };

  // Handle Terminate Session
  const handleTerminateSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    addToast('Remote device session terminated.', 'info');
  };

  const handleTerminateAllOther = () => {
    setSessions(sessions.filter(s => s.active));
    addToast('All remote device sessions terminated!', 'warning');
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
      <div className="bg-[#004165] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-[#781327] text-white flex items-center justify-center shrink-0 shadow-xl">
            <FiShield size={42} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black leading-tight text-white">
              Account Security & Access Protection
            </h1>
            <p className="text-lg sm:text-xl text-sky-100 font-bold mt-2">
              Manage live authentication credentials, 2FA settings, active device sessions, and auto-lock security.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        
        {/* Card 1: Live Change Password (50% Width) */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
            <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
              <FiKey size={32} className="text-[#781327]" /> Change Security Password
            </h3>
            <button 
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-sm font-bold text-slate-500 hover:text-[#006094] flex items-center gap-1.5 cursor-pointer font-montserrat"
            >
              {showPasswords ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              <span>{showPasswords ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                Current Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat">
                  New Password *
                </label>
                {newPassword && (
                  <span className="text-xs font-black uppercase tracking-wider font-montserrat text-slate-600">
                    Strength: <span className="text-[#006094]">{strength.label}</span>
                  </span>
                )}
              </div>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Enter minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
              />
              {/* Strength Meter Bar */}
              {newPassword && (
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-2">
                Confirm New Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#781327] hover:bg-[#580d1b] text-white font-black text-lg py-4 rounded-2xl cursor-pointer shadow-xl font-montserrat"
              >
                Update Security Password
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Live Two-Factor Authentication & Auto-Lock (50% Width) */}
        <div className="space-y-8">
          
          {/* 2FA Card */}
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
              <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
                <FiSmartphone size={32} className="text-[#006094]" /> Two-Factor Auth (2FA)
              </h3>
              <span className={`text-base font-black px-5 py-1.5 rounded-full uppercase font-montserrat flex items-center gap-2 ${
                twoFactorEnabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400' : 'bg-rose-100 text-rose-800'
              }`}>
                {twoFactorEnabled && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                {twoFactorEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
              Protect your District administrator console by requiring a one-time verification code upon sign-in.
            </p>

            <div className="flex items-center justify-between p-5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
              <div>
                <div className="font-montserrat font-black text-lg text-slate-900 dark:text-white">Authenticator App 2FA</div>
                <div className="text-sm text-slate-600 font-bold mt-0.5">Google Authenticator or Duo Security</div>
              </div>
              {twoFactorEnabled ? (
                <button
                  type="button"
                  onClick={handleDisable2FA}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-base font-black font-montserrat cursor-pointer transition-all shadow-md"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShow2FAModal(true)}
                  className="px-6 py-3 bg-[#006094] hover:bg-[#004165] text-white rounded-2xl text-base font-black font-montserrat cursor-pointer transition-all shadow-md"
                >
                  Enable 2FA
                </button>
              )}
            </div>
          </div>

          {/* Inactivity Auto-Lock Card */}
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
              <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
                <FiClock size={32} className="text-[#006094]" /> Inactivity Auto-Lock
              </h3>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-3">
                Automatic Session Timeout Period
              </label>
              <select
                value={autoLockTimeout}
                onChange={(e) => {
                  setAutoLockTimeout(e.target.value);
                  addToast(`Inactivity auto-lock set to ${e.target.value} minutes.`, 'success');
                }}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 cursor-pointer"
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
                className="w-full py-3.5 px-4 bg-[#1C4E6F] hover:bg-[#153D57] text-white font-black text-base rounded-2xl transition-all shadow-md cursor-pointer font-montserrat flex items-center justify-center gap-2"
              >
                <FiLock size={20} /> Test Lock Screen Now
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Active Sessions List - Full Width */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4">
          <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-white flex items-center gap-3">
            <FiLock size={32} className="text-[#781327]" /> Active Device Sessions
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-slate-600 font-montserrat bg-slate-100 px-4 py-1 rounded-full">
              {sessions.length} Active Sessions
            </span>
            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleTerminateAllOther}
                className="px-4 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-sm font-black font-montserrat cursor-pointer transition-colors"
              >
                Terminate Other Sessions
              </button>
            )}
          </div>
        </div>

        <div className="divide-y-2 divide-slate-100 dark:divide-slate-800">
          {sessions.map(s => (
            <div key={s.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#006094] flex items-center justify-center shrink-0">
                  <FiSmartphone size={28} />
                </div>
                <div>
                  <div className="font-montserrat font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-3">
                    {s.device}
                    {s.active && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-black">THIS DEVICE</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 font-bold mt-1">
                    IP: {s.ip} • Location: {s.location} • {s.time}
                  </div>
                </div>
              </div>

              {!s.active && (
                <button
                  type="button"
                  onClick={() => handleTerminateSession(s.id)}
                  className="px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-sm font-black font-montserrat cursor-pointer transition-colors flex items-center gap-2"
                  title="Revoke session"
                >
                  <FiTrash2 size={18} /> Terminate Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 2FA Activation Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-900 dark:text-white font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-2xl font-montserrat font-black text-[#006094] dark:text-sky-300">
                Setup Two-Factor Auth
              </h3>
              <button onClick={() => setShow2FAModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <FiX size={24} />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="w-36 h-36 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-[#006094] rounded-2xl mx-auto flex items-center justify-center text-[#006094]">
                <FiGrid size={80} />
              </div>
              <p className="text-sm text-slate-600 font-bold">
                Scan this QR code with Google Authenticator or Duo app.
              </p>
              <div className="bg-slate-100 p-3 rounded-xl font-mono text-xs font-black text-slate-800 tracking-wider">
                SECRET KEY: TM227-SEC-8941
              </div>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1 font-montserrat">
                  Enter 6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-[#FAF5EF] border-2 border-[#006094] text-center text-2xl font-black rounded-xl p-3 tracking-widest text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006094] hover:bg-[#003a5c] text-white font-black text-sm rounded-xl shadow-md cursor-pointer font-montserrat"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
