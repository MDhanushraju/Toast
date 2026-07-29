import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi';

const SEGMENTS = [
  { path: '/booklet/segment-1', label: 'Before Meeting' },
  { path: '/booklet/segment-2', label: 'During Meeting' },
  { path: '/booklet/segment-3', label: 'After Meeting' }
];

export default function PageNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = SEGMENTS.findIndex(s => s.path === location.pathname);
  const safeIndex = currentIndex !== -1 ? currentIndex : 0;

  const prevSegment = SEGMENTS[safeIndex - 1];
  const nextSegment = SEGMENTS[safeIndex + 1];

  return (
    <div className="mt-8 pt-4 border-t border-[#e8ddd0] dark:border-slate-800 no-print font-sans">
      <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-[#0c1421] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
        
        {/* Previous Button */}
        <div>
          {prevSegment ? (
            <button
              onClick={() => navigate(prevSegment.path)}
              className="flex items-center gap-2 bg-[#006094] hover:bg-[#003a5c] text-white font-montserrat font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer border border-[#003a5c]"
            >
              <FiChevronLeft size={18} />
              <span>Previous ({prevSegment.label})</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-montserrat font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FiHome size={18} />
              <span>Home Dashboard</span>
            </button>
          )}
        </div>

        {/* Step Indicator Badge */}
        <div className="hidden sm:flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat">
            Segment Navigation
          </span>
          <span className="text-xs font-black text-[#781327] dark:text-rose-300 font-montserrat">
            Segment {safeIndex + 1} of 3
          </span>
        </div>

        {/* Next Button */}
        <div>
          {nextSegment ? (
            <button
              onClick={() => navigate(nextSegment.path)}
              className="flex items-center gap-2 bg-[#781327] hover:bg-[#580d1b] text-white font-montserrat font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer border border-[#580d1b]"
            >
              <span>Next ({nextSegment.label})</span>
              <FiChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-[#006094] hover:bg-[#003a5c] text-white font-montserrat font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer border border-[#003a5c]"
            >
              <span>Finish & View Dashboard</span>
              <FiHome size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
