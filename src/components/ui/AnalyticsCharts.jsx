import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooklet } from '../../context/BookletContext';
import { FiTrendingUp, FiCheckCircle, FiUsers, FiClock, FiAward, FiBarChart2 } from 'react-icons/fi';

export function AttendanceChart({ booklets = [] }) {
  const navigate = useNavigate();
  const { selectBooklet } = useBooklet();

  const data = booklets.map(b => ({
    id: b.id,
    title: b.title || 'Meeting Booklet',
    guests: b.page6?.guestCount || 0,
    status: b.status || 'completed'
  }));

  const maxGuests = Math.max(...data.map(d => d.guests), 20);

  const handleRowClick = (bookletId) => {
    selectBooklet(bookletId);
    navigate('/booklet/segment-3');
  };

  return (
    <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-[#006094]" size={18} />
          <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white">
            Completed Meetings
          </h3>
        </div>
        <span className="text-[10px] font-extrabold bg-[#E6F0F6] text-[#006094] px-2.5 py-0.5 rounded-full font-montserrat">
          Click to View Summary
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {data.map((item) => {
          const percent = maxGuests > 0 ? Math.min(100, Math.round((item.guests / maxGuests) * 100)) : 10;
          return (
            <div 
              key={item.id} 
              onClick={() => handleRowClick(item.id)}
              className="space-y-1 cursor-pointer group p-1.5 rounded-2xl hover:bg-[#E6F0F6]/50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-[#006094]/30"
              title={`Click to open ${item.title} Summary Page`}
            >
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 font-montserrat">
                <span className="truncate max-w-[200px] group-hover:text-[#006094] dark:group-hover:text-sky-300 font-black">{item.title}</span>
                <span className="text-[#781327] font-black">{item.guests} Guests</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className="bg-gradient-to-r from-[#006094] to-[#781327] h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${percent > 0 ? percent : 10}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimingAccuracyGauge({ activeBooklet }) {
  const speakerTracking = activeBooklet?.page5?.speakerTracking || [];
  const recordedCount = speakerTracking.filter(s => s.time && s.time !== '').length;
  const totalCount = Math.max(speakerTracking.length, 1);
  const accuracyPercent = Math.round((recordedCount / totalCount) * 100);

  return (
    <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FiClock className="text-[#781327]" size={18} />
          <h3 className="font-montserrat font-extrabold text-sm text-[#781327] dark:text-white">
            Speech Timing Discipline Gauge
          </h3>
        </div>
        <span className="text-[10px] font-black bg-rose-100 text-[#781327] px-2.5 py-0.5 rounded-full font-montserrat">
          Live Tracker
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        {/* Circle Progress */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - accuracyPercent / 100)}
              strokeLinecap="round"
              className="text-[#781327] transition-all duration-700"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-montserrat text-slate-900 dark:text-white">
              {accuracyPercent}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              TIMED
            </span>
          </div>
        </div>

        <div className="text-center space-y-0.5">
          <div className="text-xs font-black text-slate-800 dark:text-slate-200 font-montserrat">
            {recordedCount} of {totalCount} Role Players Recorded
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Strict Toastmasters timing compliance rate for active booklet.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CharteringReadinessMetrics({ booklets = [] }) {
  const completed = booklets.filter(b => b.status === 'completed').length;
  const ongoing = booklets.filter(b => b.status === 'ongoing').length;
  const upcoming = booklets.filter(b => b.status === 'upcoming').length;
  const total = booklets.length || 1;

  return (
    <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FiAward className="text-[#006094]" size={18} />
          <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white">
            District 227 Outreach Performance
          </h3>
        </div>
        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-montserrat">
          Healthy Status
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 rounded-2xl border border-[#e8ddd0] dark:border-slate-800">
          <div className="text-xl font-black text-[#781327] font-montserrat">{completed}</div>
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">Finished</div>
        </div>
        <div className="p-3 bg-[#E6F0F6] dark:bg-blue-950 rounded-2xl border border-[#006094]/20">
          <div className="text-xl font-black text-[#006094] dark:text-sky-300 font-montserrat">{ongoing}</div>
          <div className="text-[10px] font-extrabold text-[#006094] uppercase tracking-widest mt-0.5">Active</div>
        </div>
        <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 rounded-2xl border border-[#e8ddd0] dark:border-slate-800">
          <div className="text-xl font-black text-slate-700 dark:text-slate-200 font-montserrat">{upcoming}</div>
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">Scheduled</div>
        </div>
      </div>
    </div>
  );
}
