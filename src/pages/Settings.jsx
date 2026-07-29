import React, { useRef, useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';
import { FiDownload, FiUpload, FiTrash2, FiRefreshCw, FiSun, FiMoon } from 'react-icons/fi';

export default function Settings() {
  const { 
    theme, setTheme, resetAllData, exportData, importData, booklets, activeBooklet, resetBooklet 
  } = useBooklet();

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState({ type: '', message: '' });
  const [printMargin, setPrintMargin] = useState('15mm');

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
      } else {
        setImportStatus({ type: 'error', message: `Import failed: ${result.error}` });
      }
    };
    reader.readAsText(file);
  };

  const handleResetActive = () => {
    if (activeBooklet && confirm(`Reset active booklet "${activeBooklet.title}" back to empty template? All input data will be lost.`)) {
      resetBooklet(activeBooklet.id);
    }
  };

  const handleResetAll = () => {
    if (confirm("Reset ALL application data? This will delete all custom booklets and restore original seeds. This cannot be undone.")) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-[#772432] dark:text-white">
          Global Settings
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Configure interface behaviors, manage backups, and configure printing margins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Style configurations */}
        <Card title="Interface Customization" icon={FiSun}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-[#772432] dark:text-[#f2a900] uppercase tracking-widest mb-2">
                Display Theme
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-[#772432] border-[#772432] text-white' 
                      : 'bg-[#faf5ef] dark:bg-slate-950 border-[#e8ddd0] dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-[#772432]/10'
                  }`}
                >
                  <FiSun size={14} /> Light Theme
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-[#004165] border-[#004165] text-white' 
                      : 'bg-[#faf5ef] dark:bg-slate-950 border-[#e8ddd0] dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-[#004165]/10'
                  }`}
                >
                  <FiMoon size={14} /> Dark Theme
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Toggle between a clean corporate light theme and an eye-friendly developer dark mode. Styles adapt instantly across all pages.
            </div>
          </div>
        </Card>

        {/* Backups config */}
        <Card title="Backup & Restore Management" icon={FiDownload}>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button variant="primary" size="sm" onClick={exportData}>
                <FiDownload size={14} className="mr-1.5" /> Export Booklet Data
              </Button>

              <Button variant="secondary" size="sm" onClick={handleImportClick}>
                <FiUpload size={14} className="mr-1.5" /> Import Backup File
              </Button>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

            {importStatus.message && (
              <div className={`p-3 rounded-xl text-[10px] font-bold ${
                importStatus.type === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
              }`}>
                {importStatus.message}
              </div>
            )}

            <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Export all local booklets to a portable JSON backup file. Restore backups on other machines to duplicate trackers and booklets.
            </div>
          </div>
        </Card>

        {/* Print Configuration settings */}
        <Card title="Printer Options" icon={FiRefreshCw}>
          <div className="space-y-4">
            <FormInput
              label="Default A4 Print Margin"
              id="printMargin"
              value={printMargin}
              onChange={(e) => setPrintMargin(e.target.value)}
              placeholder="e.g. 15mm or 20mm"
            />
            <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              Define standard page margins applied across custom PDF export canvases. The standard value of 15mm allows optimal spacing for binders.
            </div>
          </div>
        </Card>

        {/* Danger zone actions */}
        <Card title="Danger Zone" icon={FiTrash2} className="border-red-200 dark:border-red-950/40">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResetActive}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer"
              >
                <FiRefreshCw size={14} className="mr-1.5" /> Reset Active Booklet
              </button>

              <button
                onClick={handleResetAll}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-700 text-white hover:bg-red-800 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <FiTrash2 size={14} className="mr-1.5" /> Wipe All & Restore Seeds
              </button>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed font-bold">
              Warning: Reset operations are permanent. Wiping all data destroys local drafts, booklet trackers, and templates, reverting the environment to clean starting defaults.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
