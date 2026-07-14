import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';
import { FiLock, FiUser, FiMail, FiMapPin, FiCompass, FiShield, FiCheck } from 'react-icons/fi';

export default function Auth() {
  const { loginUser, registerUser } = useBooklet();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAreaDirector, setRegAreaDirector] = useState('');
  const [regDivision, setRegDivision] = useState('');
  const [regDivDirector, setRegDivDirector] = useState('');
  const [regDistrict, setRegDistrict] = useState('District 228');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername || !loginPassword) {
      setLoginError('Please enter username and password');
      return;
    }
    const result = loginUser(loginUsername, loginPassword);
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');
    if (!regUsername || !regPassword || !regName || !regEmail) {
      setRegError('Please fill out all required fields');
      return;
    }
    const userData = {
      username: regUsername,
      password: regPassword,
      name: regName,
      email: regEmail,
      areaDirectorOf: regAreaDirector,
      division: regDivision,
      divisionDirectorName: regDivDirector,
      district: regDistrict
    };
    const result = registerUser(userData);
    if (!result.success) {
      setRegError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 transition-colors duration-300 font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* App Title Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.25em] font-extrabold text-gold uppercase block">
            DISTRICT 228 SAAS PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 leading-tight">
            Booklet Management System
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Access, document, and track Toastmasters corporate outreach meetings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-850">
          <button
            onClick={() => { setIsLogin(true); setLoginError(''); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              isLogin 
                ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm border border-slate-200/50 dark:border-slate-800' 
                : 'text-slate-450 dark:text-slate-400 hover:text-brand-blue'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setRegError(''); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isLogin 
                ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm border border-slate-200/50 dark:border-slate-800' 
                : 'text-slate-450 dark:text-slate-400 hover:text-brand-blue'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Forms */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <h3 className="font-outfit font-bold text-slate-800 dark:text-slate-205 text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
              <FiUser className="text-brand-blue" /> Login Credentials
            </h3>
            
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 border border-red-100 dark:border-red-950/40 rounded-xl text-[10px] font-bold">
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

            <Button type="submit" variant="primary" className="w-full py-2.5">
              Sign In
            </Button>

            <div className="text-[10px] text-slate-400 text-center font-medium leading-relaxed pt-2">
              Tip: Use default credentials <strong>username: admin</strong> / <strong>password: password</strong> to log in immediately.
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            <h3 className="font-outfit font-bold text-slate-800 dark:text-slate-205 text-sm flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
              <FiShield className="text-gold" /> Register Officer Profile
            </h3>

            {regError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-655 border border-red-100 dark:border-red-950/40 rounded-xl text-[10px] font-bold">
                {regError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Name *"
                id="regName"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="First & Last Name"
              />
              <FormInput
                label="Email *"
                id="regEmail"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@d228.org"
              />
              <FormInput
                label="Area Director of"
                id="regAreaDirector"
                value={regAreaDirector}
                onChange={(e) => setRegAreaDirector(e.target.value)}
                placeholder="e.g. Area 12"
              />
              <FormInput
                label="Division"
                id="regDivision"
                value={regDivision}
                onChange={(e) => setRegDivision(e.target.value)}
                placeholder="e.g. Division A"
              />
              <FormInput
                label="Division Director Name"
                id="regDivDirector"
                value={regDivDirector}
                onChange={(e) => setRegDivDirector(e.target.value)}
                placeholder="Division Director Name"
              />
              <FormInput
                label="District *"
                id="regDistrict"
                value={regDistrict}
                onChange={(e) => setRegDistrict(e.target.value)}
                placeholder="District 228"
              />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-850 pt-3 space-y-4">
              <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-205 text-xs">
                Set Sign-In Credentials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Username *"
                  id="regUsername"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Set login username"
                />
                <FormInput
                  label="Password *"
                  id="regPassword"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set password"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5 mt-4">
              Register & Sign In
            </Button>
          </form>
        )}

      </div>
    </div>
  );
}
