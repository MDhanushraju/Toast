import React, { useState, useEffect, useRef } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import { 
  FiClock, FiPlay, FiPause, FiRotateCcw, FiCheckCircle, 
  FiAlertCircle, FiAward, FiFileText, FiArrowLeft, FiZap 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function TimerConsole() {
  const { activeBooklet, updateBookletPage } = useBooklet();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);
  const timerRef = useRef(null);

  const page5Data = activeBooklet?.page5 || { speakerTracking: [] };
  const speakerTracking = page5Data.speakerTracking || [];

  useEffect(() => {
    if (speakerTracking.length > 0 && !selectedSpeakerId) {
      setSelectedSpeakerId(speakerTracking[0].id);
    }
  }, [speakerTracking]);

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

  const selectedSpeaker = speakerTracking.find(s => s.id === selectedSpeakerId) || speakerTracking[0];

  // Calculate target minutes limit
  const getTargetMinutes = () => {
    if (!selectedSpeaker || !selectedSpeaker.targetTime) return 5;
    const num = parseInt(selectedSpeaker.targetTime.toString().replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 5 : num;
  };

  const targetMins = getTargetMinutes();
  const greenSecs = (targetMins - 2 > 0 ? targetMins - 2 : targetMins * 0.7) * 60;
  const yellowSecs = (targetMins - 1 > 0 ? targetMins - 1 : targetMins * 0.85) * 60;
  const redSecs = targetMins * 60;

  // Auto-pilot visual card signals
  let signalColor = 'bg-slate-900 border-slate-700 text-white'; // Default idle
  let signalLabel = 'WHITE (Ready)';

  if (seconds >= redSecs) {
    signalColor = 'bg-red-600 border-red-500 text-white animate-pulse shadow-2xl';
    signalLabel = 'RED CARD (Time Expired!)';
  } else if (seconds >= yellowSecs) {
    signalColor = 'bg-amber-500 border-amber-400 text-black shadow-xl';
    signalLabel = 'YELLOW CARD (1 Min Remaining)';
  } else if (seconds >= greenSecs) {
    signalColor = 'bg-emerald-600 border-emerald-500 text-white shadow-xl';
    signalLabel = 'GREEN CARD (Minimum Qualified)';
  }

  const handleStartPause = () => setTimerRunning(!timerRunning);
  const handleReset = () => {
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
    showToast(`Duration ${formatted} recorded for ${selectedSpeaker?.speaker || 'Speaker'}!`, "success");
  };

  const handleGenerateTimerReport = () => {
    const reportLines = speakerTracking.map(s => 
      `• ${s.role} (${s.speaker || 'Unassigned'}): Target ${s.targetTime} -> Actual Spoken: ${s.time || 'Pending'}`
    ).join('\n');

    showToast(`Timer report calculated for ${speakerTracking.length} role players!`, "info");
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/booklet/segment-2')} 
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#006094] hover:text-white rounded-2xl transition-all cursor-pointer"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-black text-white bg-[#781327] px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              Dedicated Role View
            </span>
            <h1 className="text-2xl font-montserrat font-black text-[#006094] dark:text-white mt-1">
              Official Toastmasters Timer Console
            </h1>
          </div>
        </div>

        <button
          onClick={handleGenerateTimerReport}
          className="bg-[#006094] hover:bg-[#003a5c] text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer font-montserrat"
        >
          <FiFileText size={16} /> 1-Click Timer Report
        </button>
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Full Auto-Pilot Visual Signal Display */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Signal Indicator Card */}
          <div className={`p-10 rounded-3xl border-4 transition-all duration-500 text-center flex flex-col items-center justify-center space-y-4 min-h-[320px] ${signalColor}`}>
            <span className="text-xs font-black uppercase tracking-widest font-montserrat px-4 py-1.5 rounded-full bg-black/20 text-white">
              {signalLabel}
            </span>

            <div className="text-7xl font-black font-mono tracking-wider drop-shadow-md">
              {formatTime(seconds)}
            </div>

            <div className="flex items-center gap-3 text-xs font-extrabold font-montserrat">
              <span>Target: {targetMins} Min</span>
              <span>•</span>
              <span>Green: {Math.floor(greenSecs / 60)}m</span>
              <span>•</span>
              <span>Yellow: {Math.floor(yellowSecs / 60)}m</span>
              <span>•</span>
              <span>Red: {targetMins}m</span>
            </div>
          </div>

          {/* Stopwatch Controls */}
          <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartPause}
                className={timerRunning ? 'bg-amber-600 hover:bg-amber-700 text-white font-black' : 'bg-emerald-600 hover:bg-emerald-700 text-white font-black'}
              >
                {timerRunning ? <><FiPause className="mr-2" /> Pause</> : <><FiPlay className="mr-2" /> Start Stopwatch</>}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleReset}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black"
              >
                <FiRotateCcw className="mr-2" /> Reset
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleRecordTime}
                className="bg-[#781327] hover:bg-[#580d1b] text-white font-black"
              >
                Record Time
              </Button>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Speaker Selector & Log List */}
        <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-montserrat font-black text-sm text-[#006094] dark:text-white">
              Select Speaker to Time
            </h3>
            <span className="text-[10px] bg-[#E6F0F6] text-[#006094] font-extrabold px-2 py-0.5 rounded-full">
              {speakerTracking.length} Takers
            </span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {speakerTracking.map(sp => {
              const isSelected = selectedSpeakerId === sp.id;
              return (
                <div
                  key={sp.id}
                  onClick={() => setSelectedSpeakerId(sp.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-[#E6F0F6] dark:bg-blue-950/50 border-[#006094] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-[#e8ddd0] dark:border-slate-800 hover:border-[#006094]/50'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-montserrat font-black text-xs text-[#006094] dark:text-sky-300 truncate">
                      {sp.speaker || 'Unassigned Speaker'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold truncate">
                      {sp.role} ({sp.targetTime || '5 Min'})
                    </div>
                  </div>

                  <span className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 font-mono ${
                    sp.time ? 'bg-[#781327] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {sp.time || 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
