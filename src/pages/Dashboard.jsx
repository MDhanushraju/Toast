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
    duplicateBooklet, activities, updateBookletPage, exportBookletsJSON, importBookletsJSON 
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ddd0] pb-4">
        <div>
          <h1 className="font-montserrat font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Toastmasters District 227 Booklet & Corporate Meeting Management Console
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeBooklet && (
            <Button
              variant="secondary"
              size="md"
              className="bg-[#006094] hover:bg-[#003a5c] text-white border-0 cursor-pointer font-montserrat shadow-xs font-extrabold text-xs"
              onClick={handleContinue}
            >
              Continue Editing
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            className="bg-[#781327] hover:bg-[#580d1b] text-white font-extrabold border-0 shadow-md cursor-pointer font-montserrat flex items-center gap-1.5 text-xs"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus size={15} /> Start New Booklet
          </Button>
          <button
            onClick={exportBookletsJSON}
            title="Backup booklet dataset to JSON file"
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-[#006094] dark:text-sky-300 hover:bg-[#E6F0F6] rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer font-montserrat"
          >
            <FiDownload size={14} /> Export Backup
          </button>
          <label
            title="Import booklet JSON dataset"
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer font-montserrat"
          >
            <FiUpload size={14} className="text-[#781327]" /> Import JSON
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
          className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2 cursor-pointer hover:border-[#781327] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#781327] dark:text-rose-300 uppercase tracking-widest font-montserrat">
              <FiCheckCircle size={14} className="text-[#781327] dark:text-rose-400" /> COMPLETED MEETINGS
            </div>
            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full">Finished</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-montserrat">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Total finished meeting booklets
          </div>
        </div>

        {/* Card 2: Meetings Today / Ongoing */}
        <div 
          onClick={() => navigate('/current-meetings')}
          className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2 cursor-pointer hover:border-[#781327] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#781327] dark:text-rose-300 uppercase tracking-widest font-montserrat">
              <FiZap size={14} className="text-[#781327] dark:text-rose-400" /> MEETINGS TODAY / ONGOING
            </div>
            <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-[#781327] dark:text-rose-300 font-black px-2.5 py-0.5 rounded-full animate-pulse">Live Today</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-montserrat">
            {ongoingTodayCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Sessions running today
          </div>
        </div>

        {/* Card 3: Upcoming Future Meetings */}
        <div 
          onClick={() => navigate('/current-meetings')}
          className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2 cursor-pointer hover:border-[#006094] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#006094] dark:text-sky-400 uppercase tracking-widest font-montserrat">
              <FiCalendar size={14} className="text-[#006094]" /> UPCOMING FUTURE MEETINGS
            </div>
            <span className="text-[9px] bg-[#E6F0F6] dark:bg-blue-950 text-[#006094] dark:text-sky-300 font-black px-2.5 py-0.5 rounded-full">Scheduled</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-montserrat">
            {upcomingCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Meetings scheduled in future
          </div>
        </div>

      </div>

      {/* Active Booklet Main Status Banner */}
      {activeBooklet ? (
        <div className="bg-[#E6F0F6]/60 dark:bg-[#121e2d] border border-[#006094]/30 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ProgressRing 
                progress={activeBooklet.completedPercent || 0} 
                size={70} 
                strokeWidth={7} 
                color="#006094" 
              />
              <div>
                <span className="text-[10px] font-extrabold text-[#006094] bg-white dark:bg-slate-900 border border-[#006094]/30 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
                  Active Meeting Booklet
                </span>
                <h2 className="text-xl font-montserrat font-extrabold text-[#006094] dark:text-white mt-1.5">
                  {activeBooklet.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  <span>Organization: <strong>{activeBooklet.page3?.hostOrganization || 'Unassigned'}</strong></span>
                  <span>•</span>
                  <span>Date: <strong>{activeBooklet.page3?.date || 'Today'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <Button
                variant="primary"
                size="sm"
                className="bg-[#006094] hover:bg-[#003a5c] text-white border-0 font-montserrat font-extrabold shadow-xs"
                onClick={() => navigate('/booklet/segment-1')}
              >
                Before Meeting
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#781327] hover:bg-[#580d1b] text-white border-0 font-montserrat font-extrabold shadow-xs"
                onClick={() => navigate('/booklet/segment-2')}
              >
                During Meeting Live
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 📊 Executive Analytics & Visual Performance Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AttendanceChart booklets={booklets} />
        <TimingAccuracyGauge activeBooklet={activeBooklet} />
        <CharteringReadinessMetrics booklets={booklets} />
      </div>

      {/* 📅 Compact Interactive Meeting Tracker Calendar */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3ebe1] dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FiCalendar size={20} className="text-[#006094]" />
            <h3 className="font-montserrat font-extrabold text-base text-[#006094] dark:text-white">
              Meeting Tracker Calendar ({format(currentMonth, 'MMMM yyyy')})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1 bg-[#E6F0F6] text-[#006094] hover:bg-[#006094] hover:text-white dark:bg-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer font-montserrat"
            >
              Today
            </button>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Previous Month"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Next Month"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Calendar Days Grid */}
        <div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-montserrat text-[11px] font-extrabold text-slate-400 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => {
              const dayBooklets = getBookletsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[58px] p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    !isCurrentMonth 
                      ? 'bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 border-transparent' 
                      : isDayToday
                      ? 'bg-[#E6F0F6] dark:bg-blue-950 border-[#006094] text-[#006094] font-black shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-[#e8ddd0] dark:border-slate-800 hover:border-[#006094]/40 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold ${isDayToday ? 'text-[#006094] dark:text-white font-black' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayBooklets.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#781327] animate-pulse"></span>
                    )}
                  </div>

                  {dayBooklets.length > 0 && (
                    <div className="space-y-0.5">
                      {dayBooklets.slice(0, 1).map(b => (
                        <div key={b.id} className="text-[9px] bg-[#781327] text-white px-1.5 py-0.5 rounded-md truncate font-bold shadow-2xs">
                          {b.title}
                        </div>
                      ))}
                      {dayBooklets.length > 1 && (
                        <div className="text-[8px] text-[#006094] font-black text-right pr-0.5">
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
