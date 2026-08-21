let votesStore = [];

export const submitVote = async (req, res) => {
  const { voterName, category, selectedSpeaker } = req.body;
  const newVote = {
    id: `vote-${Date.now()}`,
    voterName: voterName || 'Anonymous Voter',
    category: category || 'Best Prepared Speaker',
    selectedSpeaker: selectedSpeaker || 'Speaker 1',
    timestamp: new Date().toISOString()
  };
  votesStore.push(newVote);
  return res.status(201).json({ success: true, message: 'Vote recorded live!', data: newVote });
};

export const getVoteResults = async (req, res) => {
  const tally = {};
  votesStore.forEach(v => {
    tally[v.category] = tally[v.category] || {};
    tally[v.category][v.selectedSpeaker] = (tally[v.category][v.selectedSpeaker] || 0) + 1;
  });

  return res.json({ success: true, totalVotes: votesStore.length, tally, votes: votesStore });
};
