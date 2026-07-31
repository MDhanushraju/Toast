import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_DEMO_AGENDA, DEMO_AGENDA_NOTES } from '../constants/index.js';
import { allocateAgendaTimes } from '../utils/timeAllocator.js';

export const createDefaultBooklet = (id, title = "Meeting Booklet", status = "ongoing") => {
  const dateStr = new Date().toISOString().split('T')[0];
  const bookletId = id || `booklet-${uuidv4()}`;
  const startTime = "10:00 AM";
  const allocatedAgenda = allocateAgendaTimes(DEFAULT_DEMO_AGENDA, startTime);

  return {
    id: bookletId,
    title: title,
    status: status, // 'ongoing' | 'upcoming' | 'completed'
    preparedFor: "District 227 Leadership Team",
    districtName: "District 227",
    preparedDate: dateStr,
    logoUrl: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/980554ec398a6734eda8d57a69bcec72ba4e7dfe.jpg",
    description: "Toastmasters-style working booklet. This booklet is meant to be used as a practical guide, a printout, and a member-filled working record.",
    createdAt: dateStr,
    updatedAt: dateStr,
    completedPercent: status === 'completed' ? 100 : (status === 'ongoing' ? 50 : 0),

    // Page 3: Before Meeting (Clean & Ready for Input)
    page3: {
      checklist: [
        { id: "p3-c1", label: "Agenda finalized", desc: "Standard flow approved and ready to use.", checked: false, isCustom: false },
        { id: "p3-c2", label: "Role players confirmed", desc: "Toastmaster, Speaker, Evaluator, Timer confirmed.", checked: false, isCustom: false },
        { id: "p3-c3", label: "Dry run completed", desc: "Timing signals and speaker handoffs rehearsed.", checked: false, isCustom: false },
        { id: "p3-c4", label: "Escalation path known", desc: "Support contacts identified.", checked: false, isCustom: false }
      ],
      demoTitle: title,
      meetingTheme: "",
      meetingLink: "",
      wordOfDay: "",
      wordMeaning: "",
      hostOrganization: "",
      venue: "",
      date: dateStr,
      time: startTime,
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
      agendaItems: allocatedAgenda,
      agendaNotes: DEMO_AGENDA_NOTES,
      preparedBy: "",
      approvalSignature: "",
      approvedDate: dateStr
    },

    // Page 4: Arrangements Table and Notes
    page4: {
      rows: [
        { id: `arr-${uuidv4()}`, item: "Standard script and talking points", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Value one-pager / Why Toastmasters", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Timer cards / gavel / ribbons / bookmarks", ready: false, owner: "", priority: "Medium", notes: "" }
      ],
      venueChecklist: {
        roomBooked: false,
        projectorTested: false,
        microphoneTested: false,
        seatingArranged: false,
        bannersPlaced: false
      },
      equipmentChecklist: {
        timerCardsReady: false,
        gavelReady: false,
        ribbonsReady: false,
        bookmarksReady: false
      },
      qrCodeUrl: "",
      scriptUrl: "",
      membershipSheetsUrl: ""
    },

    // Page 5: During Meeting Execution
    page5: {
      checklist: {
        valueOpeningUsed: false,
        noJargonUsed: false,
        timeDisciplineMaintained: false,
        guestParticipationRespectful: false
      },
      liveNotes: "",
      speakerTracking: [],
      guestsList: "",
      actionItems: []
    },

    // Page 6: Outcome After Meeting
    page6: {
      guestCount: 0,
      interestLevel: "",
      decisionMakerAttended: false,
      sponsorshipStatus: "",
      notes: ""
    }
  };
};

export const createCleanBooklet = (id, title = "Meeting Booklet", initialData = {}) => {
  const dateStr = initialData.date || new Date().toISOString().split('T')[0];
  const bookletId = id || `booklet-${uuidv4()}`;
  const meetingStartTime = initialData.time || "11:00 AM";

  const rawAgenda = DEFAULT_DEMO_AGENDA.map((item, idx) => ({
    ...item,
    id: `clean-agenda-${idx}-${uuidv4()}`,
    speaker: "",
    club: "",
    details: item.details || "",
    notes: ""
  }));

  const cleanAgenda = allocateAgendaTimes(rawAgenda, meetingStartTime);

  return {
    id: bookletId,
    title: title,
    createdBy: initialData.createdBy || 'admin',
    status: 'ongoing',
    preparedFor: initialData.preparedBy || "",
    districtName: initialData.district || "District 227",
    areaDirector: initialData.areaDirector || "",
    division: initialData.division || "Division A",
    divisionDirector: initialData.divisionDirector || "",
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
      meetingTheme: initialData.meetingTheme || "",
      meetingLink: "",
      wordOfDay: "",
      wordMeaning: "",
      hostOrganization: initialData.hostOrganization || "",
      venue: initialData.venue || "",
      date: dateStr,
      time: meetingStartTime,
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
  return [];
};
