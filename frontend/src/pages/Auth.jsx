import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { 
  FiUser, FiShield, FiCheckCircle, FiClock, FiFileText, 
  FiUsers, FiAward, FiArrowRight, FiLock, FiStar, FiZap,
  FiEye, FiEyeOff
} from 'react-icons/fi';
import { DIVISION_AREA_OPTIONS } from '../constants/contactsData';

export default function Auth() {
  const { loginUser, registerUser } = useBooklet();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'

  // Login form state
  const [selectedRoleUser, setSelectedRoleUser] = useState('admin');
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('password');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const OFFICIAL_ACCOUNTS = [
    { user: 'admin', name: 'System Administrator', role: 'District Main Administrator' },
    { user: 'nitasha', name: 'Nitasha Kumar', role: 'District Director' },
    { user: 'prashanth', name: 'Prashanth K', role: 'Club Growth Director' },
    { user: 'nagesh', name: 'Nagesh Ramamurthy', role: 'CGB Pillar Lead' },
    { user: 'pramod', name: 'Pramod K', role: 'DMO Task Force Lead' }
  ];

  const handleRoleDropdownChange = (userKey) => {
    setSelectedRoleUser(userKey);
    const targetAcc = OFFICIAL_ACCOUNTS.find(a => a.user === userKey);
    if (targetAcc) {
      setLoginUsername(targetAcc.user);
      setLoginPassword('password');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotInput) {
      setForgotMessage('Please enter your registered username or email.');
      return;
    }
    const acc = OFFICIAL_ACCOUNTS.find(a => a.user.toLowerCase() === forgotInput.toLowerCase() || a.name.toLowerCase().includes(forgotInput.toLowerCase()));
    if (acc) {
      setForgotMessage(`Password reset link sent to ${acc.name}! Default Password is: password`);
    } else {
      setForgotMessage(`Password reset link generated for ${forgotInput}. Default Password is: password`);
    }
  };

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDistrict, setRegDistrict] = useState('District 227');
  const [regDivision, setRegDivision] = useState('Div A / Area 01');
  const [regArea, setRegArea] = useState('Area 01');
  const [regRole, setRegRole] = useState('Area Director');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername || !loginPassword) {
      setLoginError('Please enter username and password');
      return;
    }

    const res = loginUser(loginUsername, loginPassword);
    if (res?.success) {
      navigate('/');
    } else {
      setLoginError(res?.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName || !regUsername || !regPassword) {
      setRegError('Please complete all required fields');
      return;
    }

    const res = registerUser({
      name: regName,
      username: regUsername,
      email: regEmail,
      district: regDistrict,
      division: regDivision,
      area: regArea,
      role: regRole,
      password: regPassword
    });

    if (res?.success) {
      navigate('/');
    } else {
      setRegError(res?.error || 'Registration failed. Username might be taken.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF5EF] dark:bg-[#070d14] flex flex-col justify-center font-sans antialiased text-slate-900 dark:text-white">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        
        {/* 🌟 LEFT PANEL: Executive Toastmasters Branding Hero (7 Cols) - Extra Large */}
        <div className="order-2 lg:order-1 lg:col-span-7 bg-gradient-to-br from-[#006094] via-[#004165] to-[#002b45] text-white p-6 sm:p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl border-r-4 border-[#003a5c]">
          
          {/* Subtle Background Decorative Graphic Patterns */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-[#781327]/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="lg" />
            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-montserrat font-black uppercase tracking-widest bg-white/10 text-white px-5 py-2.5 rounded-full border-2 border-white/20 backdrop-blur-md shadow-md">
              <FiStar className="text-amber-300" size={18} /> Official Portal
            </span>
          </div>

          {/* Center Hero Content - Extra Large */}
          <div className="relative z-10 my-10 space-y-8 max-w-3xl">
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-montserrat font-black uppercase tracking-[0.3em] text-amber-300 bg-amber-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full inline-block">
                DISTRICT 227 TOASTMASTERS INTERNATIONAL
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-black leading-tight tracking-tight text-white">
                Building Clubs. Empowering Leaders. Elevating Communication.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-sky-100 font-extrabold leading-relaxed">
                Official District 227 Management Console for Area Directors, Division Leaders, and Corporate Outreach teams to conduct demo meetings, generate 3-segment booklets, and manage club chartering milestones.
              </p>
            </div>

            {/* Core Values Badge */}
            <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-montserrat">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest">Toastmasters Core Values:</span>
              <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">Integrity • Respect • Service • Excellence</span>
            </div>

            {/* Core Capability Cards Grid - Extra Large */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-montserrat">
              <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 p-5 rounded-3xl space-y-3 shadow-xl hover:bg-white/15 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#781327] text-white flex items-center justify-center shadow-lg shrink-0">
                  <FiFileText size={24} />
                </div>
                <h4 className="font-black text-base sm:text-lg text-white">3-Step Booklets</h4>
                <p className="text-xs sm:text-sm text-sky-100 font-bold leading-normal">Automate Agendas, Speaker Rosters, and Evaluation summaries.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 p-5 rounded-3xl space-y-3 shadow-xl hover:bg-white/15 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#006094] text-white flex items-center justify-center shadow-lg border-2 border-white/30 shrink-0">
                  <FiClock size={24} />
                </div>
                <h4 className="font-black text-base sm:text-lg text-white">Live Stopwatch & Voting</h4>
                <p className="text-xs sm:text-sm text-sky-100 font-bold leading-normal">Real-time speaker timing lights & live awards voting tally.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 p-5 rounded-3xl space-y-3 shadow-xl hover:bg-white/15 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
                  <FiUsers size={24} />
                </div>
                <h4 className="font-black text-base sm:text-lg text-white">District Leadership</h4>
                <p className="text-xs sm:text-sm text-sky-100 font-bold leading-normal">Direct directory for Area & Division Directors across District 227.</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote & Motto */}
          <div className="relative z-10 pt-6 border-t-2 border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-montserrat">
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                Toastmasters International Motto
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                "Where Leaders Are Made"
              </div>
            </div>
            <div className="text-xs text-sky-100 font-bold max-w-sm text-right">
              District 227 Mission: We build new clubs and support all clubs in achieving excellence.
            </div>
          </div>

        </div>

        {/* 🔐 RIGHT PANEL: Full Page Authentication Portal (5 Cols) - First on Mobile */}
        <div className="order-1 lg:order-2 lg:col-span-5 bg-white dark:bg-[#121e2d] p-6 sm:p-10 lg:p-16 flex flex-col justify-center space-y-6 sm:space-y-8 overflow-y-auto">
          
          {/* Mobile Top Branding Logo (Only visible on mobile screens) */}
          <div className="lg:hidden flex items-center justify-center py-3 border-b-2 border-slate-100 dark:border-slate-800 mb-2">
            <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="md" />
          </div>

          {/* Top Form Header & Tab Switcher */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat block">
                OFFICER ACCESS PORTAL
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-slate-900 dark:text-white leading-tight">
                {authMode === 'login' && 'Sign In to Your Account'}
                {authMode === 'register' && 'Create Officer Account'}
                {authMode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-extrabold mt-1">
                {authMode === 'login' && 'Select your Toastmasters leadership profile or enter login name.'}
                {authMode === 'register' && 'Register as a Toastmasters officer to start managing meetings.'}
                {authMode === 'forgot' && 'Enter your username or email to recover your credentials.'}
              </p>
            </div>

            {/* Pill Toggle */}
            <div className="flex bg-[#FAF5EF] dark:bg-[#0c1421] p-2 rounded-2xl border-2 border-[#e8ddd0] dark:border-slate-800 font-montserrat shadow-inner">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(''); }}
                className={`flex-1 text-center py-4 rounded-xl text-base sm:text-lg font-black transition-all cursor-pointer ${
                  authMode === 'login' 
                    ? 'bg-[#006094] text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#006094]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegError(''); }}
                className={`flex-1 text-center py-4 rounded-xl text-base sm:text-lg font-black transition-all cursor-pointer ${
                  authMode === 'register' 
                    ? 'bg-[#006094] text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#006094]'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* 1. SIGN IN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6 font-sans">
              {loginError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-[#781327] dark:text-rose-300 border-2 border-rose-300 rounded-2xl text-base font-black font-montserrat">
                  {loginError}
                </div>
              )}

              {/* 👑 Select Leadership Role / Profile Dropdown inside Form */}
              <div className="space-y-2">
                <label htmlFor="roleSelect" className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
                  SELECT LEADERSHIP PROFILE / ROLE *
                </label>
                <select
                  id="roleSelect"
                  value={selectedRoleUser}
                  onChange={(e) => handleRoleDropdownChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 dark:border-slate-800 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#006094]/30 cursor-pointer shadow-md font-montserrat"
                >
                  {OFFICIAL_ACCOUNTS.map(acc => (
                    <option key={acc.user} value={acc.user}>
                      {acc.name} — ({acc.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">
                  USERNAME / LOGIN NAME *
                </label>
                <input
                  type="text"
                  id="loginUsername"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 font-montserrat shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="loginPassword" className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
                    PASSWORD *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-xs sm:text-sm font-black text-[#006094] dark:text-sky-300 hover:text-[#004165] flex items-center gap-1.5 cursor-pointer font-montserrat"
                  >
                    {showLoginPassword ? <><FiEyeOff size={16} /> Hide Password</> : <><FiEye size={16} /> Show Password</>}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    id="loginPassword"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 pr-14 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 font-montserrat shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006094] p-1 cursor-pointer transition-colors"
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 px-8 bg-[#006094] hover:bg-[#004165] text-white font-montserrat font-black text-lg sm:text-xl rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl cursor-pointer uppercase tracking-wider border-2 border-[#004165] mt-3 hover:scale-[1.01]"
              >
                <span>Sign In to Dashboard</span>
                <FiArrowRight size={24} />
              </button>

              {/* Forgot Password option below Sign In Form */}
              <div className="text-center pt-3 border-t-2 border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setForgotMessage(''); }}
                  className="text-sm sm:text-base font-montserrat font-black text-[#781327] dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot your password? Click here to recover
                </button>
              </div>
            </form>
          )}

          {/* 2. FORGOT PASSWORD VIEW */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-6 font-sans">
              <div className="p-6 bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl space-y-2 font-montserrat">
                <div className="text-sm font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider">
                  Password Recovery System
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 font-bold">
                  Enter your officer username or email address below to receive password reset instructions.
                </p>
              </div>

              {forgotMessage && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 rounded-2xl text-base font-black font-montserrat">
                  {forgotMessage}
                </div>
              )}

              <div>
                <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">
                  USERNAME OR REGISTERED EMAIL *
                </label>
                <input
                  type="text"
                  id="forgotInput"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="e.g. nitasha / admin@toastmasters.org"
                  className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white font-montserrat"
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 px-8 bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-black text-lg sm:text-xl rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl cursor-pointer border-2 border-[#580d1b] uppercase tracking-wider"
              >
                <span>Send Reset Link / Password Hint</span>
                <FiArrowRight size={24} />
              </button>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 hover:underline font-montserrat cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 3. CREATE ACCOUNT FORM - Super Large */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6 font-sans max-h-[750px] overflow-y-auto pr-2">
              {regError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-[#781327] dark:text-rose-300 border-2 border-rose-300 rounded-2xl text-base font-black font-montserrat">
                  {regError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">FULL NAME *</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Pramod K Murthy" required className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 shadow-sm" />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">USERNAME *</label>
                  <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} placeholder="pramod" required className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 shadow-sm" />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">EMAIL ADDRESS</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="pramod@toastmasters.org" className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 shadow-sm" />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">DISTRICT *</label>
                  <input type="text" value={regDistrict} onChange={(e) => setRegDistrict(e.target.value)} placeholder="District 227" className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 shadow-sm" />
                </div>

                {/* Division / Area Dropdown Selection */}
                <div className="sm:col-span-2 space-y-2">
                  <label htmlFor="regDivision" className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
                    DIVISION / AREA SELECTION *
                  </label>
                  <select
                    id="regDivision"
                    value={regDivision}
                    onChange={(e) => setRegDivision(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white cursor-pointer shadow-md font-montserrat focus:ring-4 focus:ring-[#006094]/30"
                  >
                    {DIVISION_AREA_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-2">OFFICER ROLE</label>
                  <input type="text" value={regRole} onChange={(e) => setRegRole(e.target.value)} placeholder="Area Director / Division Director" className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 shadow-sm" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="regPassword" className="block text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">PASSWORD *</label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-xs font-black text-[#006094] dark:text-sky-300 hover:text-[#004165] flex items-center gap-1 cursor-pointer font-montserrat"
                    >
                      {showRegPassword ? <><FiEyeOff size={14} /> Hide</> : <><FiEye size={14} /> Show</>}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      id="regPassword"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 text-base sm:text-lg font-black rounded-2xl p-4.5 pr-14 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006094] p-1 cursor-pointer transition-colors"
                      title={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 px-8 bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-black text-lg sm:text-xl rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl cursor-pointer border-2 border-[#580d1b] uppercase tracking-wider hover:scale-[1.01] mt-4"
              >
                <span>Create Officer Profile</span>
                <FiCheckCircle size={26} />
              </button>

              {/* Forgot Password option below Sign Up Form */}
              <div className="text-center pt-3 border-t-2 border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setForgotMessage(''); }}
                  className="text-sm sm:text-base font-montserrat font-black text-[#781327] dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot your password? Click here to recover
                </button>
              </div>
            </form>
          )}

          {/* Security Assurance Badge */}
          <div className="pt-3 flex items-center justify-center gap-2 text-sm sm:text-base font-montserrat font-black text-slate-500 dark:text-slate-400">
            <FiLock className="text-[#006094]" size={20} />
            <span>Official Toastmasters International Brand Standard</span>
          </div>

        </div>

      </div>
    </div>
  );
}
