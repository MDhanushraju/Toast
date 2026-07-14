import React from 'react';
import PageNavigation from '../components/PageNavigation';

export default function Page2Ref() {
  const references = [
    { num: '01', title: 'Cover Page', desc: 'Booklet title, District 228 name, owner references, description, and club logo placeholder.' },
    { num: '02', title: 'Quick Reference', desc: 'Reference structure page highlighting booklet layout, mapping, and guidelines.' },
    { num: '03', title: 'Before Demo Meeting', desc: 'Checklists and member-filled logs specifying planning title, date, objective, and sign-offs.' },
    { num: '04', title: 'Arrangements Checklist', desc: 'Logistics tracker specifying script availability, talking points, materials, owner assignments, and venue notes.' },
    { num: '05', title: 'During Meeting Execution', desc: 'Focus checklist for live guest experience, speech timer tracker, role records, and real-time observation notes.' },
    { num: '06', title: 'Outcome After Meeting', desc: 'Evaluation parameters covering guest attendance details, chartering interest levels, action items, strengths, and areas of improvement.' },
    { num: '07', title: 'Demo Tracker Sheet', desc: 'Global tabular historical tracker log summarizing date, hosts, leads, outcomes, and coordinator comments.' },
    { num: '08', title: 'Booklet Data Sheet', desc: 'An aggregated tabular summary of all booklet data points ready to print.' }
  ];

  return (
    <div className="space-y-4">
      {/* Booklet Content Box */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-brand-navy dark:text-slate-100">
                Page References & Guidelines
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                A quick mapping of the District 228 Demo Meeting Booklet sections.
              </p>
            </div>

            {/* References Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
              {references.map(ref => (
                <div 
                  key={ref.num} 
                  className="flex items-start gap-4 p-3 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl shadow-sm hover:border-brand-blue/30 transition-all duration-200"
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-brand-blue/15 to-gold/15 dark:from-brand-blue/20 dark:to-gold/10 flex items-center justify-center font-outfit font-extrabold text-brand-blue dark:text-brand-blue/90 text-xs">
                    {ref.num}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{ref.title}</h4>
                    <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-normal">{ref.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 2 References
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
