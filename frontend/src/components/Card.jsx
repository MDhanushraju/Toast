import React from 'react';

export default function Card({ title, subtitle, icon: Icon, children, className = '', headerAction }) {
  return (
    <div className={`bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-[#1e2d42] rounded-2xl shadow-sm overflow-hidden p-5 flex flex-col gap-4 transition-all duration-200 ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-[#1e2d42] pb-3">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-2 rounded-xl bg-[#006094]/10 text-[#006094] dark:bg-[#006094]/30 dark:text-white flex items-center justify-center">
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && <h3 className="font-montserrat font-extrabold text-[#006094] dark:text-white text-sm leading-tight">{title}</h3>}
              {subtitle && <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="flex-1 text-xs text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
}
