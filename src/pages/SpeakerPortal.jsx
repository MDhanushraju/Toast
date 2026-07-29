import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import FormInput from '../components/forms/FormInput';
import FormTextarea from '../components/forms/FormTextarea';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { FiMic, FiCheckCircle, FiBookOpen, FiAward } from 'react-icons/fi';

export default function SpeakerPortal() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  const [speakerName, setSpeakerName] = useState('');
  const [speechTitle, setSpeechTitle] = useState('');
  const [pathwaysProject, setPathwaysProject] = useState('Level 1: Ice Breaker');
  const [targetDuration, setTargetDuration] = useState('5 to 7 Minutes');
  const [introNotes, setIntroNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!speakerName.trim() || !speechTitle.trim()) return;

    const existingPage3 = activeBooklet?.page3 || {};
    const submissions = Array.isArray(existingPage3.speakerSubmissions) ? existingPage3.speakerSubmissions : [];

    const newSub = {
      id: `sub-${Date.now()}`,
      speakerName: speakerName.trim(),
      speechTitle: speechTitle.trim(),
      pathwaysProject,
      targetDuration,
      introNotes,
      submittedAt: new Date().toLocaleTimeString()
    };

    updateBookletPage('page3', { speakerSubmissions: [...submissions, newSub] });
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006094] to-[#003a5c] text-white rounded-3xl p-8 shadow-xl space-y-4 text-center">
        <ToastmastersLogo district="DISTRICT 227" size="md" className="mx-auto my-2" />
        <span className="text-xs font-black bg-white/20 px-3.5 py-1 rounded-full uppercase tracking-widest font-montserrat">
          🎤 Speaker Submission Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-montserrat">
          Submit Your Speech & Pathways Details
        </h1>
        <p className="text-xs text-white/80 max-w-lg mx-auto font-bold">
          Submit your speech title, project level, and introduction for the Toastmaster of the Day.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <FiCheckCircle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-montserrat">
            Speech Submission Received!
          </h2>
          <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
            Your speech title <strong>"{speechTitle}"</strong> has been recorded for {activeBooklet?.title || 'the upcoming meeting'}.
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setSubmitted(false)}
            className="bg-[#006094] text-white font-black"
          >
            Submit Another Speech
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Speaker Member Name *"
              id="speakerName"
              value={speakerName}
              onChange={(e) => setSpeakerName(e.target.value)}
              placeholder="e.g. TM Ankitha Bhaskara"
              required
            />
            <FormInput
              label="Speech Title *"
              id="speechTitle"
              value={speechTitle}
              onChange={(e) => setSpeechTitle(e.target.value)}
              placeholder="e.g. Beyond the Horizon"
              required
            />
            <FormInput
              label="Pathways Project Level"
              id="pathwaysProject"
              value={pathwaysProject}
              onChange={(e) => setPathwaysProject(e.target.value)}
              placeholder="Level 1: Ice Breaker"
            />
            <FormInput
              label="Target Speaking Duration"
              id="targetDuration"
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              placeholder="5 to 7 Minutes"
            />
          </div>

          <FormTextarea
            label="Speaker Introduction for TMOD"
            id="introNotes"
            value={introNotes}
            onChange={(e) => setIntroNotes(e.target.value)}
            placeholder="Tell us a fun fact or brief bio for the Toastmaster of the Day to introduce you..."
            rows={3}
          />

          <div className="pt-2 text-right">
            <Button
              variant="primary"
              size="md"
              type="submit"
              className="bg-[#781327] hover:bg-[#580d1b] text-white font-black text-sm px-6 py-3"
            >
              <FiMic className="mr-2" /> Submit Speech Details
            </Button>
          </div>
        </form>
      )}

    </div>
  );
}
