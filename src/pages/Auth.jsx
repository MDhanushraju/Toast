import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';
import { FiUser, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function Auth() {
  const { loginUser, registerUser } = useBooklet();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('password');
  const [loginError, setLoginError] = useState('');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDistrict, setRegDistrict] = useState('District 227');
  const [regDivision, setRegDivision] = useState('Division A');
  const [regArea, setRegArea] = useState('Area 12');
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

    const success = loginUser(loginUsername, loginPassword);
    if (success) {
      navigate('/');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName || !regUsername || !regPassword) {
      setRegError('Please complete all required fields');
      return;
    }

    const success = registerUser({
      name: regName,
      username: regUsername,
      email: regEmail,
      district: regDistrict,
      division: regDivision,
      area: regArea,
      role: regRole,
      password: regPassword
    });

    if (success) {
      navigate('/');
    } else {
      setRegError('Registration failed. Username might be taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf5ef] dark:bg-[#0b1320] px-4 transition-colors duration-300 font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* App Title Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.25em] font-extrabold text-[#006094] dark:text-white uppercase block font-montserrat">
            DISTRICT 227 SAAS PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#006094] dark:text-white leading-tight">
            Booklet Management System
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Access, document, and track Toastmasters corporate outreach meetings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#faf5ef] dark:bg-[#0c1421] p-1.5 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 font-montserrat">
          <button
            onClick={() => { setIsLogin(true); setLoginError(''); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              isLogin 
                ? 'bg-[#006094] text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-[#006094]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setRegError(''); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              !isLogin 
                ? 'bg-[#006094] text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-[#006094]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <h3 className="font-montserrat font-extrabold text-[#006094] dark:text-white text-sm flex items-center gap-1.5 border-b border-[#f3ebe1] dark:border-slate-800 pb-2">
              <FiUser className="text-[#006094]" /> Login Credentials
            </h3>
            
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 border border-red-200 rounded-xl text-[10px] font-bold">
                {loginError}
              </div>
            )}

            <div className="space-y-3">
              <FormInput
                label="Username / Login name"
                id="loginUsername"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. admin"
              />
              <FormInput
                label="Password"
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5 text-white">
              Sign In
            </Button>

            <div className="text-[10px] text-slate-500 text-center font-medium leading-relaxed pt-2">
              Tip: Enter any username/password to log in immediately.
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            <h3 className="font-montserrat font-extrabold text-[#006094] dark:text-white text-sm flex items-center gap-1.5 border-b border-[#f3ebe1] dark:border-slate-800 pb-2">
              <FiShield className="text-[#006094]" /> Register Officer Profile
            </h3>

            {regError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 border border-red-200 rounded-xl text-[10px] font-bold">
                {regError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Full Name *"
                id="regName"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Pramod K Murthy"
                required
              />
              <FormInput
                label="Username *"
                id="regUsername"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="pramod"
                required
              />
              <FormInput
                label="Email Address"
                id="regEmail"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="pramod@toastmasters.org"
              />
              <FormInput
                label="District *"
                id="regDistrict"
                value={regDistrict}
                onChange={(e) => setRegDistrict(e.target.value)}
                placeholder="District 227"
              />
              <FormInput
                label="Division"
                id="regDivision"
                value={regDivision}
                onChange={(e) => setRegDivision(e.target.value)}
                placeholder="Division A"
              />
              <FormInput
                label="Area"
                id="regArea"
                value={regArea}
                onChange={(e) => setRegArea(e.target.value)}
                placeholder="Area 12"
              />
              <FormInput
                label="Officer Role"
                id="regRole"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                placeholder="Area Director"
              />
              <FormInput
                label="Password *"
                id="regPassword"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5 text-white">
              Create Officer Account
            </Button>
          </form>
        )}

        {/* Feature summary card */}
        <div className="bg-[#E6F0F6]/50 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl p-4 space-y-2">
          <h4 className="font-montserrat font-extrabold text-[#006094] dark:text-white text-xs">
            District 227 System Capabilities:
          </h4>
          <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
            <li className="flex items-center gap-1.5"><FiCheckCircle className="text-[#006094]" /> 3-Step Meeting Preparation & Agenda Generation</li>
            <li className="flex items-center gap-1.5"><FiCheckCircle className="text-[#006094]" /> Live Stopwatch Timer & Speaker Duration Tracking</li>
            <li className="flex items-center gap-1.5"><FiCheckCircle className="text-[#006094]" /> Single-Page Lead Database & Executive Brand Letterhead</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
