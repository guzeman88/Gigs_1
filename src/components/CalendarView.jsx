import React, { useState, useMemo } from 'react';
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
            display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
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
