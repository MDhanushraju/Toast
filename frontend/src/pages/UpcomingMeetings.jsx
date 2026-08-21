import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooklet } from '../context/BookletContext';
import Button from '../components/ui/Button';
import { 
  FiClock, FiPlus, FiArrowRight, FiCalendar, 
  FiMapPin, FiUsers, FiSearch, FiCheckCircle 
} from 'react-icons/fi';

export default function UpcomingMeetings() {
  const { booklets, selectBooklet, createBooklet } = useBooklet();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter ONLY upcoming meetings
  const upcomingMeetings = booklets.filter(b => b.status === 'upcoming');

  const filteredMeetings = upcomingMeetings.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.page3?.hostOrganization || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUpcomingBooklet = () => {
    const title = prompt("Enter title for upcoming meeting booklet:", "Upcoming Toastmasters Session");
    if (title && title.trim() !== "") {
      const newId = createBooklet(title.trim(), { status: 'upcoming' });
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
              Scheduled Calendar
            </span>
            <h1 className="text-2xl font-montserrat font-extrabold text-[#006094] dark:text-white mt-2 flex items-center gap-2">
              <FiClock className="text-[#006094]" /> Upcoming Meetings
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Dedicated repository of future scheduled Toastmasters meetings and upcoming sessions.
            </p>
          </div>

          <Button 
            variant="primary" 
            size="md" 
            onClick={handleCreateUpcomingBooklet} 
            className="bg-[#006094] hover:bg-[#004165] border-0 shrink-0 cursor-pointer font-montserrat text-white shadow-md font-extrabold"
          >
            <FiPlus className="mr-1.5" size={16} /> Schedule Upcoming Meeting
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search upcoming meetings by title or host organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006094]"
          />
        </div>
      </div>

      {/* Meetings Grid */}
      {filteredMeetings.length === 0 ? (
        <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E6F0F6] text-[#006094] flex items-center justify-center mx-auto">
            <FiClock size={24} />
          </div>
          <h3 className="font-montserrat font-extrabold text-base text-slate-800 dark:text-white">
            No Upcoming Meetings Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no upcoming meetings scheduled. Click below to schedule a new upcoming session.
          </p>
          <Button 
            onClick={handleCreateUpcomingBooklet}
            className="bg-[#006094] text-white font-montserrat font-extrabold text-xs px-4 py-2 rounded-xl mt-2"
          >
            Schedule Upcoming Meeting
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeetings.map(booklet => {
            const p3 = booklet.page3 || {};
            return (
              <div 
                key={booklet.id}
                className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-montserrat bg-[#E6F0F6] text-[#006094] border border-[#006094]/30">
                      UPCOMING
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <FiCalendar size={12} /> {p3.date || 'Scheduled'}
                    </span>
                  </div>

                  <h3 className="font-montserrat font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                    {booklet.title}
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1 font-semibold">
                    <div className="flex items-center gap-1.5 truncate">
                      <FiUsers size={14} className="text-[#006094] shrink-0" />
                      <span className="truncate">{p3.hostOrganization || 'District 227'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <FiMapPin size={14} className="text-[#781327] shrink-0" />
                      <span className="truncate">{p3.meetingLink || p3.venue || 'Venue TBD'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Navigation */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1.5 text-[10px] font-montserrat font-extrabold">
                  <button
                    onClick={() => handleOpenSegment(booklet.id, '/booklet/segment-1')}
                    className="py-1.5 px-2 bg-[#E6F0F6] text-[#006094] dark:bg-blue-950 dark:text-sky-300 rounded-xl hover:bg-[#006094] hover:text-white transition-all text-center cursor-pointer"
                  >
                    1. Before
                  </button>
                  <button
                    onClick={() => handleOpenSegment(booklet.id, '/booklet/segment-2')}
                    className="py-1.5 px-2 bg-[#E6F0F6] text-[#006094] dark:bg-blue-950 dark:text-sky-300 rounded-xl hover:bg-[#006094] hover:text-white transition-all text-center cursor-pointer"
                  >
                    2. During
                  </button>
                  <button
                    onClick={() => handleOpenSegment(booklet.id, '/booklet/segment-3')}
                    className="py-1.5 px-2 bg-[#E6F0F6] text-[#006094] dark:bg-blue-950 dark:text-sky-300 rounded-xl hover:bg-[#006094] hover:text-white transition-all text-center cursor-pointer"
                  >
                    3. After
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
