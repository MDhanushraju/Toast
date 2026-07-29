import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import DataTable from '../components/tables/DataTable';
import Button from '../components/ui/Button';
import BrandLetterhead from '../components/ui/BrandLetterhead';
import { 
  FiTrendingUp, FiPrinter, FiPlus, FiTrash2, 
  FiAward, FiDatabase, FiGrid, FiCheckSquare, FiCalendar, FiActivity, FiSmartphone,
  FiCopy, FiCheckCircle, FiSend, FiUserCheck
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function Segment3After() {
  const { activeBooklet, updateBooklet, updateBookletPage } = useBooklet();
  const [qrUrlInput, setQrUrlInput] = useState('https://toastmasters.org/signup');
  const [copiedRecap, setCopiedRecap] = useState(false);

  if (!activeBooklet) return null;

  const isCompleted = activeBooklet.status === 'completed' || activeBooklet.completedPercent === 100;

  const handleToggleComplete = () => {
    const nextStatus = isCompleted ? 'ongoing' : 'completed';
    updateBooklet(activeBooklet.id, { 
      status: nextStatus,
      completedPercent: nextStatus === 'completed' ? 100 : 50
    });
  };

  const p3 = activeBooklet.page3 || {};

  const handleCopyRecap = () => {
    const recapText = `
🎉 TOASTMASTERS MEETING EXECUTIVE RECAP 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Title: ${activeBooklet.title}
📍 District: ${activeBooklet.districtName || 'District 227'}
📅 Date & Time: ${p3.date || 'Today'} @ ${p3.time || '11:00 AM'}
🎭 Theme: "${p3.meetingTheme || 'Aim for the stars'}"
📖 Word of the Day: ${p3.wordOfDay || 'Aspiration'} (${p3.wordMeaning || 'Strong desire to achieve high'})

👥 ATTENDANCE & OUTCOMES:
• Guests Attended: ${activeBooklet.page6?.guestCount || 0}
• Interested Leads: ${activeBooklet.page6?.interestedGuests || 0}
• Overall Rating: ${activeBooklet.page6?.overallRating || 8}/10

✨ Thank you to all Toastmasters Officers, Role Takers & Attendees!
━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    navigator.clipboard.writeText(recapText);
    setCopiedRecap(true);
    setTimeout(() => setCopiedRecap(false), 3000);
  };
  const p4 = activeBooklet.page4 || { rows: [] };
  const p5 = activeBooklet.page5 || { checklist: {}, speakerTracking: [], actionItems: [] };
  const p6 = activeBooklet.page6 || {
    guestCount: 0,
    interestedGuests: 0,
    membersJoined: 0,
    overallRating: 8,
    strengths: '',
    weaknesses: '',
    improvements: '',
    followUpAction: '',
    comments: ''
  };
  const p7 = activeBooklet.page7 || { rows: [] };

  const handleFieldChange = (field, value) => {
    updateBookletPage('page6', { [field]: value });
  };

  const handleNumericChange = (field, val) => {
    const num = val === '' ? 0 : parseInt(val, 10);
    if (!isNaN(num)) handleFieldChange(field, num);
  };

  const handleAddTrackerRow = () => {
    const newRow = {
      id: `track-${uuidv4()}`,
      date: new Date().toISOString().split('T')[0],
      host: p3.hostOrganization || 'Corporation Alpha',
      location: p3.venue || 'Auditorium A',
      coordinator: p3.preparedBy || 'Area Director',
      attendance: p6.guestCount || 0,
      outcome: p6.followUpAction || 'Charter discussion scheduled',
      status: 'Completed'
    };
    updateBookletPage('page7', { rows: [...p7.rows, newRow] });
  };

  const handleDeleteTrackerRow = (id) => {
    const updated = p7.rows.filter(r => r.id !== id);
    updateBookletPage('page7', { rows: updated });
  };

  const trackerColumns = [
    { header: 'Date', accessor: 'date', sortable: true },
    { header: 'Host Organization', accessor: 'host', sortable: true, cell: (r) => <span className="font-bold text-[#006094] dark:text-white">{r.host || '—'}</span> },
    { header: 'Location / Link', accessor: 'location', sortable: true },
    { header: 'Coordinator', accessor: 'coordinator', sortable: true },
    { header: 'Attendance', accessor: 'attendance', sortable: true, cell: (r) => <span className="font-mono text-right font-bold">{r.attendance || 0}</span> },
    { header: 'Outcome', accessor: 'outcome', sortable: true },
    { header: 'Status', accessor: 'status', sortable: true, cell: (r) => <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#006094] text-white font-montserrat">{r.status || 'Completed'}</span> },
    {
      header: 'Action',
      accessor: 'id',
      sortable: false,
      cellClassName: 'text-center w-10',
      cell: (row) => (
        <button onClick={() => handleDeleteTrackerRow(row.id)} className="p-1 text-slate-400 hover:text-red-600 cursor-pointer">
          <FiTrash2 size={13} />
        </button>
      )
    }
  ];

  // Dynamic QR Code API image URL generator
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrlInput)}`;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-white bg-[#006094] border border-[#006094]/30 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Segment 3 of 3
            </span>
            <h1 className="text-2xl font-montserrat font-extrabold text-[#006094] dark:text-white mt-2">
              After Meeting: Outcomes, QR Code & Executive Summary
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Log ratings, generate QR sign-up codes, print summary sheets, and conclude the meeting.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleComplete}
              className={`px-4 py-2.5 rounded-xl font-montserrat font-extrabold text-xs cursor-pointer flex items-center gap-2 transition-all shadow-sm ${
                isCompleted 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500' 
                  : 'bg-[#781327] hover:bg-[#580d1b] text-white border border-[#580d1b]'
              }`}
            >
              <FiCheckCircle size={16} />
              <span>{isCompleted ? '✓ Meeting Completed' : 'Mark Meeting as Completed'}</span>
            </button>

            <Button variant="primary" size="md" onClick={() => window.print()} className="bg-[#006094] hover:bg-[#003a5c] border-0 cursor-pointer font-montserrat text-white font-extrabold text-xs">
              <FiPrinter className="mr-1.5" size={15} /> Print Summary
            </Button>
          </div>
        </div>
      </div>

      {/* 📊 Session Outcomes & Ratings */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white flex items-center gap-2 border-b border-[#f3ebe1] dark:border-slate-800 pb-2">
          <FiTrendingUp className="text-[#006094]" /> Meeting Outcomes & Satisfaction Ratings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#E6F0F6]/40 dark:bg-[#0c1421] border border-[#006094]/20 rounded-2xl">
          <FormInput
            label="Guests Attended"
            id="guestCount"
            type="number"
            value={p6.guestCount || ''}
            onChange={(e) => handleNumericChange('guestCount', e.target.value)}
            placeholder="0"
            min="0"
          />
          <FormInput
            label="Interested Guests"
            id="interestedGuests"
            type="number"
            value={p6.interestedGuests || ''}
            onChange={(e) => handleNumericChange('interestedGuests', e.target.value)}
            placeholder="0"
            min="0"
          />
          <FormInput
            label="Members Joined"
            id="membersJoined"
            type="number"
            value={p6.membersJoined || ''}
            onChange={(e) => handleNumericChange('membersJoined', e.target.value)}
            placeholder="0"
            min="0"
          />
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-[#006094] dark:text-white uppercase tracking-widest font-montserrat">
              Overall Rating (1-10)
            </label>
            <div className="flex items-center gap-3 h-[38px] px-2.5 bg-white dark:bg-slate-950 rounded-xl border border-[#e8ddd0]">
              <input
                type="range"
                min="1"
                max="10"
                value={p6.overallRating || 8}
                onChange={(e) => handleNumericChange('overallRating', e.target.value)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006094]"
              />
              <span className="font-montserrat font-extrabold text-[#006094] dark:text-white text-xs w-6 text-right">
                {p6.overallRating}/10
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextarea
            label="Session Strengths"
            id="strengths"
            value={p6.strengths || ''}
            onChange={(e) => handleFieldChange('strengths', e.target.value)}
            placeholder="What went well? e.g. High guest participation, enthusiastic speeches..."
            rows={3}
          />
          <FormTextarea
            label="Areas for Improvement"
            id="improvements"
            value={p6.improvements || ''}
            onChange={(e) => handleFieldChange('improvements', e.target.value)}
            placeholder="Actionable improvements for future sessions..."
            rows={3}
          />
        </div>
      </div>

      {/* 📱 Dynamic QR Code Generator */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white flex items-center gap-2 border-b border-[#f3ebe1] dark:border-slate-800 pb-2">
          <FiSmartphone className="text-[#006094]" /> Dynamic QR Code Sign-up Creator
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#E6F0F6]/50 dark:bg-[#0c1421] border border-[#006094]/20 rounded-2xl">
          <div className="p-3 bg-white border border-[#e8ddd0] rounded-2xl shadow-sm shrink-0">
            <img
              src={qrImageUrl}
              alt="Generated Toastmasters Signup QR Code"
              className="w-36 h-36 object-contain"
            />
          </div>
          <div className="space-y-3 flex-1">
            <FormInput
              label="Signup Form / Membership Link URL"
              id="qrUrlInput"
              value={qrUrlInput}
              onChange={(e) => setQrUrlInput(e.target.value)}
              placeholder="https://toastmasters.org/signup"
            />
            <p className="text-[11px] text-slate-500 font-semibold leading-normal">
              📲 Point smartphone cameras at this QR code during meetings to open the corporate membership sign-up form instantly!
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 Executive Meeting Announcement & Recap Generator */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094] dark:border-sky-900 rounded-3xl p-6 shadow-md space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3ebe1] dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat">
              One-Click Distribution
            </span>
            <h3 className="font-montserrat font-black text-lg text-[#006094] dark:text-white flex items-center gap-2 mt-0.5">
              <FiSend className="text-[#006094]" /> Executive Meeting Recap & Announcement Generator
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCopyRecap}
            className={`px-4 py-2.5 rounded-xl font-montserrat font-black text-xs cursor-pointer flex items-center gap-2 transition-all shadow-md ${
              copiedRecap 
                ? 'bg-emerald-600 text-white border border-emerald-500' 
                : 'bg-[#781327] hover:bg-[#580d1b] text-white border border-[#580d1b]'
            }`}
          >
            {copiedRecap ? <FiCheckCircle size={16} /> : <FiCopy size={16} />}
            <span>{copiedRecap ? 'Recap Copied to Clipboard!' : 'Copy Executive Recap for WhatsApp / Email'}</span>
          </button>
        </div>

        <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 text-xs space-y-2 font-mono text-slate-800 dark:text-slate-200 leading-relaxed shadow-inner">
          <div className="font-black text-[#781327] dark:text-rose-400 font-montserrat text-xs uppercase tracking-wider mb-1">
            Preview Announcement Message:
          </div>
          <p className="font-extrabold text-sm text-[#006094] dark:text-sky-300">🎉 TOASTMASTERS MEETING EXECUTIVE RECAP</p>
          <p>📌 <strong>Title:</strong> {activeBooklet.title}</p>
          <p>📍 <strong>District:</strong> {activeBooklet.districtName || 'District 227'} | <strong>Area Director:</strong> {activeBooklet.areaDirector || 'Unassigned'}</p>
          <p>🎭 <strong>Theme:</strong> "{p3.meetingTheme || 'Aim for the stars'}" | <strong>Word of Day:</strong> {p3.wordOfDay || 'Aspiration'}</p>
          <p>👥 <strong>Guests Attended:</strong> {p6.guestCount || 0} | <strong>Interested Leads:</strong> {p6.interestedGuests || 0} | <strong>Session Rating:</strong> {p6.overallRating || 8}/10</p>
        </div>
      </div>

      {/* 📄 Official Executive Brand Letterhead */}
      <BrandLetterhead
        title={`${activeBooklet.title} - Executive Summary`}
        subtitle="District 227 Meeting Readiness & Outcome Certificate"
        date={p3.date || new Date().toISOString().split('T')[0]}
        district={activeBooklet.districtName || "DISTRICT 227"}
        content={(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
            <div className="space-y-2 p-4 bg-[#E6F0F6]/60 border border-[#006094]/20 rounded-xl">
              <h4 className="font-extrabold text-[#006094] border-b border-[#006094]/20 pb-1 font-montserrat">1. Meeting Setup & Officers</h4>
              <div><strong>Booklet Title:</strong> {activeBooklet.title}</div>
              <div><strong>District:</strong> {activeBooklet.districtName || 'District 227'}</div>
              <div><strong>Area / Division:</strong> {activeBooklet.areaDirector || '—'} / {activeBooklet.division || '—'}</div>
              <div><strong>Host Organization:</strong> {p3.hostOrganization || '—'}</div>
              <div><strong>Meeting Date & Time:</strong> {p3.date} @ {p3.time}</div>
            </div>

            <div className="space-y-2 p-4 bg-[#E6F0F6]/60 border border-[#006094]/20 rounded-xl">
              <h4 className="font-extrabold text-[#006094] border-b border-[#006094]/20 pb-1 font-montserrat">2. Outcomes & Key Metrics</h4>
              <div><strong>Guests Attended:</strong> {p6.guestCount || 0}</div>
              <div><strong>Interested Guests:</strong> {p6.interestedGuests || 0}</div>
              <div><strong>Members Joined:</strong> {p6.membersJoined || 0}</div>
              <div><strong>Overall Session Rating:</strong> {p6.overallRating || 8}/10</div>
              <div><strong>Next Action:</strong> {p6.followUpAction || 'Follow up with HR'}</div>
            </div>
          </div>
        )}
      />

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
