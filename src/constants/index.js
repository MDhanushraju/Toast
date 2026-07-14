export const PAGES = [
  { path: '/booklet/cover', label: '1. Booklet Cover', pageNum: 1 },
  { path: '/booklet/quick-reference', label: '2. Quick Reference', pageNum: 2 },
  { path: '/booklet/before-meeting', label: '3. Before Meeting', pageNum: 3 },
  { path: '/booklet/arrangements', label: '4. Arrangements', pageNum: 4 },
  { path: '/booklet/during-meeting', label: '5. During Meeting', pageNum: 5 },
  { path: '/booklet/outcome', label: '6. Outcome Capture', pageNum: 6 },
  { path: '/booklet/tracker', label: '7. Demo Tracker', pageNum: 7 },
  { path: '/booklet/data-sheet', label: '8. Booklet Data Sheet', pageNum: 8 }
];

export const DEFAULT_ARRANGEMENTS = [
  { id: 'arr-1', item: 'Standard script and talking points', ready: false, owner: '', priority: 'High', notes: '' },
  { id: 'arr-2', item: 'Value one-pager / Why Toastmasters', ready: false, owner: '', priority: 'High', notes: '' },
  { id: 'arr-3', item: 'Success stories / testimonials', ready: false, owner: '', priority: 'Medium', notes: '' },
  { id: 'arr-4', item: 'Agenda card and role handout', ready: false, owner: '', priority: 'High', notes: '' },
  { id: 'arr-5', item: 'Timer cards / gavel / ribbons / bookmarks', ready: false, owner: '', priority: 'Medium', notes: '' },
  { id: 'arr-6', item: 'Sign-up form and QR code', ready: false, owner: '', priority: 'High', notes: '' },
  { id: 'arr-7', item: 'Membership sheet / next steps', ready: false, owner: '', priority: 'High', notes: '' }
];

export const DEFAULT_SPEAKERS = [
  { id: 'sp-1', speaker: '', role: 'Toastmaster', time: '' },
  { id: 'sp-2', speaker: '', role: 'Speaker 1', time: '' },
  { id: 'sp-3', speaker: '', role: 'Evaluator 1', time: '' },
  { id: 'sp-4', speaker: '', role: 'Table Topics Master', time: '' }
];
