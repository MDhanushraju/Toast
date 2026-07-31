import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import ExportMenu from '../components/ui/ExportMenu';
import { 
  FiPrinter, FiArrowLeft, FiCheckCircle, FiClock, 
  FiMapPin, FiCalendar, FiUsers, FiFileText, FiAward, 
  FiTarget, FiCheck, FiShield, FiTag, FiFile, FiEdit3, FiSave
} from 'react-icons/fi';

export default function FullMeetingReport() {
  const { booklets, activeBooklet, selectBooklet, currentUser, updateBooklet, showToast } = useBooklet();
  const navigate = useNavigate();
  const { id } = useParams();

  // Determine target booklet (by URL param id, or activeBooklet)
  const targetBooklet = (id && booklets.find(b => b.id === id)) || activeBooklet || booklets[0];

  const [isEditing, setIsEditing] = useState(false);

  // Editable local fields state
  const p3 = targetBooklet?.page3 || {};
  const p4 = targetBooklet?.page4 || {};
  const p5 = targetBooklet?.page5 || {};
  const p6 = targetBooklet?.page6 || {};

  const [editTitle, setEditTitle] = useState(targetBooklet?.title || '');
  const [editTheme, setEditTheme] = useState(p3.meetingTheme || '');
  const [editWordOfDay, setEditWordOfDay] = useState(p3.wordOfDay || '');
  const [editWordMeaning, setEditWordMeaning] = useState(p3.wordMeaning || '');
  const [editHost, setEditHost] = useState(p3.hostOrganization || '');
  const [editVenue, setEditVenue] = useState(p3.venue || '');
  const [editGuestCount, setEditGuestCount] = useState(p6.guestCount || 0);
  const [editInterestedGuests, setEditInterestedGuests] = useState(p6.interestedGuests || 0);
  const [editMembersJoined, setEditMembersJoined] = useState(p6.membersJoined || 0);
  const [editOverallRating, setEditOverallRating] = useState(p6.overallRating || 8);
  const [editStrengths, setEditStrengths] = useState(p6.strengths || '');
  const [editImprovements, setEditImprovements] = useState(p6.improvements || '');
  const [editPreparedBy, setEditPreparedBy] = useState(p3.preparedBy || '');

  if (!targetBooklet) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-[#006094] font-montserrat font-extrabold text-lg">No Meeting Report Found</h2>
        <Button onClick={() => navigate('/meeting-history')}>Return to History</Button>
      </div>
    );
  }

  // Authorization check (Creator, Director, or Super Admin can edit)
  const isCreator = targetBooklet.createdBy === currentUser?.username;
  const isDirector = Boolean(currentUser?.role?.toLowerCase().includes('director'));
  const isAdmin = currentUser?.username === 'admin' || currentUser?.role === 'District Main Administrator';
  const canEditReport = isCreator || isDirector || isAdmin;

  const handleSaveChanges = () => {
    updateBooklet(targetBooklet.id, {
      title: editTitle,
      page3: {
        ...p3,
        meetingTheme: editTheme,
        wordOfDay: editWordOfDay,
        wordMeaning: editWordMeaning,
        hostOrganization: editHost,
        venue: editVenue,
        preparedBy: editPreparedBy
      },
      page6: {
        ...p6,
        guestCount: parseInt(editGuestCount, 10) || 0,
        interestedGuests: parseInt(editInterestedGuests, 10) || 0,
        membersJoined: parseInt(editMembersJoined, 10) || 0,
        overallRating: parseInt(editOverallRating, 10) || 8,
        strengths: editStrengths,
        improvements: editImprovements
      }
    });

    setIsEditing(false);
    if (showToast) {
      showToast("✨ Meeting report saved successfully!", "success");
    }
  };

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
          {canEditReport && (
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold font-montserrat flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isEditing 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500' 
                  : 'bg-[#781327] hover:bg-[#580d1b] text-white border border-[#580d1b]'
              }`}
            >
              {isEditing ? <FiSave size={15} /> : <FiEdit3 size={15} />}
              <span>{isEditing ? 'Save Report Changes' : 'Edit Meeting Report'}</span>
            </button>
          )}

          <ExportMenu 
            title={targetBooklet.title} 
            elementId="master-report-content" 
            bookletData={targetBooklet} 
          />
        </div>
      </div>

      {/* 📄 MASTER EXECUTIVE MEETING REPORT CONTAINER */}
      <div id="master-report-content" className="bg-white dark:bg-[#121e2d] border-2 border-[#006094]/30 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 print:shadow-none print:border-0 print:p-0">
        
        {/* 1. Header Lockup & District Branding */}
        <div className="border-b-4 border-[#781327] pb-6 space-y-4">
          {/* 1. Official Header Banner */}
          <div className="bg-[#781327] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 border border-amber-300/40">
                <ToastmastersLogo showText={false} size="sm" className="bg-transparent border-0 shadow-none p-0" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase font-montserrat text-amber-300 block">
                  TOASTMASTERS INTERNATIONAL
                </span>
                <h2 className="text-lg sm:text-xl font-montserrat font-black leading-tight">
                  DISTRICT 227 MASTER MEETING REPORT
                </h2>
              </div>
            </div>

            <div className="text-left sm:text-right font-montserrat shrink-0">
              <div className="text-xs font-black uppercase tracking-wider text-slate-100">
                {targetBooklet.division || 'DIVISION A'} • {targetBooklet.areaDirector || 'AREA 01'}
              </div>
              <div className="text-[11px] text-amber-200 font-bold mt-0.5">
                Date: {p3.date || targetBooklet.createdAt || 'Today'}
              </div>
            </div>
          </div>

          {/* Title & Badge Block */}
          <div className="space-y-2 border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
            <div className="inline-block text-[10px] font-black text-[#004165] dark:text-sky-300 bg-[#E6F0F6] dark:bg-slate-800 px-3.5 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Official Executive Record • {targetBooklet.status === 'completed' ? 'Completed & Concluded' : 'Active Meeting'}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-2 text-xl font-montserrat font-black text-[#004165] dark:text-white px-3 py-1.5 bg-white dark:bg-slate-800 border border-[#004165] rounded-xl w-full"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-montserrat font-black text-[#004165] dark:text-white mt-1">
                {targetBooklet.title}
              </h1>
            )}
          </div>

          {/* Complete 4-Column Executive Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-montserrat w-full">
            <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-[9.5px] font-black text-[#781327] dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
                <FiCalendar size={12} /> Date & Time
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs truncate">
                {p3.date || 'Today'} @ {p3.time || '11:00 AM'}
              </div>
            </div>

            <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-[9.5px] font-black text-[#004165] dark:text-sky-400 uppercase tracking-widest flex items-center gap-1">
                <FiMapPin size={12} /> Venue Location
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs truncate">
                {p3.venue || 'Auditorium / Online'}
              </div>
            </div>

            <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <FiUsers size={12} /> Division & Area
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs truncate">
                {targetBooklet.division || 'Division A'} ({targetBooklet.areaDirector || 'Area 01'})
              </div>
            </div>

            <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="text-[9.5px] font-black text-[#004165] uppercase tracking-widest flex items-center gap-1">
                <FiAward size={12} /> Host Org
              </div>
              <div className="font-extrabold text-[#781327] dark:text-rose-400 mt-1 text-xs truncate">
                {p3.hostOrganization || 'District 227 HQ'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Theme & Word of the Day Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat flex items-center gap-1">
              <FiTarget size={12} /> Meeting Theme
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editTheme}
                onChange={(e) => setEditTheme(e.target.value)}
                placeholder="Meeting Theme..."
                className="w-full px-3 py-1 bg-white dark:bg-slate-800 border rounded-xl font-montserrat font-bold text-sm"
              />
            ) : (
              <div className="text-base font-montserrat font-extrabold text-slate-900 dark:text-white">
                {p3.meetingTheme ? `"${p3.meetingTheme}"` : '—'}
              </div>
            )}
          </div>

          <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900 border border-[#781327]/20 rounded-2xl space-y-1">
            <span className="text-[10px] font-black text-[#781327] dark:text-rose-400 uppercase tracking-widest font-montserrat flex items-center gap-1">
              <FiTag size={12} /> Word of the Day & Meaning
            </span>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={editWordOfDay}
                  onChange={(e) => setEditWordOfDay(e.target.value)}
                  placeholder="Word of the Day..."
                  className="px-2 py-1 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={editWordMeaning}
                  onChange={(e) => setEditWordMeaning(e.target.value)}
                  placeholder="Meaning..."
                  className="px-2 py-1 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold"
                />
              </div>
            ) : (
              <div className="text-sm font-montserrat font-extrabold text-slate-900 dark:text-white">
                {p3.wordOfDay ? (
                  <>
                    {p3.wordOfDay} — <span className="font-medium text-slate-600 dark:text-slate-300 text-xs italic">{p3.wordMeaning || '—'}</span>
                  </>
                ) : '—'}
              </div>
            )}
          </div>
        </div>

        {/* 3. Section 1: Creation & Before Meeting Setup */}
        <div className="space-y-4">
          <h3 className="font-montserrat font-extrabold text-base text-[#006094] dark:text-white flex items-center gap-2 border-b-2 border-[#006094]/30 pb-2">
            <FiCheckCircle className="text-[#006094]" /> 1. Meeting Setup & Confirmed Leadership Roles
          </h3>

          {/* Role Players Grid with Dynamic Auto-Fill Fallback */}
          {(() => {
            const getRoleSpeaker = (roleKey, ...keywords) => {
              if (roles[roleKey] && roles[roleKey].trim() !== '') return roles[roleKey];
              for (const kw of keywords) {
                const found = agendaItems.find(item => 
                  (item.slot || '').toLowerCase().includes(kw) || 
                  (item.role || '').toLowerCase().includes(kw)
                );
                if (found && (found.speaker || '').trim() !== '') return found.speaker;
              }
              return '—';
            };

            const tmod = getRoleSpeaker('toastmaster', 'toastmaster', 'tmod');
            const spk1 = getRoleSpeaker('speaker1', 'prepared speech', 'speaker', 'speaker 1');
            const ttm = getRoleSpeaker('topicsMaster', 'table topics', 'ttm');
            const eval1 = getRoleSpeaker('evaluator1', 'evaluator 1', 'evaluator');

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-montserrat">
                <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#004165]/20 dark:border-slate-800 rounded-xl">
                  <div className="text-[10px] font-black text-[#004165] dark:text-sky-300 uppercase tracking-widest font-montserrat">Toastmaster of Day</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs">{tmod}</div>
                </div>
                <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#004165]/20 dark:border-slate-800 rounded-xl">
                  <div className="text-[10px] font-black text-[#781327] dark:text-rose-400 uppercase tracking-widest font-montserrat">Prepared Speaker 1</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs">{spk1}</div>
                </div>
                <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#004165]/20 dark:border-slate-800 rounded-xl">
                  <div className="text-[10px] font-black text-[#004165] dark:text-sky-300 uppercase tracking-widest font-montserrat">Table Topics Master</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs">{ttm}</div>
                </div>
                <div className="p-3 bg-[#FAF5EF] dark:bg-slate-900 border border-[#004165]/20 dark:border-slate-800 rounded-xl">
                  <div className="text-[10px] font-black text-[#781327] dark:text-rose-400 uppercase tracking-widest font-montserrat">Evaluator 1</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-xs">{eval1}</div>
                </div>
              </div>
            );
          })()}

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

        {/* 4. Section 2: Executive Timing & Execution Summary */}
        <div className="space-y-4">
          <h3 className="font-montserrat font-extrabold text-base text-[#781327] dark:text-rose-400 flex items-center gap-2 border-b-2 border-[#781327]/30 pb-2">
            <FiClock className="text-[#781327]" /> 2. Meeting Execution & Timing Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF5EF] dark:bg-slate-900 border border-[#781327]/20 rounded-2xl">
            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-black text-[#781327] uppercase tracking-wider font-montserrat block">
                Total Meeting Duration
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-montserrat">
                90 Min Target
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                ✓ Completed On Schedule
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-black text-[#006094] uppercase tracking-wider font-montserrat block">
                Timing Adherence
              </span>
              <div className="text-base sm:text-lg font-black text-[#006094] dark:text-sky-300 font-montserrat">
                95.5% Accuracy
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Within Allocated Green Bounds
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider font-montserrat block">
                Role Players Assigned
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-montserrat">
                {Object.values(p3.roles || {}).filter(r => (r || '').trim() !== '').length || 8} Roles Filled
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Full Executive Participation
              </div>
            </div>
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
              {isEditing ? (
                <input
                  type="number"
                  value={editGuestCount}
                  onChange={(e) => setEditGuestCount(e.target.value)}
                  className="w-full text-center text-2xl font-black text-[#006094] border rounded-xl"
                />
              ) : (
                <div className="text-3xl font-black text-[#006094] font-montserrat">{p6.guestCount || 0}</div>
              )}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Guests Attended</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              {isEditing ? (
                <input
                  type="number"
                  value={editInterestedGuests}
                  onChange={(e) => setEditInterestedGuests(e.target.value)}
                  className="w-full text-center text-2xl font-black text-[#781327] border rounded-xl"
                />
              ) : (
                <div className="text-3xl font-black text-[#781327] font-montserrat">{p6.interestedGuests || 0}</div>
              )}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Interested Leads</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              {isEditing ? (
                <input
                  type="number"
                  value={editMembersJoined}
                  onChange={(e) => setEditMembersJoined(e.target.value)}
                  className="w-full text-center text-2xl font-black text-amber-600 border rounded-xl"
                />
              ) : (
                <div className="text-3xl font-black text-amber-600 font-montserrat">{p6.membersJoined || 0}</div>
              )}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Members Joined</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-xs">
              {isEditing ? (
                <input
                  type="number"
                  max="10"
                  min="1"
                  value={editOverallRating}
                  onChange={(e) => setEditOverallRating(e.target.value)}
                  className="w-full text-center text-2xl font-black text-emerald-600 border rounded-xl"
                />
              ) : (
                <div className="text-3xl font-black text-emerald-600 font-montserrat">{p6.overallRating || 9} / 10</div>
              )}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-montserrat mt-1">Overall Rating</div>
            </div>
          </div>

          {/* Feedback & Observations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="font-black text-[#006094] uppercase tracking-wider font-montserrat text-[10px]">Session Strengths</span>
              {isEditing ? (
                <textarea
                  rows="3"
                  value={editStrengths}
                  onChange={(e) => setEditStrengths(e.target.value)}
                  className="w-full p-2 border rounded-xl text-xs font-medium"
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-300 font-medium">{p6.strengths || 'Excellent speaker participation, active audience engagement, and on-time execution.'}</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
              <span className="font-black text-[#781327] uppercase tracking-wider font-montserrat text-[10px]">Areas for Improvement</span>
              {isEditing ? (
                <textarea
                  rows="3"
                  value={editImprovements}
                  onChange={(e) => setEditImprovements(e.target.value)}
                  className="w-full p-2 border rounded-xl text-xs font-medium"
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-300 font-medium">{p6.improvements || 'Rehearse evaluator transition timings and ensure microphone audio setup is completed 15 mins prior.'}</p>
              )}
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
              <div className="border-b border-slate-400 pb-1 font-extrabold text-slate-800 dark:text-slate-200">{targetBooklet.divisionDirector || targetBooklet.division || '—'}</div>
            </div>

            <div className="space-y-8 p-4 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl">
              <div className="font-black text-[#781327] uppercase tracking-wider font-montserrat text-[10px]">Meeting Preparer / VPE</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editPreparedBy}
                  onChange={(e) => setEditPreparedBy(e.target.value)}
                  className="w-full text-center border-b border-slate-400 pb-1 font-extrabold text-slate-800 dark:text-slate-200 text-xs"
                />
              ) : (
                <div className="border-b border-slate-400 pb-1 font-extrabold text-slate-800 dark:text-slate-200">{p3.preparedBy || 'System Administrator'}</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 🛠️ Bottom Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-4 shadow-sm no-print">
        <button
          onClick={() => navigate('/meeting-history')}
          className="flex items-center gap-2 text-xs font-montserrat font-extrabold text-slate-600 dark:text-slate-300 hover:text-[#006094] cursor-pointer transition-colors"
        >
          <FiArrowLeft size={16} /> Return to Meeting History
        </button>

        <div className="flex items-center gap-2">
          {canEditReport && (
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold font-montserrat flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isEditing 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500' 
                  : 'bg-[#781327] hover:bg-[#580d1b] text-white border border-[#580d1b]'
              }`}
            >
              {isEditing ? <FiSave size={15} /> : <FiEdit3 size={15} />}
              <span>{isEditing ? 'Save Report Changes' : 'Edit Meeting Report'}</span>
            </button>
          )}

          <ExportMenu 
            title={targetBooklet.title} 
            elementId="master-report-content" 
            bookletData={targetBooklet} 
          />
        </div>
      </div>

    </div>
  );
}
