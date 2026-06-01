import React, { useState, useEffect } from 'react';

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
            display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
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
