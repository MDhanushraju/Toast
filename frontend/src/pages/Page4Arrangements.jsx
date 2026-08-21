import React from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import FormCheckbox from '../components/forms/FormCheckbox';
import Button from '../components/ui/Button';
import { FiPlus, FiTrash2, FiMapPin, FiCpu, FiPaperclip, FiRefreshCw } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function Page4Arrangements() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page4 || {
    rows: [],
    venueChecklist: { roomBooked: false, projectorTested: false, microphoneTested: false, seatingArranged: false, bannersPlaced: false },
    equipmentChecklist: { timerCardsReady: false, gavelReady: false, ribbonsReady: false, bookmarksReady: false },
    qrCodeUrl: '',
    scriptUrl: '',
    membershipSheetsUrl: ''
  };

  const handleRowChange = (id, field, value) => {
    const updatedRows = pageData.rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    updateBookletPage('page4', { rows: updatedRows });
  };

  const handleAddRow = () => {
    const newRow = {
      id: `arr-${uuidv4()}`,
      item: 'New Logistics Item',
      ready: false,
      owner: '',
      priority: 'Medium',
      notes: ''
    };
    updateBookletPage('page4', { rows: [...pageData.rows, newRow] });
  };

  const handleDeleteRow = (id) => {
    const updatedRows = pageData.rows.filter(row => row.id !== id);
    updateBookletPage('page4', { rows: updatedRows });
  };

  const handleCheckboxChange = (group, key) => {
    const updatedGroup = {
      ...pageData[group],
      [key]: !pageData[group][key]
    };
    updateBookletPage('page4', { [group]: updatedGroup });
  };

  const handleFieldChange = (key, value) => {
    updateBookletPage('page4', { [key]: value });
  };

  const handleReset = () => {
    if (confirm("Reset checklist to original defaults? All customized list edits will be lost.")) {
      const defaultRows = [
        { id: `arr-${uuidv4()}`, item: "Standard script and talking points", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Value one-pager / Why Toastmasters", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Success stories / testimonials", ready: false, owner: "", priority: "Medium", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Agenda card and role handout", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Timer cards / gavel / ribbons / bookmarks", ready: false, owner: "", priority: "Medium", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Sign-up form and QR code", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Membership sheet / next steps", ready: false, owner: "", priority: "High", notes: "" }
      ];
      updateBookletPage('page4', {
        rows: defaultRows,
        venueChecklist: { roomBooked: false, projectorTested: false, microphoneTested: false, seatingArranged: false, bannersPlaced: false },
        equipmentChecklist: { timerCardsReady: false, gavelReady: false, ribbonsReady: false, bookmarksReady: false },
        qrCodeUrl: '',
        scriptUrl: '',
        membershipSheetsUrl: ''
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Booklet Content Container */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#e8ddd0] dark:border-slate-800 pb-3 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-[#772432] dark:text-white">
                  Meeting Arrangements
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Confirm material owners, review venue specifications, and upload necessary sheets.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  <FiRefreshCw size={13} className="mr-1.5" /> Reset Default
                </Button>
                <Button variant="primary" size="sm" onClick={handleAddRow}>
                  <FiPlus size={13} className="mr-1.5" /> Add Row
                </Button>
              </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:block pb-2 border-b-2 border-[#772432]">
              <h2 className="text-xl font-bold text-[#772432]">Meeting Arrangements</h2>
              <p className="text-xs text-slate-650">District 228 Materials Checklist & Arrangements</p>
            </div>

            {/* Logistics Grid Table */}
            <div className="overflow-x-auto border border-[#e8ddd0] dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0c1421] shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#772432] text-white border-b border-[#5e1c27]">
                    <th className="p-3 font-extrabold w-1/3">Material Item</th>
                    <th className="p-3 font-extrabold w-12 text-center">Ready</th>
                    <th className="p-3 font-extrabold w-28">Owner</th>
                    <th className="p-3 font-extrabold w-24">Priority</th>
                    <th className="p-3 font-extrabold w-1/4">Notes / Details</th>
                    <th className="p-3 font-extrabold w-10 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.rows.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-400 font-semibold bg-[#faf5ef]/50 dark:bg-slate-900/20">
                        No materials rows configured. Click "Add Row" or "Reset Default".
                      </td>
                    </tr>
                  ) : (
                    pageData.rows.map(row => (
                      <tr 
                        key={row.id} 
                        className="border-b border-[#e8ddd0]/60 dark:border-slate-800 hover:bg-[#faf5ef] dark:hover:bg-slate-900/50 transition-colors last:border-0"
                      >
                        <td className="p-3">
                          <input
                            type="text"
                            value={row.item || ''}
                            onChange={(e) => handleRowChange(row.id, 'item', e.target.value)}
                            className="w-full bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 border-0 border-b border-transparent focus:border-[#772432] focus:outline-none py-0.5"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.ready || false}
                            onChange={() => handleRowChange(row.id, 'ready', !row.ready)}
                            className="w-4 h-4 text-[#772432] border-slate-300 rounded focus:ring-[#772432] cursor-pointer"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={row.owner || ''}
                            onChange={(e) => handleRowChange(row.id, 'owner', e.target.value)}
                            placeholder="Assign owner"
                            className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 border-0 border-b border-transparent focus:border-[#772432] focus:outline-none py-0.5"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={row.priority || 'Medium'}
                            onChange={(e) => handleRowChange(row.id, 'priority', e.target.value)}
                            className="bg-transparent text-xs font-bold text-[#772432] dark:text-[#f2a900] border-0 border-b border-transparent focus:outline-none py-0.5 focus:border-[#772432] cursor-pointer"
                          >
                            <option value="High" className="dark:bg-slate-950">High</option>
                            <option value="Medium" className="dark:bg-slate-950">Medium</option>
                            <option value="Low" className="dark:bg-slate-950">Low</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={row.notes || ''}
                            onChange={(e) => handleRowChange(row.id, 'notes', e.target.value)}
                            placeholder="Add notes"
                            className="w-full bg-transparent text-xs text-slate-700 dark:text-slate-300 border-0 border-b border-transparent focus:border-[#772432] focus:outline-none py-0.5"
                          />
                        </td>
                        <td className="p-3 text-center no-print">
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            title="Delete row"
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

            {/* Checklists grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Venue checklist */}
              <div className="space-y-3">
                <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                  <FiMapPin className="text-[#004165]" /> Venue Checklist
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'roomBooked', label: 'Meeting room booked', desc: 'Secure physical space / online scheduler URL link.' },
                    { key: 'projectorTested', label: 'Projector / display tested', desc: 'Verify VGA/HDMI connections work correctly.' },
                    { key: 'microphoneTested', label: 'Microphone & sound verified', desc: 'Confirm remote participants hear clearly.' },
                    { key: 'seatingArranged', label: 'Room seating arranged', desc: 'Align layout to promote visual interaction.' },
                    { key: 'bannersPlaced', label: 'Toastmasters banners placed', desc: 'Set up corporate banners behind speaker stand.' },
                  ].map(item => (
                    <FormCheckbox
                      key={item.key}
                      id={`venue-${item.key}`}
                      label={item.label}
                      description={item.desc}
                      checked={pageData.venueChecklist?.[item.key] || false}
                      onChange={() => handleCheckboxChange('venueChecklist', item.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Equipment checklist */}
              <div className="space-y-3">
                <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                  <FiCpu className="text-[#f2a900]" /> Equipment Checklist
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'timerCardsReady', label: 'Timer cards ready', desc: 'Green, Yellow, Red timing flags on table.' },
                    { key: 'gavelReady', label: 'Meeting gavel present', desc: 'Ensure Toastmaster has corporate gavel.' },
                    { key: 'ribbonsReady', label: 'Best speaker ribbons', desc: 'Best Table Topics speaker awards ribbons ready.' },
                    { key: 'bookmarksReady', label: 'Promotional bookmarks', desc: 'Handouts and booklets for guests ready.' },
                  ].map(item => (
                    <FormCheckbox
                      key={item.key}
                      id={`equip-${item.key}`}
                      label={item.label}
                      description={item.desc}
                      checked={pageData.equipmentChecklist?.[item.key] || false}
                      onChange={() => handleCheckboxChange('equipmentChecklist', item.key)}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Links and uploaders at bottom */}
            <div className="space-y-3 pt-4">
              <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                <FiPaperclip className="text-[#004165]" /> Uploads / Attachments URLs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 bg-white dark:bg-[#0c1421] shadow-sm no-print">
                <FormInput
                  label="QR Code Link"
                  id="qrCodeUrl"
                  value={pageData.qrCodeUrl || ''}
                  onChange={(e) => handleFieldChange('qrCodeUrl', e.target.value)}
                  placeholder="Paste QR Code image link"
                />
                <FormInput
                  label="Script Document URL"
                  id="scriptUrl"
                  value={pageData.scriptUrl || ''}
                  onChange={(e) => handleFieldChange('scriptUrl', e.target.value)}
                  placeholder="Paste scripts link"
                />
                <FormInput
                  label="Membership sheet URL"
                  id="membershipSheetsUrl"
                  value={pageData.membershipSheetsUrl || ''}
                  onChange={(e) => handleFieldChange('membershipSheetsUrl', e.target.value)}
                  placeholder="Paste membership signup link"
                />
              </div>
              {/* Print view layout placeholder */}
              <div className="hidden print:grid grid-cols-3 gap-4 text-[10px] text-slate-700 dark:text-slate-400">
                <div><strong>QR Link:</strong> {pageData.qrCodeUrl || '—'}</div>
                <div><strong>Script:</strong> {pageData.scriptUrl || '—'}</div>
                <div><strong>Sheets:</strong> {pageData.membershipSheetsUrl || '—'}</div>
              </div>
            </div>

          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 4 Arrangements
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
