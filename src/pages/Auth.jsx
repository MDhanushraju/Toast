import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { 
  FiUser, FiShield, FiCheckCircle, FiClock, FiFileText, 
  FiUsers, FiAward, FiArrowRight, FiLock, FiStar, FiZap
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
        
        {/* 🌟 LEFT PANEL: Executive Toastmasters Branding Hero (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#006094] via-[#004165] to-[#002b45] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden shadow-2xl border-r border-[#003a5c]">
          
          {/* Subtle Background Decorative Graphic Patterns */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#781327]/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <ToastmastersLogo district="District 227" subtitle="CLUB GROWTH DASHBOARD" size="lg" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-montserrat font-extrabold uppercase tracking-widest bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
              <FiStar className="text-amber-300" size={14} /> Official Portal
            </span>
          </div>

          {/* Center Hero Content */}
          <div className="relative z-10 my-10 space-y-8 max-w-2xl">
            <div className="space-y-3">
              <span className="text-xs font-montserrat font-black uppercase tracking-[0.25em] text-amber-300 block">
                DISTRICT 227 SAAS OPERATIONS
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black leading-tight tracking-tight text-white">
                Empowering Toastmasters Leadership Excellence.
              </h1>
              <p className="text-sm sm:text-base text-white/85 font-medium leading-relaxed">
                Streamline corporate outreach meetings, generate automated 3-segment booklets, track live stopwatch timings, and manage officer leads effortlessly.
              </p>
            </div>

            {/* Core Capability Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-montserrat">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#781327] text-white flex items-center justify-center shadow-md">
                  <FiFileText size={20} />
                </div>
                <h4 className="font-extrabold text-xs text-white">3-Step Booklets</h4>
                <p className="text-[11px] text-white/70 font-medium">Before, During & After meeting workflow automation.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#006094] text-white flex items-center justify-center shadow-md border border-white/20">
                  <FiClock size={20} />
                </div>
                <h4 className="font-extrabold text-xs text-white">Live Stopwatch</h4>
                <p className="text-[11px] text-white/70 font-medium">Real-time speaker timing & green/yellow/red indicators.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                  <FiUsers size={20} />
                </div>
                <h4 className="font-extrabold text-xs text-white">28 Divisions & Areas</h4>
                <p className="text-[11px] text-white/70 font-medium">Complete District 227 leadership directory access.</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote & Motto */}
          <div className="relative z-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-montserrat">
            <div className="space-y-0.5">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                Toastmasters Motto
              </div>
              <div className="text-sm font-extrabold text-white">
                "Where Leaders Are Made"
              </div>
            </div>
            <div className="text-xs text-white/70 font-bold">
              District 227 &copy; {new Date().getFullYear()} All Rights Reserved.
            </div>
          </div>

        </div>

        {/* 🔐 RIGHT PANEL: Full Page Authentication Portal (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#121e2d] p-8 lg:p-14 flex flex-col justify-center space-y-6 overflow-y-auto">
          
          {/* Top Form Header & Tab Switcher */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat">
                OFFICER ACCESS PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-montserrat font-black text-slate-900 dark:text-white">
                {authMode === 'login' && 'Sign In to Your Account'}
                {authMode === 'register' && 'Create Officer Account'}
                {authMode === 'forgot' && 'Reset Your Password'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {authMode === 'login' && 'Select your Toastmasters leadership profile or enter login name.'}
                {authMode === 'register' && 'Register as a Toastmasters officer to start managing meetings.'}
                {authMode === 'forgot' && 'Enter your username or email to recover your credentials.'}
              </p>
            </div>

            {/* Pill Toggle */}
            <div className="flex bg-[#FAF5EF] dark:bg-[#0c1421] p-1.5 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 font-montserrat">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginError(''); }}
                className={`flex-1 text-center py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  authMode === 'login' 
                    ? 'bg-[#006094] text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#006094]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegError(''); }}
                className={`flex-1 text-center py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  authMode === 'register' 
                    ? 'bg-[#006094] text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#006094]'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* 1. SIGN IN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-[#781327] dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-extrabold font-montserrat">
                  {loginError}
                </div>
              )}

              {/* 👑 Select Leadership Role / Profile Dropdown inside Form */}
              <div className="space-y-1">
                <label htmlFor="roleSelect" className="block text-xs font-extrabold text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
                  SELECT LEADERSHIP PROFILE / ROLE *
                </label>
                <select
                  id="roleSelect"
                  value={selectedRoleUser}
                  onChange={(e) => handleRoleDropdownChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/40 dark:border-slate-800 text-xs sm:text-sm font-extrabold rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006094] cursor-pointer shadow-xs font-montserrat"
                >
                  {OFFICIAL_ACCOUNTS.map(acc => (
                    <option key={acc.user} value={acc.user}>
                      {acc.name} — ({acc.role})
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="USERNAME / LOGIN NAME *"
                id="loginUsername"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. admin"
                className="font-montserrat font-bold"
              />

              <FormInput
                label="PASSWORD *"
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="font-montserrat font-bold"
              />

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#006094] hover:bg-[#004165] text-white font-montserrat font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-[#004165] mt-2"
              >
                <span>Sign In to Dashboard</span>
                <FiArrowRight size={18} />
              </button>

              {/* Forgot Password option below Sign In Form */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setForgotMessage(''); }}
                  className="text-xs font-montserrat font-extrabold text-[#781327] dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot your password? Click here to recover
                </button>
              </div>
            </form>
          )}

          {/* 2. FORGOT PASSWORD VIEW */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 font-sans">
              <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl space-y-2 font-montserrat">
                <div className="text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider">
                  Password Recovery System
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Enter your officer username or email address below to receive password reset instructions.
                </p>
              </div>

              {forgotMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-extrabold font-montserrat">
                  {forgotMessage}
                </div>
              )}

              <FormInput
                label="USERNAME OR REGISTERED EMAIL *"
                id="forgotInput"
                value={forgotInput}
                onChange={(e) => setForgotInput(e.target.value)}
                placeholder="e.g. nitasha / admin@toastmasters.org"
                className="font-montserrat font-bold"
              />

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-[#580d1b]"
              >
                <span>Send Reset Link / Password Hint</span>
                <FiArrowRight size={18} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-extrabold text-[#006094] dark:text-sky-300 hover:underline font-montserrat cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 3. CREATE ACCOUNT FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans max-h-[600px] overflow-y-auto pr-1">
              {regError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-[#781327] dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-extrabold font-montserrat">
                  {regError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormInput
                  label="FULL NAME *"
                  id="regName"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Pramod K Murthy"
                  required
                />
                <FormInput
                  label="USERNAME *"
                  id="regUsername"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="pramod"
                  required
                />
                <FormInput
                  label="EMAIL ADDRESS"
                  id="regEmail"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="pramod@toastmasters.org"
                />
                <FormInput
                  label="DISTRICT *"
                  id="regDistrict"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  placeholder="District 227"
                />

                {/* Division / Area Dropdown Selection */}
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="regDivision" className="block text-xs font-extrabold text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
                    DIVISION / AREA SELECTION *
                  </label>
                  <select
                    id="regDivision"
                    value={regDivision}
                    onChange={(e) => setRegDivision(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-[#006094]/30 dark:border-slate-800 text-xs sm:text-sm font-extrabold rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006094] cursor-pointer shadow-xs font-montserrat"
                  >
                    {DIVISION_AREA_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <FormInput
                  label="OFFICER ROLE"
                  id="regRole"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  placeholder="Area Director / Division Director"
                />
                <FormInput
                  label="PASSWORD *"
                  id="regPassword"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border border-[#580d1b]"
              >
                <span>Create Officer Profile</span>
                <FiCheckCircle size={18} />
              </button>

              {/* Forgot Password option below Sign Up Form */}
              <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setForgotMessage(''); }}
                  className="text-xs font-montserrat font-extrabold text-[#781327] dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot your password? Click here to recover
                </button>
              </div>
            </form>
          )}

          {/* Security Assurance Badge */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-montserrat font-extrabold text-slate-500 dark:text-slate-400">
            <FiLock className="text-[#006094]" size={16} />
            <span>Official Toastmasters International Brand Standard</span>
          </div>

        </div>

      </div>
    </div>
  );
}
