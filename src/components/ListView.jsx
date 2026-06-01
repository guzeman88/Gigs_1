import React, { useState, useMemo } from 'react';
import EventModal from './EventModal';
import { formatDisplayDate } from '../utils/dateUtils';

const TYPE_LABELS = { gig: '🎵 Gig', vacation: '🏖️ Vacation', audition: '🎭 Audition' };
const TYPE_BADGE = {
  gig: 'bg-green-100 text-green-800',
  vacation: 'bg-blue-100 text-blue-800',
  audition: 'bg-yellow-100 text-yellow-800',
};

const SORT_OPTIONS = [
  { value: 'startDate', label: 'Date' },
  { value: 'groupName', label: 'Name' },
  { value: 'type', label: 'Type' },
];

function ConfirmDelete({ event, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Entry?</h3>
        <p className="text-sm text-slate-500 mb-5">
          "{event.groupName}" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EventRow({ event, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const hasExtras = event.payment || event.repertoire || event.notes || event.finalsDate;

  return (
    <>
      <tr
        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
        style={{ borderLeft: `4px solid ${event.color || '#94a3b8'}` }}
        onClick={() => hasExtras && setExpanded((v) => !v)}
      >
        {/* Color swatch + type */}
        <td className="py-2.5 pl-3 pr-2 whitespace-nowrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[event.type]}`}
          >
            {TYPE_LABELS[event.type]}
          </span>
        </td>

        {/* Name */}
        <td className="py-2.5 px-2 text-sm font-medium text-slate-800 min-w-[120px]">
          {event.groupName}
        </td>

        {/* Dates */}
        <td className="py-2.5 px-2 text-xs text-slate-500 whitespace-nowrap hidden sm:table-cell">
          {event.startDate === event.endDate || !event.endDate
            ? formatDisplayDate(event.startDate)
            : `${formatDisplayDate(event.startDate)} – ${formatDisplayDate(event.endDate)}`}
        </td>

        {/* Payment */}
        <td className="py-2.5 px-2 text-xs text-slate-600 hidden md:table-cell">
          {event.payment || <span className="text-slate-300">—</span>}
        </td>

        {/* Actions */}
        <td className="py-2.5 pr-3 pl-2 whitespace-nowrap text-right">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(event); }}
            className="text-blue-500 hover:text-blue-700 text-xs font-medium mr-3"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(event); }}
            className="text-red-400 hover:text-red-600 text-xs font-medium"
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Mobile date row */}
      <tr className="sm:hidden border-b border-slate-100">
        <td colSpan={5} className="pb-2 pl-3 text-xs text-slate-400">
          {event.startDate === event.endDate || !event.endDate
            ? formatDisplayDate(event.startDate)
            : `${formatDisplayDate(event.startDate)} – ${formatDisplayDate(event.endDate)}`}
          {event.payment ? ` · ${event.payment}` : ''}
        </td>
      </tr>

      {/* Expanded details */}
      {expanded && hasExtras && (
        <tr className="bg-slate-50 border-b border-slate-200">
          <td colSpan={5} className="px-4 pb-3 pt-1">
            <div className="space-y-1 text-xs text-slate-600">
              {event.repertoire && (
                <div><span className="font-semibold text-slate-500">Repertoire: </span>{event.repertoire}</div>
              )}
              {event.finalsDate && (
                <div><span className="font-semibold text-slate-500">Finals: </span>{formatDisplayDate(event.finalsDate)}</div>
              )}
              {event.notes && (
                <div><span className="font-semibold text-slate-500">Notes: </span>{event.notes}</div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ListView({ events, addEvent, updateEvent, deleteEvent }) {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return events
      .filter((ev) => {
        if (filter !== 'all' && ev.type !== filter) return false;
        if (search) {
          const s = search.toLowerCase();
          return (
            ev.groupName.toLowerCase().includes(s) ||
            ev.repertoire?.toLowerCase().includes(s) ||
            ev.notes?.toLowerCase().includes(s)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'startDate') return (a.startDate || '').localeCompare(b.startDate || '');
        if (sortBy === 'groupName') return a.groupName.localeCompare(b.groupName);
        if (sortBy === 'type') return a.type.localeCompare(b.type);
        return 0;
      });
  }, [events, filter, sortBy, search]);

  function handleSave(formData) {
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }
    setShowModal(false);
    setEditingEvent(null);
  }

  function handleEdit(ev) {
    setEditingEvent(ev);
    setShowModal(true);
  }

  function handleDeleteConfirm() {
    if (deletingEvent) {
      deleteEvent(deletingEvent.id);
      setDeletingEvent(null);
    }
  }

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-safe">
        <div className="flex items-center justify-between py-3">
          <h1 className="text-xl font-bold text-slate-800">My Schedule</h1>
          <button
            onClick={() => { setEditingEvent(null); setShowModal(true); }}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <span className="text-lg leading-none">+</span> Add
          </button>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Filter + Sort */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['all', 'gig', 'vacation', 'audition'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {f === 'all' ? 'All' : TYPE_LABELS[f]}
            </button>
          ))}
          <div className="ml-auto shrink-0 flex items-center gap-1">
            <span className="text-xs text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">No entries yet</p>
            <p className="text-xs mt-1">Tap + Add to create your first entry</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2 pl-3 pr-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                <th className="py-2 px-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="py-2 px-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Date(s)</th>
                <th className="py-2 px-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Payment</th>
                <th className="py-2 pr-3 pl-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <EventRow
                  key={ev.id}
                  event={ev}
                  onEdit={handleEdit}
                  onDelete={setDeletingEvent}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats bar */}
      {events.length > 0 && (
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex gap-4 text-xs text-slate-500 overflow-x-auto">
          <span>{events.filter((e) => e.type === 'gig').length} Gigs</span>
          <span>{events.filter((e) => e.type === 'vacation').length} Vacations</span>
          <span>{events.filter((e) => e.type === 'audition').length} Auditions</span>
          <span className="ml-auto font-medium text-slate-600">
            {events.filter((e) => e.type === 'gig' && e.payment).reduce((sum, e) => {
              const n = parseFloat(e.payment.replace(/[^0-9.]/g, ''));
              return isNaN(n) ? sum : sum + n;
            }, 0) > 0
              ? `Total: $${events.filter((e) => e.type === 'gig' && e.payment).reduce((sum, e) => {
                  const n = parseFloat(e.payment.replace(/[^0-9.]/g, ''));
                  return isNaN(n) ? sum : sum + n;
                }, 0).toLocaleString()}`
              : ''}
          </span>
        </div>
      )}

      {showModal && (
        <EventModal
          event={editingEvent}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
        />
      )}

      {deletingEvent && (
        <ConfirmDelete
          event={deletingEvent}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingEvent(null)}
        />
      )}
    </div>
  );
}
