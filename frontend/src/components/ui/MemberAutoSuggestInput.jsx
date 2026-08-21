import React, { useState, useRef, useEffect } from 'react';

const DISTRICT_MEMBERS = [
  "Pramod K Murthy",
  "Prashant",
  "Ankita Bhaskara",
  "Rahul",
  "Hari",
  "Anish",
  "Siddharth",
  "TM Vinod",
  "TM Nikhil Periwal",
  "TM Antara Kundu",
  "TM Premdeep Taduavai",
  "TM Anjali Jha",
  "TM Arun Kota",
  "TM Priyanka Singh",
  "TM Devika",
  "TM Sowmya",
  "TM Janhavi",
  "TM Pankaj Joshi",
  "Anoop Menon"
];

export default function MemberAutoSuggestInput({
  value = '',
  onChange,
  placeholder = 'Type or select member name...',
  className = ''
}) {
  const [query, setQuery] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const filteredMembers = DISTRICT_MEMBERS.filter(m => 
    m.toLowerCase().includes((query || '').toLowerCase())
  );

  const handleSelect = (name) => {
    setQuery(name);
    setShowDropdown(false);
    if (onChange) onChange(name);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);
    if (onChange) onChange(val);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006094] ${className}`}
      />

      {showDropdown && filteredMembers.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 max-h-48 overflow-y-auto">
          <div className="text-[9px] font-black text-[#006094] uppercase tracking-widest px-2.5 py-1 font-montserrat border-b border-slate-100 dark:border-slate-800">
            District 227 Members
          </div>
          {filteredMembers.map((member, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(member)}
              className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-[#E6F0F6] dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-between font-montserrat"
            >
              <span>{member}</span>
              <span className="text-[9px] text-[#006094] font-black bg-[#E6F0F6] px-1.5 py-0.5 rounded-md">Member</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
