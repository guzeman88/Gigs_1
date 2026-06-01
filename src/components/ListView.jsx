import React, { useState, useMemo } from 'react';
import EventModal from './EventModal';

const TYPE = {
  gig:      { label: 'Gig',      color: '#1a7f4b' },
  vacation: { label: 'Vacation', color: '#2060c8' },
  audition: { label: 'Audition', color: '#c07900' },
};

function fmtDate(s, e) {
  if (!s) return '';
  const a = new Date(s + 'T12:00:00');
  const opts = { month: 'short', day: 'numeric' };
  if (!e || e === s) return a.toLocaleDateString('en-US', opts);
  const b = new Date(e + 'T12:00:00');
  if (a.getMonth() === b.getMonth())
    return a.toLocaleDateString('en-US', opts) + '–' + b.getDate();
  return a.toLocaleDateString('en-US', opts) + ' – ' + b.toLocaleDateString('en-US', opts);
}

function EventRow({ event, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const t = TYPE[event.type] || TYPE.gig;
  const hasExtra = !!(event.repertoire || event.notes || event.finalsDate);

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
      <div onClick={() => setOpen(v => !v)}
        style={{ display: 'flex', alignItems: 'center', padding: '13px 0', cursor: 'pointer', gap: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111', lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.groupName}
          </div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 1 }}>
            {t.label}{event.payment ? ' · ' + event.payment : ''}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#bbb', fontWeight: 500, flexShrink: 0 }}>
          {fmtDate(event.startDate, event.endDate)}
        </div>
      </div>

      {open && (
        <div style={{ paddingLeft: 18, paddingBottom: 16 }}>
          {event.repertoire && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#ccc', letterSpacing: '0.1em', marginBottom: 2 }}>REPERTOIRE</div>
              <div style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>{event.repertoire}</div>
            </div>
          )}
          {event.finalsDate && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#ccc', letterSpacing: '0.1em', marginBottom: 2 }}>FINALS DATE</div>
              <div style={{ fontSize: 13, color: '#c07900', fontWeight: 600 }}>
                {new Date(event.finalsDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          )}
          {event.notes && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#ccc', letterSpacing: '0.1em', marginBottom: 2 }}>NOTES</div>
              <div style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>{event.notes}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={e => { e.stopPropagation(); onEdit(event); }}
              style={{ padding: '7px 18px', borderRadius: 8, border: '1px solid #e0e0e0',
                background: 'white', color: '#111', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
            <button onClick={e => { e.stopPropagation(); onDelete(event); }}
              style={{ padding: '7px 18px', borderRadius: 8, border: '1px solid #fee2e2',
                background: '#fff5f5', color: '#dc2626', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmDelete({ event, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: 24,
        animation: 'overlayIn 0.15s ease' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 18, padding: '28px 24px', maxWidth: 320, width: '100%',
          animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 8px', textAlign: 'center' }}>
          Delete entry?
        </h3>
        <p style={{ fontSize: 14, color: '#888', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
          {'“'}{event.groupName}{'”'} will be permanently removed.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: '1px solid #e0e0e0',
              background: 'white', color: '#111', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
              background: '#111', color: 'white', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { v: 'all',      l: 'All' },
  { v: 'gig',      l: 'Gigs' },
  { v: 'vacation', l: 'Vacations' },
  { v: 'audition', l: 'Auditions' },
];

export default function ListView({ events, addEvent, updateEvent, deleteEvent }) {
  const [showModal,    setShowModal]    = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent,setDeletingEvent]= useState(null);
  const [filter,       setFilter]       = useState('all');

  const grouped = useMemo(() => {
    const sorted = [...events]
      .filter(ev => filter === 'all' || ev.type === filter)
      .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

    const groups = [];
    let lastKey = null;
    sorted.forEach(ev => {
      const key = ev.startDate
        ? new Date(ev.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Undated';
      if (key !== lastKey) { groups.push({ key, items: [] }); lastKey = key; }
      groups[groups.length - 1].items.push(ev);
    });
    return groups;
  }, [events, filter]);

  function handleSave(fd) {
    if (editingEvent) updateEvent(editingEvent.id, fd);
    else addEvent(fd);
    setShowModal(false);
    setEditingEvent(null);
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'white' }} className="pb-nav">

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, background: 'white',
        borderBottom: '1px solid #ebebeb',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
        paddingBottom: 0,
        paddingLeft: 20, paddingRight: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>Gigs</h1>
          <button onClick={() => { setEditingEvent(null); setShowModal(true); }}
            style={{ width: 30, height: 30, borderRadius: 15, border: 'none', background: '#111',
              color: 'white', fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex' }}>
          {FILTERS.map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              style={{ flex: 1, padding: '8px 0', border: 'none', background: 'none',
                borderBottom: '2px solid ' + (filter === f.v ? '#111' : 'transparent'),
                color: filter === f.v ? '#111' : '#bbb',
                fontSize: 12, fontWeight: filter === f.v ? 700 : 500,
                letterSpacing: '0.04em', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s' }}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '0 20px' }}>
        {grouped.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#ccc', marginBottom: 20, letterSpacing: '0.04em' }}>No entries yet</div>
            <button onClick={() => { setEditingEvent(null); setShowModal(true); }}
              style={{ padding: '11px 28px', borderRadius: 99, border: 'none', background: '#111',
                color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Add Entry
            </button>
          </div>
        ) : (
          grouped.map(g => (
            <div key={g.key}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ccc', letterSpacing: '0.1em',
                textTransform: 'uppercase', paddingTop: 24, paddingBottom: 8 }}>{g.key}</div>
              {g.items.map(ev => (
                <EventRow key={ev.id} event={ev}
                  onEdit={ev => { setEditingEvent(ev); setShowModal(true); }}
                  onDelete={setDeletingEvent} />
              ))}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <EventModal event={editingEvent}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingEvent(null); }} />
      )}
      {deletingEvent && (
        <ConfirmDelete event={deletingEvent}
          onConfirm={() => { deleteEvent(deletingEvent.id); setDeletingEvent(null); }}
          onCancel={() => setDeletingEvent(null)} />
      )}
    </div>
  );
}
