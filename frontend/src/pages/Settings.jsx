import React, { useRef, useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useToast } from '../context/ToastContext';
import { 
  FiDownload, FiUpload, FiTrash2, FiRefreshCw, FiSun, FiMoon, 
  FiBell, FiSave, FiHardDrive, FiCheckCircle, FiShield, FiSliders
} from 'react-icons/fi';

export default function Settings() {
  const { 
    theme, setTheme, resetAllData, exportData, importData, booklets, activeBooklet, resetBooklet 
  } = useBooklet();
  const { addToast } = useToast();

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState({ type: '', message: '' });
  const [autoSaveInterval, setAutoSaveInterval] = useState('5');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importData(event.target.result);
      if (result.success) {
        setImportStatus({ type: 'success', message: 'Data imported successfully!' });
        addToast('Backup data imported successfully!', 'success');
      } else {
        setImportStatus({ type: 'error', message: `Import failed: ${result.error}` });
        addToast(`Import failed: ${result.error}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetActive = () => {
    if (activeBooklet && confirm(`Reset active booklet "${activeBooklet.title}" back to empty template? All input data will be lost.`)) {
      resetBooklet(activeBooklet.id);
      addToast('Active booklet reset to template.', 'info');
    }
  };

  const handleResetAll = () => {
    if (confirm("Reset ALL application data? This will delete all custom booklets and restore original seeds. This cannot be undone.")) {
      resetAllData();
      addToast('All system data wiped and reset to seeds.', 'warning');
    }
  };

  // Calculate approximate LocalStorage usage
  const storageUsageKB = Math.round(JSON.stringify(localStorage).length / 1024);

  return (
    <div className="w-full space-y-8 font-sans pb-12">
      
      {/* Super Large Page Header */}
      <div className="bg-[#781327] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-white text-[#781327] flex items-center justify-center shrink-0 shadow-xl">
            <FiSliders size={42} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black leading-tight text-white">
              Global System Preferences & Data Management
            </h1>
            <p className="text-lg sm:text-xl text-rose-100 font-bold mt-2">
              Configure display themes, automated background saving, system notifications, and database backups.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Full Width Settings Grid (50/50 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        
        {/* Card 1: Theme & Display Options */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4 flex items-center gap-3">
              <FiSun size={32} className="text-[#781327]" /> Interface Customization
            </h3>

            <div>
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-3">
                Display Visual Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl text-lg font-black font-montserrat transition-all cursor-pointer border-2 ${
                    theme === 'light' 
                      ? 'bg-[#781327] border-[#781327] text-white shadow-lg scale-105' 
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <FiSun size={24} /> Light Mode
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl text-lg font-black font-montserrat transition-all cursor-pointer border-2 ${
                    theme === 'dark' 
                      ? 'bg-[#004165] border-[#004165] text-white shadow-lg scale-105' 
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <FiMoon size={24} /> Dark Mode
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-base font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            Current active theme: <span className="text-[#006094] dark:text-sky-400 font-black uppercase">{theme} mode</span>
          </div>
        </div>

        {/* Card 2: Auto-Save & System Alerts */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4 flex items-center gap-3">
              <FiSave size={32} className="text-[#006094]" /> Auto-Save & System Alerts
            </h3>

            <div>
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-montserrat mb-3">
                Background Auto-Save Frequency
              </label>
              <select
                value={autoSaveInterval}
                onChange={(e) => {
                  setAutoSaveInterval(e.target.value);
                  addToast(`Auto-save interval updated to every ${e.target.value} seconds.`, 'success');
                }}
                className="w-full bg-[#FAF5EF] dark:bg-slate-900 border-2 border-[#006094] text-lg font-black rounded-2xl p-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-[#006094]/30 cursor-pointer"
              >
                <option value="5">Every 5 Seconds (Instant)</option>
                <option value="15">Every 15 Seconds (Standard)</option>
                <option value="30">Every 30 Seconds</option>
                <option value="60">Every 1 Minute</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
              <div>
                <div className="font-montserrat font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <FiBell size={22} className="text-[#781327]" /> Officer Meeting Alerts
                </div>
                <div className="text-sm text-slate-600 font-bold mt-0.5">Show popups for meeting role & timing updates</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                  addToast(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}.`, 'info');
                }}
                className={`px-5 py-2.5 rounded-2xl text-base font-black font-montserrat cursor-pointer transition-all ${
                  notificationsEnabled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Backup & Restore JSON Data */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4 flex items-center gap-3">
              <FiDownload size={32} className="text-[#781327]" /> Backup & Data Restore
            </h3>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
              Export all saved District 227 booklets, meeting records, and contact directories into a portable JSON backup file.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={exportData}
                className="w-full flex items-center justify-center gap-3 p-4 bg-[#781327] hover:bg-[#580d1b] text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-md cursor-pointer font-montserrat"
              >
                <FiDownload size={24} /> Export Backup JSON
              </button>

              <button
                type="button"
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-3 p-4 bg-[#006094] hover:bg-[#004165] text-white font-black text-base sm:text-lg rounded-2xl transition-all shadow-md cursor-pointer font-montserrat"
              >
                <FiUpload size={24} /> Import Backup File
              </button>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {importStatus.message && (
            <div className={`p-4 rounded-2xl text-base font-black ${
              importStatus.type === 'success' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {importStatus.message}
            </div>
          )}
        </div>

        {/* Card 4: Local Storage Engine & Memory Diagnostics */}
        <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4 flex items-center gap-3">
              <FiHardDrive size={32} className="text-[#006094]" /> Storage Engine Diagnostics
            </h3>

            <div className="space-y-4 font-montserrat">
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>Active Booklets Stored</span>
                <span className="text-[#006094] dark:text-sky-400 font-black">{booklets?.length || 0} Booklets</span>
              </div>
              
              <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>Approximate Memory Used</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{storageUsageKB} KB / 5000 KB</span>
              </div>

              <div className="flex items-center justify-between text-base sm:text-lg font-black text-slate-800 dark:text-slate-200">
                <span>System Environment</span>
                <span className="text-slate-600 dark:text-slate-400 font-bold">Stable Offline HTML5</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 text-base font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <FiCheckCircle size={22} /> Local database operating at 100% capacity
          </div>
        </div>

      </div>

      {/* Danger Zone Actions - Full Width */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-rose-300 dark:border-rose-900 rounded-3xl p-8 shadow-md space-y-6">
        <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-rose-700 dark:text-rose-400 border-b-2 border-rose-200 dark:border-rose-900 pb-4 flex items-center gap-3">
          <FiTrash2 size={32} className="text-rose-600" /> Danger Zone Actions
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-bold max-w-2xl leading-relaxed">
            Reset active booklet drafts or perform a complete wipe to restore original District 227 demonstration templates.
          </p>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={handleResetActive}
              className="px-6 py-4 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-base sm:text-lg transition-all cursor-pointer border border-rose-300 flex items-center gap-2 font-montserrat"
            >
              <FiRefreshCw size={22} /> Reset Active Booklet
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className="px-6 py-4 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-base sm:text-lg transition-all shadow-xl cursor-pointer flex items-center gap-2 font-montserrat"
            >
              <FiTrash2 size={22} /> Wipe All & Restore Seeds
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
