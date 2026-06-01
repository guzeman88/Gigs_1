/**
 * Parse a date string "YYYY-MM-DD" into a local Date object (no timezone shift).
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format a Date to "YYYY-MM-DD".
 */
export function toDateString(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns true if dateA and dateB represent the same calendar day.
 */
export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/**
 * Return today as a Date normalized to midnight.
 */
export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get all events that overlap a given date.
 */
export function eventsForDate(events, date) {
  return events.filter((ev) => {
    const start = parseLocalDate(ev.startDate);
    const end = parseLocalDate(ev.endDate || ev.startDate);
    if (!start) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Main range
    if (d >= start && d <= end) return true;

    // Audition finals date
    if (ev.type === 'audition' && ev.finalsDate) {
      const finals = parseLocalDate(ev.finalsDate);
      if (finals) {
        finals.setHours(0, 0, 0, 0);
        if (isSameDay(d, finals)) return true;
      }
    }

    return false;
  });
}

/**
 * Format a date string "YYYY-MM-DD" to a human-readable "MMM D, YYYY".
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Get the number of days in a given month (0-based month).
 */
export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
