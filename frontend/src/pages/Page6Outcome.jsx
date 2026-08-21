import React from 'react';
import { useBooklet } from '../context/BookletContext';
import PageNavigation from '../components/PageNavigation';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import { FiAward, FiHeart, FiTrendingUp, FiThumbsUp, FiAlertTriangle, FiPlusCircle, FiMessageSquare } from 'react-icons/fi';

export default function Page6Outcome() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  if (!activeBooklet) return null;

  const pageData = activeBooklet.page6 || {
    guestCount: 0,
    interestedGuests: 0,
    membersJoined: 0,
    overallRating: 5,
    strengths: '',
    weaknesses: '',
    improvements: '',
    followUpAction: '',
    comments: ''
  };

  const handleFieldChange = (field, value) => {
    updateBookletPage('page6', { [field]: value });
  };

  const handleNumericChange = (field, val) => {
    const num = val === '' ? 0 : parseInt(val, 10);
    if (!isNaN(num)) {
      handleFieldChange(field, num);
    }
  };

  const handleClear = () => {
    if (confirm("Clear Page 6 outcomes data?")) {
      updateBookletPage('page6', {
        guestCount: 0,
        interestedGuests: 0,
        membersJoined: 0,
        overallRating: 5,
        strengths: '',
        weaknesses: '',
        improvements: '',
        followUpAction: '',
        comments: ''
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Booklet Outcome Sheet */}
      <div className="booklet-page">
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-[#e8ddd0] dark:border-slate-800 pb-3 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-[#772432] dark:text-white">
                  Outcome After Meeting
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Log satisfaction ratings, count attendees interested, and draft action plans.
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
              <h2 className="text-xl font-bold text-[#772432]">Outcome After Meeting</h2>
              <p className="text-xs text-slate-650">District 228 Session Evaluation & Outcomes</p>
            </div>

            {/* Metrics cards inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-[#0c1421] p-4 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl shadow-sm">
              <FormInput
                label="Guest Count"
                id="guestCount"
                type="number"
                value={pageData.guestCount || ''}
                onChange={(e) => handleNumericChange('guestCount', e.target.value)}
                placeholder="0"
                min="0"
              />
              <FormInput
                label="Interested Guests"
                id="interestedGuests"
                type="number"
                value={pageData.interestedGuests || ''}
                onChange={(e) => handleNumericChange('interestedGuests', e.target.value)}
                placeholder="0"
                min="0"
              />
              <FormInput
                label="Members Joined"
                id="membersJoined"
                type="number"
                value={pageData.membersJoined || ''}
                onChange={(e) => handleNumericChange('membersJoined', e.target.value)}
                placeholder="0"
                min="0"
              />
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-[#772432] dark:text-[#f2a900] uppercase tracking-widest">
                  Overall rating (1-10)
                </label>
                <div className="flex items-center gap-3 h-[38px] px-2.5 bg-[#faf5ef] dark:bg-slate-950 rounded-xl border border-[#e8ddd0] dark:border-slate-800">
                  <input
                    type="range"
                    id="overallRating"
                    min="1"
                    max="10"
                    value={pageData.overallRating || 5}
                    onChange={(e) => handleNumericChange('overallRating', e.target.value)}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#772432] focus:outline-none"
                  />
                  <span className="font-outfit font-extrabold text-[#772432] dark:text-[#f2a900] text-xs w-5 text-right shrink-0">
                    {pageData.overallRating}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <FormTextarea
                label="Session Strengths"
                id="strengths"
                value={pageData.strengths || ''}
                onChange={(e) => handleFieldChange('strengths', e.target.value)}
                placeholder="What went well? e.g. High guest participation, enthusiastic speeches..."
                rows={4}
              />
              <FormTextarea
                label="Session Weaknesses"
                id="weaknesses"
                value={pageData.weaknesses || ''}
                onChange={(e) => handleFieldChange('weaknesses', e.target.value)}
                placeholder="Shortcomings encountered? e.g. AV projector failures, delayed timing segment..."
                rows={4}
              />
            </div>

            {/* Improvements and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextarea
                label="Required Improvements"
                id="improvements"
                value={pageData.improvements || ''}
                onChange={(e) => handleFieldChange('improvements', e.target.value)}
                placeholder="Actionable improvements: shorten timer instructions, provide handouts..."
                rows={4}
              />
              <FormTextarea
                label="Next Follow-up Action"
                id="followUpAction"
                value={pageData.followUpAction || ''}
                onChange={(e) => handleFieldChange('followUpAction', e.target.value)}
                placeholder="What is the next step? e.g. Send formal pricing quotation by Monday..."
                rows={4}
              />
            </div>

            {/* General comments */}
            <FormTextarea
              label="Coordinator Comments & Host Feedback"
              id="comments"
              value={pageData.comments || ''}
              onChange={(e) => handleFieldChange('comments', e.target.value)}
              placeholder="Record qualitative testimonials shared by the host, specific chartering questions..."
              rows={5}
            />

          </div>

          <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-12">
            Page 6 Outcomes
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <PageNavigation />
    </div>
  );
}
