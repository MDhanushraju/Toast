import React from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import Button from '../components/ui/Button';
import { FiPrinter, FiDownload, FiInfo } from 'react-icons/fi';
import { exportBookletToPDF } from '../services/pdf';
import { useToast } from '../context/ToastContext';

export default function Page1Cover() {
  const { activeBooklet, updateBooklet } = useBooklet();
  const { showToast } = useToast();

  if (!activeBooklet) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No active booklet selected. Please return to the Dashboard.</p>
      </div>
    );
  }

  const handleChange = (field, value) => {
    updateBooklet(activeBooklet.id, { [field]: value });
  };

  const handleDownloadPDF = async () => {
    showToast("Generating PDF booklet...", "info");
    const container = document.createElement('div');
    container.id = 'hidden-print-node';
    container.className = 'fixed left-[-9999px] top-[-9999px]';
    // We will navigate to the full printable view inside an iframe or simply print
    // The most stable way for html2canvas + jsPDF is to open the PDF print page or trigger it.
    // Let's print the actual PrintView container. So we tell the user to use the print layout or we generate it from activeBooklet.
    // To make it super robust, let's trigger it.
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Booklet Cover Page Render Container */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left/Main Column: Title and Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-extrabold block">
                  TOASTMASTERS-STYLE WORKING BOOKLET
                </span>
                <input
                  type="text"
                  value={activeBooklet.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full text-2xl sm:text-3xl lg:text-4xl font-outfit font-extrabold text-brand-navy dark:text-slate-105 bg-transparent border-b border-dashed border-slate-200 hover:border-slate-400 focus:border-brand-blue focus:outline-none transition-colors py-1 leading-tight"
                  placeholder="Demo Meeting Guide & Checklist"
                />
              </div>

              <div className="space-y-4">
                <FormInput
                  label="Prepared For"
                  id="preparedFor"
                  value={activeBooklet.preparedFor || ''}
                  onChange={(e) => handleChange('preparedFor', e.target.value)}
                  placeholder="Pramod K Murthy, Prashant, and the extended team"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="District / Region"
                    id="districtName"
                    value={activeBooklet.districtName || ''}
                    onChange={(e) => handleChange('districtName', e.target.value)}
                    placeholder="District 228"
                  />

                  <FormInput
                    label="Prepared Date"
                    id="preparedDate"
                    type="date"
                    value={activeBooklet.preparedDate || ''}
                    onChange={(e) => handleChange('preparedDate', e.target.value)}
                  />
                </div>

                <FormTextarea
                  label="Description"
                  id="description"
                  value={activeBooklet.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the booklet or demo session guidelines..."
                  maxLength={500}
                />
              </div>

              {/* Grid cards for Booklet Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                  <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-250 text-xs mb-1">Use this for</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal">
                    Before demo planning, meeting arrangements, live execution notes, and outcomes capture after the meeting.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                  <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-250 text-xs mb-1">Working style</h4>
                  <p className="text-[10px] text-slate-455 dark:text-slate-500 leading-normal">
                    Simple, check-box driven, printable layout. Easy to share as a physical booklet with fellow club members.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Logo Box / Image Placeholder */}
            <div className="space-y-4">
              <div className="logoBox dark:bg-slate-950 dark:border-slate-800 flex flex-col justify-center items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  TOASTMASTERS LOGO
                </span>
                {activeBooklet.logoUrl ? (
                  <img
                    src={activeBooklet.logoUrl}
                    alt="Toastmasters International logo"
                    className="max-w-[150px] h-auto rounded-xl border border-slate-200 dark:border-slate-850"
                  />
                ) : (
                  <div className="w-32 h-32 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center p-2">
                    Placeholder logo
                  </div>
                )}
                <FormInput
                  id="logoUrl"
                  value={activeBooklet.logoUrl || ''}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="Paste image link here"
                  className="w-full text-center"
                />
              </div>

              {/* Booklet Print Actions */}
              <div className="flex flex-col gap-2 pt-4 no-print">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadPDF}
                  className="w-full"
                >
                  <FiPrinter className="mr-1.5" size={14} /> Open Print Options
                </Button>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 1 Cover
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
