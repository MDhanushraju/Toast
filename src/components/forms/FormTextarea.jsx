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
          <label htmlFor={id} className="block text-[10px] font-extrabold text-[#006094] dark:text-white uppercase tracking-widest font-montserrat">
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
          w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 text-slate-900 border transition-all placeholder-slate-400 leading-relaxed
          dark:bg-[#0c1421] dark:text-slate-100 focus:outline-none
          ${error 
            ? 'border-red-400 focus:ring-1 focus:ring-red-500 focus:border-red-500' 
            : 'border-[#e8ddd0] dark:border-slate-800 hover:border-[#006094]/40 focus:ring-1 focus:ring-[#006094] focus:border-[#006094] dark:focus:ring-white'}
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
