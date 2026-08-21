import React, { useState, useRef, useEffect } from 'react';
import { exportAsPDF, exportAsDOC, exportAsImage, exportAsJSON } from '../../utils/exportUtils';
import { 
  FiPrinter, FiFileText, FiImage, FiCode, 
  FiChevronDown, FiDownload, FiCheck 
} from 'react-icons/fi';

export default function ExportMenu({ title = 'Meeting_Report', elementId = 'master-report-content', bookletData = null, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format) => {
    setIsOpen(false);
    if (format === 'pdf') {
      exportAsPDF(title);
    } else if (format === 'doc') {
      exportAsDOC(title, elementId);
    } else if (format === 'png') {
      exportAsImage(title, elementId, 'png');
    } else if (format === 'jpg') {
      exportAsImage(title, elementId, 'jpg');
    } else if (format === 'json') {
      exportAsJSON(title, bookletData || {});
    }
  };

  return (
    <div className={`relative inline-block text-left no-print ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 bg-[#004165] hover:bg-[#002b44] text-white font-montserrat font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-[#002b44]"
      >
        <FiDownload size={15} />
        <span>Export & Print Options</span>
        <FiChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121e2d] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden font-sans animate-fade-in">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-[#006094] dark:text-sky-300 font-montserrat tracking-wider">
            Select Export Format
          </div>

          <div className="p-1.5 space-y-0.5 text-xs font-montserrat font-bold">
            
            {/* PDF Format */}
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#006094]/10 hover:text-[#006094] dark:hover:text-sky-300 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <FiPrinter className="text-red-500" size={15} />
              <div className="flex flex-col">
                <span>PDF Document / Print</span>
                <span className="text-[9px] text-slate-400 font-normal">Official Printable PDF Format</span>
              </div>
            </button>

            {/* DOC Format */}
            <button
              onClick={() => handleExport('doc')}
              className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#006094]/10 hover:text-[#006094] dark:hover:text-sky-300 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <FiFileText className="text-blue-500" size={15} />
              <div className="flex flex-col">
                <span>Word Document (.doc)</span>
                <span className="text-[9px] text-slate-400 font-normal">Microsoft Word & Docs Format</span>
              </div>
            </button>

            {/* PNG Image */}
            <button
              onClick={() => handleExport('png')}
              className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#006094]/10 hover:text-[#006094] dark:hover:text-sky-300 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <FiImage className="text-emerald-500" size={15} />
              <div className="flex flex-col">
                <span>PNG Image (.png)</span>
                <span className="text-[9px] text-slate-400 font-normal">High Quality Lossless Image</span>
              </div>
            </button>

            {/* JPG Image */}
            <button
              onClick={() => handleExport('jpg')}
              className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#006094]/10 hover:text-[#006094] dark:hover:text-sky-300 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <FiImage className="text-amber-500" size={15} />
              <div className="flex flex-col">
                <span>JPG Image (.jpg)</span>
                <span className="text-[9px] text-slate-400 font-normal">Compressed Image Format</span>
              </div>
            </button>

            {/* JSON Data */}
            {bookletData && (
              <button
                onClick={() => handleExport('json')}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#006094]/10 hover:text-[#006094] dark:hover:text-sky-300 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
              >
                <FiCode className="text-purple-500" size={15} />
                <div className="flex flex-col">
                  <span>JSON Raw Data (.json)</span>
                  <span className="text-[9px] text-slate-400 font-normal">Backup & System Data</span>
                </div>
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
