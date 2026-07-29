import React from 'react';
import ToastmastersLogo from './ToastmastersLogo';
import Button from './Button';
import { FiX, FiShare2, FiCopy, FiCheck } from 'react-icons/fi';

const QrIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3z" fill="currentColor" />
    <path d="M18 18h3v3h-3z" fill="currentColor" />
    <path d="M14 18h1v3h-1z" fill="currentColor" />
    <path d="M18 14h3v1h-3z" fill="currentColor" />
  </svg>
);

export default function QRCodeModal({
  isOpen,
  onClose,
  activeBooklet
}) {
  const [copiedWhatsApp, setCopiedWhatsApp] = React.useState(false);

  if (!isOpen) return null;

  const page3Data = activeBooklet?.page3 || {};
  const agendaItems = Array.isArray(page3Data.agendaItems) ? page3Data.agendaItems : [];

  const handleCopyWhatsAppText = () => {
    const lines = [
      `🏆 *TOASTMASTERS DISTRICT 227 AGENDA*`,
      `📌 *${activeBooklet?.title || 'District Meeting'}*`,
      `🗓️ Date: ${page3Data.date || 'Today'} @ ${page3Data.time || '10:00 AM'}`,
      `📍 Venue/Room: ${page3Data.venue || 'Auditorium A'}`,
      `🔗 Zoom Link: ${page3Data.meetingLink || 'https://tinyurl.com/Smedz'}`,
      ``,
      `🎭 *Meeting Theme:* "${page3Data.meetingTheme || 'Aim for the stars'}"`,
      `📚 *Word of the Day:* *${page3Data.wordOfDay || 'Aspiration'}*`,
      `👉 _Meaning:_ ${page3Data.wordMeaning || 'A strong desire to achieve something high'}`,
      ``,
      `⏰ *TIMED AGENDA:*`,
      ...agendaItems.map(i => `• ${i.time} - ${i.slot} (${i.speaker})`),
      ``,
      `👋 _All members & guests are warmly welcome!_`
    ];

    const text = lines.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ddd0] dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <QrIcon size={22} className="text-[#006094]" />
            <div>
              <span className="text-[10px] font-black text-[#006094] uppercase tracking-widest block font-montserrat">
                Attendee Access & Sharing
              </span>
              <h3 className="text-lg font-montserrat font-black text-slate-900 dark:text-white">
                Live QR Code & WhatsApp Share
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full cursor-pointer">
            <FiX size={20} />
          </button>
        </div>

        {/* QR Code Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          
          {/* Live Agenda QR */}
          <div className="p-4 bg-[#E6F0F6]/60 dark:bg-slate-900 border border-[#006094]/20 rounded-2xl space-y-2">
            <div className="text-xs font-black text-[#006094] dark:text-sky-300 font-montserrat">
              📱 Live Agenda QR
            </div>
            <div className="w-32 h-32 bg-white p-2 mx-auto rounded-xl border shadow-xs flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://d227.org/live-agenda" 
                alt="Live Agenda QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-extrabold">Scan to view Agenda on Mobile</p>
          </div>

          {/* Live Voting QR */}
          <div className="p-4 bg-[#FAF5EF] dark:bg-slate-900 border border-[#781327]/20 rounded-2xl space-y-2">
            <div className="text-xs font-black text-[#781327] dark:text-rose-400 font-montserrat">
              🗳️ Digital Voting QR
            </div>
            <div className="w-32 h-32 bg-white p-2 mx-auto rounded-xl border shadow-xs flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://d227.org/vote" 
                alt="Live Voting QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-extrabold">Scan to Vote for Best Speaker</p>
          </div>

        </div>

        {/* 📲 1-Click WhatsApp Formatter Action */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#006094] dark:text-white font-montserrat">
              📲 1-Click WhatsApp Agenda Formatter
            </span>
            <Button
              variant="primary"
              size="xs"
              onClick={handleCopyWhatsAppText}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black"
            >
              {copiedWhatsApp ? <><FiCheck className="mr-1" /> Copied!</> : <><FiCopy className="mr-1" /> Copy WhatsApp Agenda</>}
            </Button>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            Formats Meeting #, Theme, Word of the Day, Zoom Link, and Timed Agenda into a WhatsApp text snippet ready to paste in your Toastmasters group!
          </p>
        </div>

      </div>
    </div>
  );
}
