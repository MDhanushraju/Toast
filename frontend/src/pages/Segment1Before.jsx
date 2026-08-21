import React, { useState, useEffect } from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { 
  FiPlayCircle, FiUsers, FiClock, FiCheckSquare, FiPlus, FiTrash2, 
  FiZap, FiLayers, FiRefreshCw, FiAward, FiBookOpen, FiGlobe, FiX, FiPrinter, FiYoutube, FiCalendar
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_DEMO_AGENDA, DEMO_AGENDA_NOTES } from '../constants/index.js';
import { DEFAULT_DISTRICT_CONTACTS, DISTRICT_DIVISIONS, DISTRICT_LIST, AREA_DIRECTORS, DIVISION_DIRECTORS } from '../constants/contactsData.js';
import ExportMenu from '../components/ui/ExportMenu';
import { allocateAgendaTimes, allocateProportionalTimes } from '../utils/timeAllocator.js';

export default function Segment1Before() {
  const { activeBooklet, updateBooklet, updateBookletPage, createBooklet } = useBooklet();

  // Live real-time clock state
  const [liveDateTime, setLiveDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedLiveDate = liveDateTime.toISOString().split('T')[0];
  const formattedLiveTime = liveDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleSpeaker, setNewRoleSpeaker] = useState('');
  const [newRoleTime, setNewRoleTime] = useState('5');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Time allocation modal state
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocStartTime, setAllocStartTime] = useState('11:00 AM');
  const [targetTotalMins, setTargetTotalMins] = useState('90');

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page3 || {};
  const checklistItems = Array.isArray(pageData.checklist) ? pageData.checklist : [];
  const customRoleList = Array.isArray(pageData.customRoleList) ? pageData.customRoleList : [];
  
  const rawAgenda = pageData.agendaItems;
  const agendaItems = Array.isArray(rawAgenda) && rawAgenda.length > 0 ? rawAgenda : DEFAULT_DEMO_AGENDA;
  const agendaNotes = pageData.agendaNotes !== undefined ? pageData.agendaNotes : DEMO_AGENDA_NOTES;

  const formatMinStr = (val) => {
    if (!val && val !== 0) return '5 Min';
    const str = val.toString().trim();
    if (str === '') return '5 Min';
    return str.toLowerCase().includes('min') ? str : `${str} Min`;
  };

  // Validate if all required Segment 1 fields are completed
  const getMissingFields = () => {
    const missing = [];
    if (!pageData.meetingTheme?.trim()) missing.push('Meeting Theme');
    if (!pageData.wordOfDay?.trim()) missing.push('Word of the Day');

    if (agendaItems.length === 0) {
      missing.push('Agenda Table Rows');
    } else {
      const missingRoles = agendaItems.filter(item => !item.speaker?.trim());
      if (missingRoles.length > 0) {
        missing.push(`${missingRoles.length} Agenda Role Taker Name(s)`);
      }
    }
    return missing;
  };

  const missingFields = getMissingFields();
  const isSegment1Complete = missingFields.length === 0;

  const updateRolesAndSync = (newRoles, newRoleTimes, newRoleLabels, newCustomList) => {
    const rolesObj = newRoles !== undefined ? newRoles : (pageData.roles || {});
    const timesObj = newRoleTimes !== undefined ? newRoleTimes : (pageData.roleTimes || {});
    const labelsObj = newRoleLabels !== undefined ? newRoleLabels : (pageData.roleLabels || {});
    const customList = newCustomList !== undefined ? newCustomList : customRoleList;

    const updatedPage3 = {
      ...pageData,
      roles: rolesObj,
      roleTimes: timesObj,
      roleLabels: labelsObj,
      customRoleList: customList
    };

    const defaultList = [
      { key: 'toastmaster', defaultRole: 'Toastmaster of Day', defaultTime: '15' },
      { key: 'speaker1', defaultRole: 'Prepared Speaker 1', defaultTime: '7' },
      { key: 'speaker2', defaultRole: 'Prepared Speaker 2', defaultTime: '7' },
      { key: 'evaluator1', defaultRole: 'Speech Evaluator 1', defaultTime: '4' },
      { key: 'topicsMaster', defaultRole: 'Table Topics Master', defaultTime: '15' },
      { key: 'generalEvaluator', defaultRole: 'General Evaluator', defaultTime: '15' },
      { key: 'ahCounter', defaultRole: 'Ah-Counter', defaultTime: '3' },
      { key: 'timer', defaultRole: 'Timer Role', defaultTime: '4' },
      { key: 'grammarian', defaultRole: 'Grammarian', defaultTime: '3' },
      { key: 'listener', defaultRole: 'Listener', defaultTime: '3' }
    ];

    const syncedSpeakers = defaultList.map(item => ({
      id: `sp-${item.key}`,
      speaker: rolesObj[item.key] || '',
      role: labelsObj[item.key] || item.defaultRole,
      targetTime: formatMinStr(timesObj[item.key] || item.defaultTime),
      time: ''
    }));

    customList.forEach(cr => {
      syncedSpeakers.push({
        id: cr.id,
        speaker: cr.speaker || '',
        role: cr.label || 'Custom Role',
        targetTime: formatMinStr(cr.targetTime || '5'),
        time: ''
      });
    });

    const existingPage5 = activeBooklet.page5 || { speakerTracking: [] };
    const existingTracking = existingPage5.speakerTracking || [];
    
    const mergedTracking = syncedSpeakers.map(synced => {
      const match = existingTracking.find(ex => ex.id === synced.id || ex.role === synced.role);
      return match ? { 
        ...synced, 
        speaker: synced.speaker !== '' ? synced.speaker : match.speaker, 
        role: synced.role,
        targetTime: synced.targetTime, 
        time: match.time || '' 
      } : synced;
    });

    updateBooklet(activeBooklet.id, {
      page3: updatedPage3,
      page5: { ...existingPage5, speakerTracking: mergedTracking }
    });
  };

  const handleRoleChange = (roleKey, value) => {
    updateRolesAndSync({ ...(pageData.roles || {}), [roleKey]: value });
  };

  const handleRoleLabelChange = (roleKey, value) => {
    updateRolesAndSync(undefined, undefined, { ...(pageData.roleLabels || {}), [roleKey]: value });
  };

  const handleRoleTimeChange = (roleKey, value) => {
    updateRolesAndSync(undefined, { ...(pageData.roleTimes || {}), [roleKey]: value });
  };

  // Submit Handler for Add Role Player Modal
  const handleAddCustomRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    const newRole = { 
      id: `cr-${uuidv4()}`, 
      label: newRoleTitle.trim(), 
      speaker: newRoleSpeaker.trim(), 
      targetTime: newRoleTime.toString() 
    };
    updateRolesAndSync(undefined, undefined, undefined, [...customRoleList, newRole]);
    setNewRoleTitle('');
    setNewRoleSpeaker('');
    setNewRoleTime('5');
    setShowRoleModal(false);
  };

  const handleUpdateCustomRole = (id, field, value) => {
    const updatedList = customRoleList.map(cr => cr.id === id ? { ...cr, [field]: value } : cr);
    updateRolesAndSync(undefined, undefined, undefined, updatedList);
  };

  const handleDeleteCustomRole = (id) => {
    const updatedList = customRoleList.filter(cr => cr.id !== id);
    updateRolesAndSync(undefined, undefined, undefined, updatedList);
  };

  // Auto-allocate times when meeting start time changes
  const handleMeetingTimeChange = (newTimeStr) => {
    const updatedPage3 = { ...pageData, time: newTimeStr };
    const reallocated = allocateAgendaTimes(agendaItems, newTimeStr);
    updateBooklet(activeBooklet.id, {
      page3: {
        ...updatedPage3,
        agendaItems: reallocated
      }
    });
  };

  const handleOpenAllocateModal = () => {
    setAllocStartTime(pageData.time || '11:00 AM');
    setShowAllocateModal(true);
  };

  const handleApplyProportionalAllocation = () => {
    const startTime = allocStartTime || pageData.time || '11:00 AM';
    const totalTarget = parseInt(targetTotalMins, 10) || 90;
    const reallocated = allocateProportionalTimes(agendaItems, totalTarget, startTime);
    updateBookletPage('page3', { 
      time: startTime,
      agendaItems: reallocated 
    });
    setShowAllocateModal(false);
  };

  const handleApplySequentialAllocation = () => {
    const startTime = allocStartTime || pageData.time || '11:00 AM';
    const reallocated = allocateAgendaTimes(agendaItems, startTime);
    updateBookletPage('page3', { 
      time: startTime,
      agendaItems: reallocated 
    });
    setShowAllocateModal(false);
  };

  const handleLoadDemoTemplate = () => {
    const meetingStartTime = pageData.time || '11:00 AM';
    const reallocated = allocateAgendaTimes(DEFAULT_DEMO_AGENDA, meetingStartTime);
    updateBookletPage('page3', {
      agendaItems: reallocated,
      agendaNotes: DEMO_AGENDA_NOTES
    });
  };

  const handleAddAgendaItem = () => {
    const newItem = {
      id: `ag-${uuidv4()}`,
      time: '',
      duration: 5,
      slot: 'New Agenda Item',
      details: 'Brief description of agenda item...',
      role: 'Role Title',
      speaker: '',
      club: ''
    };
    const updatedRaw = [...agendaItems, newItem];
    const meetingStartTime = pageData.time || '11:00 AM';
    const reallocated = allocateAgendaTimes(updatedRaw, meetingStartTime);
    updateBookletPage('page3', { agendaItems: reallocated });
  };

  const handleUpdateAgendaItem = (id, field, value) => {
    const updatedRaw = agendaItems.map(item => item.id === id ? { ...item, [field]: value } : item);
    if (field === 'duration') {
      const meetingStartTime = pageData.time || '11:00 AM';
      const reallocated = allocateAgendaTimes(updatedRaw, meetingStartTime);
      updateBookletPage('page3', { agendaItems: reallocated });
    } else {
      updateBookletPage('page3', { agendaItems: updatedRaw });
    }
  };

  const handleDeleteAgendaItem = (id) => {
    const updatedRaw = agendaItems.filter(item => item.id !== id);
    const meetingStartTime = pageData.time || '11:00 AM';
    const reallocated = allocateAgendaTimes(updatedRaw, meetingStartTime);
    updateBookletPage('page3', { agendaItems: reallocated });
  };

  const handleAutoGenerateAgenda = () => {
    const r = pageData.roles || {};

    const generatedAgenda = DEFAULT_DEMO_AGENDA.map(item => {
      let assigned = item.speaker;
      if (item.slot.includes('Toastmaster')) assigned = r.toastmaster || item.speaker;
      else if (item.slot.includes('General Evaluator')) assigned = r.generalEvaluator || item.speaker;
      else if (item.slot.includes('Prepared Speech')) assigned = r.speaker1 || item.speaker;
      else if (item.slot.includes('Table Topics')) assigned = r.topicsMaster || item.speaker;
      else if (item.slot.includes('Grammarian')) assigned = r.grammarian || item.speaker;
      else if (item.slot.includes('Timer')) assigned = r.timer || item.speaker;
      return { ...item, speaker: assigned };
    });

    const meetingStartTime = pageData.time || '11:00 AM';
    const reallocated = allocateAgendaTimes(generatedAgenda, meetingStartTime);
    updateBookletPage('page3', { agendaItems: reallocated });
    if (showToast) {
      showToast("Toastmasters Demo Agenda successfully generated and assigned!", "success");
    }
  };

  const handlePrintAgenda = () => {
    window.print();
  };

  const handleCheckChange = (id) => {
    const updatedChecks = checklistItems.map(c => {
      if (c.id === id) return { ...c, checked: !c.checked };
      return c;
    });
    updateBookletPage('page3', { checklist: updatedChecks });
  };

  const handleAddCustomCheck = () => {
    const newItem = {
      id: `p3-custom-${uuidv4()}`,
      label: 'Custom Readiness Requirement',
      desc: 'Enter instructions...',
      checked: false,
      isCustom: true
    };
    updateBookletPage('page3', { checklist: [...checklistItems, newItem] });
  };

  const handleDeleteCustomCheck = (id) => {
    const updatedChecks = checklistItems.filter(c => c.id !== id);
    updateBookletPage('page3', { checklist: updatedChecks });
  };

  const handleFieldChange = (key, value) => {
    if (key === 'time') {
      const reallocated = allocateAgendaTimes(agendaItems, value);
      updateBookletPage('page3', { time: value, agendaItems: reallocated });
    } else {
      updateBookletPage('page3', { [key]: value });
    }
  };

  const defaultRoleConfigs = [
    { key: 'toastmaster', defaultLabel: 'Toastmaster of Day', defaultTime: '15' },
    { key: 'speaker1', defaultLabel: 'Prepared Speaker 1', defaultTime: '7' },
    { key: 'speaker2', defaultLabel: 'Prepared Speaker 2', defaultTime: '7' },
    { key: 'evaluator1', defaultLabel: 'Speech Evaluator 1', defaultTime: '4' },
    { key: 'topicsMaster', defaultLabel: 'Table Topics Master', defaultTime: '15' },
    { key: 'generalEvaluator', defaultLabel: 'General Evaluator', defaultTime: '15' },
    { key: 'ahCounter', defaultLabel: 'Ah-Counter', defaultTime: '3' },
    { key: 'timer', defaultLabel: 'Timer Role', defaultTime: '4' },
    { key: 'grammarian', defaultLabel: 'Grammarian', defaultTime: '3' },
    { key: 'listener', defaultLabel: 'Listener', defaultTime: '3' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-[#006094] bg-[#E6F0F6] border border-[#006094]/30 px-3 py-1 rounded-full uppercase tracking-wider font-montserrat">
              Segment 1 of 3
            </span>
            <h1 className="text-2xl sm:text-3xl font-montserrat font-black text-[#006094] dark:text-white mt-2">
              Before Meeting: Setup, Theme & Agenda
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bold mt-1">
              Configure Meeting Theme, Word of the Day, Meeting #, Zoom Link, assign officers & role takers, and manage full Toastmasters agendas.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleAutoGenerateAgenda} className="bg-[#781327] hover:bg-[#580d1b] border-0 shrink-0 cursor-pointer font-montserrat text-white shadow-md font-black text-sm">
            <FiZap className="mr-1.5" size={16} /> Auto-Generate Toastmasters Agenda
          </Button>
        </div>
      </div>



      {/* 📹 Video Guide & Official District Logo Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start no-print">

        {/* Video Player (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#006094] dark:text-white font-montserrat font-black text-sm border-b border-[#f3ebe1] dark:border-slate-800 pb-2">
            <FiPlayCircle size={18} className="text-[#006094]" />
            <span>Meeting Procedure Video Guide</span>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#e8ddd0] shadow-inner bg-black">
            <iframe
              src="https://www.youtube.com/embed/383gehepo8M"
              title="Toastmasters Meeting Guide Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-extrabold text-center">
            Step-by-step video guide for conducting District corporate meetings.
          </p>
        </div>

        {/* Official Brand Lockup Card (Span 1) */}
        <div className="bg-[#E6F0F6]/50 dark:bg-[#121e2d] border border-[#006094]/20 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#006094] dark:text-white font-montserrat font-extrabold text-sm border-b border-[#006094]/20 pb-2 mb-3">
              <FiLayers size={18} className="text-[#006094]" />
              <span>Official District Brand Lockup</span>
            </div>

            <ToastmastersLogo district={activeBooklet.districtName || "DISTRICT 227"} size="md" className="my-2" />
          </div>

          <div className="space-y-1 pt-2 border-t border-[#006094]/20 text-xs text-slate-700 dark:text-slate-300 font-bold">
            <span className="font-black text-[#006094] block font-montserrat uppercase tracking-widest text-xs">District 227 Outreach</span>
            <p>Official Toastmasters International brand compliant layout & executive stationery.</p>
          </div>
        </div>

      </div>

      {/* TOASTMASTERS DEMO MEETING AGENDA TABLE (Super Large & High Impact) */}
      <div className="bg-white dark:bg-[#121e2d] border-4 border-[#004165] dark:border-sky-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 printable-agenda-card">
        
        {/* Header Title & Action Toolbar */}
        <div className="border-b-4 border-[#004165] dark:border-sky-900 pb-6 space-y-6">
          
          {/* Printable Official Header Banner & Integrated Theme / Word of the Day Inputs */}
          <div className="text-center space-y-5">
            
            {/* 📌 Non-editable Fixed Metadata Bar (Date & Time on Left, Venue & District/Division/Area on Right) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#E6F0F6]/90 dark:bg-slate-900 border-2 border-[#006094]/40 rounded-2xl text-sm sm:text-base font-montserrat font-extrabold text-[#006094] dark:text-sky-300 shadow-sm">
              <div className="flex items-center gap-2">
                <FiCalendar size={20} className="text-[#781327]" />
                <span>Date & Time: <span className="text-slate-900 dark:text-white font-black">{formattedLiveDate} @ {formattedLiveTime}</span></span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span>Venue: <span className="text-slate-900 dark:text-white font-black">{pageData.venue || pageData.meetingLink || 'Auditorium / Online'}</span></span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>District: <span className="text-[#781327] dark:text-rose-400 font-black">District 227</span></span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>Division / Area: <span className="text-slate-900 dark:text-white font-black">{activeBooklet.division || 'Division A'} / {activeBooklet.areaDirector || 'Area 01'}</span></span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-[#004165] dark:text-sky-300 uppercase tracking-tight">
              TOASTMASTERS DEMO MEETING AGENDA
            </h2>
            
            {/* Integrated Theme & Word of the Day Controls - Extra Large */}
            <div className="bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-base sm:text-lg font-bold text-[#781327] dark:text-rose-400">
                <span className="font-black uppercase font-montserrat tracking-wide">THEME OF THE DEMO MEETING:</span>
                <input
                  type="text"
                  value={pageData.meetingTheme || ''}
                  onChange={(e) => handleFieldChange('meetingTheme', e.target.value)}
                  placeholder="e.g. Aim for the stars"
                  className="px-5 py-3 bg-white dark:bg-slate-800 border-2 border-[#781327]/40 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-montserrat font-black text-base sm:text-lg focus:ring-4 focus:ring-[#781327]/30 outline-none shadow-sm w-full max-w-xl text-center"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t-2 border-[#e8ddd0] dark:border-slate-800 text-left">
                <div>
                  <label className="block text-xs sm:text-sm font-montserrat font-black uppercase text-[#006094] dark:text-sky-300 mb-2">
                    Word of the Day *
                  </label>
                  <input
                    type="text"
                    value={pageData.wordOfDay || ''}
                    onChange={(e) => handleFieldChange('wordOfDay', e.target.value)}
                    placeholder="e.g. Aspiration"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-montserrat font-black text-base sm:text-lg focus:ring-4 focus:ring-[#006094]/30 outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-montserrat font-black uppercase text-[#006094] dark:text-sky-300 mb-2">
                    Word Meaning
                  </label>
                  <input
                    type="text"
                    value={pageData.wordMeaning || ''}
                    onChange={(e) => handleFieldChange('wordMeaning', e.target.value)}
                    placeholder="A strong desire to achieve something high or great..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-montserrat font-bold text-base sm:text-lg focus:ring-4 focus:ring-[#006094]/30 outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 px-2 no-print">
            <ToastmastersLogo district={activeBooklet.districtName || "DISTRICT 227"} size="md" />
            <div className="flex flex-wrap items-center gap-3">
              <ExportMenu 
                title={`${activeBooklet.title} - Meeting Agenda`} 
                elementId="segment-1-agenda-container" 
                bookletData={activeBooklet} 
              />
              <button 
                type="button"
                onClick={handleLoadDemoTemplate}
                className="text-base bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 cursor-pointer font-montserrat shadow-md transition-all"
                title="Reset to official Demo Agenda Template"
              >
                <FiRefreshCw size={18} /> Load Demo Template
              </button>
            </div>
          </div>
        </div>

        {/* Table layout matching Image 2 - Extra Large */}
        <div id="segment-1-agenda-container" className="max-h-[750px] overflow-y-auto overflow-x-auto border-2 border-[#004165] dark:border-slate-800 rounded-3xl bg-white dark:bg-[#0c1421] relative shadow-inner printable-table-container">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 shadow-md">
              <tr className="bg-[#004165] text-white font-montserrat uppercase tracking-wider text-sm sm:text-base">
                <th className="p-4 font-black w-48 bg-[#004165] border-r border-[#005a8b]">TIME</th>
                <th className="p-4 font-black bg-[#004165] border-r border-[#005a8b]">AGENDA ITEM</th>
                <th className="p-4 font-black bg-[#004165] border-r border-[#005a8b] w-56">ROLE</th>
                <th className="p-4 font-black bg-[#004165] border-r border-[#005a8b] w-64">NAME OF ROLE TAKER</th>
                <th className="p-4 font-black bg-[#004165] border-r border-[#005a8b] w-44">CLUB</th>
                <th className="p-4 font-black w-14 text-center bg-[#004165] no-print-col">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {agendaItems.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-[#faf5ef] dark:hover:bg-slate-900/50">
                  {/* TIME + DURATION */}
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={item.time || ''}
                      onChange={(e) => handleUpdateAgendaItem(item.id, 'time', e.target.value)}
                      placeholder="11:00 AM - 11:05 AM"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-black text-[#781327] dark:text-rose-400 rounded-xl px-3 py-2 focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-500">Duration:</span>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={item.duration || 5}
                        onChange={(e) => handleUpdateAgendaItem(item.id, 'duration', e.target.value)}
                        className="w-20 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-black text-[#006094] dark:text-sky-300 rounded-xl px-2 py-1 text-center"
                      />
                      <span className="text-xs sm:text-sm text-slate-500 font-bold">Min</span>
                    </div>
                  </td>

                  {/* AGENDA ITEM (Title + Description) */}
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.slot || ''}
                        onChange={(e) => handleUpdateAgendaItem(item.id, 'slot', e.target.value)}
                        placeholder="Agenda Item Title..."
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base sm:text-lg font-black text-[#004165] dark:text-sky-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006094]"
                      />
                      {(item.hasVideo || (item.slot && item.slot.toLowerCase().includes('toastmasters introduction'))) && (
                        <button
                          type="button"
                          onClick={() => setShowVideoModal(true)}
                          title="Watch Toastmasters Meeting Procedure Video Guide"
                          className="p-2 text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/50 rounded-xl transition-transform hover:scale-110 cursor-pointer border border-red-200 dark:border-red-900/60 shrink-0"
                        >
                          <FiYoutube size={22} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.details !== undefined ? item.details : (item.notes || '')}
                      onChange={(e) => {
                        handleUpdateAgendaItem(item.id, 'details', e.target.value);
                        handleUpdateAgendaItem(item.id, 'notes', e.target.value);
                      }}
                      placeholder="Welcome participants and set the tone..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none"
                    />
                  </td>

                  {/* ROLE */}
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={item.role || ''}
                      onChange={(e) => handleUpdateAgendaItem(item.id, 'role', e.target.value)}
                      placeholder="Corporate POC / SAA / Speaker..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base sm:text-lg font-black text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006094]"
                    />
                  </td>

                  {/* NAME OF ROLE TAKER */}
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      list="districtRoleTakersList"
                      value={item.speaker || ''}
                      onChange={(e) => handleUpdateAgendaItem(item.id, 'speaker', e.target.value)}
                      placeholder="Select or enter Role Taker Name..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base sm:text-lg font-black text-[#006094] dark:text-sky-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006094]"
                    />
                  </td>

                  {/* CLUB */}
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={item.club || ''}
                      onChange={(e) => handleUpdateAgendaItem(item.id, 'club', e.target.value)}
                      placeholder="Club Name..."
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </td>

                  {/* ACTION */}
                  <td className="p-2 text-center">
                    <button onClick={() => handleDeleteAgendaItem(item.id)} className="text-slate-400 hover:text-red-600 p-1.5 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <datalist id="districtRoleTakersList">
            {DEFAULT_DISTRICT_CONTACTS.map(c => (
              <option key={`rt-${c.id}`} value={c.name}>{`${c.name} (${c.role})`}</option>
            ))}
          </datalist>
        </div>

        {/* Bottom NOTES Box matching Image 2 */}
        <div className="border-2 border-[#004165]/40 dark:border-sky-800/80 rounded-2xl p-3 bg-[#FAF5EF]/90 dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="font-montserrat font-black text-xs text-[#004165] dark:text-sky-300 uppercase tracking-widest shrink-0">
            NOTES:
          </span>
          <input
            type="text"
            value={agendaNotes}
            onChange={(e) => handleFieldChange('agendaNotes', e.target.value)}
            placeholder="1 Prepared Speaker | 1 Evaluator | TAG: Only Timer & Language Evaluator..."
            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#006094]"
          />
        </div>
      </div>

      {/* 🛡️ Field Completion & Next Page Unlock Banner */}
      <div className={`border-2 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 no-print transition-all ${
        isSegment1Complete 
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200' 
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${isSegment1Complete ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200' : 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200'}`}>
            {isSegment1Complete ? <FiCheckSquare size={22} /> : <FiClock size={22} />}
          </div>
          <div>
            <span className="font-montserrat font-extrabold text-sm block">
              {isSegment1Complete ? 'All Segment 1 Required Fields Completed!' : 'Required Fields Incomplete'}
            </span>
            <span className="text-xs font-bold block mt-0.5 opacity-90">
              {isSegment1Complete 
                ? 'All required details (Meeting Theme, Word of the Day, Agenda Role Takers) are filled. You may proceed to Segment 2.'
                : `Missing: ${missingFields.join(', ')}. Fill all fields to unlock the Next Page.`
              }
            </span>
          </div>
        </div>

        {!isSegment1Complete && (
          <span className="text-[11px] font-black uppercase tracking-wider bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-3.5 py-1.5 rounded-full font-montserrat shrink-0 border border-rose-300">
            Navigation Locked
          </span>
        )}
      </div>

      {/* Page navigation steps at bottom of page */}
      <div className="pt-4 border-t border-[#e8ddd0] dark:border-slate-800 no-print">
        <PageNavigation 
          disabledNext={!isSegment1Complete}
          disabledNextReason={`Please complete all required fields (${missingFields.join(', ')}) before moving to Segment 2!`}
        />
      </div>

      {/* ⚡ Dedicated Time Allocation Engine Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#004165] dark:border-sky-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#006094] dark:text-sky-300 uppercase tracking-widest font-montserrat">
                  Dynamic Toastmasters Agenda
                </span>
                <h3 className="text-xl font-montserrat font-black text-[#004165] dark:text-white mt-0.5 flex items-center gap-2">
                  <FiZap className="text-amber-500" /> Allocate Agenda Time Windows
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAllocateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4 font-sans text-xs">
              
              {/* Meeting Start Time input */}
              <div>
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-1">
                  1. Meeting Start Time (e.g. 11:00 AM, 11 AM, 9:30 AM)
                </label>
                <input
                  type="text"
                  value={allocStartTime}
                  onChange={(e) => setAllocStartTime(e.target.value)}
                  placeholder="e.g. 11:00 AM"
                  className="w-full bg-white dark:bg-slate-900 border border-[#006094]/30 text-sm font-black text-[#781327] dark:text-rose-400 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006094]"
                />
                <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                  Example: Typing <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-amber-700 font-bold">11:00 AM</code> allocates 11:00 AM - 11:05 AM, 11:05 AM - 11:10 AM across all rows.
                </span>
              </div>

              {/* Target Total Duration preset pills */}
              <div>
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-1.5">
                  2. Target Total Meeting Duration (Minutes)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['60', '75', '90', '120'].map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setTargetTotalMins(dur)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer border transition-all ${
                        targetTotalMins === dur 
                          ? 'bg-[#006094] text-white border-[#006094]' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {dur} Min Meeting
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={targetTotalMins}
                  onChange={(e) => setTargetTotalMins(e.target.value)}
                  placeholder="Enter total minutes e.g. 75"
                  className="w-full bg-white dark:bg-slate-900 border border-[#006094]/30 text-sm font-black rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Strategy buttons */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
                  3. Select Allocation Mode
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleApplyProportionalAllocation}
                    className="p-3 text-left bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer group transition-all"
                  >
                    <span className="font-black text-amber-900 dark:text-amber-300 block font-montserrat text-xs flex items-center gap-1">
                      <FiZap size={14} /> Proportional Scale ({targetTotalMins} Min)
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block mt-0.5">
                      Scales all row durations to total exactly {targetTotalMins} minutes.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplySequentialAllocation}
                    className="p-3 text-left bg-sky-50 dark:bg-sky-950/30 border-2 border-[#006094] rounded-2xl hover:bg-sky-100 dark:hover:bg-sky-900/40 cursor-pointer group transition-all"
                  >
                    <span className="font-black text-[#006094] dark:text-sky-300 block font-montserrat text-xs flex items-center gap-1">
                      <FiClock size={14} /> Keep Current Durations
                    </span>
                    <span className="text-[10px] text-sky-700 dark:text-sky-400 font-bold block mt-0.5">
                      Recalculates sequential clock times starting from {allocStartTime}.
                    </span>
                  </button>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="xs" type="button" onClick={() => setShowAllocateModal(false)}>
                Cancel
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ➕ Dedicated Add Role Player Modal Box */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#006094] uppercase tracking-widest font-montserrat">
                  Toastmasters Role Assignment
                </span>
                <h3 className="text-xl font-montserrat font-black text-slate-900 dark:text-white mt-0.5">
                  Add Role Player & Name
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomRoleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Speech Evaluator 2, Ah-Counter, Listener..."
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006094]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-1">
                  Assigned Member Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. TM Rajesh"
                  value={newRoleSpeaker}
                  onChange={(e) => setNewRoleSpeaker(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006094]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-1">
                  Target Duration (Minutes)
                </label>
                <input
                  type="number"
                  placeholder="5"
                  value={newRoleTime}
                  onChange={(e) => setNewRoleTime(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006094]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" size="xs" type="button" onClick={() => setShowRoleModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="xs" type="submit">
                  Save Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📹 Toastmasters Procedure Video Guide Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-[#121e2d] border-2 border-[#006094] dark:border-sky-900 rounded-3xl p-5 max-w-2xl w-full shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <FiYoutube className="text-red-600" size={24} />
                <h3 className="font-montserrat font-black text-base text-[#006094] dark:text-white">
                  Toastmasters Meeting Procedure Video Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner bg-black">
              <iframe
                src="https://www.youtube.com/embed/383gehepo8M?autoplay=1"
                title="Toastmasters Meeting Guide Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs font-bold text-slate-500">
              <span>Step-by-step video guide for conducting District corporate meetings.</span>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 bg-[#006094] hover:bg-[#003a5c] text-white font-extrabold rounded-xl text-xs font-montserrat shadow-xs cursor-pointer"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
