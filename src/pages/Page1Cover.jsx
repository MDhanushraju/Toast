import React from 'react';
import { useBooklet } from '../context/BookletContext';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import PageNavigation from '../components/PageNavigation';

export default function Page1Cover() {
  const { activeBooklet, updateBooklet } = useBooklet();

  if (!activeBooklet) return null;

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center space-y-6">
        <ToastmastersLogo district={activeBooklet.districtName || "DISTRICT 227"} size="lg" className="mx-auto my-4" />
        
        <span className="text-[10px] tracking-[0.25em] font-extrabold text-[#006094] dark:text-white uppercase block font-montserrat">
          MEETING BOOKLET
        </span>

        <input
          type="text"
          value={activeBooklet.title}
          onChange={(e) => updateBooklet(activeBooklet.id, { title: e.target.value })}
          className="w-full text-center text-2xl sm:text-3xl font-montserrat font-extrabold text-[#006094] dark:text-white bg-transparent border-b border-dashed border-[#e8ddd0] focus:border-[#006094] focus:outline-none py-2"
        />

        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Official Toastmasters District 227 preparation booklet for corporate sessions and club chartering.
        </p>
      </div>

      <PageNavigation />
    </div>
  );
}
