export const PAGES = [
  { path: '/booklet/cover', label: '1. Booklet Cover', pageNum: 1 },
  { path: '/booklet/quick-reference', label: '2. Quick Reference', pageNum: 2 },
  { path: '/booklet/before-meeting', label: '3. Before Meeting', pageNum: 3 },
  { path: '/booklet/arrangements', label: '4. Arrangements', pageNum: 4 },
  { path: '/booklet/during-meeting', label: '5. During Meeting', pageNum: 5 },
  { path: '/booklet/outcome', label: '6. Outcome Capture', pageNum: 6 },
  { path: '/booklet/tracker', label: '7. Tracker Sheet', pageNum: 7 },
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

export const DEFAULT_DEMO_AGENDA = [
  {
    id: 'ag-1',
    time: '0:00 - 0:05',
    duration: 5,
    slot: 'Welcome Remarks',
    details: 'Welcome participants and set the tone for the session.',
    role: 'Corporate POC / Champion',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-2',
    time: '0:05 - 0:10',
    duration: 5,
    slot: 'Address to Participants',
    details: 'Company perspective on communication and leadership.',
    role: 'Company Leader / HR',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-3',
    time: '0:10 - 0:20',
    duration: 10,
    slot: 'Toastmasters Introduction',
    details: 'Video & Context Setting: Showcase Toastmasters video and its benefits.',
    role: 'Area Director / Division Director',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-4',
    time: '0:20 - 0:22',
    duration: 2,
    slot: 'Hand Over & Opening',
    details: 'Officially open the meeting and hand over to the TM team.',
    role: 'Presiding Officer (PO)',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-5',
    time: '0:22 - 0:24',
    duration: 2,
    slot: 'Sergeant-at-Arms (Meeting Protocol)',
    details: 'Conduct meeting protocol and housekeeping.',
    role: 'SAA',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-6',
    time: '0:24 - 0:27',
    duration: 3,
    slot: 'Introduce Meeting & Agenda',
    details: 'Introduce the meeting, agenda and participants.',
    role: 'Toastmaster of the Day (TMOD)',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-7',
    time: '0:27 - 0:37',
    duration: 10,
    slot: 'Prepared Speech',
    details: 'Deliver the prepared speech.',
    role: 'Speaker',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-8',
    time: '0:37 - 0:40',
    duration: 3,
    slot: 'Speech Evaluation',
    details: 'Evaluate the prepared speech.',
    role: 'Evaluator',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-9',
    time: '0:40 - 0:43',
    duration: 3,
    slot: 'Table Topics Introduction',
    details: 'Introduce the Table Topics session and rules.',
    role: 'Table Topics Master (TTM)',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-10',
    time: '0:43 - 1:04',
    duration: 21,
    slot: 'Table Topics Session',
    details: '7 Participants - First speaker from Toastmasters to demonstrate.',
    role: 'TTM',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-11',
    time: '1:04 - 1:07',
    duration: 3,
    slot: 'TAG Report',
    details: 'Timer and Language Evaluator only.',
    role: 'TAG Team (Timer & Language Evaluator)',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-12',
    time: '1:07 - 1:12',
    duration: 5,
    slot: "General Evaluator's Report",
    details: 'Provide overall feedback on the meeting.',
    role: 'General Evaluator (GE)',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-13',
    time: '1:12 - 1:14',
    duration: 2,
    slot: 'Hand Over to Presiding Officer',
    details: 'GE hands over the meeting to the Presiding Officer.',
    role: 'GE -> PO',
    speaker: '',
    club: ''
  },
  {
    id: 'ag-14',
    time: '1:14 - 1:30',
    duration: 16,
    slot: 'Q&A on Toastmasters, Membership & Benefits',
    details: 'Open floor for questions and clarifications.',
    role: 'Area Director / Division Director',
    speaker: '',
    club: ''
  }
];

export const DEMO_AGENDA_NOTES = '1 Prepared Speaker | 1 Evaluator | TAG: Only Timer & Language Evaluator | 7 Table Topics Participants (First from Toastmasters)';
