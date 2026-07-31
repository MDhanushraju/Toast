import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';
import { FiAward, FiPrinter, FiCheckCircle } from 'react-icons/fi';

export default function CertificateGenerator() {
  const { activeBooklet } = useBooklet();

  const [recipientName, setRecipientName] = useState('TM Anjali Jha');
  const [awardCategory, setAwardCategory] = useState('Best Speaker');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [presenterName, setPresenterName] = useState('System Administrator, D227 Leadership');

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Controls Header (Hidden on print) */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-black text-white bg-[#781327] px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
              📜 1-Click Award Certificate Generator
            </span>
            <h1 className="text-2xl font-montserrat font-black text-[#006094] dark:text-white mt-1">
              Toastmasters District 227 Award Certificate
            </h1>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handlePrintCertificate}
            className="bg-[#781327] hover:bg-[#580d1b] text-white font-black text-sm px-5 py-2.5 shadow-md flex items-center gap-2 cursor-pointer font-montserrat"
          >
            <FiPrinter size={16} /> Print / Save Certificate PDF
          </Button>
        </div>

        {/* Certificate Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <FormInput
            label="Recipient Name"
            id="recipientName"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="TM Member Name"
          />
          <div>
            <label className="block text-xs font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat mb-1.5">
              Award Title / Category
            </label>
            <select
              value={awardCategory}
              onChange={(e) => setAwardCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-[#e8ddd0] dark:border-slate-800 text-sm font-extrabold rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#006094]"
            >
              <option value="Best Speaker">Best Speaker Award</option>
              <option value="Best Evaluator">Best Evaluator Award</option>
              <option value="Best Table Topics Speaker">Best Table Topics Speaker</option>
              <option value="Role Player Excellence">Role Player Excellence</option>
              <option value="Certificate of Appreciation">Certificate of Appreciation</option>
            </select>
          </div>
          <FormInput
            label="Date Presented"
            id="meetingDate"
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />
          <FormInput
            label="Presenter / Officer"
            id="presenterName"
            value={presenterName}
            onChange={(e) => setPresenterName(e.target.value)}
            placeholder="Officer Name"
          />
        </div>
      </div>

      {/* 📜 Pristine Award Certificate Canvas (Printable) */}
      <div className="bg-white text-slate-900 border-8 border-[#006094] p-10 sm:p-14 rounded-3xl shadow-2xl space-y-6 text-center max-w-4xl mx-auto relative overflow-hidden font-sans">
        
        {/* Certificate Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <ToastmastersLogo district="" size="lg" />
        </div>

        {/* Top District Brand Lockup */}
        <div className="space-y-2 relative z-10 border-b-2 border-[#781327] pb-6">
          <ToastmastersLogo district="DISTRICT 227" size="md" className="mx-auto" />
          <span className="text-xs font-black text-[#006094] uppercase tracking-[0.3em] block font-montserrat">
            TOASTMASTERS INTERNATIONAL
          </span>
          <h2 className="text-lg font-black text-[#781327] uppercase tracking-widest font-montserrat">
            DISTRICT 227 LEADERSHIP RECOGNITION
          </h2>
        </div>

        {/* Certificate Title */}
        <div className="py-4 space-y-2 relative z-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-montserrat">
            THIS CERTIFICATE IS PROUDLY PRESENTED TO
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-montserrat text-[#006094] border-b border-dashed border-[#006094]/30 pb-2 inline-block px-8">
            {recipientName || 'Member Name'}
          </h1>
        </div>

        {/* Category Description */}
        <div className="space-y-3 max-w-xl mx-auto relative z-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-montserrat">
            IN RECOGNITION OF OUTSTANDING PERFORMANCE AS
          </span>
          <div className="text-2xl font-black text-[#781327] font-montserrat bg-[#FAF5EF] py-2 px-6 rounded-2xl border border-[#e8ddd0] inline-block shadow-xs">
            🏆 {awardCategory}
          </div>
          <p className="text-xs text-slate-600 font-semibold leading-relaxed pt-2">
            Presented for exemplary public speaking, leadership discipline, and commitment to the core values of Toastmasters International at {activeBooklet?.title || 'District 227 Meeting'}.
          </p>
        </div>

        {/* Signatures & Date Line */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-[#006094]/20 relative z-10 font-montserrat">
          <div className="text-center space-y-1">
            <div className="font-extrabold text-sm text-[#006094] border-b border-slate-400 pb-1 max-w-[200px] mx-auto">
              {presenterName}
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">District Officer Signature</span>
          </div>

          <div className="text-center space-y-1">
            <div className="font-extrabold text-sm text-slate-800 border-b border-slate-400 pb-1 max-w-[200px] mx-auto">
              {meetingDate}
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Date of Presentation</span>
          </div>
        </div>

      </div>

    </div>
  );
}
