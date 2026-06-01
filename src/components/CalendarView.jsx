import React, { useState, useMemo } from "react";
import { eventsForDate, daysInMonth, today, isSameDay } from "../utils/dateUtils";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["S","M","T","W","T","F","S"];
const TYPE_ORDER = { gig: 0, vacation: 1, audition: 2 };
const TYPE_CONFIG = {
  gig:      { label: "Gig",      emoji: "??", fg: "#065f46", bg: "#d1fae5" },
  vacation: { label: "Vacation", emoji: "???", fg: "#1e40af", bg: "#dbeafe" },
  audition: { label: "Audition", emoji: "??", fg: "#92400e", bg: "#fef3c7" },
};
function sortByPri(a,b){ return (TYPE_ORDER[a.type]??9)-(TYPE_ORDER[b.type]??9); }

function DayCell({ date, evs, todayDate, onClick }) {
  const sorted = [...evs].sort(sortByPri);
  const primary = sorted[0];
  const isPast  = date < todayDate;
  const isToday = isSameDay(date, todayDate);
  const hasEvent = !!primary;
  const bgColor  = hasEvent ? (primary.color || "#c7d2fe") : "transparent";
  const textColor= isToday ? "#dc2626" : isPast ? "#cbd5e1" : "#334155";

  return (
    <div
      onClick={() => evs.length > 0 && onClick(date, evs)}
      style={{
        aspectRatio: "1", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", borderRadius: 7,
        backgroundColor: bgColor,
        border: isToday ? "2px solid #dc2626" : "none",
        cursor: evs.length > 0 ? "pointer" : "default",
        transition: "opacity 0.1s",
      }}
      onMouseEnter={e => { if(evs.length) e.currentTarget.style.opacity="0.75"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}
    >
      <span style={{ fontSize:12, fontWeight: isToday?800:hasEvent?700:400, color:textColor, lineHeight:1 }}>
        {date.getDate()}
      </span>
      {sorted.length > 1 && (
        <div style={{ display:"flex", gap:2, marginTop:2 }}>
          {sorted.slice(1,3).map((ev,i)=>(
            <div key={i} style={{ width:3, height:3, borderRadius:"50%", backgroundColor: ev.color||"#a5b4fc" }}/>
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
  for(let i=0;i<firstDow;i++) cells.push(<div key={"e"+i}/>);
  for(let d=1;d<=numDays;d++){
    const date = new Date(year, month, d);
    date.setHours(0,0,0,0);
    const evs = eventsForDate(events, date);
    cells.push(<DayCell key={d} date={date} evs={evs} todayDate={todayDate} onClick={onDayClick}/>);
  }
  return (
    <div style={{ background:"white", borderRadius:20, overflow:"hidden", marginBottom:14 }} className="card-shadow">
      <div style={{ background:"linear-gradient(135deg,#4338ca,#5b21b6)", color:"white", fontWeight:800, fontSize:13, letterSpacing:"0.06em", padding:"10px 16px", textTransform:"uppercase" }}>
        {MONTHS[month]}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"8px 8px 3px" }}>
        {DOW.map((d,i)=>(
          <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color: i===0?"#f87171":"#94a3b8", letterSpacing:"0.06em" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, padding:"0 8px 10px" }}>
        {cells}
      </div>
    </div>
  );
}

function DaySheet({ date, evs, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:60,background:"rgba(15,23,42,0.55)",display:"flex",alignItems:"flex-end",animation:"overlayIn 0.2s ease" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:640,margin:"0 auto",background:"white",borderRadius:"24px 24px 0 0",maxHeight:"70dvh",overflow:"hidden",display:"flex",flexDirection:"column",animation:"sheetUp 0.35s cubic-bezier(0.16,1,0.3,1)" }} className="card-shadow-lg">
        <div style={{ display:"flex",justifyContent:"center",paddingTop:10,paddingBottom:4 }}>
          <div style={{ width:36,height:4,borderRadius:2,background:"#e2e8f0" }}/>
        </div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 20px 12px" }}>
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:"#0f172a" }}>
              {date.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
            </div>
            <div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>{date.getFullYear()}</div>
          </div>
          <button onClick={onClose} style={{ width:32,height:32,borderRadius:16,border:"none",background:"#f1f5f9",color:"#64748b",cursor:"pointer",fontSize:16,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center" }}>?</button>
        </div>
        <div style={{ overflowY:"auto",padding:"0 16px 24px" }} className="scrollbar-none pb-safe">
          {[...evs].sort(sortByPri).map(ev => {
            const t = TYPE_CONFIG[ev.type]||TYPE_CONFIG.gig;
            return (
              <div key={ev.id} style={{ borderRadius:16,padding:"14px 16px",marginBottom:10,background: ev.color||"#f8fafc",borderLeft:`4px solid ${ev.color||"#94a3b8"}` }}>
                <span style={{ fontSize:10,fontWeight:800,letterSpacing:"0.08em",color:t.fg,background:t.bg,padding:"2px 8px",borderRadius:99 }}>{t.emoji} {t.label.toUpperCase()}</span>
                <div style={{ fontWeight:700,fontSize:16,color:"#0f172a",marginTop:6 }}>{ev.groupName}</div>
                {ev.repertoire && <div style={{ fontSize:13,color:"#475569",marginTop:4 }}><strong>Repertoire:</strong> {ev.repertoire}</div>}
                {ev.payment    && <div style={{ fontSize:13,color:"#059669",fontWeight:600,marginTop:4 }}>{ev.payment}</div>}
                {ev.notes      && <div style={{ fontSize:13,color:"#475569",marginTop:4 }}>{ev.notes}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CalendarView({ events }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selDay, setSelDay] = useState(null);
  const [selEvs, setSelEvs] = useState([]);
  const todayDate = useMemo(() => { const d=today(); d.setHours(0,0,0,0); return d; }, []);

  return (
    <div style={{ display:"flex",flexDirection:"column",minHeight:"100dvh" }} className="pb-nav">
      <div style={{ background:"linear-gradient(135deg,#4338ca,#5b21b6)",paddingLeft:20,paddingRight:20,paddingTop:"calc(var(--safe-t) + 16px)",paddingBottom:20,position:"sticky",top:0,zIndex:20 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <button onClick={()=>setYear(y=>y-1)} style={{ width:40,height:40,borderRadius:20,border:"1.5px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>‹</button>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:"rgba(199,210,254,0.9)",fontSize:11,fontWeight:700,letterSpacing:"0.1em" }}>YEAR</div>
            <div style={{ color:"white",fontSize:30,fontWeight:800,letterSpacing:"-1px",lineHeight:1.1 }}>{year}</div>
          </div>
          <button onClick={()=>setYear(y=>y+1)} style={{ width:40,height:40,borderRadius:20,border:"1.5px solid rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.1)",color:"white",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>›</button>
        </div>
        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          {[{color:"#93c47d",label:"Gig"},{color:"#c9daf8",label:"Vacation",b:true},{color:"#fff2cc",label:"Audition",b:true}].map(l=>(
            <div key={l.label} style={{ display:"flex",alignItems:"center",gap:5 }}>
              <div style={{ width:13,height:13,borderRadius:3,backgroundColor:l.color,border:l.b?"1px solid rgba(255,255,255,0.5)":"none" }}/>
              <span style={{ color:"rgba(255,255,255,0.8)",fontSize:11,fontWeight:600 }}>{l.label}</span>
            </div>
          ))}
          <div style={{ display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:13,height:13,borderRadius:3,border:"2px solid #f87171" }}/>
            <span style={{ color:"rgba(255,255,255,0.8)",fontSize:11,fontWeight:600 }}>Today</span>
          </div>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 14px 0" }}>
        {MONTHS.map((_,m)=>(
          <MonthGrid key={m} year={year} month={m} events={events} todayDate={todayDate} onDayClick={(d,e)=>{setSelDay(d);setSelEvs(e);}}/>
        ))}
      </div>
      {selDay && <DaySheet date={selDay} evs={selEvs} onClose={()=>setSelDay(null)}/>}
    </div>
  );
}
