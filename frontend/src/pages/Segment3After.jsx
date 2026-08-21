import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { activeBooklet, updateBooklet, updateBookletPage, showToast, createBooklet } = useBooklet();
  const navigate = useNavigate();

  const defaultGuestSignupUrl = `${window.location.origin}${window.location.pathname}#/guest-signup`;
  const [qrUrlInput, setQrUrlInput] = useState(defaultGuestSignupUrl);
  const [copiedRecap, setCopiedRecap] = useState(false);

  if (!activeBooklet) return null;

  const isCompleted = activeBooklet.status === 'completed' || activeBooklet.completedPercent === 100;

  const handleCompleteMeetingAndGoHome = () => {
    // 1. Mark current booklet completed & archived to Meeting History
    updateBooklet(activeBooklet.id, { 
      status: 'completed',
      completedPercent: 100,
      segment1Completed: true,
      segment2Completed: true,
      segment3Completed: true
    });

    if (showToast) {
      showToast("Meeting completed! Archived to Meeting History.", "success");
    }

    // 2. Directly navigate to Home Dashboard
    navigate('/');
  };

  const p3 = activeBooklet.page3 || {};

  const handleCopyRecap = () => {
    const recapText = `
TOASTMASTERS INTERNATIONAL - EXECUTIVE MEETING SUMMARY
District: ${activeBooklet.districtName || 'District 227'} | Area: ${activeBooklet.areaDirector || 'Unassigned'} | Division: ${activeBooklet.division || 'Unassigned'}
Meeting Title: ${activeBooklet.title}
Host Organization: ${p3.hostOrganization || 'District 227 Corporate'}
Date & Time: ${p3.date || 'Scheduled Date'} @ ${p3.time || '11:00 AM'}

MEETING HIGHLIGHTS & PARAMETERS:
- Theme of the Meeting: "${p3.meetingTheme || 'Aim for the stars'}"
- Word of the Day: ${p3.wordOfDay || 'Aspiration'} (${p3.wordMeaning || 'Strong desire to achieve high'})
- Meeting Link / Venue: ${p3.meetingLink || p3.venue || 'Auditorium / Online'}

ATTENDANCE & EXECUTIVE OUTCOMES:
- Total Guests Attended: ${activeBooklet.page6?.guestCount || 0}
- Prospective Member Leads: ${activeBooklet.page6?.interestedGuests || 0}
- New Members Joined: ${activeBooklet.page6?.membersJoined || 0}
- Executive Session Quality Rating: ${activeBooklet.page6?.overallRating || 8}/10
- Key Follow-up Action: ${activeBooklet.page6?.followUpAction || 'Follow up with HR & Coordination Team'}

Official Report Generated under Toastmasters District 227 Corporate Guidelines.
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
              onClick={handleCompleteMeetingAndGoHome}
              className="px-[#18px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-montserrat font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer border border-emerald-500"
            >
              <FiCheckCircle size={18} />
              <span>Mark Meeting as Completed</span>
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
            <div className="flex items-center gap-3 h-[38px] px-3 bg-white dark:bg-slate-950 rounded-xl border border-[#e8ddd0] dark:border-slate-800">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={p6.overallRating !== undefined && p6.overallRating !== null ? p6.overallRating : 10}
                onChange={(e) => handleFieldChange('overallRating', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#006094]"
              />
              <span className="font-montserrat font-black text-[#006094] dark:text-sky-300 text-xs whitespace-nowrap shrink-0">
                {p6.overallRating !== undefined && p6.overallRating !== null ? p6.overallRating : 10} / 10
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
            <div className="flex items-center gap-2 pt-1">
              <a
                href={qrUrlInput}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-[#006094] hover:bg-[#003a5c] text-white font-montserrat font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <FiSmartphone size={14} /> Open Guest Sign-up Form
              </a>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold leading-normal">
              📲 Point smartphone cameras at this QR code during meetings to open the corporate membership sign-up form instantly! All guest sign-ups live-update the "Guests Attended" slot automatically.
            </p>
          </div>
        </div>
      </div>

      {/* 📄 Single Unified Master Executive Summary Card */}
      <BrandLetterhead
        title={`${activeBooklet.title} - Master Executive Summary`}
        subtitle="District 227 Official Meeting Readiness & Outcome Certificate"
        date={p3.date || new Date().toISOString().split('T')[0]}
        district={activeBooklet.districtName || "DISTRICT 227"}
        content={(
          <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200 font-sans">
            
            {/* Top Action Toolbar Inside Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 no-print">
              <div>
                <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat">
                  Official Executive Certificate
                </span>
                <h4 className="font-montserrat font-black text-sm text-[#006094] dark:text-white">
                  Meeting Executive Summary & Outcome Record
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyRecap}
                className={`px-4 py-2 rounded-xl font-montserrat font-black text-xs cursor-pointer flex items-center gap-2 transition-all shadow-sm ${
                  copiedRecap 
                    ? 'bg-emerald-600 text-white border border-emerald-500' 
                    : 'bg-[#781327] hover:bg-[#580d1b] text-white border border-[#580d1b]'
                }`}
              >
                {copiedRecap ? <FiCheckCircle size={15} /> : <FiCopy size={15} />}
                <span>{copiedRecap ? 'Summary Copied to Clipboard!' : 'Copy Summary for WhatsApp / Email'}</span>
              </button>
            </div>

            {/* Grid 1: Setup & Parameters */}
            {(() => {
              const displayHost = (p3.hostOrganization && p3.hostOrganization !== 'Corporation Alpha') ? p3.hostOrganization : '—';
              const displayVenue = (p3.meetingLink || p3.venue) && (p3.meetingLink || p3.venue) !== 'Auditorium A' ? (p3.meetingLink || p3.venue) : '—';
              const displayTheme = (p3.meetingTheme && p3.meetingTheme !== 'Transform Your Communication and Leadership') ? `"${p3.meetingTheme}"` : '—';
              const displayDateTime = (p3.date && p3.date !== '2026-07-29') ? `${p3.date} @ ${p3.time || '—'}` : '—';
              const displayTitle = (activeBooklet.title && activeBooklet.title !== 'Corporation Alpha Meeting') ? activeBooklet.title : '—';

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl">
                    <h4 className="font-extrabold text-[#006094] dark:text-sky-300 border-b border-[#006094]/20 pb-1 font-montserrat uppercase tracking-wider text-[11px]">
                      1. Meeting Setup & Officers
                    </h4>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div><strong className="text-slate-900 dark:text-white">Booklet Title:</strong> {displayTitle}</div>
                      <div><strong className="text-slate-900 dark:text-white">District:</strong> District 227</div>
                      <div><strong className="text-slate-900 dark:text-white">Area / Division:</strong> {activeBooklet.areaDirector || '—'} / {activeBooklet.division || '—'}</div>
                      <div><strong className="text-slate-900 dark:text-white">Host Organization:</strong> {displayHost}</div>
                      <div><strong className="text-slate-900 dark:text-white">Meeting Date & Time:</strong> {displayDateTime}</div>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl">
                    <h4 className="font-extrabold text-[#781327] dark:text-rose-400 border-b border-[#781327]/20 pb-1 font-montserrat uppercase tracking-wider text-[11px]">
                      2. Parameters & Theme Settings
                    </h4>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div><strong className="text-slate-900 dark:text-white">Meeting Theme:</strong> {displayTheme}</div>
                      <div><strong className="text-slate-900 dark:text-white">Word of the Day:</strong> {p3.wordOfDay || '—'}</div>
                      <div><strong className="text-slate-900 dark:text-white">Word Meaning:</strong> {p3.wordMeaning || '—'}</div>
                      <div><strong className="text-slate-900 dark:text-white">Meeting Link / Venue:</strong> {displayVenue}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Grid 2: Outcomes & Key Metrics */}
            <div className="space-y-3 p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl">
              <h4 className="font-extrabold text-[#006094] dark:text-sky-300 border-b border-[#006094]/20 pb-1 font-montserrat uppercase tracking-wider text-[11px]">
                3. Executive Outcomes & Attendance Metrics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Guests Attended</span>
                  <span className="text-xl font-montserrat font-black text-[#006094] dark:text-sky-300">{p6.guestCount || 0}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Prospective Leads</span>
                  <span className="text-xl font-montserrat font-black text-[#781327] dark:text-rose-400">{p6.interestedGuests || 0}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Members Joined</span>
                  <span className="text-xl font-montserrat font-black text-emerald-600">{p6.membersJoined || 0}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Session Rating</span>
                  <span className="text-xl font-montserrat font-black text-amber-600">{p6.overallRating || 0}/10</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#006094]/15 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <strong className="text-[#006094] dark:text-sky-300">Key Follow-up Action:</strong> {p6.followUpAction || '—'}
              </div>
            </div>

          </div>
        )}
      />

      {/* 🏁 Bottom Completion Card & Home Redirect */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest block font-montserrat">
              FINAL MEETING CLOSEOUT & ARCHIVE
            </span>
            <h3 className="text-xl font-montserrat font-black text-slate-900 dark:text-white mt-0.5">
              Complete Meeting Booklet & Archive
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Marks this meeting booklet as 100% completed, archives full report into Meeting History, resets segment data, and redirects to Home.
            </p>
          </div>

          <button
            onClick={handleCompleteMeetingAndGoHome}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-montserrat font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer border border-emerald-500 shrink-0"
          >
            <FiCheckCircle size={20} />
            <span>Mark Meeting as Completed & Go Home</span>
          </button>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
