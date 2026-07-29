import React, { useState } from 'react';
import { useBooklet } from '../context/BookletContext';
import Button from '../components/ui/Button';
import ToastmastersLogo from '../components/ui/ToastmastersLogo';
import { FiAward, FiCheckCircle, FiStar, FiTrendingUp } from 'react-icons/fi';

export default function LiveVoting() {
  const { activeBooklet, updateBookletPage } = useBooklet();

  const [bestSpeaker, setBestSpeaker] = useState('');
  const [bestEvaluator, setBestEvaluator] = useState('');
  const [bestTableTopics, setBestTableTopics] = useState('');
  const [voted, setVoted] = useState(false);

  const speakerTracking = activeBooklet?.page5?.speakerTracking || [
    { id: '1', speaker: 'TM Anjali Jha', role: 'Prepared Speaker 1' },
    { id: '2', speaker: 'TM Arun Kota', role: 'Prepared Speaker 2' },
    { id: '3', speaker: 'TM Premdeep Taduavai', role: 'Speech Evaluator 1' },
    { id: '4', speaker: 'TM Priyanka Singh', role: 'Table Topics Master' }
  ];

  const page5Data = activeBooklet?.page5 || {};
  const votes = Array.isArray(page5Data.votes) ? page5Data.votes : [];

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    if (!bestSpeaker && !bestEvaluator && !bestTableTopics) {
      alert('Please select at least one vote choice!');
      return;
    }

    const newVote = {
      id: `v-${Date.now()}`,
      bestSpeaker,
      bestEvaluator,
      bestTableTopics,
      votedAt: new Date().toLocaleTimeString()
    };

    updateBookletPage('page5', { votes: [...votes, newVote] });
    setVoted(true);
  };

  // Calculate vote tallies for VPE
  const getTallies = (field) => {
    const counts = {};
    votes.forEach(v => {
      const val = v[field];
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  };

  const speakerTallies = getTallies('bestSpeaker');
  const evaluatorTallies = getTallies('bestEvaluator');
  const ttTallies = getTallies('bestTableTopics');

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      
      {/* Executive Voting Header */}
      <div className="bg-gradient-to-r from-[#781327] to-[#580d1b] text-white rounded-3xl p-8 shadow-xl text-center space-y-3">
        <ToastmastersLogo district="DISTRICT 227" size="md" className="mx-auto my-1" />
        <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest font-montserrat">
          🗳️ 3-Tap Live Digital Voting
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-montserrat uppercase tracking-wider">
          Vote for Today's Best Performers
        </h1>
        <p className="text-xs text-white/80 font-bold max-w-md mx-auto">
          Cast your vote for Best Speaker, Best Evaluator, and Best Table Topics Speaker!
        </p>
      </div>

      {voted ? (
        <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <FiCheckCircle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-montserrat">
            Your Vote Has Been Recorded!
          </h2>
          <p className="text-xs text-slate-500 font-extrabold max-w-md mx-auto">
            Thank you for participating! The Vice President Education will announce the winner ribbons during closing address.
          </p>
          <Button variant="secondary" size="md" onClick={() => setVoted(false)} className="bg-[#781327] text-white font-black">
            Cast Another Vote
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVoteSubmit} className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Best Speaker */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <label className="block text-sm font-black text-[#781327] dark:text-rose-400 uppercase tracking-wider font-montserrat">
              🥇 1. Vote Best Speaker
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {speakerTracking.map(sp => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setBestSpeaker(sp.speaker || sp.role)}
                  className={`p-3.5 rounded-2xl border-2 text-left font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                    bestSpeaker === (sp.speaker || sp.role)
                      ? 'bg-[#781327] text-white border-[#781327] shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-[#e8ddd0] dark:border-slate-800 hover:border-[#781327]'
                  }`}
                >
                  <div>
                    <div className="font-black text-xs truncate">{sp.speaker || 'Speaker'}</div>
                    <div className="text-[10px] opacity-80 truncate">{sp.role}</div>
                  </div>
                  {bestSpeaker === (sp.speaker || sp.role) && <FiStar size={16} className="shrink-0 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Best Evaluator */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <label className="block text-sm font-black text-[#006094] dark:text-sky-300 uppercase tracking-wider font-montserrat">
              🥈 2. Vote Best Evaluator
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {speakerTracking.map(sp => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setBestEvaluator(sp.speaker || sp.role)}
                  className={`p-3.5 rounded-2xl border-2 text-left font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                    bestEvaluator === (sp.speaker || sp.role)
                      ? 'bg-[#006094] text-white border-[#006094] shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-[#e8ddd0] dark:border-slate-800 hover:border-[#006094]'
                  }`}
                >
                  <div>
                    <div className="font-black text-xs truncate">{sp.speaker || 'Evaluator'}</div>
                    <div className="text-[10px] opacity-80 truncate">{sp.role}</div>
                  </div>
                  {bestEvaluator === (sp.speaker || sp.role) && <FiStar size={16} className="shrink-0 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Best Table Topics Speaker */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-[#781327] dark:text-rose-400 uppercase tracking-wider font-montserrat">
              🥉 3. Vote Best Table Topics Speaker
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {speakerTracking.map(sp => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setBestTableTopics(sp.speaker || sp.role)}
                  className={`p-3.5 rounded-2xl border-2 text-left font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${
                    bestTableTopics === (sp.speaker || sp.role)
                      ? 'bg-[#781327] text-white border-[#781327] shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-[#e8ddd0] dark:border-slate-800 hover:border-[#781327]'
                  }`}
                >
                  <div>
                    <div className="font-black text-xs truncate">{sp.speaker || 'Table Topics Speaker'}</div>
                    <div className="text-[10px] opacity-80 truncate">{sp.role}</div>
                  </div>
                  {bestTableTopics === (sp.speaker || sp.role) && <FiStar size={16} className="shrink-0 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <Button variant="primary" size="md" type="submit" className="bg-[#781327] hover:bg-[#580d1b] text-white font-black text-sm px-6 py-3">
              <FiAward size={18} className="mr-2" /> Submit Digital Votes
            </Button>
          </div>
        </form>
      )}

      {/* 📊 Live Vote Results Tally for VPE Admin */}
      <div className="bg-white dark:bg-[#121e2d] border border-[#e8ddd0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-montserrat font-black text-sm text-[#006094] dark:text-white">
            <FiTrendingUp size={18} className="text-[#006094]" />
            <span>VPE Live Vote Results Tally ({votes.length} Votes Cast)</span>
          </div>
          <span className="text-xs bg-[#E6F0F6] text-[#006094] font-black px-3 py-1 rounded-full">
            Real-time Tally
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          {/* Best Speaker Tally */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-montserrat font-black text-xs text-[#781327] dark:text-rose-400 uppercase tracking-widest">
              Best Speaker
            </h4>
            {Object.keys(speakerTallies).length === 0 ? (
              <p className="text-[11px] text-slate-400 font-bold">No votes recorded yet.</p>
            ) : (
              Object.entries(speakerTallies).map(([name, count]) => (
                <div key={name} className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate">{name}</span>
                  <span className="text-[#781327] font-black">{count} Votes</span>
                </div>
              ))
            )}
          </div>

          {/* Best Evaluator Tally */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-montserrat font-black text-xs text-[#006094] dark:text-sky-300 uppercase tracking-widest">
              Best Evaluator
            </h4>
            {Object.keys(evaluatorTallies).length === 0 ? (
              <p className="text-[11px] text-slate-400 font-bold">No votes recorded yet.</p>
            ) : (
              Object.entries(evaluatorTallies).map(([name, count]) => (
                <div key={name} className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate">{name}</span>
                  <span className="text-[#006094] font-black">{count} Votes</span>
                </div>
              ))
            )}
          </div>

          {/* Best TT Tally */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-[#e8ddd0] dark:border-slate-800 rounded-2xl space-y-2">
            <h4 className="font-montserrat font-black text-xs text-[#781327] dark:text-rose-400 uppercase tracking-widest">
              Best Table Topics
            </h4>
            {Object.keys(ttTallies).length === 0 ? (
              <p className="text-[11px] text-slate-400 font-bold">No votes recorded yet.</p>
            ) : (
              Object.entries(ttTallies).map(([name, count]) => (
                <div key={name} className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="truncate">{name}</span>
                  <span className="text-[#781327] font-black">{count} Votes</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
