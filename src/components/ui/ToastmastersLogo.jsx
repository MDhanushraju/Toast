import React, { useState } from 'react';

export default function ToastmastersLogo({ 
  district = "TOASTMASTERS", 
  subtitle = "INTERNATIONAL", 
  size = "md", 
  showSubtitle = true,
  showText = true,
  className = "" 
}) {
  const [imgError, setImgError] = useState(true);

  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14"
  };

  // If passed "District 227", override to TOASTMASTERS INTERNATIONAL as requested
  const displayDistrict = district === "District 227" ? "TOASTMASTERS" : district;
  const displaySubtitle = subtitle === "CLUB GROWTH DASHBOARD" ? "INTERNATIONAL" : subtitle;

  return (
    <div className={`flex items-center gap-3 select-none min-w-0 ${className}`}>
      {/* Official Toastmasters Globe Emblem Badge */}
      <div className={`${sizeClasses[size] || "w-11 h-11"} bg-white rounded-xl p-0.5 flex items-center justify-center shadow-md shrink-0 border border-slate-200 overflow-hidden`}>
        {!imgError ? (
          <img 
            src={`${import.meta.env.BASE_URL}toastmasters-logo.png`} 
            alt="Toastmasters International Logo" 
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#006094" stroke="#781327" strokeWidth="3" />
            <circle cx="50" cy="50" r="42" fill="#006094" stroke="#F5C027" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="37" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
            <ellipse cx="50" cy="50" rx="37" ry="15" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
            <ellipse cx="50" cy="50" rx="18" ry="37" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
            <line x1="13" y1="50" x2="87" y2="50" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
            <line x1="50" y1="13" x2="50" y2="87" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
            <rect x="5" y="38" width="90" height="24" fill="#FFFFFF" rx="2" stroke="#781327" strokeWidth="1.5" />
            <text x="50" y="49" textAnchor="middle" fill="#004165" fontSize="7.5" fontWeight="900" fontFamily="Montserrat, Inter, sans-serif" letterSpacing="0.5">
              TOASTMASTERS
            </text>
            <text x="50" y="57" textAnchor="middle" fill="#781327" fontSize="4.8" fontWeight="800" fontFamily="Montserrat, Inter, sans-serif" letterSpacing="0.7">
              INTERNATIONAL
            </text>
          </svg>
        )}
      </div>

      {/* TOASTMASTERS INTERNATIONAL Title Lockup */}
      {showText && (
        <div className="text-left leading-tight">
          <h2 className="text-xl font-extrabold text-white font-montserrat tracking-tight uppercase">
            {displayDistrict}
          </h2>
          {showSubtitle && (
            <span className="text-[10px] sm:text-[11px] font-bold text-white/80 uppercase tracking-wider block font-montserrat mt-0.5">
              {displaySubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
