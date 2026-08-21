import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import ProgressRing from '../components/ProgressRing';
import Button from '../components/ui/Button';
import { 
  AttendanceChart, TimingAccuracyGauge, CharteringReadinessMetrics 
} from '../components/ui/AnalyticsCharts';
import { 
  FiFileText, FiPlus, FiGrid, FiClock, FiTrash2, 
  FiCopy, FiEdit3, FiTrendingUp, FiCheckCircle, FiActivity,
  FiCalendar, FiFolderPlus, FiDatabase, FiAward, FiCheck,
  FiChevronLeft, FiChevronRight, FiMapPin, FiUsers, FiX, FiZap,
  FiDownload, FiUpload
} from 'react-icons/fi';
import { 
  format, parseISO, compareAsc, addMonths, subMonths, 
  startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, startOfWeek, endOfWeek 
} from 'date-fns';

export default function Dashboard() {
  const { 
    booklets, activeBooklet, selectBooklet, createBooklet, deleteBooklet, 
    duplicateBooklet, activities, updateBookletPage, exportBookletsJSON, importBookletsJSON,
    unlockDemoMeeting
  } = useBooklet();
  const navigate = useNavigate();
  
  const [newTitle, setNewTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);

  // Stats Calculations
  const totalBooklets = booklets.length;

  // 1. Completed Booklets Count
  const completedCount = booklets.filter(b => b.status === 'completed' || b.completedPercent === 100).length;

  // 2. Ongoing / Today Meetings Count
  const ongoingTodayCount = booklets.filter(b => b.status === 'ongoing').length;

  // 3. Upcoming Future Meetings Count
  const upcomingCount = booklets.filter(b => b.status === 'upcoming').length;

  const avgProgress = totalBooklets > 0 
    ? Math.round(booklets.reduce((acc, b) => acc + (b.completedPercent || 0), 0) / totalBooklets)
    : 0;

  // Count checks
  let totalTasksCompleted = 0;
  let totalTasksPending = 0;
  
  booklets.forEach(b => {
    const p3Checks = b.page3?.checklist || {};
    Object.values(p3Checks).forEach(val => val ? totalTasksCompleted++ : totalTasksPending++);

    const p4Rows = b.page4?.rows || [];
    p4Rows.forEach(r => r.ready ? totalTasksCompleted++ : totalTasksPending++);

    const p5Checks = b.page5?.checklist || {};
    Object.values(p5Checks).forEach(val => val ? totalTasksCompleted++ : totalTasksPending++);
  });

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (newTitle.trim() === '') return;
    const newId = createBooklet(newTitle);
    unlockDemoMeeting();
    setNewTitle('');
    setShowCreateModal(false);
    navigate('/booklet/segment-1');
  };

  const handleContinue = () => {
    if (activeBooklet) {
      navigate('/booklet/segment-1');
    }
  };

  // Calendar logic helpers
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Find booklets scheduled on a specific day
  const getBookletsForDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return booklets.filter(b => b.page3?.date === dateStr);
  };

  // Handle clicking a date cell
  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowDateModal(true);
  };

  // Schedule a new booklet for selected date
  const handleScheduleForDate = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const title = `District Meeting (${format(selectedDate, 'MMM dd, yyyy')})`;
    const newId = createBooklet(title);
    updateBookletPage('page3', { date: dateStr });
    setShowDateModal(false);
    navigate('/booklet/segment-1');
  };

  // Booklets scheduled for selected date in modal
  const selectedDayBooklets = selectedDate ? getBookletsForDay(selectedDate) : [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Dashboard Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ddd0] dark:border-slate-800 pb-4">
        <div>
          <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-bold mt-1">
            Toastmasters District 227 Booklet & Corporate Meeting Management Console
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeBooklet && (
            <Button
              variant="secondary"
              size="md"
              className="bg-[#006094] hover:bg-[#003a5c] text-white border-0 cursor-pointer font-montserrat shadow-xs font-black text-sm sm:text-base px-4 py-2.5"
              onClick={handleContinue}
            >
              Continue Editing
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            className="bg-[#781327] hover:bg-[#580d1b] text-white font-black border-0 shadow-md cursor-pointer font-montserrat flex items-center gap-2 text-sm sm:text-base px-4 py-2.5"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus size={18} /> Create New Demo Meeting
          </Button>
          <button
            onClick={exportBookletsJSON}
            title="Backup booklet dataset to JSON file"
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-[#006094] dark:text-sky-300 hover:bg-[#E6F0F6] rounded-xl text-sm font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer font-montserrat"
          >
            <FiDownload size={16} /> Export Backup
          </button>
          <label
            title="Import booklet JSON dataset"
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 rounded-xl text-sm font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer font-montserrat"
          >
            <FiUpload size={16} className="text-[#781327]" /> Import JSON
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target.result);
                      importBookletsJSON(data);
                    } catch (err) {
                      alert("Invalid JSON file");
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Restructured Top 3 Metric Cards as Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Completed Meetings */}
        <div 
          onClick={() => navigate('/meeting-history')}
          className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 cursor-pointer hover:border-[#781327] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#781327] dark:text-rose-300 uppercase tracking-widest font-montserrat">
              <FiCheckCircle size={18} className="text-[#781327] dark:text-rose-400" /> COMPLETED MEETINGS
            </div>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black px-3 py-1 rounded-full">Finished</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-montserrat">
            {completedCount}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-bold">
            Total finished meeting booklets
          </div>
        </div>

        {/* Card 2: Meetings Today / Ongoing */}
        <div 
          onClick={() => navigate('/current-meetings')}
          className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 cursor-pointer hover:border-[#781327] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#781327] dark:text-rose-300 uppercase tracking-widest font-montserrat">
              <FiZap size={18} className="text-[#781327] dark:text-rose-400" /> MEETINGS TODAY / ONGOING
            </div>
            <span className="text-xs bg-rose-100 dark:bg-rose-950 text-[#781327] dark:text-rose-300 font-black px-3 py-1 rounded-full animate-pulse">Live Today</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-montserrat">
            {ongoingTodayCount}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-bold">
            Sessions running today
          </div>
        </div>

        {/* Card 3: Upcoming Future Meetings */}
        <div 
          onClick={() => navigate('/current-meetings')}
          className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 cursor-pointer hover:border-[#006094] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#006094] dark:text-sky-400 uppercase tracking-widest font-montserrat">
              <FiCalendar size={18} className="text-[#006094]" /> UPCOMING FUTURE MEETINGS
            </div>
            <span className="text-xs bg-[#E6F0F6] dark:bg-blue-950 text-[#006094] dark:text-sky-300 font-black px-3 py-1 rounded-full">Scheduled</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-montserrat">
            {upcomingCount}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-bold">
            Meetings scheduled in future
          </div>
        </div>

      </div>

      {/* Active Booklet Main Status Banner */}
      {activeBooklet ? (
        <div className="bg-[#E6F0F6]/60 dark:bg-[#121e2d] border border-[#006094]/30 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <ProgressRing 
                progress={activeBooklet.completedPercent || 0} 
                size={85} 
                strokeWidth={8} 
                color="#006094" 
              />
              <div>
                <span className="text-xs font-black text-[#006094] bg-white dark:bg-slate-900 border border-[#006094]/30 px-3.5 py-1 rounded-full uppercase tracking-widest font-montserrat">
                  Active Meeting Booklet
                </span>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-black text-[#006094] dark:text-white mt-2">
                  {activeBooklet.title}
                </h2>
                <div className="flex items-center gap-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-bold mt-1.5">
                  <span>Organization: <strong>{activeBooklet.page3?.hostOrganization || 'Unassigned'}</strong></span>
                  <span>•</span>
                  <span>Date: <strong>{activeBooklet.page3?.date || 'Today'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
              <Button
                variant="primary"
                size="md"
                className="bg-[#004165] hover:bg-[#002b44] text-white border-0 font-montserrat font-black text-sm sm:text-base px-4 py-2.5 shadow-xs"
                onClick={() => navigate('/booklet/segment-1')}
              >
                Before Meeting
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="bg-[#781327] hover:bg-[#580d1b] text-white border-0 font-montserrat font-black text-sm sm:text-base px-4 py-2.5 shadow-xs"
                onClick={() => navigate('/booklet/segment-2')}
              >
                During Meeting Live
              </Button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to cancel and remove "${activeBooklet.title}"?`)) {
                    deleteBooklet(activeBooklet.id);
                  }
                }}
                className="p-2.5 bg-rose-600/80 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-montserrat font-black cursor-pointer transition-all border border-rose-500/50 shadow-xs flex items-center gap-1.5"
                title="Cancel / Delete Active Meeting Session"
              >
                <FiTrash2 size={16} />
                <span className="hidden sm:inline">Cancel Session</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 🚀 Quick Launch Operations Hub */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094]/30 dark:border-sky-900 rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-[#006094]/20 pb-4">
          <div className="flex items-center gap-3">
            <FiZap className="text-[#781327] dark:text-rose-400" size={24} />
            <h3 className="font-montserrat font-black text-xl sm:text-2xl text-[#006094] dark:text-white">
              Toastmasters Quick Launch Operations Hub
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-[#E6F0F6] text-[#006094] dark:bg-sky-950 dark:text-sky-300 px-3.5 py-1.5 rounded-full font-montserrat">
            One-Click Workflows
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Quick Action 3: Master Reports */}
          <button
            onClick={() => {
              if (activeBooklet) navigate(`/meeting-report/${activeBooklet.id}`);
              else navigate('/meeting-report');
            }}
            className="p-5 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl hover:border-[#781327] transition-all text-left group cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#781327] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <FiFileText size={24} />
            </div>
            <div>
              <div className="font-montserrat font-black text-base sm:text-lg text-slate-900 dark:text-white">Master Executive Report</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-1">View printable 3-segment report</div>
            </div>
          </button>

          {/* Quick Action 4: Official Manual Download */}
          <a
            href="https://ccdn.toastmasters.org//medias/files/pathways/toastmaster-wears-many-hats/1167d-a-toastmaster-wears-many-hats.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-[#E6F0F6]/50 dark:bg-slate-900 border border-[#006094]/20 dark:border-slate-800 rounded-2xl hover:border-[#006094] transition-all text-left group cursor-pointer space-y-3 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#006094] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <FiDownload size={24} />
            </div>
            <div>
              <div className="font-montserrat font-black text-base sm:text-lg text-slate-900 dark:text-white">Official Member Manual</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-1">Download Toastmasters PDF guide</div>
            </div>
          </a>

        </div>
      </div>

      {/* 📅 Compact Interactive Meeting Tracker Calendar */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3ebe1] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <FiCalendar size={24} className="text-[#006094]" />
            <h3 className="font-montserrat font-black text-xl sm:text-2xl text-[#006094] dark:text-white">
              Meeting Tracker Calendar ({format(currentMonth, 'MMMM yyyy')})
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-[#E6F0F6] text-[#006094] hover:bg-[#006094] hover:text-white dark:bg-slate-800 dark:text-slate-200 text-sm font-black rounded-xl transition-all cursor-pointer font-montserrat"
            >
              Today
            </button>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Previous Month"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Next Month"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Calendar Days Grid */}
        <div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-montserrat text-sm sm:text-base font-black text-slate-500 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayBooklets = getBookletsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[70px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    !isCurrentMonth 
                      ? 'bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 border-transparent' 
                      : isDayToday
                      ? 'bg-[#E6F0F6] dark:bg-blue-950 border-[#006094] text-[#006094] font-black shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-[#e8ddd0] dark:border-slate-800 hover:border-[#006094]/40 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm sm:text-base font-black ${isDayToday ? 'text-[#006094] dark:text-white font-black' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayBooklets.length > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#781327] animate-pulse"></span>
                    )}
                  </div>

                  {dayBooklets.length > 0 && (
                    <div className="space-y-0.5">
                      {dayBooklets.slice(0, 1).map(b => (
                        <div key={b.id} className="text-[10px] sm:text-xs bg-[#781327] text-white px-2 py-0.5 rounded-md truncate font-black shadow-2xs">
                          {b.title}
                        </div>
                      ))}
                      {dayBooklets.length > 1 && (
                        <div className="text-[9px] text-[#006094] font-black text-right pr-0.5">
                          +{dayBooklets.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 📋 Recent Meeting Booklets Table */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <FiGrid size={22} className="text-[#006094]" />
            <h3 className="font-montserrat font-black text-xl sm:text-2xl text-[#006094] dark:text-white">
              Recent Meeting Booklets & Direct Operations
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 font-montserrat">
            Showing {Math.min(booklets.length, 5)} of {booklets.length} Booklets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#e8ddd0] dark:border-slate-800 text-xs sm:text-sm uppercase font-montserrat font-black text-slate-500">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Host Organization</th>
                <th className="py-3 px-4">Meeting Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ebe1] dark:divide-slate-800 font-bold">
              {booklets.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-[#E6F0F6]/30 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-montserrat font-black text-base text-slate-900 dark:text-white block">
                      {b.title}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">ID: {b.id.substring(0, 8)}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-bold text-sm">
                    {b.page3?.hostOrganization || 'District 227'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-bold text-sm">
                    {b.page3?.date || 'Unscheduled'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-montserrat ${
                      b.status === 'completed' || b.completedPercent === 100
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : b.status === 'ongoing'
                        ? 'bg-rose-100 text-[#781327] dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-[#E6F0F6] text-[#006094] dark:bg-blue-950 dark:text-sky-300'
                    }`}>
                      {b.status || 'Upcoming'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          selectBooklet(b.id);
                          navigate('/booklet/segment-1');
                        }}
                        className="px-3.5 py-1.5 bg-[#006094] text-white rounded-xl text-xs sm:text-sm font-black hover:bg-[#003a5c] transition-all cursor-pointer font-montserrat"
                      >
                        Agenda
                      </button>
                      <button
                        onClick={() => {
                          selectBooklet(b.id);
                          navigate('/booklet/segment-2');
                        }}
                        className="px-3.5 py-1.5 bg-[#781327] text-white rounded-xl text-xs sm:text-sm font-black hover:bg-[#580d1b] transition-all cursor-pointer font-montserrat"
                      >
                        Live Timer
                      </button>
                      <button
                        onClick={() => navigate(`/meeting-report/${b.id}`)}
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-black hover:bg-slate-200 transition-all cursor-pointer font-montserrat"
                      >
                        Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Date Detail Popup Modal */}
      {showDateModal && selectedDate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#006094] uppercase tracking-widest font-montserrat">
                  Scheduled Meetings
                </span>
                <h3 className="text-lg font-montserrat font-extrabold text-slate-900 dark:text-white">
                  {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                </h3>
              </div>
              <button 
                onClick={() => setShowDateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedDayBooklets.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-slate-900 rounded-2xl">
                  No meetings scheduled for this date.
                </div>
              ) : (
                selectedDayBooklets.map(b => (
                  <div key={b.id} className="p-3 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/30 rounded-2xl flex items-center justify-between gap-2">
                    <div>
                      <div className="font-montserrat font-extrabold text-xs text-[#006094] dark:text-sky-300">{b.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Host: {b.page3?.hostOrganization || 'District 227'}
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="xs"
                      className="bg-[#781327] hover:bg-[#580d1b] text-white shrink-0"
                      onClick={() => {
                        selectBooklet(b.id);
                        setShowDateModal(false);
                        navigate('/booklet/segment-1');
                      }}
                    >
                      Open
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex items-center gap-2 justify-end border-t border-[#e8ddd0] dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDateModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-[#006094] hover:bg-[#003a5c] text-white font-extrabold"
                onClick={handleScheduleForDate}
              >
                <FiPlus size={14} className="mr-1" /> Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Start New Booklet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-montserrat font-extrabold text-slate-900 dark:text-white border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
              Start New Meeting Booklet
            </h3>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest font-montserrat mb-1">
                  Booklet Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Corporation Alpha Meeting"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-2xl p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006094]"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="bg-[#781327] hover:bg-[#580d1b] text-white font-extrabold">
                  Create & Launch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
