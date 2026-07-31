import React, { useState, useEffect, useRef } from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormCheckbox from '../components/forms/FormCheckbox';
import FormTextarea from '../components/forms/FormTextarea';
import Button from '../components/ui/Button';
import { 
  FiClock, FiPlay, FiPause, FiRotateCcw, FiPlus, 
  FiTrash2, FiMapPin, FiCpu, FiCompass, FiFileText, FiRefreshCw, FiCheckCircle
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function Segment2During() {
  const { activeBooklet, updateBooklet, updateBookletPage, createBooklet } = useBooklet();

  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);
  const timerRef = useRef(null);

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page5 || {};
  const speakerTracking = Array.isArray(pageData.speakerTracking) ? pageData.speakerTracking : [];
  const actionItems = Array.isArray(pageData.actionItems) ? pageData.actionItems : [];

  const [isPageVerified, setIsPageVerified] = useState(activeBooklet.page4?.isSegment2Verified || false);

  const p3Roles = activeBooklet.page3?.roles || {};
  const p3RoleTimes = activeBooklet.page3?.roleTimes || {};

  const p4Data = activeBooklet.page4 || {
    venueChecklist: { roomBooked: false, projectorTested: false, microphoneTested: false, seatingArranged: false, bannersPlaced: false },
    equipmentChecklist: { timerCardsReady: false, gavelReady: false, ribbonsReady: false, bookmarksReady: false },
    customVenueChecks: [],
    customEquipmentChecks: []
  };

  const customVenueChecks = Array.isArray(p4Data.customVenueChecks) ? p4Data.customVenueChecks : [];
  const customEquipmentChecks = Array.isArray(p4Data.customEquipmentChecks) ? p4Data.customEquipmentChecks : [];

  // Helper to format minute string
  const formatMinStr = (val) => {
    if (!val && val !== 0) return '5 Min';
    const str = val.toString().trim();
    if (str === '') return '5 Min';
    return str.toLowerCase().includes('min') ? str : `${str} Min`;
  };

  const handleSyncRolesFromSegment1 = () => {
    const agendaItems = Array.isArray(activeBooklet.page3?.agendaItems) ? activeBooklet.page3.agendaItems : [];
    
    if (agendaItems.length === 0) return;

    const existingTracking = speakerTracking;

    const syncedSpeakers = agendaItems.map((item, idx) => {
      const match = existingTracking.find(ex => ex.id === item.id || (ex.role === (item.role || item.slot) && ex.speaker === item.speaker));
      
      const roleTitle = item.role && item.role.trim() !== '' ? item.role : (item.slot || `Agenda Item ${idx + 1}`);
      const durationStr = `${item.duration || 5} Min`;

      return {
        id: item.id || `ag-spk-${idx}`,
        speaker: item.speaker || '',
        role: roleTitle,
        slotTitle: item.slot || '',
        targetTime: durationStr,
        time: match ? match.time : ''
      };
    });

    updateBookletPage('page5', { speakerTracking: syncedSpeakers });
    if (syncedSpeakers.length > 0 && !selectedSpeakerId) {
      setSelectedSpeakerId(syncedSpeakers[0].id);
    }
  };

  // Auto-sync roles from Segment 1 whenever active booklet or agenda items change
  useEffect(() => {
    handleSyncRolesFromSegment1();
  }, [activeBooklet.id, JSON.stringify(activeBooklet.page3?.agendaItems || [])]);

  // Stopwatch timer effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => setTimerRunning(!timerRunning);
  const handleResetTimer = () => {
    setTimerRunning(false);
    setSeconds(0);
  };

  const handleRecordTime = () => {
    if (!selectedSpeakerId) return;
    const formatted = formatTime(seconds);
    const updated = speakerTracking.map(sp => {
      if (sp.id === selectedSpeakerId) return { ...sp, time: formatted };
      return sp;
    });
    updateBookletPage('page5', { speakerTracking: updated });
    alert(`⏱️ Time recorded (${formatted}) for speaker!`);
  };

  const handleAddSpeaker = () => {
    const newSp = {
      id: `sp-${uuidv4()}`,
      speaker: '',
      role: 'Speaker',
      targetTime: '5 Min',
      time: ''
    };
    const updated = [...speakerTracking, newSp];
    updateBookletPage('page5', { speakerTracking: updated });
    if (!selectedSpeakerId) setSelectedSpeakerId(newSp.id);
  };

  const handleDeleteSpeaker = (id) => {
    const updated = speakerTracking.filter(sp => sp.id !== id);
    updateBookletPage('page5', { speakerTracking: updated });
    if (selectedSpeakerId === id) {
      setSelectedSpeakerId(updated[0]?.id || null);
    }
  };

  const handleActionChange = (id, field, value) => {
    const updated = actionItems.map(act => {
      if (act.id === id) return { ...act, [field]: value };
      return act;
    });
    updateBookletPage('page5', { actionItems: updated });
  };

  const handleAddAction = () => {
    const newAct = {
      id: `act-${uuidv4()}`,
      action: '',
      owner: '',
      status: 'Pending'
    };
    updateBookletPage('page5', { actionItems: [...actionItems, newAct] });
  };

  const handleDeleteAction = (id) => {
    const updated = actionItems.filter(act => act.id !== id);
    updateBookletPage('page5', { actionItems: updated });
  };

  const handleCheckChange = (group, key) => {
    if (group === 'venueChecklist' || group === 'equipmentChecklist') {
      const updatedGroup = {
        ...p4Data[group],
        [key]: !p4Data[group][key]
      };
      updateBookletPage('page4', { [group]: updatedGroup });
    } else {
      const updatedChecks = {
        ...pageData.checklist,
        [key]: !pageData.checklist[key]
      };
      updateBookletPage('page5', { checklist: updatedChecks });
    }
  };

  // Custom Venue Checks Handlers
  const handleAddCustomVenueCheck = () => {
    const newItem = { id: `vc-${uuidv4()}`, label: 'Custom Venue Check', checked: false };
    updateBookletPage('page4', { customVenueChecks: [...customVenueChecks, newItem] });
  };

  const handleUpdateCustomVenueCheck = (id, field, value) => {
    const updated = customVenueChecks.map(item => item.id === id ? { ...item, [field]: value } : item);
    updateBookletPage('page4', { customVenueChecks: updated });
  };

  const handleDeleteCustomVenueCheck = (id) => {
    const updated = customVenueChecks.filter(item => item.id !== id);
    updateBookletPage('page4', { customVenueChecks: updated });
  };

  // Custom Equipment Checks Handlers
  const handleAddCustomEquipmentCheck = () => {
    const newItem = { id: `ec-${uuidv4()}`, label: 'Custom Equipment Item', checked: false };
    updateBookletPage('page4', { customEquipmentChecks: [...customEquipmentChecks, newItem] });
  };

  const handleUpdateCustomEquipmentCheck = (id, field, value) => {
    const updated = customEquipmentChecks.map(item => item.id === id ? { ...item, [field]: value } : item);
    updateBookletPage('page4', { customEquipmentChecks: updated });
  };

  const handleDeleteCustomEquipmentCheck = (id) => {
    const updated = customEquipmentChecks.filter(item => item.id !== id);
    updateBookletPage('page4', { customEquipmentChecks: updated });
  };

  // Find currently selected speaker object
  const selectedSpeaker = speakerTracking.find(s => s.id === selectedSpeakerId);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-white bg-[#006094] border border-[#006094]/30 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Segment 2 of 3
            </span>
            <h1 className="text-2xl font-montserrat font-extrabold text-[#006094] dark:text-white mt-2">
              During Meeting: Live Execution & Stopwatch
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Track live speech durations with interactive stopwatch timer, compare assigned target times with actual spoken durations, and log notes.
            </p>
          </div>

          <button 
            onClick={handleSyncRolesFromSegment1}
            className="bg-[#006094] hover:bg-[#003a5c] text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#003a5c] font-montserrat shrink-0"
          >
            <FiRefreshCw size={15} className="text-white" />
            <span>Auto-Fill Names from Segment 1</span>
          </button>
        </div>
      </div>





      {/* 🏢 Logistics & Venue Verification (Without Checkboxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Venue Preparation Checks */}
        <div className="bg-[#E6F0F6]/40 dark:bg-[#121e2d] border border-[#006094]/20 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#006094]/20 pb-2">
            <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white flex items-center gap-2">
              <FiMapPin className="text-[#006094]" /> Venue & Hall Readiness Checks
            </h3>
            <button 
              onClick={handleAddCustomVenueCheck}
              className="text-[10px] bg-[#006094] hover:bg-[#003a5c] text-white px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer font-montserrat shadow-xs"
            >
              <FiPlus size={11} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {[
              { key: 'roomBooked', label: 'Meeting Room / Auditorium Reserved' },
              { key: 'projectorTested', label: 'Projector / Screen Display Tested' },
              { key: 'microphoneTested', label: 'Microphone & Audio System Clear' },
              { key: 'seatingArranged', label: 'U-Shape / Theater Seating Arranged' },
              { key: 'bannersPlaced', label: 'District 227 Banner Placed' }
            ].map(item => (
              <div key={item.key} className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl shadow-2xs">
                <span className="text-xs font-montserrat font-extrabold text-slate-800 dark:text-slate-200">{item.label}</span>
              </div>
            ))}

            {/* Custom Venue Check Items */}
            {customVenueChecks.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl">
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => handleUpdateCustomVenueCheck(item.id, 'label', e.target.value)}
                  placeholder="Custom venue check item..."
                  className="flex-1 bg-transparent border-0 text-xs font-bold focus:outline-none text-slate-900 dark:text-slate-100"
                />
                <button onClick={() => handleDeleteCustomVenueCheck(item.id)} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                  <FiTrash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment & Ribbons Readiness */}
        <div className="bg-[#E6F0F6]/40 dark:bg-[#121e2d] border border-[#006094]/20 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#006094]/20 pb-2">
            <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white flex items-center gap-2">
              <FiCpu className="text-[#006094]" /> Meeting Equipment & Supplies
            </h3>
            <button 
              onClick={handleAddCustomEquipmentCheck}
              className="text-[10px] bg-[#006094] hover:bg-[#003a5c] text-white px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1 cursor-pointer font-montserrat shadow-xs"
            >
              <FiPlus size={11} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {[
              { key: 'timerCardsReady', label: 'Red / Yellow / Green Timer Cards Ready' },
              { key: 'gavelReady', label: 'Toastmasters Wooden Gavel Available' },
              { key: 'ribbonsReady', label: 'Award Ribbons / Certificates Ready' },
              { key: 'bookmarksReady', label: 'Corporate Value Handouts Printed' }
            ].map(item => (
              <div key={item.key} className="p-3 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl shadow-2xs">
                <span className="text-xs font-montserrat font-extrabold text-slate-800 dark:text-slate-200">{item.label}</span>
              </div>
            ))}

            {/* Custom Equipment Check Items */}
            {customEquipmentChecks.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-xl">
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => handleUpdateCustomEquipmentCheck(item.id, 'label', e.target.value)}
                  placeholder="Custom equipment item..."
                  className="flex-1 bg-transparent border-0 text-xs font-bold focus:outline-none text-slate-900 dark:text-slate-100"
                />
                <button onClick={() => handleDeleteCustomEquipmentCheck(item.id)} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                  <FiTrash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🧭 Follow-up Action Items */}
      <div className="bg-[#FAF5EF] dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f3ebe1] dark:border-slate-800 pb-2">
            <h3 className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white flex items-center gap-2">
              <FiCompass className="text-[#006094]" /> Follow-up Action Items
            </h3>
            <Button variant="primary" size="xs" onClick={handleAddAction} className="bg-[#006094] hover:bg-[#003a5c] border-0 cursor-pointer font-montserrat text-white font-extrabold">
              <FiPlus size={12} className="mr-1" /> Add Action Item
            </Button>
          </div>

          <div className="space-y-3">
            {actionItems.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-4 font-semibold">No action items logged.</div>
            ) : (
              actionItems.map(act => (
                <div key={act.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-950 border border-[#e8ddd0] rounded-xl">
                  <input
                    type="text"
                    placeholder="Action item..."
                    value={act.action || ''}
                    onChange={(e) => handleActionChange(act.id, 'action', e.target.value)}
                    className="flex-1 bg-transparent border-0 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    placeholder="Owner"
                    value={act.owner || ''}
                    onChange={(e) => handleActionChange(act.id, 'owner', e.target.value)}
                    className="w-24 bg-transparent border-0 text-xs text-slate-500 focus:outline-none"
                  />
                  <button onClick={() => handleDeleteAction(act.id)} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      {/* 🛡️ Master Page Readiness Verification Checkbox Card */}
      <div className="bg-[#E6F0F6]/80 dark:bg-[#121e2d] border-2 border-[#006094] dark:border-sky-800 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <label className="flex items-center gap-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isPageVerified}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsPageVerified(checked);
              updateBookletPage('page4', { isSegment2Verified: checked });
            }}
            className="w-6 h-6 text-[#006094] border-2 border-[#006094] rounded-lg focus:ring-2 focus:ring-[#006094] cursor-pointer shrink-0"
          />
          <div>
            <span className="font-montserrat font-extrabold text-sm text-[#006094] dark:text-white block">
              I Confirm All Venue & Equipment Readiness Details
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold block mt-0.5">
              Check this box to confirm all meeting supplies, venue setups, and equipment checks are verified before proceeding to Segment 3.
            </span>
          </div>
        </label>

        {!isPageVerified && (
          <span className="text-[11px] font-black uppercase tracking-wider bg-rose-100 text-[#781327] dark:bg-rose-950 dark:text-rose-300 px-3 py-1.5 rounded-full font-montserrat shrink-0 border border-rose-300 dark:border-rose-900">
            🔒 Required to Unlock Next Page
          </span>
        )}
      </div>

      {/* Navigation footer */}
      <PageNavigation 
        disabledNext={!isPageVerified} 
        disabledNextReason="Please tick the Master Verification checkbox confirming venue & equipment readiness before moving to Segment 3!" 
      />
    </div>
  );
}
