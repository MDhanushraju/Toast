import React from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { 
  FiPrinter, FiArrowLeft, FiCheckCircle, FiClock, 
  FiMapPin, FiCalendar, FiUsers, FiFileText, FiAward, 
  FiTarget, FiCheck, FiShield, FiTag, FiFile
} from 'react-icons/fi';

export default function FullMeetingReport() {
  const { booklets, activeBooklet, selectBooklet } = useBooklet();
  const navigate = useNavigate();
  const { id } = useParams();

  // Determine target booklet (by URL param id, or activeBooklet)
  const targetBooklet = (id && booklets.find(b => b.id === id)) || activeBooklet || booklets[0];

  if (!targetBooklet) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-[#006094] font-montserrat font-extrabold text-lg">No Meeting Report Found</h2>
        <Button onClick={() => navigate('/meeting-history')}>Return to History</Button>
      </div>
    );
  }

  const p3 = targetBooklet.page3 || {};
  const p4 = targetBooklet.page4 || {};
  const p5 = targetBooklet.page5 || {};
  const p6 = targetBooklet.page6 || {};

  const roles = p3.roles || {};
  const roleLabels = p3.roleLabels || {};
  const agendaItems = Array.isArray(p3.agendaItems) ? p3.agendaItems : [];
  const speakerTracking = Array.isArray(p5.speakerTracking) ? p5.speakerTracking : [];
  const actionItems = Array.isArray(p5.actionItems) ? p5.actionItems : [];
  const customVenueChecks = Array.isArray(p4.customVenueChecks) ? p4.customVenueChecks : [];
  const customEquipmentChecks = Array.isArray(p4.customEquipmentChecks) ? p4.customEquipmentChecks : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-12">
      
      {/* 🛠️ Top Bar Navigation & Print Action */}
      <div className="flex items-center justify-between bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-4 shadow-xs no-print">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-montserrat font-extrabold text-slate-600 dark:text-slate-300 hover:text-[#006094] cursor-pointer transition-colors"
        >
          <FiArrowLeft size={16} /> Back to History & Log
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            className="bg-[#006094] hover:bg-[#003a5c] text-white font-extrabold cursor-pointer font-montserrat flex items-center gap-2 text-xs shadow-md"
          >
            <FiPrinter size={15} /> Print Complete Master Meeting Report
          </Button>
        </div>
      </div>

      {/* 📄 MASTER EXECUTIVE MEETING REPORT CONTAINER */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094]/30 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 print:shadow-none print:border-0 print:p-0">
        
        {/* 1. Header Lockup & District Branding */}
        <div className="border-b-4 border-[#781327] pb-6 space-y-4">
          <div className="bg-[#781327] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <ToastmastersLogo className="w-12 h-12 shrink-0 bg-white rounded-full p-1" />
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase font-montserrat text-amber-300">
                  TOASTMASTERS INTERNATIONAL
                </span>
                <h2 className="text-xl font-montserrat font-black leading-none mt-0.5">
                  DISTRICT 227 MASTER MEETING REPORT
                </h2>
              </div>
            </div>

            <div className="text-right font-montserrat shrink-0">
              <div className="text-xs font-black uppercase tracking-wider text-slate-100">
                {targetBooklet.division || 'DIVISION A'} • {targetBooklet.areaDirector || 'AREA 12'}
              </div>
              <div className="text-[11px] text-amber-200 font-bold mt-0.5">
                Date: {p3.date || targetBooklet.createdAt || 'Today'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>
              <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 bg-[#E6F0F6] dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
                Executive Record • {targetBooklet.status === 'completed' ? 'Completed & Concluded' : 'Active Meeting'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-montserrat font-black text-[#006094] dark:text-white mt-2">
                {targetBooklet.title}
              </h1>
            </div>

            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 space-y-0.5">
              <div>Host Org: <strong className="text-[#781327] dark:text-rose-400">{p3.hostOrganization || 'District 227 HQ'}</strong></div>
              <div>Venue: <strong>{p3.venue || 'Auditorium A'}</strong></div>
              <div>Time: <strong>{p3.time || '10:00 AM'}</strong></div>
            </div>
          </div>
        </div>

        {/* 2. Theme & Word of the Day Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat flex items-center gap-1">
              <FiTarget size={12} /> Meeting Theme
            </span>
            <div className="text-base font-montserrat font-extrabold text-slate-900 dark:text-white">
              "{p3.meetingTheme || 'Transform Your Communication and Leadership'}"
            </div>
          </div>

          <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900 border border-[#781327]/20 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-[#781327] dark:text-rose-400 uppercase tracking-widest font-montserrat flex items-center gap-1">
              <FiTag size={12} /> Word of the Day & Meaning
            </span>
            <div className="text-sm font-montserrat font-extrabold text-slate-900 dark:text-white">
              {p3.wordOfDay || 'Aspiration'} — <span className="font-medium text-slate-600 dark:text-slate-300 text-xs italic">{p3.wordMeaning || 'A strong desire, longing, or aim to achieve something high.'}</span>
            </div>
          </div>
        </div>

        {/* 3. Section 1: Creation & Before Meeting Setup */}
        <div className="space-y-4">
          <h3 className="font-montserrat font-extrabold text-base text-[#006094] dark:text-white flex items-center gap-2 border-b-2 border-[#006094]/30 pb-2">
            <FiCheckCircle className="text-[#006094]" /> 1. Meeting Setup & Confirmed Leadership Roles
          </h3>

          {/* Role Players Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat">Toastmaster of Day</div>
              <div className="font-extrabold text-[#006094] dark:text-sky-300 mt-0.5">{roles.toastmaster || '—'}</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat">Prepared Speaker 1</div>
              <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">{roles.speaker1 || '—'}</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat">Table Topics Master</div>
              <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">{roles.topicsMaster || '—'}</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat">Evaluator 1</div>
              <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">{roles.evaluator1 || '—'}</div>
            </div>
          </div>

          {/* Full Agenda Table */}
          <div className="border border-[#e8ddd0] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#006094] text-white font-montserrat font-extrabold">
                <tr>
                  <th className="p-3 w-20">Time</th>
                  <th className="p-3">Slot Title</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Speaker / Owner</th>
                  <th className="p-3 text-center w-24">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ddd0] dark:divide-slate-800 bg-white dark:bg-slate-900 font-semibold">
                {agendaItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-400 italic">No agenda items defined.</td>
                  </tr>
                ) : (
                  agendaItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-slate-500">{item.time || '—'}</td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{item.slot || '—'}</td>
                      <td className="p-3 text-[#006094] dark:text-sky-300 font-bold">{item.role || '—'}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{item.speaker || '—'}</td>
                      <td className="p-3 text-center font-extrabold text-[#781327] dark:text-rose-400">{item.duration ? `${item.duration} Min` : '5 Min'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Section 2: During Meeting Live Execution & Speech Performance */}
        <div className="space-y-4">
          <h3 className="font-montserrat font-extrabold text-base text-[#781327] dark:text-rose-400 flex items-center gap-2 border-b-2 border-[#781327]/30 pb-2">
            <FiClock className="text-[#781327]" /> 2. Live Execution & Speech Performance Timings Log
          </h3>

          {/* Speaker Timings Log Table */}
          <div className="border border-[#e8ddd0] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#781327] text-white font-montserrat font-extrabold">
                <tr>
                  <th className="p-3">Speaker Name</th>
                  <th className="p-3">Role Executed</th>
                  <th className="p-3 text-center">Target Time</th>
                  <th className="p-3 text-center">Actual Spoken Time</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ddd0] dark:divide-slate-800 bg-white dark:bg-slate-900 font-semibold">
                {speakerTracking.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-400 italic">No live speaker timings logged for this meeting.</td>
                  </tr>
                ) : (
                  speakerTracking.map((sp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{sp.speaker || '—'}</td>
                      <td className="p-3 text-[#006094] dark:text-sky-300 font-bold">{sp.role || 'Speaker'}</td>
                      <td className="p-3 text-center font-extrabold text-slate-600 dark:text-slate-300">{sp.targetTime || '5 Min'}</td>
                      <td className="p-3 text-center font-mono font-black text-[#781327] dark:text-rose-400">{sp.time || '—'}</td>
                      <td className="p-3 text-center">
                        {sp.time ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Recorded
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Action Items Log */}
          {actionItems.length > 0 && (
            <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] rounded-2xl space-y-2">
              <span className="text-[10px] font-black text-[#006094] uppercase tracking-widest font-montserrat">Follow-Up Action Items</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {actionItems.map((act, i) => (
                  <div key={i} className="p-2 bg-white dark:bg-slate-950 rounded-xl border border-[#e8ddd0] flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{act.action}</span>
                    <span className="text-[10px] font-black text-[#781327]">Owner: {act.owner || 'Unassigned'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Section 3: After Meeting Outcomes, Guest Conversion & Sign-off */}
        <div className="space-y-4">
          <h3 className="font-montserrat font-extrabold text-base text-[#006094] dark:text-white flex items-center gap-2 border-b-2 border-[#006094]/30 pb-2">
            <FiAward className="text-[#006094]" /> 3. After Meeting Outcomes & Guest Conversion
          </h3>

          {/* Attendance Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-3xl font-black text-[#006094] font-montserrat">{p6.guestCount || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Guests Attended</div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-3xl font-black text-[#781327] font-montserrat">{p6.interestedGuests || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Interested Leads</div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-3xl font-black text-amber-600 font-montserrat">{p6.membersJoined || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Members Joined</div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-3xl font-black text-emerald-600 font-montserrat">{p6.overallRating || 9} / 10</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Overall Rating</div>
            </div>
          </div>

          {/* Feedback & Observations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="font-black text-[#006094] uppercase tracking-wider font-montserrat text-[10px]">Session Strengths</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{p6.strengths || 'Excellent speaker participation, active audience engagement, and on-time execution.'}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="font-black text-[#781327] uppercase tracking-wider font-montserrat text-[10px]">Areas for Improvement</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{p6.improvements || 'Rehearse evaluator transition timings and ensure microphone audio setup is completed 15 mins prior.'}</p>
            </div>
          </div>
        </div>

        {/* 6. Official Approval & Executive Sign-off Block */}
        <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <FiShield className="text-[#006094]" size={28} />
              <div>
                <h4 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white">Official District 227 Leadership Approval</h4>
                <p className="text-xs text-slate-500 font-medium">This document certifies that the above meeting execution and speech records have been reviewed and approved.</p>
              </div>
            </div>
            <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-full font-montserrat shrink-0">
              Approved & Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center text-xs">
            <div className="space-y-8 p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl">
              <div className="font-black text-[#006094] uppercase tracking-wider font-montserrat text-[10px]">Area Director Sign-off</div>
              <div className="border-b border-slate-400 pb-1 font-extrabold text-slate-800 dark:text-slate-200">{targetBooklet.areaDirector || 'Hari (Area 12 Director)'}</div>
            </div>

            <div className="space-y-8 p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl">
              <div className="font-black text-[#006094] uppercase tracking-wider font-montserrat text-[10px]">Division Director Sign-off</div>
              <div className="border-b border-slate-400 pb-1 font-extrabold text-slate-800 dark:text-slate-200">{targetBooklet.division || 'Prashant (Division A Director)'}</div>
            </div>

            <div className="space-y-8 p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl">
              <div className="font-black text-[#781327] uppercase tracking-wider font-montserrat text-[10px]">Meeting Preparer / VPE</div>
              <div className="border-b border-slate-400 pb-1 font-extrabold text-slate-800 dark:text-slate-200">{p3.preparedBy || 'Pramod K Murthy'}</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
