import React from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import Button from '../components/ui/Button';
import { FiPrinter, FiGrid, FiCheckSquare, FiCalendar, FiTrendingUp, FiActivity } from 'react-icons/fi';

export default function Page8DataSheet() {
  const { activeBooklet } = useBooklet();

  if (!activeBooklet) return null;

  const p3 = activeBooklet.page3 || {};
  const p4 = activeBooklet.page4 || { rows: [] };
  const p5 = activeBooklet.page5 || { checklist: {}, speakerTracking: [], actionItems: [] };
  const p6 = activeBooklet.page6 || {};
  const p7 = activeBooklet.page7 || { rows: [] };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Booklet Content Sheet */}
      <div className="booklet-page print:p-0 print:border-0 print:shadow-none print:bg-white bg-paper dark:bg-slate-900 w-full min-h-[1200px]">
        <div className="h-full flex flex-col justify-between p-4">
          
          <div className="space-y-8">
            {/* Header / Title Actions */}
            <div className="border-b-2 border-slate-900 dark:border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100">
                  Meeting Data Summary Sheet
                </h2>
                <p className="text-xs text-slate-405 font-semibold mt-0.5">
                  Full compilation of recorded data across all booklets sections.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handlePrint} className="no-print">
                <FiPrinter className="mr-1.5" size={14} /> Print Summary
              </Button>
            </div>

            {/* SECTION 1: COVER DETAILS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-805 pb-1">
                <FiGrid /> 1. General Info
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><strong>Booklet Title:</strong> {activeBooklet.title}</div>
                <div><strong>Prepared For:</strong> {activeBooklet.preparedFor}</div>
                <div><strong>District Name:</strong> {activeBooklet.districtName}</div>
                <div><strong>Prepared Date:</strong> {activeBooklet.preparedDate}</div>
              </div>
            </div>

            {/* SECTION 2: BEFORE MEETING DETAILS */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-805 pb-1">
                <FiCheckSquare /> 2. Before Demo Meeting Prep
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <div><strong>Demo Title:</strong> {p3.demoTitle || '—'}</div>
                <div><strong>Host Organization:</strong> {p3.hostOrganization || '—'}</div>
                <div><strong>Venue / Link:</strong> {p3.venue || '—'}</div>
                <div><strong>Scheduled Time:</strong> {p3.date} @ {p3.time || '—'}</div>
                <div><strong>Prepared By:</strong> {p3.preparedBy || '—'}</div>
                <div><strong>Approved Signature:</strong> {p3.approvalSignature || '—'}</div>
              </div>
              
              <div className="pt-2">
                <strong className="text-[10px] uppercase text-slate-400 block mb-1">Checklist Confirmations:</strong>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                  {(p3.checklist || []).map(item => (
                    <div key={item.id}>{item.label}: {item.checked ? '✅ Yes' : '❌ No'}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: ARRANGEMENTS CHECKLIST */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-805 pb-1">
                <FiCalendar /> 3. Material arrangements log
              </h3>
              <table className="w-full text-left border-collapse text-[10px] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white/40">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-2 font-bold">Material Item</th>
                    <th className="p-2 font-bold w-12 text-center">Ready</th>
                    <th className="p-2 font-bold w-24">Owner</th>
                    <th className="p-2 font-bold w-16">Priority</th>
                    <th className="p-2 font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {p4.rows.map(row => (
                    <tr key={row.id} className="border-b border-slate-100 dark:border-slate-855">
                      <td className="p-2 font-medium">{row.item}</td>
                      <td className="p-2 text-center">{row.ready ? '✅' : '❌'}</td>
                      <td className="p-2">{row.owner || '—'}</td>
                      <td className="p-2">{row.priority || '—'}</td>
                      <td className="p-2 text-slate-500">{row.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECTION 4: DURING MEETING EXECUTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-805 pb-1">
                <FiActivity /> 4. Meeting Execution Logs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <strong className="text-[10px] uppercase text-slate-400 block mb-1">Speaker timings:</strong>
                  <table className="w-full text-left border-collapse text-[10px] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white/40">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <th className="p-2 font-bold">Speaker</th>
                        <th className="p-2 font-bold">Role</th>
                        <th className="p-2 font-bold">Logged Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p5.speakerTracking.map(sp => (
                        <tr key={sp.id} className="border-b border-slate-100 dark:border-slate-855 last:border-0">
                          <td className="p-2">{sp.speaker || '—'}</td>
                          <td className="p-2">{sp.role || '—'}</td>
                          <td className="p-2 font-mono font-bold">{sp.time || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <div>
                    <strong className="text-[10px] uppercase text-slate-400 block">Guests present list:</strong>
                    <p className="text-xs text-slate-700 dark:text-slate-350 min-h-[2rem] bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-850">
                      {p5.guestsList || 'No guests logged'}
                    </p>
                  </div>
                  <div>
                    <strong className="text-[10px] uppercase text-slate-400 block mb-1">Execution Quality:</strong>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                      <div>Value Opening: {p5.checklist?.valueOpeningUsed ? '✅ Yes' : '❌ No'}</div>
                      <div>No Jargon: {p5.checklist?.noJargonUsed ? '✅ Yes' : '❌ No'}</div>
                      <div>Time Discipline: {p5.checklist?.timeDisciplineMaintained ? '✅ Yes' : '❌ No'}</div>
                      <div>Guest Respect: {p5.checklist?.guestParticipationRespectful ? '✅ Yes' : '❌ No'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: OUTCOMES AFTER MEETING */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-805 pb-1">
                <FiTrendingUp /> 5. Session outcomes & ratings
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-3">
                <div><strong>Guests Attended:</strong> {p6.guestCount || 0}</div>
                <div><strong>Interested Guests:</strong> {p6.interestedGuests || 0}</div>
                <div><strong>Members Joined:</strong> {p6.membersJoined || 0}</div>
                <div><strong>Overall Rating:</strong> {p6.overallRating || 0}/10</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-700 dark:text-slate-400">
                <div><strong>Strengths:</strong> <p className="text-xs text-slate-655 dark:text-slate-350 mt-0.5 leading-relaxed">{p6.strengths || '—'}</p></div>
                <div><strong>Weaknesses:</strong> <p className="text-xs text-slate-655 dark:text-slate-350 mt-0.5 leading-relaxed">{p6.weaknesses || '—'}</p></div>
                <div><strong>Improvements:</strong> <p className="text-xs text-slate-655 dark:text-slate-350 mt-0.5 leading-relaxed">{p6.improvements || '—'}</p></div>
                <div><strong>Next steps action:</strong> <p className="text-xs text-slate-655 dark:text-slate-350 mt-0.5 leading-relaxed">{p6.followUpAction || '—'}</p></div>
              </div>
            </div>

          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 8 Summary Data Sheet
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
