import React from 'react';
import PageNavigation from '../components/PageNavigation';

export default function Page2Ref() {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-montserrat font-extrabold text-[#006094] dark:text-white">
          Reference Guidelines & Standards
        </h2>
        <p className="text-xs text-slate-500">
          Toastmasters International District 227 standard protocols for corporate outreach.
        </p>
      </div>

      <PageNavigation />
    </div>
  );
}
