import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import ProgressRing from '../components/ProgressRing';
import Button from '../components/ui/Button';
import { 
  FiFileText, FiPlus, FiGrid, FiClock, FiTrash2, 
  FiCopy, FiEdit3, FiTrendingUp, FiCheckCircle, FiActivity,
  FiCalendar, FiFolderPlus, FiDatabase 
} from 'react-icons/fi';
import { format, parseISO, compareAsc } from 'date-fns';

export default function Dashboard() {
  const { booklets, activeBooklet, selectBooklet, createBooklet, deleteBooklet, duplicateBooklet, activities } = useBooklet();
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Stats Calculations
  const totalBooklets = booklets.length;
  
  const completedBookletsCount = booklets.filter(b => b.completedPercent === 100).length;

  const avgProgress = totalBooklets > 0 
    ? Math.round(booklets.reduce((acc, b) => acc + (b.completedPercent || 0), 0) / totalBooklets)
    : 0;

  // Count checks
  let totalTasksCompleted = 0;
  let totalTasksPending = 0;
  
  booklets.forEach(b => {
    // Page 3 checks
    const p3Checks = b.page3?.checklist || {};
    Object.values(p3Checks).forEach(val => val ? totalTasksCompleted++ : totalTasksPending++);

    // Page 4 checks
    const p4Rows = b.page4?.rows || [];
    p4Rows.forEach(r => r.ready ? totalTasksCompleted++ : totalTasksPending++);

    // Page 5 checks
    const p5Checks = b.page5?.checklist || {};
    Object.values(p5Checks).forEach(val => val ? totalTasksCompleted++ : totalTasksPending++);
  });

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (newTitle.trim() === '') return;
    const newId = createBooklet(newTitle);
    setNewTitle('');
    setShowCreateModal(false);
    navigate('/booklet/cover');
  };

  const handleContinue = () => {
    if (activeBooklet) {
      navigate('/booklet/cover');
    }
  };

  // Sort upcoming meetings using date-fns
  const sortedUpcoming = [...booklets]
    .filter(b => b.page3?.date)
    .sort((a, b) => {
      try {
        return compareAsc(parseISO(a.page3.date), parseISO(b.page3.date));
      } catch (err) {
        return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* SaaS Hero Banner */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-navy dark:from-slate-900 dark:to-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-brand-blue/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(197,143,50,0.15),transparent_40%)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold text-gold-light uppercase tracking-widest">District 228</span>
            <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl leading-tight">Booklet Management Console</h1>
            <p className="text-xs text-slate-200/90 leading-relaxed font-normal">
              Manage professional corporate outreach programs, track readiness parameters, evaluate session timings, and review meeting outcome structures across District 228.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              className="bg-gold hover:bg-gold-dark text-white border-0 shadow-lg shadow-gold/25"
              onClick={() => setShowCreateModal(true)}
            >
              <FiPlus size={16} className="mr-1.5" /> Start New Booklet
            </Button>
            {activeBooklet && (
              <Button
                variant="secondary"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/25 hover:text-white"
                onClick={handleContinue}
              >
                Continue Draft
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Booklets Completed" icon={FiCheckCircle}>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-outfit text-slate-805 dark:text-slate-100">{completedBookletsCount}</span>
            <span className="text-xs text-slate-400 font-semibold">of {totalBooklets} total</span>
          </div>
        </Card>

        <Card title="Average Progress" icon={FiTrendingUp}>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-outfit text-slate-805 dark:text-slate-100">{avgProgress}%</span>
              <span className="text-[9px] text-green-550 bg-green-50 dark:bg-green-950/20 px-1.5 py-0.5 rounded-md font-bold">Health</span>
            </div>
            <ProgressRing percentage={avgProgress} size={50} strokeWidth={5} />
          </div>
        </Card>

        <Card title="Pending Checks" icon={FiActivity}>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-outfit text-amber-500">{totalTasksPending}</span>
            <span className="text-xs text-slate-455 font-semibold">Remaining items</span>
          </div>
        </Card>

        <Card title="Meetings Logged" icon={FiDatabase}>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-outfit text-brand-blue">{totalBooklets}</span>
            <span className="text-xs text-slate-400 font-semibold">In history logs</span>
          </div>
        </Card>
      </div>

      {/* Main dashboard content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booklets List Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-extrabold text-sm text-slate-805 dark:text-slate-200">Active Booklets</h3>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-500 px-2 py-0.5 rounded-full font-bold">{totalBooklets} Total</span>
          </div>

          {booklets.length === 0 ? (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs font-semibold">
              No booklets generated yet. Click "Start New Booklet" above to seed templates.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {booklets.map(b => (
                <div 
                  key={b.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-405 dark:text-slate-500 font-bold">{b.createdAt}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        b.completedPercent === 100 
                          ? 'bg-green-50 text-green-650 dark:bg-green-950/20' 
                          : 'bg-brand-blue/5 text-brand-blue dark:bg-brand-blue/20'
                      }`}>
                        {b.completedPercent}% Complete
                      </span>
                    </div>
                    <h4 className="font-outfit font-bold text-slate-850 dark:text-slate-200 text-xs sm:text-sm mb-1 truncate">{b.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4 truncate">
                      Host: {b.page3?.hostOrganization || 'Not specified'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-brand-blue h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${b.completedPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => {
                          selectBooklet(b.id);
                          navigate('/booklet/cover');
                        }}
                        className="flex items-center gap-1.5 text-xs text-brand-blue hover:text-brand-blue/80 font-bold"
                      >
                        <FiEdit3 size={13} /> Edit
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => duplicateBooklet(b.id)}
                          title="Duplicate booklet"
                          className="p-1.5 text-slate-400 hover:text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <FiCopy size={13} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${b.title}"?`)) {
                              deleteBooklet(b.id);
                            }
                          }}
                          title="Delete booklet"
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar panels: Upcoming Meetings & Activities */}
        <div className="space-y-6">
          {/* Upcoming Meetings timeline */}
          <div className="space-y-3">
            <h3 className="font-outfit font-extrabold text-sm text-slate-855 dark:text-slate-200">Upcoming Meetings</h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
              {sortedUpcoming.length === 0 ? (
                <div className="text-[10px] text-slate-400 text-center py-2 font-medium">No sessions scheduled yet</div>
              ) : (
                <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4 ml-1">
                  {sortedUpcoming.slice(0, 3).map(b => (
                    <div key={b.id} className="relative">
                      <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-blue ring-4 ring-white dark:ring-slate-900"></span>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-405 font-bold">
                          {b.page3?.date ? format(parseISO(b.page3.date), 'MMM dd, yyyy') : 'No Date'} • {b.page3?.time || 'No Time'}
                        </span>
                        <h5 className="text-[11px] font-bold text-slate-805 dark:text-slate-200 truncate">{b.title}</h5>
                        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold truncate">
                          {b.page3?.venue ? `Venue: ${b.page3.venue}` : 'Venue not specified'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity history */}
          <div className="space-y-3">
            <h3 className="font-outfit font-extrabold text-sm text-slate-855 dark:text-slate-200">Recent Activity</h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
              {activities.length === 0 ? (
                <div className="text-[10px] text-slate-400 text-center py-2 font-medium">No recent activities logged</div>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 4).map(act => (
                    <div key={act.id} className="flex items-start gap-2.5 text-[10px] text-slate-500 leading-normal">
                      <FiClock size={12} className="mt-0.5 text-slate-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{act.message}</span>
                        <div className="text-[8px] text-slate-400 mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-outfit font-extrabold text-slate-900 dark:text-white text-base mb-2">Create New Demo Booklet</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Initialize a new template record to manage preparation, logistics, execution, and outcomes.</p>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest mb-1.5">Booklet Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporation Alpha Demo Booklet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => {
                  setNewTitle('');
                  setShowCreateModal(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Booklet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
