import React from 'react';
import ToastmastersLogo from './ToastmastersLogo';

export default function BrandLetterhead({
  districtName = "District 227",
  division = "Division A",
  area = "Area 12",
  title = "",
  date = new Date().toISOString().split('T')[0],
  content,
  children
}) {
  return (
    <div className="brand-letterhead font-sans shadow-md border border-[#e8ddd0] bg-white rounded-2xl overflow-hidden text-slate-900 my-4">
      {/* Official Header Strip - Rich Maroon */}
      <div className="bg-[#781327] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#580d1b]">
        {/* District Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-xs shrink-0">
            <ToastmastersLogo showText={false} size="sm" className="bg-transparent border-0 shadow-none p-0" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest block text-white/80 font-montserrat leading-tight">
              TOASTMASTERS INTERNATIONAL
            </span>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider font-montserrat leading-tight text-white mt-0.5">
              {districtName || 'DISTRICT 227'}
            </h2>
          </div>
        </div>

        {/* Division & Date Badge */}
        <div className="text-right text-xs font-semibold space-y-0.5">
          <div className="font-extrabold text-white font-montserrat uppercase tracking-wider">{division} • {area}</div>
          <div className="text-[10px] text-white/80 font-medium">{date}</div>
        </div>
      </div>

      {/* Main Document Body Canvas */}
      <div className="p-8 sm:p-10 space-y-6 bg-white min-h-[400px]">
        {/* Document Headline */}
        <div className="border-b border-[#e8ddd0] pb-4">
          <h3 className="text-lg font-black font-montserrat text-[#006094] uppercase tracking-wide">
            {title || 'Corporate Session Authorization'}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Prepared under District 227 Leadership Guidelines
          </p>
        </div>

        {/* Dynamic Content area */}
        <div className="text-xs text-slate-700 leading-relaxed space-y-4 font-normal">
          {content || children || (
            <>
              <p>
                This document confirms official authorization for conducting Toastmasters International corporate meetings under District 227. All presentations adhere strictly to brand manual guidelines, utilizing primary Blissful Blue (#006094).
              </p>
              <p>
                Toastmasters International's educational programs empower employees to build public speaking confidence, leadership abilities, and strategic communication skills in corporate environments.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Official Footer Banner with Address & Contact */}
      <div className="bg-[#FAF5EF] border-t border-[#e8ddd0] p-4 text-center text-[10px] text-slate-500 font-semibold space-y-0.5">
        <div>Toastmasters International • District 227 Corporate Outreach Division</div>
        <div className="text-slate-400">Where Leaders Are Made • Official Executive Stationery</div>
      </div>
    </div>
  );
}
