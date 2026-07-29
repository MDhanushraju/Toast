import React, { useState, useEffect, useRef } from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import FormCheckbox from '../components/forms/FormCheckbox';
import FormTextarea from '../components/forms/FormTextarea';
import Button from '../components/ui/Button';
import { 
  FiCheckSquare, FiPlay, FiPause, FiRotateCcw, 
  FiPlus, FiTrash2, FiClock, FiFileText, FiUsers, FiCompass 
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function Page5During() {
  const { activeBooklet, updateBookletPage } = useBooklet();
  
  // Stopwatch controls states
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);
  const timerRef = useRef(null);

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page5 || {
    checklist: { valueOpeningUsed: false, noJargonUsed: false, timeDisciplineMaintained: false, guestParticipationRespectful: false },
    liveNotes: '',
    speakerTracking: [],
    guestsList: '',
    actionItems: []
  };

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
    if (!selectedSpeakerId) {
      alert("Please select a speaker row from the table first.");
      return;
    }
    const formatted = formatTime(seconds);
    handleSpeakerChange(selectedSpeakerId, 'time', formatted);
  };

  // State handlers
  const handleCheckChange = (key) => {
    const updatedChecks = {
      ...pageData.checklist,
      [key]: !pageData.checklist[key]
    };
    updateBookletPage('page5', { checklist: updatedChecks });
  };

  const handleSpeakerChange = (id, field, value) => {
    const updatedSpeakers = pageData.speakerTracking.map(sp => {
      if (sp.id === id) {
        return { ...sp, [field]: value };
      }
      return sp;
    });
    updateBookletPage('page5', { speakerTracking: updatedSpeakers });
  };

  const handleAddSpeaker = () => {
    const newSp = {
      id: `sp-${uuidv4()}`,
      speaker: '',
      role: 'Speaker/Evaluator',
      time: ''
    };
    const updated = [...pageData.speakerTracking, newSp];
    updateBookletPage('page5', { speakerTracking: updated });
    setSelectedSpeakerId(newSp.id);
  };

  const handleDeleteSpeaker = (id) => {
    const updated = pageData.speakerTracking.filter(sp => sp.id !== id);
    updateBookletPage('page5', { speakerTracking: updated });
    if (selectedSpeakerId === id) {
      setSelectedSpeakerId(updated[0]?.id || null);
    }
  };

  // Action items handlers
  const handleActionChange = (id, field, value) => {
    const updated = pageData.actionItems.map(act => {
      if (act.id === id) {
        return { ...act, [field]: value };
      }
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
    updateBookletPage('page5', { actionItems: [...pageData.actionItems, newAct] });
  };

  const handleDeleteAction = (id) => {
    const updated = pageData.actionItems.filter(act => act.id !== id);
    updateBookletPage('page5', { actionItems: updated });
  };

  const handleFieldChange = (key, value) => {
    updateBookletPage('page5', { [key]: value });
  };

  const handleClear = () => {
    if (confirm("Clear Page 5 execution records?")) {
      updateBookletPage('page5', {
        checklist: { valueOpeningUsed: false, noJargonUsed: false, timeDisciplineMaintained: false, guestParticipationRespectful: false },
        liveNotes: '',
        speakerTracking: [
          { id: `sp-${uuidv4()}`, speaker: "", role: "Toastmaster", time: "" },
          { id: `sp-${uuidv4()}`, speaker: "", role: "Speaker 1", time: "" },
          { id: `sp-${uuidv4()}`, speaker: "", role: "Evaluator 1", time: "" },
          { id: `sp-${uuidv4()}`, speaker: "", role: "Table Topics Master", time: "" }
        ],
        guestsList: '',
        actionItems: []
      });
      handleResetTimer();
      setSelectedSpeakerId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Booklet page wrapper */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#e8ddd0] dark:border-slate-800 pb-3 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-[#772432] dark:text-white">
                  During Meeting Execution
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Monitor meeting timings, checklists, actions, and take notes.
                </p>
              </div>
              <button 
                onClick={handleClear}
                className="px-3 py-1 bg-[#faf5ef] dark:bg-slate-900 text-[#772432] dark:text-rose-200 hover:bg-[#772432] hover:text-white border border-[#e8ddd0] dark:border-slate-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
              >
                Clear Page
              </button>
            </div>

            {/* Print Header */}
            <div className="hidden print:block pb-2 border-b-2 border-[#772432]">
              <h2 className="text-xl font-bold text-[#772432]">During Meeting Execution</h2>
              <p className="text-xs text-slate-650">District 228 Live Session Timings & Actions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Standards, Stopwatch, and Guests */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Standards Checklist */}
                <div className="space-y-3">
                  <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                    <FiCheckSquare className="text-[#004165]" /> Execution Standards
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'valueOpeningUsed', label: 'Value-driven opening', desc: 'Discussed practical benefits.' },
                      { key: 'noJargonUsed', label: 'No jargon used', desc: 'Avoided technical terms.' },
                      { key: 'timeDisciplineMaintained', label: 'Time discipline maintained', desc: 'Timer cards active.' },
                      { key: 'guestParticipationRespectful', label: 'Guest participation respectful', desc: 'Voluntary topics.' }
                    ].map(item => (
                      <FormCheckbox
                        key={item.key}
                        id={`exec-${item.key}`}
                        label={item.label}
                        description={item.desc}
                        checked={pageData.checklist?.[item.key] || false}
                        onChange={() => handleCheckChange(item.key)}
                      />
                    ))}
                  </div>
                </div>

                {/* Stopwatch Assistant */}
                <div className="space-y-3 no-print">
                  <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                    <FiClock className="text-[#f2a900]" /> Timing Assistant
                  </h3>
                  <div className="bg-[#004165] text-white border border-[#002b45] rounded-2xl p-5 flex flex-col items-center justify-center gap-4 shadow-md">
                    <div className="font-outfit font-extrabold text-3xl text-white tracking-wider">
                      {formatTime(seconds)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleStartPause}
                        className={`p-2 rounded-full text-[#772432] ${timerRunning ? 'bg-[#f2a900] hover:bg-[#d99700]' : 'bg-[#f2a900] hover:bg-[#d99700]'} transition-all cursor-pointer`}
                      >
                        {timerRunning ? <FiPause size={16} /> : <FiPlay size={16} />}
                      </button>
                      <button
                        onClick={handleResetTimer}
                        className="p-2 rounded-full bg-[#002b45] hover:bg-[#005580] text-white transition-all cursor-pointer"
                      >
                        <FiRotateCcw size={16} />
                      </button>
                      <Button variant="primary" size="sm" onClick={handleRecordTime} className="bg-[#772432] hover:bg-[#5e1c27] border-0">
                        Record to Row
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Guests present */}
                <FormTextarea
                  label="Guests Present"
                  id="guestsList"
                  value={pageData.guestsList || ''}
                  onChange={(e) => handleFieldChange('guestsList', e.target.value)}
                  placeholder="Record guest names..."
                  rows={3}
                />

              </div>

              {/* Right Column: Timing log and Actions */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Speaker timings table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between no-print">
                    <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                      <FiClock className="text-[#004165]" /> Speaker Timings Log
                    </h3>
                    <Button variant="secondary" size="xs" onClick={handleAddSpeaker}>
                      <FiPlus size={13} className="mr-1" /> Add Row
                    </Button>
                  </div>

                  <div className="overflow-x-auto border border-[#e8ddd0] dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0c1421] shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#772432] text-white border-b border-[#5e1c27]">
                          <th className="p-3 font-extrabold w-10 text-center no-print">Select</th>
                          <th className="p-3 font-extrabold">Speaker Name</th>
                          <th className="p-3 font-extrabold">Role</th>
                          <th className="p-3 font-extrabold w-24">Time</th>
                          <th className="p-3 font-extrabold w-10 text-center no-print">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageData.speakerTracking.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-6 text-center text-slate-400 font-semibold bg-[#faf5ef]/50 dark:bg-slate-900/20">
                              No speakers logged.
                            </td>
                          </tr>
                        ) : (
                          pageData.speakerTracking.map(sp => (
                            <tr 
                              key={sp.id} 
                              className={`border-b border-[#e8ddd0]/60 dark:border-slate-800 hover:bg-[#faf5ef] dark:hover:bg-slate-900/50 transition-colors last:border-0 ${selectedSpeakerId === sp.id ? 'bg-[#faf5ef] font-bold border-l-4 border-l-[#772432]' : ''}`}
                            >
                              <td className="p-3 text-center no-print">
                                <input
                                  type="radio"
                                  name="active_speaker"
                                  checked={selectedSpeakerId === sp.id}
                                  onChange={() => setSelectedSpeakerId(sp.id)}
                                  className="w-4 h-4 text-[#772432] focus:ring-[#772432] cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={sp.speaker || ''}
                                  onChange={(e) => handleSpeakerChange(sp.id, 'speaker', e.target.value)}
                                  placeholder="e.g. Prashant"
                                  className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={sp.role || ''}
                                  onChange={(e) => handleSpeakerChange(sp.id, 'role', e.target.value)}
                                  placeholder="e.g. Toastmaster"
                                  className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={sp.time || ''}
                                  onChange={(e) => handleSpeakerChange(sp.id, 'time', e.target.value)}
                                  placeholder="05:30"
                                  className="w-full bg-transparent font-mono font-bold text-[#772432] dark:text-[#f2a900] border-0 border-b border-transparent focus:border-[#772432] focus:outline-none"
                                />
                              </td>
                              <td className="p-3 text-center no-print">
                                <button
                                  onClick={() => handleDeleteSpeaker(sp.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-[#faf5ef] dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Items tracker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between no-print">
                    <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                      <FiCompass className="text-[#f2a900]" /> Follow-up Action Items
                    </h3>
                    <Button variant="secondary" size="xs" onClick={handleAddAction}>
                      <FiPlus size={13} className="mr-1" /> Add Action
                    </Button>
                  </div>

                  <div className="overflow-x-auto border border-[#e8ddd0] dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0c1421] shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#772432] text-white border-b border-[#5e1c27]">
                          <th className="p-3 font-extrabold">Action Item Description</th>
                          <th className="p-3 font-extrabold w-24">Owner</th>
                          <th className="p-3 font-extrabold w-24">Status</th>
                          <th className="p-3 font-extrabold w-10 text-center no-print">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageData.actionItems.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-6 text-center text-slate-400 font-semibold bg-[#faf5ef]/50 dark:bg-slate-900/20">
                              No action items recorded.
                            </td>
                          </tr>
                        ) : (
                          pageData.actionItems.map(act => (
                            <tr key={act.id} className="border-b border-[#e8ddd0]/60 dark:border-slate-800 last:border-0 hover:bg-[#faf5ef]">
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={act.action || ''}
                                  onChange={(e) => handleActionChange(act.id, 'action', e.target.value)}
                                  placeholder="e.g. Send brochures"
                                  className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={act.owner || ''}
                                  onChange={(e) => handleActionChange(act.id, 'owner', e.target.value)}
                                  placeholder="Owner"
                                  className="w-full bg-transparent border-0 border-b border-transparent focus:border-[#772432] focus:outline-none text-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="p-3">
                                <select
                                  value={act.status || 'Pending'}
                                  onChange={(e) => handleActionChange(act.id, 'status', e.target.value)}
                                  className="bg-transparent border-0 border-b border-transparent focus:outline-none focus:border-[#772432] cursor-pointer text-[#772432] dark:text-[#f2a900] font-bold"
                                >
                                  <option value="Pending" className="dark:bg-slate-950">Pending</option>
                                  <option value="In Progress" className="dark:bg-slate-950">In Progress</option>
                                  <option value="Completed" className="dark:bg-slate-950">Completed</option>
                                </select>
                              </td>
                              <td className="p-3 text-center no-print">
                                <button
                                  onClick={() => handleDeleteAction(act.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-[#faf5ef] dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

            {/* Live Observation Notes */}
            <div className="space-y-2 pt-2">
              <h4 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                <FiFileText className="text-[#004165]" /> Live observations / Notes
              </h4>
              <div className="hidden print:block dotted-notes min-h-[220px] text-xs">
                {pageData.liveNotes}
              </div>
              <textarea
                value={pageData.liveNotes || ''}
                onChange={(e) => handleFieldChange('liveNotes', e.target.value)}
                placeholder="Log live comments, questions asked by guests, parts that generated maximum enthusiasm..."
                rows={6}
                className="w-full p-4 text-xs bg-white dark:bg-[#0c1421] text-slate-800 dark:text-slate-100 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#772432] print:hidden"
              />
            </div>

          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 5 Execution
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
