import React from 'react';

export default function FormCheckbox({
  label,
  id,
  checked,
  onChange,
  description,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-start gap-3 p-3 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl hover:border-brand-blue/30 cursor-pointer select-none transition-all duration-200">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="mt-0.5 w-4.5 h-4.5 text-brand-blue border-slate-350 rounded focus:ring-brand-blue focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          {...props}
        />
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block leading-tight">
            {label}
          </span>
          {description && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-normal">
              {description}
            </span>
          )}
        </div>
      </label>
      {error && (
        <p className="text-[10px] text-red-500 font-bold pl-1">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
