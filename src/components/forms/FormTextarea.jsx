import React from 'react';

export default function FormTextarea({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  error,
  required = false,
  className = '',
  ...props
}) {
  const charactersCount = value ? value.length : 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={id} className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[9px] font-semibold text-slate-400">
            {charactersCount}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 text-slate-800 border transition-all placeholder-slate-400 leading-relaxed
          dark:bg-slate-950 dark:text-slate-200 focus:outline-none
          ${error 
            ? 'border-red-400 focus:ring-1 focus:ring-red-500 focus:border-red-500' 
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue'}
        `}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-[10px] text-red-500 font-bold">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
