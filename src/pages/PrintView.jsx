import React, { useEffect } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiPrinter } from 'react-icons/fi';
import Button from '../components/ui/Button';

export default function PrintView() {
  const { activeBooklet } = useBooklet();
  const navigate = useNavigate();

  // Print automatically when view opens
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!activeBooklet) {
    return (
      <div className="text-center p-12">
        <p className="text-slate-500">No active booklet selected. Please return to Dashboard.</p>
      </div>
    );
  }

  const p3 = activeBooklet.page3 || {};
  const p4 = activeBooklet.page4 || { rows: [] };
  const p5 = activeBooklet.page5 || { checklist: {}, speakerTracking: [], actionItems: [] };
  const p6 = activeBooklet.page6 || {};
  const p7 = activeBooklet.page7 || { rows: [] };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 transition-colors duration-300">
      {/* Top action bar - Hidden during print */}
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl mb-6 shadow-sm no-print">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-655 bg-white hover:bg-slate-50 border border-slate-250 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-850 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
        >
          <FiChevronLeft size={16} /> Back to Editor
        </button>
        <span className="text-xs font-bold text-slate-550 dark:text-slate-405">
          Print Preview: <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{activeBooklet.title}</strong>
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.print()}
        >
          <FiPrinter className="mr-1.5" size={14} /> Print Now
        </Button>
      </div>

      {/* Printable Booklet Stack */}
      <div className="print-container max-w-[210mm] mx-auto bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-0 overflow-hidden flex flex-col items-center">

        {/* PAGE 1: COVER */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <div className="text-[10px] tracking-[0.28em] font-extrabold text-gold text-left uppercase mb-4">
                TOASTMASTERS-STYLE WORKING BOOKLET
              </div>
              <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 leading-tight mb-4">
                {activeBooklet.title}
              </h1>
              <div className="space-y-4 max-w-xl text-left border-l-2 border-brand-blue pl-4 py-1">
                <div>
                  <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Prepared For</span>
                  <span className="text-xs font-semibold text-slate-805 dark:text-slate-200">{activeBooklet.preparedFor}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-0.5">District / Region</span>
                  <span className="text-xs font-semibold text-slate-805 dark:text-slate-200">{activeBooklet.districtName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Description</span>
                  <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed">{activeBooklet.description}</p>
                </div>
              </div>

              {/* Cover Cards */}
              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50">
                  <h4 className="font-outfit font-bold text-slate-805 dark:text-slate-200 text-xs mb-1">Use this for</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal">
                    Before planning, meeting arrangements, live execution notes, and outcomes capture after the meeting.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50">
                  <h4 className="font-outfit font-bold text-slate-805 dark:text-slate-200 text-xs mb-1">Working style</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal">
                    Simple, check-box driven, printable layout. Easy to share as a physical booklet with fellow club members.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
              {activeBooklet.logoUrl && (
                <img src={activeBooklet.logoUrl} alt="Logo" className="h-10 w-auto opacity-75 grayscale" />
              )}
              <span className="text-[10px] font-bold text-slate-400">PAGE 1</span>
            </div>
          </div>
        </section>

        {/* PAGE 2: REFERENCES */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <h2 className="text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
                Page References & Guidelines
              </h2>
              <div className="space-y-4 max-w-2xl">
                {[
                  { num: '01', title: 'Cover Page', desc: 'Booklet title, District 228 name, owner references, description, and club logo placeholder.' },
                  { num: '02', title: 'Quick Reference', desc: 'Reference structure page highlighting booklet layout, mapping, and guidelines.' },
                  { num: '03', title: 'Before Meeting', desc: 'Checklists and member-filled logs specifying planning title, date, objective, and sign-offs.' },
                  { num: '04', title: 'Meeting Arrangements', desc: 'Pre-meeting preparation checklist, venue logistics, script link, and equipment readiness.' },
                  { num: '05', title: 'During Meeting Execution', desc: 'Live execution notes, guest attendance, agenda timetable, and action items.' },
                  { num: '06', title: 'After Meeting Summary', desc: 'Outcomes, guest sign-ups, decision-maker sign-off, and chartering status.' },
                  { num: '07', title: 'Meeting Tracker Sheet', desc: 'Global tabular historical tracker log summarizing date, hosts, leads, outcomes, and coordinator comments.' },
                ].map(ref => (
                  <div key={ref.num} className="flex gap-4 p-3 border border-slate-105 dark:border-slate-850 rounded-xl bg-white/40">
                    <div className="w-10 h-10 shrink-0 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-xl flex items-center justify-center font-bold text-brand-blue text-xs">
                      {ref.num}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-805 dark:text-slate-200">{ref.title}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-450 leading-normal">{ref.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-800">
              PAGE 2
            </div>
          </div>
        </section>

        {/* PAGE 3: TOASTMASTERS DEMO MEETING AGENDA (Matching Image 2) */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4 space-y-4">
            <div>
              <div className="border-b-2 border-[#004165] dark:border-sky-900 pb-3 mb-4 text-center space-y-2">
                <h2 className="text-xl font-outfit font-black text-[#004165] dark:text-slate-100 uppercase tracking-wide">
                  TOASTMASTERS DEMO MEETING AGENDA
                </h2>
                <div className="border border-[#004165]/30 rounded-xl p-2 bg-[#FAF5EF] dark:bg-slate-950 text-xs font-bold text-[#781327] dark:text-rose-400">
                  THEME OF THE DEMO MEETING: <span className="font-extrabold">{p3.meetingTheme || p3.demoTitle || 'Transform Your Communication & Leadership'}</span>
                </div>
              </div>

              {/* Official Table Matching Image 2 */}
              <table className="w-full text-left border-collapse text-[11px] border-2 border-[#004165] rounded-xl overflow-hidden mb-4">
                <thead>
                  <tr className="bg-[#004165] text-white uppercase tracking-wider text-[10px]">
                    <th className="p-2 font-black w-32 border-r border-[#005a8b]">TIME</th>
                    <th className="p-2 font-black border-r border-[#005a8b]">AGENDA ITEM</th>
                    <th className="p-2 font-black w-36 border-r border-[#005a8b]">ROLE</th>
                    <th className="p-2 font-black w-36 border-r border-[#005a8b]">NAME OF ROLE TAKER</th>
                    <th className="p-2 font-black w-28">CLUB</th>
                  </tr>
                </thead>
                <tbody>
                  {(p3.agendaItems || []).map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-slate-300 dark:border-slate-800 last:border-0 hover:bg-[#FAF5EF]/50">
                      <td className="p-2 font-black text-[#781327] dark:text-rose-400 border-r border-slate-200 dark:border-slate-800 font-mono">
                        {item.time || ''}
                      </td>
                      <td className="p-2 border-r border-slate-200 dark:border-slate-800">
                        <div className="font-black text-[#004165] dark:text-sky-200">{item.slot}</div>
                        {item.details && <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{item.details}</div>}
                      </td>
                      <td className="p-2 font-extrabold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                        {item.role || '—'}
                      </td>
                      <td className="p-2 font-extrabold text-[#006094] dark:text-sky-300 border-r border-slate-200 dark:border-slate-800">
                        {item.speaker || '—'}
                      </td>
                      <td className="p-2 font-semibold text-slate-700 dark:text-slate-300">
                        {item.club || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom NOTES box matching Image 2 */}
              <div className="border border-[#004165]/40 rounded-xl p-2.5 bg-[#FAF5EF] dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2">
                <span className="font-black text-[#004165] uppercase shrink-0">NOTES:</span>
                <span>{p3.agendaNotes || '1 Prepared Speaker | 1 Evaluator | TAG: Only Timer & Language Evaluator | 7 Table Topics Participants (First from Toastmasters)'}</span>
              </div>
            </div>

            <div className="text-right text-[10px] font-bold text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
              PAGE 3
            </div>
          </div>
        </section>

        {/* PAGE 4: ARRANGEMENTS CHECKLIST */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <h2 className="text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
                Arrangements Checklist
              </h2>

              <table className="w-full text-left border-collapse text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 font-bold text-slate-700 dark:text-slate-300">Item Description</th>
                    <th className="p-3 font-bold text-slate-700 dark:text-slate-300 w-16 text-center">Ready</th>
                    <th className="p-3 font-bold text-slate-700 dark:text-slate-300 w-24">Owner</th>
                    <th className="p-3 font-bold text-slate-700 dark:text-slate-300 w-48">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {p4.rows.map(row => (
                    <tr key={row.id} className="border-b border-slate-100 dark:border-slate-850">
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{row.item}</td>
                      <td className="p-3 text-center text-brand-blue font-bold text-sm">
                        {row.ready ? '☑' : '☐'}
                      </td>
                      <td className="p-3 text-slate-705 dark:text-slate-350">{row.owner || '—'}</td>
                      <td className="p-3 text-slate-500 dark:text-slate-450">{row.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Venue / Platform Check</h4>
                  <div className="dotted-notes text-xs min-h-[120px] bg-white/40">{p4.venueChecklist?.roomBooked ? 'Checked' : ''}</div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Additional Arrangements</h4>
                  <div className="dotted-notes text-xs min-h-[120px] bg-white/40">{p4.qrCodeUrl || ''}</div>
                </div>
              </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-800">
              PAGE 4
            </div>
          </div>
        </section>

        {/* PAGE 5: DURING MEETING EXECUTION */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <h2 className="text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
                During Meeting Execution
              </h2>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="space-y-3">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Execution Checklist</h4>
                  {[
                    { key: 'valueOpeningUsed', label: 'Value-driven opening used', desc: 'Benefits discussed first.' },
                    { key: 'noJargonUsed', label: 'No jargon used', desc: 'Avoided terms like Pathways, Icebreaker.' },
                    { key: 'timeDisciplineMaintained', label: 'Time discipline maintained', desc: 'Timing indicators shown.' },
                    { key: 'guestParticipationRespectful', label: 'Guest participation respectful', desc: 'Table Topics strictly voluntary.' }
                  ].map(item => (
                    <div key={item.key} className="flex gap-3 p-2.5 border border-slate-105 dark:border-slate-850 rounded-xl bg-white/40">
                      <span className="font-bold text-brand-blue text-sm">
                        {p5.checklist?.[item.key] ? '☑' : '☐'}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-805 dark:text-slate-200">{item.label}</span>
                        <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-455">Speaker Tracker Log</h4>
                  <table className="w-full text-left border-collapse text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white/40">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <th className="p-2 font-bold">Speaker</th>
                        <th className="p-2 font-bold">Role</th>
                        <th className="p-2 font-bold">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p5.speakerTracking.map(sp => (
                        <tr key={sp.id} className="border-b border-slate-100 dark:border-slate-855 last:border-0">
                          <td className="p-2 text-slate-705 dark:text-slate-350">{sp.speaker || '—'}</td>
                          <td className="p-2 text-slate-705 dark:text-slate-350">{sp.role || '—'}</td>
                          <td className="p-2 text-slate-600 dark:text-slate-400 font-mono font-bold">{sp.time || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Observations & Live Notes</h4>
                <div className="dotted-notes text-xs min-h-[220px] bg-white/40">{p5.liveNotes}</div>
              </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-800 mt-12">
              PAGE 5
            </div>
          </div>
        </section>

        {/* PAGE 6: OUTCOME AFTER MEETING */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <h2 className="text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
                Outcome After Meeting
              </h2>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-3 border border-slate-205 dark:border-slate-800 rounded-xl bg-white/40">
                  <span className="text-[9px] font-bold text-slate-455 uppercase block mb-1">Guests Attended</span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-250 min-h-[1.5rem]">
                    {p6.guestCount || 0}
                  </div>
                </div>
                <div className="p-3 border border-slate-205 dark:border-slate-800 rounded-xl bg-white/40">
                  <span className="text-[9px] font-bold text-slate-455 uppercase block mb-1">Interested Guests</span>
                  <div className="text-xs font-bold text-slate-805 dark:text-slate-250 min-h-[1.5rem]">
                    {p6.interestedGuests || 0}
                  </div>
                </div>
                <div className="p-3 border border-slate-205 dark:border-slate-805 rounded-xl bg-white/40">
                  <span className="text-[9px] font-bold text-slate-455 uppercase block mb-1">Members Joined</span>
                  <div className="text-xs font-bold text-slate-805 dark:text-slate-250 min-h-[1.5rem]">
                    {p6.membersJoined || 0}
                  </div>
                </div>
                <div className="p-3 border border-slate-205 dark:border-slate-805 rounded-xl bg-white/40">
                  <span className="text-[9px] font-bold text-slate-455 uppercase block mb-1">Overall Rating</span>
                  <div className="text-xs font-bold text-slate-805 dark:text-slate-250 min-h-[1.5rem]">
                    {p6.overallRating || 5}/10
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">What worked well</h4>
                  <div className="dotted-notes text-xs min-h-[120px] bg-white/40">{p6.strengths}</div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">What needs improvement</h4>
                  <div className="dotted-notes text-xs min-h-[120px] bg-white/40">{p6.weaknesses}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Follow-up Action Steps</h4>
                <div className="dotted-notes text-xs min-h-[160px] bg-white/40">{p6.followUpAction}</div>
              </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-800">
              PAGE 6
            </div>
          </div>
        </section>

        {/* PAGE 7: MEETING TRACKER SHEET */}
        <section className="booklet-page bg-paper dark:bg-slate-900 w-full">
          <div className="h-full flex flex-col justify-between p-4">
            <div>
              <h2 className="text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
                Meeting Tracker Sheet
              </h2>

              <table className="w-full text-left border-collapse text-[10px] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-2 font-bold w-20">Date</th>
                    <th className="p-2 font-bold w-1/4">Host Organization</th>
                    <th className="p-2 font-bold w-1/6">Location</th>
                    <th className="p-2 font-bold w-1/6">Coordinator</th>
                    <th className="p-2 font-bold w-10">Attendance</th>
                    <th className="p-2 font-bold w-1/6">Outcome</th>
                    <th className="p-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {p7.rows.map(row => (
                    <tr key={row.id} className="border-b border-slate-100 dark:border-slate-855">
                      <td className="p-2 text-slate-700 dark:text-slate-350">{row.date}</td>
                      <td className="p-2 font-semibold text-slate-700 dark:text-slate-300">{row.host || '—'}</td>
                      <td className="p-2 text-slate-700 dark:text-slate-350">{row.location || '—'}</td>
                      <td className="p-2 text-slate-700 dark:text-slate-350">{row.coordinator || '—'}</td>
                      <td className="p-2 text-slate-705 dark:text-slate-350 text-right">{row.attendance || 0}</td>
                      <td className="p-2 text-slate-705 dark:text-slate-350">{row.outcome || '—'}</td>
                      <td className="p-2 text-slate-500 dark:text-slate-450">{row.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Monthly Review Notes</h4>
                  <div className="dotted-notes text-xs min-h-[140px] bg-white/40">{p7.monthlyNotes}</div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-outfit font-bold text-xs uppercase tracking-widest text-slate-450">Support / Escalation Notes</h4>
                  <div className="dotted-notes text-xs min-h-[140px] bg-white/40">{p7.supportNotes}</div>
                </div>
              </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400 pt-6 border-t border-slate-100 dark:border-slate-800 mt-12">
              PAGE 7
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
