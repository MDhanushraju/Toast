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
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer font-montserrat";
  
  const variants = {
    primary: "bg-[#006094] hover:bg-[#003a5c] text-white shadow-sm focus:ring-[#006094] dark:focus:ring-offset-slate-900",
    secondary: "bg-[#003a5c] hover:bg-[#002b45] text-white shadow-sm focus:ring-[#003a5c] dark:focus:ring-offset-slate-900",
    outline: "bg-white hover:bg-[#faf5ef] text-[#006094] border border-[#006094]/30 focus:ring-[#006094]",
    danger: "bg-red-700 hover:bg-red-800 text-white shadow-sm focus:ring-red-500 dark:focus:ring-offset-slate-900",
    ghost: "bg-transparent hover:bg-[#006094]/10 text-[#006094] dark:text-blue-200 focus:ring-[#006094]",
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
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
