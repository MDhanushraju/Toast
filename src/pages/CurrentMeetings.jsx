import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooklet } from '../context/BookletContext';
import Button from '../components/ui/Button';
import { 
  FiZap, FiClock, FiPlus, FiArrowRight, FiCalendar, 
  FiMapPin, FiUsers, FiSearch, FiCheckCircle, FiTrash2 
} from 'react-icons/fi';

export default function CurrentMeetings() {
  const { booklets, selectBooklet, createBooklet, deleteBooklet } = useBooklet();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter current active meetings (ONLY ongoing)
  const currentMeetings = booklets.filter(b => b.status === 'ongoing');

  const filteredMeetings = currentMeetings.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.page3?.hostOrganization || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBooklet = () => {
    const title = prompt("Enter title for the new meeting booklet:", "District Meeting");
    if (title && title.trim() !== "") {
      const newId = createBooklet(title.trim());
      navigate('/booklet/segment-1');
    }
  };

  const handleOpenSegment = (id, segmentPath) => {
    selectBooklet(id);
    navigate(segmentPath);
  };

  return (
    <div className="space-y-6 font-sans pb-8">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#006094] bg-[#E6F0F6] border border-[#006094]/30 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Active Dashboard
            </span>
            <h1 className="text-2xl font-montserrat font-extrabold text-[#006094] dark:text-white mt-2 flex items-center gap-2">
              <FiZap className="text-[#781327]" /> Current Meetings (Today & Upcoming)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              View and manage active Toastmasters meetings currently ongoing today or scheduled upcoming.
            </p>
          </div>

          <Button 
            variant="primary" 
            size="md" 
            onClick={handleCreateBooklet} 
            className="bg-[#781327] hover:bg-[#580d1b] border-0 shrink-0 cursor-pointer font-montserrat text-white shadow-md font-extrabold"
          >
            <FiPlus className="mr-1.5" size={16} /> New Meeting Booklet
          </Button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search active meetings by title or host organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006094]"
          />
        </div>
      </div>

      {/* Current Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filteredMeetings.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-10 text-center text-slate-400 font-semibold space-y-2">
            <FiClock size={32} className="mx-auto text-slate-300" />
            <p>No active meetings found matching your search.</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const isOngoing = meeting.status === 'ongoing';
            const page3 = meeting.page3 || {};
            const roles = page3.roles || {};

            return (
              <div 
                key={meeting.id}
                className={`rounded-3xl p-6 shadow-md border transition-all space-y-4 ${
                  isOngoing 
                    ? 'bg-gradient-to-br from-[#781327] to-[#580d1b] text-white border-[#781327] shadow-xl' // Bright vibrant maroon for ongoing today
                    : 'bg-white dark:bg-[#121e2d] text-slate-900 dark:text-white border-[#006094]/30' // Light bright for upcoming
                }`}
              >
                {/* Card Header & Status Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-white/20 dark:border-slate-800 pb-3">
                  <div>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest font-montserrat inline-flex items-center gap-1 ${
                      isOngoing 
                        ? 'bg-white text-[#781327] animate-pulse shadow-xs' 
                        : 'bg-[#E6F0F6] text-[#006094] dark:bg-blue-950 dark:text-sky-300'
                    }`}>
                      {isOngoing ? '🟢 ONGOING TODAY' : '🔵 UPCOMING'}
                    </span>
                    <h2 className={`text-lg font-montserrat font-black mt-2 truncate ${isOngoing ? 'text-white' : 'text-[#006094] dark:text-white'}`}>
                      {meeting.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 font-mono ${
                      isOngoing ? 'bg-white/20 text-white' : 'bg-[#781327] text-white'
                    }`}>
                      {meeting.completedPercent || 0}% Done
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to cancel and remove "${meeting.title}"?`)) {
                          deleteBooklet(meeting.id);
                        }
                      }}
                      className="p-1.5 bg-rose-600/80 hover:bg-rose-700 text-white rounded-xl text-xs font-montserrat font-bold cursor-pointer transition-all border border-rose-500/50 shadow-xs"
                      title="Cancel / Remove Meeting Session"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FiCalendar className={isOngoing ? 'text-rose-200' : 'text-[#006094]'} />
                    <span className="font-semibold">{page3.date || 'Today'} • {page3.time || '10:00 AM'}</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <FiMapPin className={isOngoing ? 'text-rose-200' : 'text-[#006094]'} />
                    <span className="font-semibold truncate">{page3.venue || 'Auditorium A'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiUsers className={isOngoing ? 'text-rose-200' : 'text-[#006094]'} />
                    <span className="font-semibold truncate">TM: {roles.toastmaster || 'Prashant'}</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <FiCheckCircle className={isOngoing ? 'text-rose-200' : 'text-[#006094]'} />
                    <span className="font-semibold truncate">Host: {page3.hostOrganization || '—'}</span>
                  </div>
                </div>

                {/* Quick Action Navigation */}
                <div className="pt-2 flex items-center gap-2 border-t border-white/20 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenSegment(meeting.id, '/booklet/segment-1')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold font-montserrat transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isOngoing 
                        ? 'bg-white text-[#781327] hover:bg-slate-100 shadow-xs' 
                        : 'bg-[#006094] text-white hover:bg-[#003a5c]'
                    }`}
                  >
                    1. Before Meeting <FiArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => handleOpenSegment(meeting.id, '/booklet/segment-2')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold font-montserrat transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isOngoing 
                        ? 'bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-xs font-black' 
                        : 'bg-[#781327] text-white hover:bg-[#580d1b]'
                    }`}
                  >
                    2. During Meeting <FiArrowRight size={13} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
