import React from 'react';

export default function ToastmastersLogo({ district = "DISTRICT 227", size = "md", className = "" }) {
  const isSmall = size === "sm";

  return (
    <div className={`bg-[#006094] border border-white/20 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-lg select-none ${className}`}>
      {/* Toastmasters Emblem / Globe Logo */}
      <div className="relative flex items-center justify-center mb-1">
        <svg 
          viewBox="0 0 100 100" 
          className={isSmall ? "w-10 h-10" : "w-16 h-16"}
        >
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" fill="#006094" stroke="#FFFFFF" strokeWidth="2" />
          
          {/* Globe Lines */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
          <ellipse cx="50" cy="50" rx="38" ry="16" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
          <ellipse cx="50" cy="50" rx="20" ry="38" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
          <line x1="12" y1="50" x2="88" y2="50" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
          <line x1="50" y1="12" x2="50" y2="88" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
          
          {/* Wordmark Banner */}
          <rect x="5" y="40" width="90" height="20" fill="#FFFFFF" rx="2" stroke="#006094" strokeWidth="1.5" />
          <text x="50" y="49" textAnchor="middle" fill="#006094" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            TOASTMASTERS
          </text>
          <text x="50" y="56" textAnchor="middle" fill="#003a5c" fontSize="5" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.8">
            INTERNATIONAL
          </text>
        </svg>
      </div>

      {/* District Label */}
      <span className="font-outfit font-extrabold text-white uppercase tracking-widest leading-tight text-xs sm:text-sm">
        {district}
      </span>
    </div>
  );
}
