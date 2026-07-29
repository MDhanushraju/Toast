import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_DEMO_AGENDA, DEMO_AGENDA_NOTES } from '../constants/index.js';

export const createDefaultBooklet = (id, title = "Meeting Booklet", status = "ongoing") => {
  const dateStr = new Date().toISOString().split('T')[0];
  const bookletId = id || `booklet-${uuidv4()}`;

  return {
    id: bookletId,
    title: title,
    status: status, // 'ongoing' | 'upcoming' | 'completed'
    preparedFor: "Pramod K Murthy, Prashant, and the extended team",
    districtName: "District 227",
    preparedDate: dateStr,
    logoUrl: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/980554ec398a6734eda8d57a69bcec72ba4e7dfe.jpg",
    description: "Toastmasters-style working booklet. This booklet is meant to be used as a practical guide, a printout, and a member-filled working record.",
    createdAt: dateStr,
    updatedAt: dateStr,
    completedPercent: status === 'completed' ? 100 : (status === 'ongoing' ? 50 : 0),

    // Page 3: Before Meeting
    page3: {
      checklist: [
        { id: "p3-c1", label: "Agenda finalized", desc: "Standard flow approved and ready to use.", checked: status === 'completed', isCustom: false },
        { id: "p3-c2", label: "Role players confirmed", desc: "Toastmaster, Speaker, Evaluator, Timer confirmed.", checked: status === 'completed', isCustom: false },
        { id: "p3-c3", label: "Dry run completed", desc: "Timing signals and speaker handoffs rehearsed.", checked: status === 'completed', isCustom: false },
        { id: "p3-c4", label: "Escalation path known", desc: "Support contacts identified.", checked: status === 'completed', isCustom: false }
      ],
      demoTitle: title,
      meetingTheme: "Transform Your Communication and Leadership",
      hostOrganization: status === 'ongoing' ? 'Corporation Alpha' : (status === 'upcoming' ? 'Tech Solutions Corp' : 'District 227 HQ'),
      venue: status === 'ongoing' ? 'Auditorium A' : 'Conference Room B',
      date: dateStr,
      time: "10:00 AM",
      objective: "To demonstrate Toastmasters value to the host organization and pave the way for chartering a new club.",
      roles: {
        toastmaster: "Prashant",
        speaker1: "Ankita",
        speaker2: "Prepared Speaker 2",
        evaluator1: "Rahul",
        evaluator2: "",
        topicsMaster: "Pramod K Murthy",
        timer: "Hari",
        grammarian: "Anish"
      },
      roleLabels: {
        toastmaster: 'Toastmaster of Day',
        speaker1: 'Prepared Speaker 1',
        speaker2: 'Prepared Speaker 2',
        evaluator1: 'Speech Evaluator 1',
        topicsMaster: 'Table Topics Master',
        timer: 'Timer Role',
        grammarian: 'Grammarian'
      },
      roleTimes: {
        toastmaster: '5',
        speaker1: '7',
        speaker2: '7',
        evaluator1: '3',
        topicsMaster: '20',
        timer: '4',
        grammarian: '4'
      },
      agendaItems: DEFAULT_DEMO_AGENDA,
      agendaNotes: DEMO_AGENDA_NOTES,
      preparedBy: "Pramod K Murthy",
      approvalSignature: "Pramod K Murthy",
      approvedDate: dateStr
    },

    // Page 4: Arrangements Table and Notes
    page4: {
      rows: [
        { id: `arr-${uuidv4()}`, item: "Standard script and talking points", ready: true, owner: "Prashant", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Value one-pager / Why Toastmasters", ready: true, owner: "Ankita", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Success stories / testimonials", ready: true, owner: "Rahul", priority: "Medium", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Agenda card and role handout", ready: true, owner: "Pramod", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Timer cards / gavel / ribbons / bookmarks", ready: true, owner: "Hari", priority: "Medium", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Sign-up form and QR code", ready: true, owner: "Anish", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Membership sheet / next steps", ready: true, owner: "District Team", priority: "High", notes: "" }
      ],
      venueChecklist: {
        roomBooked: true,
        projectorTested: true,
        microphoneTested: true,
        seatingArranged: true,
        bannersPlaced: true
      },
      equipmentChecklist: {
        timerCardsReady: true,
        gavelReady: true,
        ribbonsReady: true,
        bookmarksReady: true
      },
      qrCodeUrl: "",
      scriptUrl: "",
      membershipSheetsUrl: ""
    },

    // Page 5: During Meeting Execution
    page5: {
      checklist: {
        valueOpeningUsed: true,
        noJargonUsed: true,
        timeDisciplineMaintained: true,
        guestParticipationRespectful: true
      },
      liveNotes: "Great guest enthusiasm, 12 guests expressed interest in chartering.",
      speakerTracking: [
        { id: `sp-tm`, speaker: "Prashant", role: "Toastmaster of Day", targetTime: "5 Min", time: "05:12" },
        { id: `sp-sp1`, speaker: "Ankita", role: "Prepared Speaker 1", targetTime: "7 Min", time: "06:45" },
        { id: `sp-sp2`, speaker: "Prepared Speaker 2", role: "Prepared Speaker 2", targetTime: "7 Min", time: "07:05" },
        { id: `sp-ev1`, speaker: "Rahul", role: "Speech Evaluator 1", targetTime: "3 Min", time: "03:10" },
        { id: `sp-ttm`, speaker: "Pramod K Murthy", role: "Table Topics Master", targetTime: "20 Min", time: "19:40" },
        { id: `sp-tim`, speaker: "Hari", role: "Timer Role", targetTime: "4 Min", time: "03:50" },
        { id: `sp-grm`, speaker: "Anish", role: "Grammarian", targetTime: "4 Min", time: "04:10" }
      ],
      guestsList: "Siddharth, Priya, Arjun, Vikram, Neha",
      actionItems: [
        { id: `act-${uuidv4()}`, action: "Send chartering kits to corporate sponsor", owner: "Pramod K Murthy", status: "Pending" }
      ]
    },

    // Page 6: Outcome After Meeting
    page6: {
      guestCount: 24,
      interestLevel: "High",
      decisionMakerAttended: true,
      sponsorshipStatus: "Approved",
      notes: "HR VP signed off on chartering sponsorship."
    }
  };
};

export const createCleanBooklet = (id, title = "New Meeting Booklet") => {
  const dateStr = new Date().toISOString().split('T')[0];
  const bookletId = id || `booklet-${uuidv4()}`;

  const cleanAgenda = DEFAULT_DEMO_AGENDA.map((item, idx) => ({
    ...item,
    id: `clean-agenda-${idx}-${uuidv4()}`,
    speaker: "",
    club: "",
    details: item.details || "",
    notes: ""
  }));

  return {
    id: bookletId,
    title: title,
    status: 'ongoing',
    preparedFor: "",
    districtName: "District 227",
    areaDirector: "",
    division: "Division A",
    divisionDirector: "",
    preparedDate: dateStr,
    logoUrl: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/980554ec398a6734eda8d57a69bcec72ba4e7dfe.jpg",
    description: "New Toastmasters meeting booklet.",
    createdAt: dateStr,
    updatedAt: dateStr,
    completedPercent: 0,

    page3: {
      checklist: [
        { id: `p3-c1-${uuidv4()}`, label: "Agenda finalized", desc: "Standard flow approved and ready to use.", checked: false, isCustom: false },
        { id: `p3-c2-${uuidv4()}`, label: "Role players confirmed", desc: "Toastmaster, Speaker, Evaluator, Timer confirmed.", checked: false, isCustom: false },
        { id: `p3-c3-${uuidv4()}`, label: "Dry run completed", desc: "Timing signals and speaker handoffs rehearsed.", checked: false, isCustom: false },
        { id: `p3-c4-${uuidv4()}`, label: "Escalation path known", desc: "Support contacts identified.", checked: false, isCustom: false }
      ],
      demoTitle: title,
      meetingTheme: "",
      meetingLink: "",
      wordOfDay: "",
      wordMeaning: "",
      hostOrganization: "",
      venue: "",
      date: dateStr,
      time: "11:00 AM",
      objective: "",
      roles: {
        toastmaster: "",
        speaker1: "",
        speaker2: "",
        evaluator1: "",
        evaluator2: "",
        topicsMaster: "",
        timer: "",
        grammarian: ""
      },
      roleLabels: {
        toastmaster: 'Toastmaster of Day',
        speaker1: 'Prepared Speaker 1',
        speaker2: 'Prepared Speaker 2',
        evaluator1: 'Speech Evaluator 1',
        topicsMaster: 'Table Topics Master',
        timer: 'Timer Role',
        grammarian: 'Grammarian'
      },
      roleTimes: {
        toastmaster: '5',
        speaker1: '7',
        speaker2: '7',
        evaluator1: '3',
        topicsMaster: '20',
        timer: '4',
        grammarian: '4'
      },
      agendaItems: cleanAgenda,
      agendaNotes: "",
      preparedBy: "",
      approvalSignature: "",
      approvedDate: dateStr
    },

    page4: {
      rows: [
        { id: `arr-${uuidv4()}`, item: "Standard script and talking points", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Value one-pager / Why Toastmasters", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Timer cards / gavel / ribbons / bookmarks", ready: false, owner: "", priority: "Medium", notes: "" }
      ],
      venueChecklist: { roomBooked: false, projectorTested: false, microphoneTested: false, seatingArranged: false, bannersPlaced: false },
      equipmentChecklist: { timerCardsReady: false, gavelReady: false, ribbonsReady: false, bookmarksReady: false },
      qrCodeUrl: "", scriptUrl: "", membershipSheetsUrl: ""
    },

    page5: {
      speakerTimings: [],
      roleTracker: [],
      meetingNotes: ""
    },

    page6: {
      guestSubmissions: []
    }
  };
};

export const getInitialBooklets = () => {
  return [
    createDefaultBooklet('corp-alpha-booklet', 'Corporation Alpha Meeting', 'ongoing'),
    createDefaultBooklet('corp-beta-booklet', 'Tech Solutions Corp Session', 'upcoming'),
    createDefaultBooklet('district-demo-booklet', 'District 227 Annual Meeting', 'completed')
  ];
};
