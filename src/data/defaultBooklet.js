import { v4 as uuidv4 } from 'uuid';

export const createDefaultBooklet = (id, title = "Demo Meeting Booklet") => {
  const dateStr = new Date().toISOString().split('T')[0];
  const bookletId = id || `booklet-${uuidv4()}`;
  
  return {
    id: bookletId,
    title: title,
    preparedFor: "Pramod K Murthy, Prashant, and the extended team",
    districtName: "District 228",
    preparedDate: dateStr,
    logoUrl: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/980554ec398a6734eda8d57a69bcec72ba4e7dfe.jpg",
    description: "Toastmasters-style working booklet. This booklet is meant to be used as a practical guide, a printout, and a member-filled working record.",
    createdAt: dateStr,
    updatedAt: dateStr,
    completedPercent: 0,
    
    // Page 3: Before Demo Meeting
    page3: {
      checklist: [
        { id: "p3-c1", label: "Agenda finalized", desc: "Standard flow approved and ready to use.", checked: false, isCustom: false },
        { id: "p3-c2", label: "Role players confirmed", desc: "Toastmaster, Speaker, Evaluator, Timer confirmed.", checked: false, isCustom: false },
        { id: "p3-c3", label: "Dry run completed", desc: "Timing signals and speaker handoffs rehearsed.", checked: false, isCustom: false },
        { id: "p3-c4", label: "Escalation path known", desc: "Support contacts identified.", checked: false, isCustom: false }
      ],
      demoTitle: title,
      hostOrganization: "",
      venue: "",
      date: dateStr,
      time: "10:00 AM",
      objective: "To demonstrate Toastmasters value to the host organization and pave the way for chartering a new club.",
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
      preparedBy: "",
      approvalSignature: "",
      approvedDate: dateStr
    },

    // Page 4: Arrangements Table and Notes
    page4: {
      rows: [
        { id: `arr-${uuidv4()}`, item: "Standard script and talking points", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Value one-pager / Why Toastmasters", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Success stories / testimonials", ready: false, owner: "", priority: "Medium", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Agenda card and role handout", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Timer cards / gavel / ribbons / bookmarks", ready: false, owner: "", priority: "Medium", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Sign-up form and QR code", ready: false, owner: "", priority: "High", notes: "" },
        { id: `arr-${uuidv4()}`, item: "Membership sheet / next steps", ready: false, owner: "", priority: "High", notes: "" }
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
      speakerTracking: [
        { id: `sp-${uuidv4()}`, speaker: "", role: "Toastmaster", time: "" },
        { id: `sp-${uuidv4()}`, speaker: "", role: "Speaker 1", time: "" },
        { id: `sp-${uuidv4()}`, speaker: "", role: "Evaluator 1", time: "" },
        { id: `sp-${uuidv4()}`, speaker: "", role: "Table Topics Master", time: "" }
      ],
      guestsList: "",
      actionItems: [
        { id: `act-${uuidv4()}`, action: "Send chartering kits to coordinator", owner: "", status: "Pending" }
      ]
    },

    // Page 6: Outcome After Meeting
    page6: {
      guestCount: 0,
      interestedGuests: 0,
      membersJoined: 0,
      overallRating: 5,
      strengths: "",
      weaknesses: "",
      improvements: "",
      followUpAction: "",
      comments: ""
    },

    // Page 7: Demo Tracker Sheet
    page7: {
      rows: [
        { id: `track-${uuidv4()}`, date: dateStr, host: "", location: "", coordinator: "", attendance: 0, outcome: "", remarks: "", status: "Pending" }
      ],
      monthlyNotes: "",
      supportNotes: ""
    }
  };
};

export const getInitialBooklets = () => {
  return [
    {
      id: "corp-alpha-booklet",
      title: "Corporation Alpha Demo Meeting",
      preparedFor: "Pramod K Murthy, Prashant, and District 228 Team",
      districtName: "District 228",
      preparedDate: "2026-07-01",
      logoUrl: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/980554ec398a6734eda8d57a69bcec72ba4e7dfe.jpg",
      description: "Demo Meeting Guide and tracker for Corporation Alpha HR Team.",
      createdAt: "2026-07-01",
      updatedAt: "2026-07-10",
      completedPercent: 70,
      page3: {
        checklist: [
          { id: "p3-c1", label: "Agenda finalized", desc: "Standard flow approved and ready to use.", checked: true, isCustom: false },
          { id: "p3-c2", label: "Role players confirmed", desc: "Toastmaster, Speaker, Evaluator, Timer confirmed.", checked: true, isCustom: false },
          { id: "p3-c3", label: "Dry run completed", desc: "Timing signals and speaker handoffs rehearsed.", checked: true, isCustom: false },
          { id: "p3-c4", label: "Escalation path known", desc: "Support contacts identified.", checked: false, isCustom: false }
        ],
        demoTitle: "Corporation Alpha Demo Meeting",
        hostOrganization: "Corporation Alpha Inc.",
        venue: "Meeting Room A (HQ)",
        date: "2026-07-10",
        time: "11:00 AM",
        objective: "Establish communication benefits for engineering division.",
        roles: {
          toastmaster: "Prashant",
          speaker1: "Ankita",
          speaker2: "",
          evaluator1: "Rahul",
          evaluator2: "",
          topicsMaster: "Pramod",
          timer: "Hari",
          grammarian: "Anish"
        },
        preparedBy: "Pramod K Murthy",
        approvalSignature: "Approved by VP HR",
        approvedDate: "2026-07-09"
      },
      page4: {
        rows: [
          { id: "arr-default-1", item: "Standard script and talking points", ready: true, owner: "Prashant", priority: "High", notes: "Modified for Corp Alpha" },
          { id: "arr-default-2", item: "Value one-pager / Why Toastmasters", ready: true, owner: "Pramod", priority: "High", notes: "Printed 30 copies" },
          { id: "arr-default-3", item: "Success stories / testimonials", ready: true, owner: "Prashant", priority: "Medium", notes: "Shared PDF before session" },
          { id: "arr-default-4", item: "Agenda card and role handout", ready: true, owner: "Pramod", priority: "High", notes: "Completed" },
          { id: "arr-default-5", item: "Timer cards / gavel / ribbons / bookmarks", ready: false, owner: "Hari", priority: "Medium", notes: "Need ribbons" },
          { id: "arr-default-6", item: "Sign-up form and QR code", ready: true, owner: "Anish", priority: "High", notes: "QR Code set up" },
          { id: "arr-default-7", item: "Membership sheet / next steps", ready: false, owner: "Prashant", priority: "High", notes: "Printing pending" }
        ],
        venueChecklist: {
          roomBooked: true,
          projectorTested: true,
          microphoneTested: true,
          seatingArranged: false,
          bannersPlaced: false
        },
        equipmentChecklist: {
          timerCardsReady: true,
          gavelReady: false,
          ribbonsReady: false,
          bookmarksReady: true
        },
        qrCodeUrl: "",
        scriptUrl: "",
        membershipSheetsUrl: ""
      },
      page5: {
        checklist: {
          valueOpeningUsed: true,
          noJargonUsed: true,
          timeDisciplineMaintained: true,
          guestParticipationRespectful: false
        },
        liveNotes: "Meeting started on time. 25 guests present. Speaker was fantastic. Several questions about pathways program.",
        speakerTracking: [
          { id: "sp-d-1", speaker: "Prashant", role: "Toastmaster", time: "15:00" },
          { id: "sp-d-2", speaker: "Ankita", role: "Speaker 1", time: "07:12" },
          { id: "sp-d-3", speaker: "Rahul", role: "Evaluator 1", time: "03:05" },
          { id: "sp-d-4", speaker: "Pramod", role: "Table Topics Master", time: "12:00" }
        ],
        guestsList: "Anil, Suresh, Veena, Deepa, Mohan, Karthik, Sunita",
        actionItems: [
          { id: "act-d-1", action: "Send corporate fee structure", owner: "Pramod", status: "In Progress" },
          { id: "act-d-2", action: "Share meeting recordings", owner: "Prashant", status: "Pending" }
        ]
      },
      page6: {
        guestCount: 25,
        interestedGuests: 12,
        membersJoined: 0,
        overallRating: 8,
        strengths: "Great speakers and interactive table topics.",
        weaknesses: "Timer description was slightly too long.",
        improvements: "Shorten role descriptions during first 5 mins.",
        followUpAction: "Arrange secondary session with HR Director.",
        comments: "HR manager loved the session and asked for a budget proposal."
      },
      page7: {
        rows: [
          { id: "track-d-1", date: "2026-07-10", host: "Corporation Alpha", location: "HQ Auditorium A", coordinator: "Prashant", attendance: 25, outcome: "Interested", remarks: "Send follow-up details", status: "Completed" }
        ],
        monthlyNotes: "Active lead. Keep engaging corporate team.",
        supportNotes: "Requested pricing approval."
      }
    }
  ];
};
