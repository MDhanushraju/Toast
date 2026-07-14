import React from 'react';

export default function Card({ title, subtitle, icon: Icon, children, className = '', headerAction }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden p-5 flex flex-col gap-4 transition-all duration-200 ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 flex items-center justify-center">
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && <h3 className="font-outfit font-bold text-slate-800 dark:text-slate-250 text-sm leading-tight">{title}</h3>}
              {subtitle && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="flex-1 text-xs text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </div>
  );
}
