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
      <label className="flex items-start gap-3 p-3 bg-white dark:bg-[#0c1421] border border-[#e8ddd0] dark:border-slate-800 rounded-xl hover:border-[#006094]/40 cursor-pointer select-none transition-all duration-200">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="mt-0.5 w-4.5 h-4.5 text-[#006094] border-slate-350 rounded focus:ring-[#006094] focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
          {...props}
        />
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-[#006094] dark:text-slate-200 block leading-tight font-montserrat">
            {label}
          </span>
          {description && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-normal">
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
