import React from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import FormCheckbox from '../components/forms/FormCheckbox';
import Button from '../components/ui/Button';
import { FiCheckSquare, FiInfo, FiUsers, FiAward, FiPlus, FiTrash2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

export default function Page3Before() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page3 || {
    checklist: [],
    demoTitle: '',
    hostOrganization: '',
    venue: '',
    date: '',
    time: '',
    roles: {
      toastmaster: '',
      speaker1: '',
      speaker2: '',
      evaluator1: '',
      evaluator2: '',
      topicsMaster: '',
      timer: '',
      grammarian: ''
    },
    preparedBy: '',
    approvalSignature: '',
    approvedDate: ''
  };

  const checklistItems = Array.isArray(pageData.checklist) ? pageData.checklist : [];

  const handleCheckChange = (id) => {
    const updatedChecks = checklistItems.map(c => {
      if (c.id === id) {
        return { ...c, checked: !c.checked };
      }
      return c;
    });
    updateBookletPage('page3', { checklist: updatedChecks });
  };

  const handleCustomItemChange = (id, field, value) => {
    const updatedChecks = checklistItems.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    });
    updateBookletPage('page3', { checklist: updatedChecks });
  };

  const handleAddCustomItem = () => {
    const newItem = {
      id: `p3-custom-${uuidv4()}`,
      label: 'Custom Readiness Check',
      desc: 'Enter details...',
      checked: false,
      isCustom: true
    };
    updateBookletPage('page3', { checklist: [...checklistItems, newItem] });
  };

  const handleDeleteCustomItem = (id) => {
    const updatedChecks = checklistItems.filter(c => c.id !== id);
    updateBookletPage('page3', { checklist: updatedChecks });
  };

  const handleFieldChange = (key, value) => {
    updateBookletPage('page3', { [key]: value });
  };

  const handleRoleChange = (roleKey, value) => {
    const updatedRoles = {
      ...pageData.roles,
      [roleKey]: value
    };
    updateBookletPage('page3', { roles: updatedRoles });
  };

  const handleClear = () => {
    if (confirm("Clear all inputs on page 3?")) {
      updateBookletPage('page3', {
        checklist: [
          { id: "p3-c1", label: "Agenda finalized", desc: "Standard flow approved and ready to use.", checked: false, isCustom: false },
          { id: "p3-c2", label: "Role players confirmed", desc: "Toastmaster, Speaker, Evaluator, Timer confirmed.", checked: false, isCustom: false },
          { id: "p3-c3", label: "Dry run completed", desc: "Timing signals and speaker handoffs rehearsed.", checked: false, isCustom: false },
          { id: "p3-c4", label: "Escalation path known", desc: "Support contacts identified.", checked: false, isCustom: false }
        ],
        demoTitle: activeBooklet.title,
        hostOrganization: '',
        venue: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        roles: { toastmaster: '', speaker1: '', speaker2: '', evaluator1: '', evaluator2: '', topicsMaster: '', timer: '', grammarian: '' },
        preparedBy: '',
        approvalSignature: '',
        approvedDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Booklet Content Sheet */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#e8ddd0] dark:border-slate-800 pb-3 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-[#772432] dark:text-white">
                  Before Meeting
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Confirm meeting readiness, assign primary speakers, and secure sign-offs.
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
              <h2 className="text-xl font-bold text-[#772432]">Before Meeting</h2>
              <p className="text-xs text-slate-650">District 228 Meeting Readiness & Approvals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column (Checklist & Approvals) */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Readiness Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between no-print">
                    <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                      <FiCheckSquare className="text-[#004165]" /> Quality Checklist
                    </h3>
                    <Button variant="secondary" size="xs" onClick={handleAddCustomItem}>
                      <FiPlus size={12} className="mr-1" /> Add New
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {checklistItems.map(item => (
                      <div 
                        key={item.id} 
                        className="flex flex-col gap-2 p-3 bg-white dark:bg-[#0c1421] border border-[#e8ddd0] dark:border-slate-800 rounded-xl hover:border-[#772432]/40 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={() => handleCheckChange(item.id)}
                            className="mt-0.5 w-4.5 h-4.5 text-[#772432] border-slate-350 rounded focus:ring-[#772432] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            {item.isCustom ? (
                              <div className="space-y-2 no-print">
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => handleCustomItemChange(item.id, 'label', e.target.value)}
                                  className="w-full text-xs font-bold text-[#772432] dark:text-slate-200 bg-[#faf5ef] dark:bg-slate-900 border border-[#e8ddd0] focus:border-[#772432] focus:outline-none p-1 rounded"
                                  placeholder="Checklist title"
                                />
                                <input
                                  type="text"
                                  value={item.desc}
                                  onChange={(e) => handleCustomItemChange(item.id, 'desc', e.target.value)}
                                  className="w-full text-[10px] text-slate-500 dark:text-slate-400 bg-[#faf5ef] dark:bg-slate-900 border border-[#e8ddd0] focus:border-[#772432] focus:outline-none p-1 rounded"
                                  placeholder="Details/instructions"
                                />
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-[#772432] dark:text-slate-200 block leading-tight">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-normal">
                                  {item.desc}
                                </span>
                              </div>
                            )}

                            {/* Print view render for custom items */}
                            {item.isCustom && (
                              <div className="hidden print:block space-y-0.5">
                                <span className="text-xs font-bold text-[#772432] dark:text-slate-200 block leading-tight">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-normal">
                                  {item.desc}
                                </span>
                              </div>
                            )}
                          </div>

                          {item.isCustom && (
                            <button
                              onClick={() => handleDeleteCustomItem(item.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-[#faf5ef] dark:hover:bg-slate-900 transition-colors no-print cursor-pointer"
                              title="Delete custom item"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sign-offs & approvals */}
                <div className="space-y-4">
                  <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                    <FiAward className="text-[#f2a900]" /> Approvals & Sign-off
                  </h3>
                  <div className="p-4 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 bg-white dark:bg-[#0c1421] space-y-3 shadow-sm">
                    <FormInput
                      label="Prepared By"
                      id="preparedBy"
                      value={pageData.preparedBy || ''}
                      onChange={(e) => handleFieldChange('preparedBy', e.target.value)}
                      placeholder="Coordinators name"
                    />
                    <FormInput
                      label="Approval / Signature"
                      id="approvalSignature"
                      value={pageData.approvalSignature || ''}
                      onChange={(e) => handleFieldChange('approvalSignature', e.target.value)}
                      placeholder="District officer signature"
                    />
                    <FormInput
                      label="Approved Date"
                      id="approvedDate"
                      type="date"
                      value={pageData.approvedDate || ''}
                      onChange={(e) => handleFieldChange('approvedDate', e.target.value)}
                    />
                  </div>
                </div>

              </div>

              {/* Center/Right Column (Meta Details & Role assignments) */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Meta details */}
                <div className="space-y-3">
                  <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                    <FiInfo className="text-[#004165]" /> General Session Metadata
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 bg-white dark:bg-[#0c1421] shadow-sm">
                    <FormInput
                      label="Meeting Title"
                      id="demoTitle"
                      value={pageData.demoTitle || ''}
                      onChange={(e) => handleFieldChange('demoTitle', e.target.value)}
                      placeholder="Corporation Alpha Booklet"
                      className="sm:col-span-2"
                    />
                    <FormInput
                      label="Host Organization"
                      id="hostOrganization"
                      value={pageData.hostOrganization || ''}
                      onChange={(e) => handleFieldChange('hostOrganization', e.target.value)}
                      placeholder="e.g. Corporation Alpha"
                    />
                    <FormInput
                      label="Venue / platform"
                      id="venue"
                      value={pageData.venue || ''}
                      onChange={(e) => handleFieldChange('venue', e.target.value)}
                      placeholder="Auditorium A / Zoom link"
                    />
                    <FormInput
                      label="Meeting Date"
                      id="date"
                      type="date"
                      value={pageData.date || ''}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                    />
                    <FormInput
                      label="Meeting Time"
                      id="time"
                      value={pageData.time || ''}
                      onChange={(e) => handleFieldChange('time', e.target.value)}
                      placeholder="10:00 AM"
                    />
                    <FormInput
                      label="Session Objective"
                      id="objective"
                      value={pageData.objective || ''}
                      onChange={(e) => handleFieldChange('objective', e.target.value)}
                      placeholder="Define goals..."
                      className="sm:col-span-2"
                    />
                  </div>
                </div>

                {/* Role Assignments Grid */}
                <div className="space-y-3">
                  <h3 className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs flex items-center gap-1.5">
                    <FiUsers className="text-[#f2a900]" /> Meeting Roles Allocation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-[#e8ddd0] dark:border-slate-800 bg-white dark:bg-[#0c1421] shadow-sm">
                    {[
                      { key: 'toastmaster', label: 'Toastmaster of the Day' },
                      { key: 'speaker1', label: 'Prepared Speaker 1' },
                      { key: 'speaker2', label: 'Prepared Speaker 2 (Optional)' },
                      { key: 'evaluator1', label: 'Speech Evaluator 1' },
                      { key: 'evaluator2', label: 'Speech Evaluator 2 (Optional)' },
                      { key: 'topicsMaster', label: 'Table Topics Master' },
                      { key: 'timer', label: 'Timer Role' },
                      { key: 'grammarian', label: 'Grammarian / Ah-Counter' },
                    ].map(r => (
                      <FormInput
                        key={r.key}
                        label={r.label}
                        id={`role-${r.key}`}
                        value={pageData.roles?.[r.key] || ''}
                        onChange={(e) => handleRoleChange(r.key, e.target.value)}
                        placeholder="Assign speaker"
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 3 Prep
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
