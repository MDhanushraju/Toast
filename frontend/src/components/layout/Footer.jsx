import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 px-6 bg-white dark:bg-slate-900 border-t border-[#e8ddd0] dark:border-slate-800 text-slate-500 text-[10px] font-medium flex flex-col sm:flex-row items-center justify-between gap-2 no-print font-sans">
      <div>
        <span className="font-extrabold text-[#006094] dark:text-white font-montserrat">District 227</span> Booklet System
      </div>
      <div>
        SaaS Version 1.3.0 • Stable Offline
      </div>
      <div>
        &copy; {new Date().getFullYear()} District 227 Team. Licensed for local corporate outreach.
      </div>
    </footer>
  );
}
