import React, { useState, useEffect } from "react";

const TYPES = [
  { value: "gig",      label: "Gig",      emoji: "??", fg: "#065f46", bg: "#d1fae5", active: "#059669" },
  { value: "vacation", label: "Vacation", emoji: "???", fg: "#1e40af", bg: "#dbeafe", active: "#2563eb" },
  { value: "audition", label: "Audition", emoji: "??", fg: "#92400e", bg: "#fef3c7", active: "#d97706" },
];

const EMPTY = { type:"gig", groupName:"", startDate:"", endDate:"", payment:"", repertoire:"", finalsDate:"", notes:"" };

function Label({ children }) {
  return <div style={{ fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"0.08em",marginBottom:6,textTransform:"uppercase" }}>{children}</div>;
}

function Input({ value, onChange, type="text", placeholder, min }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} min={min}
      style={{
        width:"100%", padding:"11px 14px", borderRadius:12,
        border:"1.5px solid #e2e8f0", background:"#f8fafc",
        fontSize:15, color:"#0f172a", outline:"none", fontFamily:"inherit",
        transition:"border-color 0.15s",
      }}
      onFocus={e => e.target.style.borderColor="#6366f1"}
      onBlur={e  => e.target.style.borderColor="#e2e8f0"}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows=2 }) {
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{
        width:"100%", padding:"11px 14px", borderRadius:12,
        border:"1.5px solid #e2e8f0", background:"#f8fafc",
        fontSize:15, color:"#0f172a", outline:"none", fontFamily:"inherit", resize:"none",
        transition:"border-color 0.15s",
      }}
      onFocus={e => e.target.style.borderColor="#6366f1"}
      onBlur={e  => e.target.style.borderColor="#e2e8f0"}
    />
  );
}

export default function EventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  useEffect(() => { setForm(event ? { ...EMPTY, ...event } : EMPTY); }, [event]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const activeType = TYPES.find(t => t.value === form.type) || TYPES[0];

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.groupName.trim() || !form.startDate) return;
    onSave(form);
  }

  return (
    <div
      onClick={onClose}
      style={{ position:"fixed",inset:0,zIndex:60,background:"rgba(15,23,42,0.55)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"overlayIn 0.2s ease" }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:"100%",maxWidth:640,background:"white",borderRadius:"28px 28px 0 0",
          maxHeight:"92dvh",display:"flex",flexDirection:"column",
          animation:"sheetUp 0.38s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="card-shadow-lg"
      >
        {/* Drag handle */}
        <div style={{ display:"flex",justifyContent:"center",paddingTop:10 }}>
          <div style={{ width:36,height:4,borderRadius:2,background:"#e2e8f0" }}/>
        </div>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px 12px" }}>
          <h2 style={{ fontSize:20,fontWeight:800,color:"#0f172a",margin:0 }}>
            {event ? "Edit Entry" : "New Entry"}
          </h2>
          <button onClick={onClose} style={{ width:34,height:34,borderRadius:17,border:"none",background:"#f1f5f9",color:"#64748b",cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>?</button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY:"auto",padding:"0 20px 24px",display:"flex",flexDirection:"column",gap:20 }} className="scrollbar-none pb-safe">

          {/* Type selector */}
          <div>
            <Label>Type</Label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              {TYPES.map(t => {
                const isActive = form.type === t.value;
                return (
                  <button key={t.value} type="button" onClick={() => set("type", t.value)}
                    style={{
                      padding:"12px 8px",borderRadius:16,border:`2px solid ${isActive ? t.active : "#e2e8f0"}`,
                      background: isActive ? t.bg : "#f8fafc",
                      cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",
                    }}
                  >
                    <div style={{ fontSize:22,marginBottom:4 }}>{t.emoji}</div>
                    <div style={{ fontSize:12,fontWeight:700,color: isActive ? t.fg : "#94a3b8" }}>{t.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label>
              {form.type==="gig" ? "Group / Ensemble" : form.type==="vacation" ? "Destination / Label" : "Audition For"}
              <span style={{ color:"#ef4444",marginLeft:2 }}>*</span>
            </Label>
            <Input
              value={form.groupName}
              onChange={e => set("groupName", e.target.value)}
              placeholder={form.type==="gig" ? "e.g. City Symphony Orchestra" : form.type==="vacation" ? "e.g. Summer in Italy" : "e.g. Metropolitan Opera"}
            />
          </div>

          {/* Dates */}
          <div>
            <Label>Date(s) <span style={{ color:"#ef4444" }}>*</span></Label>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              <div>
                <div style={{ fontSize:12,color:"#94a3b8",fontWeight:600,marginBottom:4 }}>Start</div>
                <Input type="date" value={form.startDate} onChange={e => {
                  set("startDate", e.target.value);
                  if (!form.endDate || e.target.value > form.endDate) set("endDate", e.target.value);
                }} />
              </div>
              <div>
                <div style={{ fontSize:12,color:"#94a3b8",fontWeight:600,marginBottom:4 }}>End</div>
                <Input type="date" value={form.endDate} min={form.startDate} onChange={e => set("endDate", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Payment (gigs only) */}
          {form.type === "gig" && (
            <div>
              <Label>Payment</Label>
              <Input value={form.payment} onChange={e=>set("payment",e.target.value)} placeholder="e.g. $500, Per-service, TBD"/>
            </div>
          )}

          {/* Repertoire */}
          {(form.type==="gig"||form.type==="audition") && (
            <div>
              <Label>Repertoire</Label>
              <Textarea value={form.repertoire} onChange={e=>set("repertoire",e.target.value)} placeholder="e.g. Beethoven 9, Brahms Requiem"/>
            </div>
          )}

          {/* Finals Date (auditions) */}
          {form.type==="audition" && (
            <div>
              <Label>Finals Date <span style={{ color:"#94a3b8",fontWeight:400,textTransform:"none" }}>(optional)</span></Label>
              <Input type="date" value={form.finalsDate} onChange={e=>set("finalsDate",e.target.value)}/>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Any additional notes…" rows={2}/>
          </div>

          {/* Actions */}
          <div style={{ display:"flex",gap:10,paddingTop:4 }}>
            <button type="button" onClick={onClose} style={{
              flex:1,padding:"14px 0",borderRadius:16,border:"1.5px solid #e2e8f0",
              background:"white",color:"#475569",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",
            }}>Cancel</button>
            <button type="submit" style={{
              flex:2,padding:"14px 0",borderRadius:16,border:"none",
              background:`linear-gradient(135deg,${activeType.active},${activeType.active}cc)`,
              color:"white",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",
              boxShadow:`0 4px 14px ${activeType.active}55`,
            }}>
              {event ? "Save Changes" : `Add ${activeType.label}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
