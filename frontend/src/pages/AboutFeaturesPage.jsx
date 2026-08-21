import React from 'react';
import { 
  FiInfo, FiCheckCircle, FiBookOpen, FiClock, FiFileText, 
  FiCalendar, FiShield, FiCpu, FiAward, FiDownload, FiUsers, FiZap
} from 'react-icons/fi';

export default function AboutFeaturesPage() {
  const features = [
    {
      title: '3-Segment Booklet Architecture',
      desc: 'Seamless meeting lifecycle management: Segment 1 (Pre-meeting setup & agendas), Segment 2 (Live meeting timers & attendance), and Segment 3 (Post-meeting executive summary).',
      icon: FiBookOpen,
      color: 'bg-[#781327]'
    },
    {
      title: 'Real-Time Speaker & Role Timers',
      desc: 'Live timing console with automated color indicators (Green, Yellow, Red) for Toastmaster of the Day, Prepared Speakers, Table Topics, and Evaluators.',
      icon: FiClock,
      color: 'bg-[#006094]'
    },
    {
      title: 'Interactive Tracker Calendar',
      desc: 'Date-fns powered monthly calendar grid to view, schedule, and launch meeting booklets directly on specific dates.',
      icon: FiCalendar,
      color: 'bg-emerald-700'
    },
    {
      title: 'One-Click Backup & Executive PDF Export',
      desc: 'Instant 1-click JSON dataset export/import backups and print-ready executive reports for District Leadership and corporate sponsors.',
      icon: FiFileText,
      color: 'bg-purple-700'
    },
    {
      title: 'District Role & Access Control',
      desc: 'Role-based access matrix ensuring data integrity across District Main Administrators, VPE Officers, Secretaries, and Members.',
      icon: FiShield,
      color: 'bg-amber-700'
    },
    {
      title: 'Senior Accessibility & Legibility',
      desc: '20px font-black typography scale, high contrast Toastmasters colors, 26px vector icons, and generous touch targets for senior readability.',
      icon: FiAward,
      color: 'bg-[#1C4E6F]'
    }
  ];

  return (
    <div className="w-full space-y-8 font-sans pb-12">
      
      {/* Header Banner - High Impact */}
      <div className="bg-[#1C4E6F] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-white text-[#1C4E6F] flex items-center justify-center shrink-0 shadow-xl">
            <FiInfo size={42} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black uppercase tracking-wider bg-[#781327] text-white px-4 py-1.5 rounded-full font-montserrat shadow-sm">
                OFFICIAL SYSTEM GUIDE
              </span>
              <span className="text-sm font-extrabold text-sky-200 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                v1.5.0 Stable Offline
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black leading-tight text-white mt-2">
              Toastmasters District 227 Console Features
            </h1>
            <p className="text-lg sm:text-xl text-sky-100 font-bold mt-2">
              Complete operational guide to the features, tools, and capabilities of the District Meeting Management Console.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid - 50/50 Full Page Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-5 hover:border-[#006094] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${f.color} text-white flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-snug">
                    {f.title}
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                  {f.desc}
                </p>
              </div>
              
              <div className="pt-4 border-t-2 border-[#f3ebe1] dark:border-slate-800 flex items-center justify-between text-sm sm:text-base font-black text-slate-500 font-montserrat">
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black"><FiCheckCircle size={20} /> Active Certified Module</span>
                <span>District 227 Standard</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Specifications Box - Full Width */}
      <div className="bg-white dark:bg-[#121e2d] border-2 border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6">
        <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#006094] dark:text-sky-300 border-b-2 border-[#e8ddd0] dark:border-slate-800 pb-4 flex items-center gap-3">
          <FiCpu size={32} className="text-[#781327]" /> System Engine & Offline Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-montserrat">
          <div className="p-6 bg-[#FAF5EF] dark:bg-slate-900 rounded-2xl border-2 border-[#e8ddd0] dark:border-slate-800 space-y-2">
            <div className="text-sm text-slate-500 font-black uppercase tracking-wider">Storage Engine</div>
            <div className="font-black text-slate-900 dark:text-white text-xl">HTML5 LocalStorage</div>
            <div className="text-base text-slate-600 font-bold">Automatic offline data sync</div>
          </div>

          <div className="p-6 bg-[#E6F0F6]/80 dark:bg-slate-900 rounded-2xl border-2 border-[#006094]/40 space-y-2">
            <div className="text-sm text-[#006094] dark:text-sky-400 font-black uppercase tracking-wider">UI Framework</div>
            <div className="font-black text-slate-900 dark:text-white text-xl">React 18 + Tailwind CSS</div>
            <div className="text-base text-slate-600 font-bold">20px high legibility scale</div>
          </div>

          <div className="p-6 bg-rose-50 dark:bg-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-900 space-y-2">
            <div className="text-sm text-rose-800 dark:text-rose-400 font-black uppercase tracking-wider">Compliance</div>
            <div className="font-black text-slate-900 dark:text-white text-xl">Toastmasters International</div>
            <div className="text-base text-slate-600 font-bold">District 227 Brand Standard</div>
          </div>
        </div>
      </div>

    </div>
  );
}
