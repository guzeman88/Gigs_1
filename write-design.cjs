const fs = require('fs');
const path = require('path');
const W = (f, c) => fs.writeFileSync(path.resolve(__dirname, f), c, 'utf8');

// ── index.css ────────────────────────────────────────────────────────────────
W('src/index.css', `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..800;1,14..32,300..800&display=swap');
@import "tailwindcss";

:root {
  --nav-h: 52px;
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-t: env(safe-area-inset-top, 0px);
  --bg: #f5f5f3;
  --surface: #ffffff;
  --border: #ebebeb;
  --text: #111111;
  --muted: #888888;
  --faint: #cccccc;
}

*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; overscroll-behavior: none; margin: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

#root { min-height: 100dvh; display: flex; flex-direction: column; }

@keyframes slideUp  { from{transform:translateY(14px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes sheetUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes overlayIn{ from{opacity:0} to{opacity:1} }
@keyframes scaleIn  { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }

.scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
.pb-nav  { padding-bottom: calc(var(--nav-h) + var(--safe-b)); }
.pb-safe { padding-bottom: max(16px, var(--safe-b)); }
`);

// ── Navigation.jsx ───────────────────────────────────────────────────────────
W('src/components/Navigation.jsx', `import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  const link = ({ isActive }) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 'max(10px, env(safe-area-inset-bottom, 0px))',
    textDecoration: 'none',
    borderTop: '2px solid ' + (isActive ? '#111' : 'transparent'),
    transition: 'border-color 0.15s',
  });

  const label = (active) => ({
    fontSize: 11,
    fontWeight: active ? 700 : 500,
    letterSpacing: '0.09em',
    color: active ? '#111' : '#aaa',
    textTransform: 'uppercase',
  });

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 640, zIndex: 50,
      background: 'white', borderTop: '1px solid #e8e8e8',
    }}>
      <div style={{ display: 'flex' }}>
        <NavLink to="/" end style={link}>
          {({ isActive }) => <span style={label(isActive)}>Schedule</span>}
        </NavLink>
        <NavLink to="/calendar" style={link}>
          {({ isActive }) => <span style={label(isActive)}>Calendar</span>}
        </NavLink>
      </div>
    </nav>
  );
}
`);

// ── ListView.jsx ─────────────────────────────────────────────────────────────
W('src/components/ListView.jsx', `import React, { useState, useMemo } from 'react';
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
    return a.toLocaleDateString('en-US', opts) + '\u2013' + b.getDate();
  return a.toLocaleDateString('en-US', opts) + ' \u2013 ' + b.toLocaleDateString('en-US', opts);
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
            {t.label}{event.payment ? ' \u00b7 ' + event.payment : ''}
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
          {'\u201c'}{event.groupName}{'\u201d'} will be permanently removed.
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
`);

// ── CalendarView.jsx ─────────────────────────────────────────────────────────
W('src/components/CalendarView.jsx', `import React, { useState, useMemo } from 'react';
import { eventsForDate, daysInMonth, today, isSameDay } from '../utils/dateUtils';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['S','M','T','W','T','F','S'];
const T_COLOR = { gig: '#1a7f4b', vacation: '#2060c8', audition: '#c07900' };
const T_ORDER = { gig: 0, vacation: 1, audition: 2 };
const byPri = (a,b) => (T_ORDER[a.type]??9)-(T_ORDER[b.type]??9);

function DayCell({ date, evs, todayDate, onClick }) {
  const sorted = [...evs].sort(byPri);
  const primary = sorted[0];
  const isPast  = date < todayDate;
  const isToday = isSameDay(date, todayDate);

  return (
    <div onClick={() => evs.length > 0 && onClick(date, evs)}
      style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start', paddingTop: 3,
        cursor: evs.length ? 'pointer' : 'default', borderRadius: 6 }}
      onMouseEnter={e => { if(evs.length) e.currentTarget.style.background='#f5f5f3'; }}
      onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
      <span style={{
        fontSize: 12, lineHeight: 1, fontWeight: isToday ? 700 : 400,
        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%', background: isToday ? '#111' : 'transparent',
        color: isToday ? 'white' : isPast ? '#ccc' : '#333',
      }}>{date.getDate()}</span>
      {primary && (
        <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
          {sorted.slice(0,3).map((ev,i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: '50%',
              background: T_COLOR[ev.type] || '#aaa' }} />
          ))}
        </div>
      )}
    </div>
  );
}

function MonthGrid({ year, month, events, todayDate, onDayClick }) {
  const numDays  = daysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const cells = [];
  for(let i=0;i<firstDow;i++) cells.push(<div key={'e'+i}/>);
  for(let d=1;d<=numDays;d++){
    const date = new Date(year, month, d);
    date.setHours(0,0,0,0);
    cells.push(<DayCell key={d} date={date} evs={eventsForDate(events, date)}
      todayDate={todayDate} onClick={onDayClick}/>);
  }
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#111', letterSpacing: '0.04em',
        paddingBottom: 8, borderBottom: '1px solid #f0f0f0', marginBottom: 6 }}>{MONTHS[month]}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 2 }}>
        {DOW.map((d,i)=>(
          <div key={i} style={{ textAlign:'center', fontSize:10, fontWeight:600,
            color: i===0 ? '#e5483a' : '#ccc', letterSpacing:'0.06em', paddingBottom:2 }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1 }}>{cells}</div>
    </div>
  );
}

function DaySheet({ date, evs, onClose }) {
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:60,background:'rgba(0,0,0,0.35)',
      display:'flex',alignItems:'flex-end',animation:'overlayIn 0.2s ease' }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%',maxWidth:640,margin:'0 auto',
        background:'white',borderRadius:'20px 20px 0 0',maxHeight:'70dvh',
        display:'flex',flexDirection:'column',
        animation:'sheetUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        boxShadow:'0 -8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ display:'flex',justifyContent:'center',padding:'10px 0 0' }}>
          <div style={{ width:32,height:3,borderRadius:2,background:'#e0e0e0' }}/>
        </div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px 14px' }}>
          <div>
            <div style={{ fontSize:17,fontWeight:700,color:'#111' }}>
              {date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
            </div>
            <div style={{ fontSize:12,color:'#aaa',marginTop:1 }}>{date.getFullYear()}</div>
          </div>
          <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,border:'1px solid #e0e0e0',
            background:'white',color:'#888',fontSize:16,cursor:'pointer',fontFamily:'inherit',
            display:'flex',alignItems:'center',justifyContent:'center' }}>\u00d7</button>
        </div>
        <div style={{ overflowY:'auto',padding:'0 20px 24px' }} className="scrollbar-none pb-safe">
          {[...evs].sort(byPri).map(ev => (
            <div key={ev.id} style={{ padding:'14px 0',borderBottom:'1px solid #f5f5f5' }}>
              <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:5 }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:T_COLOR[ev.type]||'#aaa',flexShrink:0 }}/>
                <span style={{ fontSize:10,fontWeight:700,color:'#aaa',letterSpacing:'0.1em' }}>
                  {ev.type.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize:16,fontWeight:600,color:'#111' }}>{ev.groupName}</div>
              {ev.repertoire && <div style={{ fontSize:13,color:'#666',marginTop:4,lineHeight:1.5 }}>{ev.repertoire}</div>}
              {ev.payment    && <div style={{ fontSize:13,color:'#1a7f4b',fontWeight:600,marginTop:4 }}>{ev.payment}</div>}
              {ev.notes      && <div style={{ fontSize:13,color:'#666',marginTop:4,lineHeight:1.5 }}>{ev.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CalendarView({ events }) {
  const [year, setYear]     = useState(new Date().getFullYear());
  const [selDay, setSelDay] = useState(null);
  const [selEvs, setSelEvs] = useState([]);
  const todayDate = useMemo(()=>{ const d=today(); d.setHours(0,0,0,0); return d; },[]);

  return (
    <div style={{ display:'flex',flexDirection:'column',minHeight:'100dvh',background:'white' }} className="pb-nav">
      <div style={{ position:'sticky',top:0,zIndex:20,background:'white',borderBottom:'1px solid #ebebeb',
        paddingTop:'calc(env(safe-area-inset-top,0px) + 14px)',
        paddingBottom:14, paddingLeft:20, paddingRight:20 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
          <button onClick={()=>setYear(y=>y-1)}
            style={{ width:30,height:30,borderRadius:8,border:'1px solid #e0e0e0',
              background:'white',color:'#111',fontSize:14,cursor:'pointer',fontFamily:'inherit',
              display:'flex',alignItems:'center',justifyContent:'center' }}>&lt;</button>
          <span style={{ fontSize:17,fontWeight:700,color:'#111',letterSpacing:'-0.3px' }}>{year}</span>
          <button onClick={()=>setYear(y=>y+1)}
            style={{ width:30,height:30,borderRadius:8,border:'1px solid #e0e0e0',
              background:'white',color:'#111',fontSize:14,cursor:'pointer',fontFamily:'inherit',
              display:'flex',alignItems:'center',justifyContent:'center' }}>&gt;</button>
        </div>
        <div style={{ display:'flex',gap:16,justifyContent:'center' }}>
          {[{c:'#1a7f4b',l:'Gig'},{c:'#2060c8',l:'Vacation'},{c:'#c07900',l:'Audition'}].map(x=>(
            <div key={x.l} style={{ display:'flex',alignItems:'center',gap:5 }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:x.c }}/>
              <span style={{ fontSize:11,color:'#aaa',fontWeight:500 }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1,padding:'20px 20px 0',overflowY:'auto' }} className="scrollbar-none">
        {MONTHS.map((_,m)=>(
          <MonthGrid key={m} year={year} month={m} events={events}
            todayDate={todayDate} onDayClick={(d,evs)=>{ setSelDay(d); setSelEvs(evs); }}/>
        ))}
      </div>

      {selDay && <DaySheet date={selDay} evs={selEvs} onClose={()=>setSelDay(null)}/>}
    </div>
  );
}
`);

// ── EventModal.jsx ───────────────────────────────────────────────────────────
W('src/components/EventModal.jsx', `import React, { useState, useEffect } from 'react';

const TYPES = [
  { value: 'gig',      label: 'Gig',      color: '#1a7f4b' },
  { value: 'vacation', label: 'Vacation', color: '#2060c8' },
  { value: 'audition', label: 'Audition', color: '#c07900' },
];

const EMPTY = { type:'gig', groupName:'', startDate:'', endDate:'', payment:'', repertoire:'', finalsDate:'', notes:'' };

const field = {
  width:'100%', padding:'10px 0', border:'none',
  borderBottom:'1px solid #e8e8e8', background:'transparent',
  fontSize:15, color:'#111', outline:'none', fontFamily:'inherit',
};

const lbl = {
  display:'block', fontSize:10, fontWeight:700, color:'#bbb',
  letterSpacing:'0.12em', marginBottom:6, textTransform:'uppercase',
};

function Field({ children }) {
  return <div style={{ display:'flex', flexDirection:'column' }}>{children}</div>;
}

export default function EventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  useEffect(()=>{ setForm(event ? { ...EMPTY, ...event } : EMPTY); }, [event]);
  const set = (k,v) => setForm(p=>({ ...p, [k]:v }));

  const focus = e => { e.target.style.borderBottomColor = '#111'; };
  const blur  = e => { e.target.style.borderBottomColor = '#e8e8e8'; };

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.groupName.trim() || !form.startDate) return;
    onSave(form);
  }

  const nameLabel = form.type === 'gig' ? 'Group / Ensemble'
    : form.type === 'vacation' ? 'Destination'
    : 'Audition For';

  const namePlaceholder = form.type === 'gig' ? 'City Symphony Orchestra'
    : form.type === 'vacation' ? 'Summer in Italy'
    : 'Metropolitan Opera';

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:60,background:'rgba(0,0,0,0.35)',
      display:'flex',alignItems:'flex-end',justifyContent:'center',animation:'overlayIn 0.2s ease' }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%',maxWidth:640,background:'white',
        borderRadius:'20px 20px 0 0',maxHeight:'92dvh',display:'flex',flexDirection:'column',
        animation:'sheetUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow:'0 -8px 40px rgba(0,0,0,0.1)' }}>

        <div style={{ display:'flex',justifyContent:'center',padding:'12px 0 0' }}>
          <div style={{ width:32,height:3,borderRadius:2,background:'#e0e0e0' }}/>
        </div>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px 16px' }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',margin:0 }}>
            {event ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button onClick={onClose} style={{ width:28,height:28,borderRadius:14,border:'1px solid #e0e0e0',
            background:'white',color:'#888',fontSize:14,cursor:'pointer',fontFamily:'inherit',
            display:'flex',alignItems:'center',justifyContent:'center' }}>\u00d7</button>
        </div>

        <form onSubmit={handleSubmit}
          style={{ overflowY:'auto',padding:'0 20px 24px',display:'flex',flexDirection:'column',gap:22 }}
          className="scrollbar-none pb-safe">

          {/* Type selector */}
          <Field>
            <span style={lbl}>Type</span>
            <div style={{ display:'flex', borderBottom:'1px solid #e8e8e8' }}>
              {TYPES.map(t => {
                const active = form.type === t.value;
                return (
                  <button key={t.value} type="button" onClick={()=>set('type',t.value)}
                    style={{ flex:1, padding:'10px 0', border:'none',
                      borderBottom: '2px solid ' + (active ? t.color : 'transparent'),
                      background:'none', color: active ? t.color : '#bbb',
                      fontSize:13, fontWeight: active ? 700 : 500,
                      cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', marginBottom:-1 }}>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Name */}
          <Field>
            <span style={lbl}>{nameLabel} <span style={{ color:'#e5483a' }}>*</span></span>
            <input value={form.groupName} onChange={e=>set('groupName',e.target.value)}
              placeholder={namePlaceholder} style={field} onFocus={focus} onBlur={blur}/>
          </Field>

          {/* Dates */}
          <Field>
            <span style={lbl}>Dates <span style={{ color:'#e5483a' }}>*</span></span>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <div style={{ fontSize:11,color:'#ccc',marginBottom:3 }}>Start</div>
                <input type="date" value={form.startDate} style={field} onFocus={focus} onBlur={blur}
                  onChange={e=>{
                    set('startDate', e.target.value);
                    if (!form.endDate || e.target.value > form.endDate) set('endDate', e.target.value);
                  }}/>
              </div>
              <div>
                <div style={{ fontSize:11,color:'#ccc',marginBottom:3 }}>End</div>
                <input type="date" value={form.endDate} min={form.startDate} style={field}
                  onFocus={focus} onBlur={blur} onChange={e=>set('endDate',e.target.value)}/>
              </div>
            </div>
          </Field>

          {form.type === 'gig' && (
            <Field>
              <span style={lbl}>Payment</span>
              <input value={form.payment} onChange={e=>set('payment',e.target.value)}
                placeholder="e.g. $500, per-service, TBD" style={field} onFocus={focus} onBlur={blur}/>
            </Field>
          )}

          {(form.type === 'gig' || form.type === 'audition') && (
            <Field>
              <span style={lbl}>Repertoire</span>
              <textarea value={form.repertoire} onChange={e=>set('repertoire',e.target.value)}
                placeholder="Beethoven 9, Brahms Requiem..." rows={2}
                style={{ ...field, resize:'none' }} onFocus={focus} onBlur={blur}/>
            </Field>
          )}

          {form.type === 'audition' && (
            <Field>
              <span style={lbl}>Finals Date</span>
              <input type="date" value={form.finalsDate} onChange={e=>set('finalsDate',e.target.value)}
                style={field} onFocus={focus} onBlur={blur}/>
            </Field>
          )}

          <Field>
            <span style={lbl}>Notes</span>
            <textarea value={form.notes} onChange={e=>set('notes',e.target.value)}
              placeholder="Additional notes..." rows={2}
              style={{ ...field, resize:'none' }} onFocus={focus} onBlur={blur}/>
          </Field>

          <div style={{ display:'flex', gap:10, paddingTop:4 }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:'13px 0', borderRadius:12, border:'1px solid #e0e0e0',
                background:'white', color:'#111', fontSize:14, fontWeight:600,
                cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            <button type="submit"
              style={{ flex:2, padding:'13px 0', borderRadius:12, border:'none',
                background:'#111', color:'white', fontSize:14, fontWeight:700,
                cursor:'pointer', fontFamily:'inherit' }}>
              {event ? 'Save Changes' : 'Add ' + form.type.charAt(0).toUpperCase() + form.type.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`);

console.log('All files written successfully.');
