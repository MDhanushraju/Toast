import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-205 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-medium flex flex-col sm:flex-row items-center justify-between gap-2 no-print">
      <div>
        <span className="font-extrabold text-slate-655 dark:text-slate-400">District 228</span> Demo Booklet System
      </div>
      <div>
        SaaS Version 1.1.0 • Stable Offline
      </div>
      <div>
        &copy; {new Date().getFullYear()} District 228 Team. Licensed for local corporate outreach.
      </div>
    </footer>
  );
}
