import React, { useState, useMemo } from 'react';
import { eventsForDate, daysInMonth, today, isSameDay, parseLocalDate } from '../utils/dateUtils';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TYPE_ORDER = { gig: 0, vacation: 1, audition: 2 };

// Priority sort: Gig > Vacation > Audition
function sortByPriority(a, b) {
  return (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9);
}

function DayCell({ date, events, todayDate, onClick }) {
  const cellEvents = useMemo(() => eventsForDate(events, date), [events, date]);
  const sorted = [...cellEvents].sort(sortByPriority);
  const primary = sorted[0];

  const isPast = date < todayDate;
  const isToday = isSameDay(date, todayDate);
  const hasEvent = primary != null;

  const bgColor = hasEvent ? primary.color : (isPast ? '#f1f5f9' : null);

  const textColor = (() => {
    if (isToday) return '#dc2626'; // red
    if (isPast) return '#94a3b8'; // slate-400
    return '#1e293b'; // slate-800
  })();

  return (
    <div
      onClick={() => cellEvents.length > 0 && onClick(date, cellEvents)}
      style={{
        backgroundColor: bgColor || 'transparent',
        color: textColor,
        borderWidth: isToday ? 2 : 0,
        borderColor: isToday ? '#dc2626' : 'transparent',
        borderStyle: 'solid',
      }}
      className={`
        relative flex flex-col items-start justify-start p-1 rounded-md min-h-[52px] text-left
        ${cellEvents.length > 0 ? 'cursor-pointer hover:brightness-95 transition-all' : ''}
      `}
    >
      {/* Day number */}
      <span className="text-[11px] font-semibold leading-tight">
        {date.getDate()}
      </span>

      {/* Event dots / label */}
      {sorted.map((ev, i) => (
        <span
          key={ev.id + String(i)}
          className="block text-[9px] leading-tight mt-0.5 truncate w-full"
          style={{
            color: i === 0 ? textColor : (ev.type === 'vacation' ? '#1d4ed8' : ev.type === 'audition' ? '#b45309' : textColor),
            fontWeight: i === 0 ? 600 : 400,
          }}
        >
          {i === 0
            ? ev.groupName.length > 10 ? ev.groupName.slice(0, 9) + '…' : ev.groupName
            : `+${ev.groupName.slice(0, 6)}…`}
        </span>
      ))}
    </div>
  );
}

function MonthGrid({ year, month, events, todayDate, onDayClick }) {
  const numDays = daysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun

  const cells = [];
  // Empty cells before the 1st
  for (let i = 0; i < firstDow; i++) {
    cells.push(<div key={`e-${i}`} />);
  }
  for (let d = 1; d <= numDays; d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    cells.push(
      <DayCell
        key={d}
        date={date}
        events={events}
        todayDate={todayDate}
        onClick={onDayClick}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 text-white text-center text-sm font-semibold py-2">
        {MONTH_NAMES[month]}
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-100 px-1 pt-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-slate-400 pb-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 p-1 bg-white">
        {cells}
      </div>
    </div>
  );
}

function DayDetailSheet({ date, events, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[70dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h3 className="font-semibold text-slate-800">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="p-4 space-y-3">
          {events.sort(sortByPriority).map((ev) => (
            <div
              key={ev.id}
              className="rounded-xl p-3 border border-slate-200"
              style={{ backgroundColor: ev.color || '#f8fafc' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm text-slate-800">{ev.groupName}</div>
                  <div className="text-xs text-slate-500 capitalize mt-0.5">{ev.type}</div>
                </div>
              </div>
              {ev.repertoire && (
                <div className="mt-2 text-xs text-slate-600">
                  <span className="font-medium">Repertoire: </span>{ev.repertoire}
                </div>
              )}
              {ev.payment && (
                <div className="mt-1 text-xs text-slate-600">
                  <span className="font-medium">Payment: </span>{ev.payment}
                </div>
              )}
              {ev.finalsDate && (
                <div className="mt-1 text-xs text-slate-600">
                  <span className="font-medium">Finals: </span>{ev.finalsDate}
                </div>
              )}
              {ev.notes && (
                <div className="mt-1 text-xs text-slate-600">
                  <span className="font-medium">Notes: </span>{ev.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Year-at-a-glance strip (like the original script's calendar sheet)
function YearStrip({ year, events, todayDate, onDayClick }) {
  return (
    <div className="space-y-4">
      {MONTH_NAMES.map((_, monthIdx) => (
        <MonthGrid
          key={monthIdx}
          year={year}
          month={monthIdx}
          events={events}
          todayDate={todayDate}
          onDayClick={onDayClick}
        />
      ))}
    </div>
  );
}

export default function CalendarView({ events }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const todayDate = useMemo(() => today(), []);

  function handleDayClick(date, dayEvents) {
    setSelectedDay(date);
    setSelectedDayEvents(dayEvents);
  }

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-safe sticky top-0 z-10">
        <div className="flex items-center justify-between py-3">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            ‹
          </button>
          <h1 className="text-xl font-bold text-slate-800">{year}</h1>
          <button
            onClick={() => setYear((y) => y + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-3 pb-3 overflow-x-auto scrollbar-none text-xs items-center">
          <LegendDot color="#93c47d" label="Gig" />
          <LegendDot color="#c9daf8" label="Vacation" />
          <LegendDot color="#fff2cc" label="Audition" border />
          <LegendDot color="#f1f5f9" label="Past" />
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-4 h-4 rounded border-2 border-red-600" />
            <span className="text-slate-500">Today</span>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <YearStrip
          year={year}
          events={events}
          todayDate={todayDate}
          onDayClick={handleDayClick}
        />
      </div>

      {selectedDay && (
        <DayDetailSheet
          date={selectedDay}
          events={selectedDayEvents}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

function LegendDot({ color, label, border }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <div
        className="w-4 h-4 rounded"
        style={{ backgroundColor: color, border: border ? '1px solid #d1d5db' : 'none' }}
      />
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
