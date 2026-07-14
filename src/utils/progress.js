export function calculateBookletProgress(booklet) {
  if (!booklet) return 0;

  let totalPoints = 0;
  let earnedPoints = 0;

  // PAGE 1: COVER (Weight: 10% - 5 fields)
  const coverFields = [booklet.title, booklet.preparedFor, booklet.districtName, booklet.preparedDate, booklet.description];
  coverFields.forEach(f => {
    totalPoints += 1;
    if (f && String(f).trim() !== '') earnedPoints += 1;
  });

  // PAGE 3: BEFORE DEMO (Weight: 20%)
  const p3 = booklet.page3 || {};
  const p3Checks = p3.checklist || [];
  const p3Fields = [p3.demoTitle, p3.hostOrganization, p3.venue, p3.date, p3.time];
  const p3Roles = p3.roles || {};
  const p3Approvals = [p3.preparedBy, p3.approvalSignature, p3.approvedDate];

  // Checklist (array of items)
  if (Array.isArray(p3Checks)) {
    p3Checks.forEach(c => {
      totalPoints += 1;
      if (c.checked) earnedPoints += 1;
    });
  } else {
    Object.values(p3Checks).forEach(val => {
      totalPoints += 1;
      if (val) earnedPoints += 1;
    });
  }

  // Metadata Fields (5 fields)
  p3Fields.forEach(f => {
    totalPoints += 1;
    if (f && String(f).trim() !== '') earnedPoints += 1;
  });

  // Roles assignments (8 roles)
  Object.values(p3Roles).forEach(r => {
    totalPoints += 0.5; // smaller weight
    if (r && String(r).trim() !== '') earnedPoints += 0.5;
  });

  // Approvals (3 fields)
  p3Approvals.forEach(f => {
    totalPoints += 1;
    if (f && String(f).trim() !== '') earnedPoints += 1;
  });

  // PAGE 4: ARRANGEMENTS (Weight: 20%)
  const p4 = booklet.page4 || {};
  const p4Rows = p4.rows || [];
  const p4VenueCheck = p4.venueChecklist || {};
  const p4EquipCheck = p4.equipmentChecklist || {};

  // Table rows
  p4Rows.forEach(row => {
    totalPoints += 2; // ready (1), owner (1)
    if (row.ready) earnedPoints += 1;
    if (row.owner && row.owner.trim() !== '') earnedPoints += 1;
  });

  // Venue checklist (5 checks)
  Object.values(p4VenueCheck).forEach(val => {
    totalPoints += 0.5;
    if (val) earnedPoints += 0.5;
  });

  // Equipment checklist (4 checks)
  Object.values(p4EquipCheck).forEach(val => {
    totalPoints += 0.5;
    if (val) earnedPoints += 0.5;
  });

  // PAGE 5: EXECUTION (Weight: 20%)
  const p5 = booklet.page5 || {};
  const p5Checks = p5.checklist || {};
  const p5Notes = p5.liveNotes;
  const p5Speakers = p5.speakerTracking || [];
  const p5Actions = p5.actionItems || [];

  // Execution Checks (4 checks)
  Object.values(p5Checks).forEach(val => {
    totalPoints += 1;
    if (val) earnedPoints += 1;
  });

  // Notes (1 pt)
  totalPoints += 1;
  if (p5Notes && p5Notes.trim() !== '') earnedPoints += 1;

  // Speakers (each role filled)
  p5Speakers.forEach(sp => {
    totalPoints += 1; // speaker name
    if (sp.speaker && sp.speaker.trim() !== '') earnedPoints += 1;
  });

  // Action items (each owner assigned)
  p5Actions.forEach(act => {
    totalPoints += 1;
    if (act.owner && act.owner.trim() !== '') earnedPoints += 1;
  });

  // PAGE 6: OUTCOMES (Weight: 20%)
  const p6 = booklet.page6 || {};
  const p6Fields = [p6.guestCount, p6.interestedGuests, p6.membersJoined];
  const p6Areas = [p6.strengths, p6.weaknesses, p6.improvements, p6.followUpAction, p6.comments];

  totalPoints += 3;
  p6Fields.forEach(f => {
    if (f !== undefined && f !== null && f !== 0) earnedPoints += 1;
  });

  totalPoints += 5;
  p6Areas.forEach(a => {
    if (a && a.trim() !== '') earnedPoints += 1;
  });

  // PAGE 7: TRACKER (Weight: 10%)
  const p7 = booklet.page7 || {};
  const p7Rows = p7.rows || [];
  p7Rows.forEach(r => {
    totalPoints += 3; // host, date, outcome
    if (r.host && r.host.trim() !== '') earnedPoints += 1;
    if (r.date && r.date.trim() !== '') earnedPoints += 1;
    if (r.outcome && r.outcome.trim() !== '') earnedPoints += 1;
  });

  if (totalPoints === 0) return 0;
  return Math.min(100, Math.round((earnedPoints / totalPoints) * 100));
}
export default calculateBookletProgress;
