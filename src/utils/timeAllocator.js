/**
 * Time Allocation Helper Utility
 * Automatically parses meeting start times (clock time like "10:00 AM", "11 AM", "14:00" or relative time "0:00")
 * and allocates sequential start and end times to all agenda items based on their duration.
 */

export function parseStartTime(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return { mins: 600, isClock: true };
  const str = timeStr.trim();

  if (!str || str === '0:00') return { mins: 0, isClock: false };

  // Match 12-hour or 24-hour clock time e.g. "10:00 AM", "9:30 PM", "10:00", "14:30"
  const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const ampm = match12[3] ? match12[3].toUpperCase() : null;

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const isClock = Boolean(ampm) || (hours >= 1 && hours <= 23);
    return { mins: hours * 60 + minutes, isClock };
  }

  // Match simple hour with AM/PM e.g. "11 AM", "11AM", "2 PM"
  const matchSimple = str.match(/^(\d{1,2})\s*(AM|PM|am|pm)$/i);
  if (matchSimple) {
    let hours = parseInt(matchSimple[1], 10);
    const ampm = matchSimple[2].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return { mins: hours * 60, isClock: true };
  }

  // Relative format e.g. "0:00" or "1:15"
  const matchRel = str.match(/^(\d+):(\d{2})$/);
  if (matchRel) {
    const hrs = parseInt(matchRel[1], 10);
    const mins = parseInt(matchRel[2], 10);
    return { mins: hrs * 60 + mins, isClock: false };
  }

  return { mins: 600, isClock: true };
}

export function formatMinutes(totalMinutes, isClock = false) {
  if (!isClock) {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}`;
  } else {
    // 12-hour format e.g. 10:05 AM
    const totalMinsNormalized = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
    let hrs = Math.floor(totalMinsNormalized / 60);
    const mins = totalMinsNormalized % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    if (hrs === 0) hrs = 12;
    return `${hrs}:${mins < 10 ? '0' : ''}${mins} ${ampm}`;
  }
}

export function allocateAgendaTimes(items = [], startTimeStr = '10:00 AM') {
  if (!Array.isArray(items)) return [];

  const { mins: parsedMins, isClock } = parseStartTime(startTimeStr);
  let currentMin = parsedMins;

  return items.map((item) => {
    let duration = parseInt(item.duration, 10);
    if (isNaN(duration) || duration <= 0) {
      if (item.targetTime) {
        duration = parseInt(item.targetTime, 10);
      } else if (item.slot) {
        const match = item.slot.match(/\((\d+)\s*Min\)/i);
        if (match) duration = parseInt(match[1], 10);
      }
    }
    if (isNaN(duration) || duration <= 0) duration = 5;

    const startMin = currentMin;
    const endMin = currentMin + duration;
    currentMin = endMin;

    const startFormatted = formatMinutes(startMin, isClock);
    const endFormatted = formatMinutes(endMin, isClock);
    const timeRange = `${startFormatted} - ${endFormatted}`;

    return {
      ...item,
      duration,
      time: timeRange
    };
  });
}

/**
 * Scale row durations proportionally to match totalTargetMinutes exactly
 */
export function allocateProportionalTimes(items = [], totalTargetMinutes = 90, startTimeStr = '10:00 AM') {
  if (!Array.isArray(items) || items.length === 0) return [];
  const target = Math.max(15, parseInt(totalTargetMinutes, 10) || 90);

  const currentTotal = items.reduce((acc, it) => acc + (parseInt(it.duration, 10) || 5), 0);
  if (currentTotal <= 0) return allocateAgendaTimes(items, startTimeStr);

  const factor = target / currentTotal;

  let allocatedSum = 0;
  const scaledItems = items.map((it, idx) => {
    let rawDur = (parseInt(it.duration, 10) || 5) * factor;
    let roundedDur = Math.max(1, Math.round(rawDur));
    allocatedSum += roundedDur;
    return { ...it, duration: roundedDur };
  });

  // Adjust last item to ensure exact match with target
  const diff = target - allocatedSum;
  if (diff !== 0 && scaledItems.length > 0) {
    const lastIdx = scaledItems.length - 1;
    scaledItems[lastIdx].duration = Math.max(1, scaledItems[lastIdx].duration + diff);
  }

  return allocateAgendaTimes(scaledItems, startTimeStr);
}
