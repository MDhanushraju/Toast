import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-3 text-sm font-bold rounded-2xl bg-white text-slate-900 border-2 transition-all placeholder-slate-400
          dark:bg-[#0c1421] dark:text-white focus:outline-none shadow-xs
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
            : 'border-[#e8ddd0] dark:border-slate-800 hover:border-[#006094] focus:ring-2 focus:ring-[#006094] focus:border-[#006094] dark:focus:ring-sky-400'}
        `}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 font-extrabold">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
