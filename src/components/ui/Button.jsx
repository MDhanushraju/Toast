import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-blue hover:bg-brand-blue/90 text-white shadow-sm shadow-brand-blue/15 focus:ring-brand-blue dark:focus:ring-offset-slate-900",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-350 dark:border-slate-800 focus:ring-slate-300 dark:focus:ring-offset-slate-900",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/15 focus:ring-red-500 dark:focus:ring-offset-slate-900",
    ghost: "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 focus:ring-slate-200 dark:focus:ring-offset-slate-900",
  };

  const sizes = {
    xs: "px-2.5 py-1 text-[10px]",
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4.5 py-2.5 text-xs",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
