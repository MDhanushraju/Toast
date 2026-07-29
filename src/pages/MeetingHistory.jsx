import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooklet } from '../context/BookletContext';
import Button from '../components/ui/Button';
import { 
  FiArchive, FiClock, FiSearch, FiCheckCircle, 
  FiCalendar, FiUsers, FiArrowRight, FiFileText,
  FiPrinter, FiX, FiEye, FiMapPin, FiAward, FiCheck
} from 'react-icons/fi';

export default function MeetingHistory() {
  const { booklets, selectBooklet, updateBooklet } = useBooklet();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportMeeting, setSelectedReportMeeting] = useState(null);

  // Filter completed meetings for history (or booklets at 100% progress)
  const finishedMeetings = booklets.filter(b => b.status === 'completed' || b.completedPercent === 100);

  const filteredHistory = finishedMeetings.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.page3?.hostOrganization || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsCompleted = (id) => {
    updateBooklet(id, { status: 'completed', completedPercent: 100 });
  };

  const handleOpenSegment = (id, segmentPath) => {
    selectBooklet(id);
    navigate(segmentPath);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const pendingBooklets = booklets.filter(b => b.status !== 'completed' && (b.completedPercent || 0) < 100);

  return (
    <div className="space-y-6 font-sans pb-8">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-md no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Archived Logs & Records
            </span>
            <h1 className="text-2xl font-montserrat font-black text-white mt-2 flex items-center gap-2">
              <FiArchive className="text-amber-400" /> Finished Meetings & History Reports
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Complete historical record of all concluded Toastmasters sessions, guest sign-ups, speaker timings, and printable executive reports.
            </p>
          </div>

          <div className="bg-slate-800 text-slate-200 px-4 py-2 rounded-2xl border border-slate-700 text-xs font-bold font-montserrat">
            Total Finished: {finishedMeetings.length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 no-print">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search finished meetings history by title or host organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006094]"
          />
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start no-print">
        {filteredHistory.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center space-y-4">
            <FiArchive size={36} className="mx-auto text-[#006094]" />
            <div>
              <h3 className="font-montserrat font-extrabold text-base text-slate-900 dark:text-white">
                No Finished Meetings in Archive Yet
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 max-w-md mx-auto">
                Mark your active meeting booklets as completed from <strong>Segment 3 (After Meeting)</strong> or click below to view meeting reports!
              </p>
            </div>

            {pendingBooklets.length > 0 && (
              <div className="pt-3 max-w-lg mx-auto space-y-2">
                <span className="text-[10px] font-black text-[#006094] uppercase tracking-widest font-montserrat block">
                  Available Booklets - Click to View Meeting Report:
                </span>
                <div className="space-y-2">
                  {pendingBooklets.map(b => (
                    <div key={b.id} className="p-3 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl flex items-center justify-between gap-3">
                      <div className="text-left truncate">
                        <div className="font-montserrat font-extrabold text-xs text-slate-900 dark:text-white truncate">{b.title}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Host: {b.page3?.hostOrganization || 'District 227'}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            selectBooklet(b.id);
                            navigate(`/meeting-report/${b.id}`);
                          }}
                          className="bg-[#006094] hover:bg-[#003a5c] text-white text-xs font-montserrat font-extrabold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <FiEye size={13} /> View Master Report
                        </button>
                        <button
                          onClick={() => handleMarkAsCompleted(b.id)}
                          className="bg-[#781327] hover:bg-[#580d1b] text-white text-xs font-montserrat font-extrabold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <FiCheckCircle size={13} /> Mark Finished
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          filteredHistory.map((meeting) => {
            const page3 = meeting.page3 || {};
            const page6 = meeting.page6 || {};

            return (
              <div 
                key={meeting.id}
                className="bg-slate-900 text-slate-200 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4 opacity-95 hover:opacity-100 transition-opacity"
              >
                {/* Card Header & Finished Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest font-montserrat inline-flex items-center gap-1">
                      <FiCheckCircle className="text-emerald-400" /> FINISHED / COMPLETED
                    </span>
                    <h2 className="text-lg font-montserrat font-black text-white mt-2 truncate">
                      {meeting.title}
                    </h2>
                  </div>

                  <span className="text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-xl">
                    100% Done
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-amber-400" />
                    <span>{page3.date || 'Concluded'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiUsers className="text-amber-400" />
                    <span>{page6.guestCount || 0} Guests Attended</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <FiMapPin className="text-amber-400" />
                    <span className="truncate">Venue: {page3.venue || 'Auditorium A'}</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <FiFileText className="text-amber-400" />
                    <span className="truncate">Host: {page3.hostOrganization || 'District 227 HQ'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      selectBooklet(meeting.id);
                      navigate(`/meeting-report/${meeting.id}`);
                    }}
                    className="flex-1 py-2.5 px-3 bg-[#006094] hover:bg-[#003a5c] text-white rounded-xl text-xs font-extrabold font-montserrat transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FiFileText size={14} /> View Master Executive Report
                  </button>

                  <button
                    onClick={() => handleOpenSegment(meeting.id, '/booklet/segment-3')}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-extrabold font-montserrat transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-700"
                  >
                    Segment 3 <FiArrowRight size={13} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 📄 Executive Meeting Report Modal & Print View */}
      {selectedReportMeeting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto printable-report-card">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e8ddd0] dark:border-slate-800 pb-4 no-print">
              <div className="flex items-center gap-2">
                <FiFileText className="text-[#006094]" size={22} />
                <div>
                  <span className="text-[10px] font-black text-[#006094] uppercase tracking-widest font-montserrat">
                    District 227 Executive Meeting Report
                  </span>
                  <h2 className="text-xl font-montserrat font-black text-slate-900 dark:text-white">
                    {selectedReportMeeting.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="bg-[#006094] hover:bg-[#003a5c] text-white px-4 py-2 rounded-xl text-xs font-extrabold font-montserrat flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FiPrinter size={15} /> Print Report
                </button>

                <button 
                  onClick={() => setSelectedReportMeeting(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:block text-center border-b pb-4 mb-4">
              <h1 className="text-2xl font-black text-[#006094] font-montserrat">{selectedReportMeeting.title}</h1>
              <p className="text-xs font-bold text-slate-600">Toastmasters District 227 Executive Meeting & Performance Report</p>
            </div>

            {/* 1. Meeting Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-montserrat">Date</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedReportMeeting.page3?.date || 'Today'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-montserrat">Time</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedReportMeeting.page3?.time || '10:00 AM'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-montserrat">Venue</span>
                <span className="font-extrabold text-[#006094] dark:text-sky-300">{selectedReportMeeting.page3?.venue || 'Auditorium A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-montserrat">Host Org</span>
                <span className="font-extrabold text-[#781327] dark:text-rose-400">{selectedReportMeeting.page3?.hostOrganization || 'District 227'}</span>
              </div>
            </div>

            {/* 2. Attendance & Outcomes Bar */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="text-2xl font-black text-[#006094] font-montserrat">{selectedReportMeeting.page6?.guestCount || 0}</div>
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-montserrat mt-0.5">Guests Attended</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="text-2xl font-black text-[#781327] font-montserrat">{selectedReportMeeting.page6?.interestedGuests || 0}</div>
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-montserrat mt-0.5">Interested Leads</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
                <div className="text-2xl font-black text-emerald-600 font-montserrat">{selectedReportMeeting.page6?.overallRating || 8} / 10</div>
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-montserrat mt-0.5">Session Rating</div>
              </div>
            </div>

            {/* 3. Speaker Timings & Speech Table */}
            <div className="space-y-3">
              <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white flex items-center gap-2 border-b border-[#e8ddd0] dark:border-slate-800 pb-2">
                <FiClock className="text-[#006094]" /> Speaker Performance & Speech Timings Log
              </h3>

              <div className="border border-[#e8ddd0] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#006094] text-white font-montserrat font-extrabold">
                    <tr>
                      <th className="p-3">Speaker Name</th>
                      <th className="p-3">Meeting Role</th>
                      <th className="p-3 text-center">Assigned Target Time</th>
                      <th className="p-3 text-center">Actual Spoken Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8ddd0] dark:divide-slate-800 bg-white dark:bg-slate-900 font-semibold">
                    {(selectedReportMeeting.page5?.speakerTracking || []).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-slate-400 italic">
                          No live speech timings logged for this meeting session.
                        </td>
                      </tr>
                    ) : (
                      (selectedReportMeeting.page5?.speakerTracking || []).map((sp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-extrabold text-slate-900 dark:text-white">{sp.speaker || '—'}</td>
                          <td className="p-3 text-[#006094] dark:text-sky-300 font-bold">{sp.role || 'Speaker'}</td>
                          <td className="p-3 text-center font-extrabold text-slate-600 dark:text-slate-300">{sp.targetTime || '5 Min'}</td>
                          <td className="p-3 text-center font-mono font-black text-[#781327] dark:text-rose-400">{sp.time || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#e8ddd0] dark:border-slate-800 flex items-center justify-between no-print">
              <span className="text-[10px] text-slate-400 font-medium">District 227 Official Report</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedReportMeeting(null)}
              >
                Close Report
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
