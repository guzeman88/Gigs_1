import React, { useState, useMemo } from "react";
import EventModal from "./EventModal";
import { formatDisplayDate } from "../utils/dateUtils";

/* -- Design tokens ------------------------ */
const T = {
  gig:      { label: "Gig",      emoji: "??", fg: "#065f46", bg: "#d1fae5", border: "#34d399" },
  vacation: { label: "Vacation", emoji: "???", fg: "#1e40af", bg: "#dbeafe", border: "#60a5fa" },
  audition: { label: "Audition", emoji: "??", fg: "#92400e", bg: "#fef3c7", border: "#fbbf24" },
};

function fmtRange(s, e) {
  if (!s) return "";
  const a = new Date(s + "T12:00:00");
  const b = (e && e !== s) ? new Date(e + "T12:00:00") : null;
  const mo = { month: "short", day: "numeric" };
  if (!b) return a.toLocaleDateString("en-US", mo);
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear())
    return a.toLocaleDateString("en-US", mo) + " – " + b.getDate();
  return a.toLocaleDateString("en-US", mo) + " – " + b.toLocaleDateString("en-US", mo);
}

/* -- EventCard --------------------------- */
function EventCard({ event, onEdit, onDelete, idx }) {
  const [open, setOpen] = useState(false);
  const t = T[event.type] || T.gig;
  const accent = event.color || t.border;
  const hasExtra = !!(event.repertoire || event.notes || event.finalsDate);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden mb-3 card-shadow"
      style={{ animation: `slideUp 0.35s cubic-bezier(0.16,1,0.3,1) ${idx * 0.04}s both` }}
    >
      {/* Main row */}
      <div
        style={{ display: "flex", cursor: hasExtra ? "pointer" : "default" }}
        onClick={() => hasExtra && setOpen(v => !v)}
      >
        {/* Accent bar */}
        <div style={{ width: 5, background: accent, flexShrink: 0 }} />

        {/* Content */}
        <div style={{ flex: 1, padding: "14px 14px 14px 16px", minWidth: 0 }}>
          {/* Row 1: badge + date */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span
              style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                color: t.fg, background: t.bg,
                padding: "3px 10px", borderRadius: 99,
              }}
            >
              {t.emoji} {t.label.toUpperCase()}
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8", flexShrink: 0 }}>
              {fmtRange(event.startDate, event.endDate)}
            </span>
          </div>

          {/* Row 2: name */}
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginTop: 8, lineHeight: 1.3 }}>
            {event.groupName}
          </div>

          {/* Row 3: repertoire + payment */}
          {(event.repertoire || event.payment) && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 6 }}>
              {event.repertoire ? (
                <span style={{ fontSize: 13, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {event.repertoire}
                </span>
              ) : <span />}
              {event.payment && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#065f46",
                  background: "#ecfdf5", border: "1px solid #a7f3d0",
                  padding: "2px 8px", borderRadius: 99, flexShrink: 0, marginLeft: 8,
                }}>
                  {event.payment}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Chevron */}
        {hasExtra && (
          <div style={{ display: "flex", alignItems: "center", paddingRight: 14 }}>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}
      </div>

      {/* Expanded section */}
      {open && hasExtra && (
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "12px 16px 16px 21px" }}>
          {event.repertoire && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2 }}>REPERTOIRE</div>
              <div style={{ fontSize: 14, color: "#334155" }}>{event.repertoire}</div>
            </div>
          )}
          {event.finalsDate && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2 }}>FINALS DATE</div>
              <div style={{ fontSize: 14, color: "#b45309", fontWeight: 600 }}>{formatDisplayDate(event.finalsDate)}</div>
            </div>
          )}
          {event.notes && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2 }}>NOTES</div>
              <div style={{ fontSize: 14, color: "#334155" }}>{event.notes}</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              onClick={e => { e.stopPropagation(); onEdit(event); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 12, border: "none",
                background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >?? Edit</button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(event); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 12, border: "none",
                background: "#fef2f2", color: "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >??? Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -- Confirm Delete ----------------------- */
function ConfirmDelete({ event, onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20, animation: "overlayIn 0.15s ease" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "white", borderRadius: 24, padding: "28px 24px", maxWidth: 360, width: "100%", animation: "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)" }}
        className="card-shadow-lg"
      >
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>???</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>Delete Entry?</h3>
        <p style={{ fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 24, lineHeight: 1.5 }}>
          "<strong>{event.groupName}</strong>" will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px 0", borderRadius: 14, border: "1.5px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* -- Empty State -------------------------- */
function EmptyState({ onAdd }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>??</div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No entries yet</h3>
      <p style={{ fontSize: 15, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>Add your gigs, vacations, and auditions to see them here and in the calendar.</p>
      <button
        onClick={onAdd}
        style={{
          padding: "14px 32px", borderRadius: 16, border: "none",
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer",
          boxShadow: "0 4px 14px rgba(79,70,229,0.35)", fontFamily: "inherit",
        }}
      >+ Add First Entry</button>
    </div>
  );
}

/* -- Stat Chip ---------------------------- */
function Chip({ value, label, fg, bg }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 14px", flexShrink: 0, backdropFilter: "blur(8px)" }}>
      <div style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* -- Main component ----------------------- */
export default function ListView({ events, addEvent, updateEvent, deleteEvent }) {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("startDate");

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const gigCount = events.filter(e => e.type === "gig").length;
  const vacCount = events.filter(e => e.type === "vacation").length;
  const audCount = events.filter(e => e.type === "audition").length;
  const upcoming = events.filter(e => e.startDate && new Date(e.startDate + "T12:00:00") >= now).length;
  const totalPay = events
    .filter(e => e.type === "gig" && e.payment)
    .reduce((s, e) => { const n = parseFloat(e.payment.replace(/[^0-9.]/g, "")); return isNaN(n) ? s : s + n; }, 0);

  const filtered = useMemo(() => events
    .filter(ev => {
      if (filter !== "all" && ev.type !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        return ev.groupName.toLowerCase().includes(s)
          || ev.repertoire?.toLowerCase().includes(s)
          || ev.notes?.toLowerCase().includes(s);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "startDate") return (a.startDate || "").localeCompare(b.startDate || "");
      if (sortBy === "groupName") return a.groupName.localeCompare(b.groupName);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return 0;
    }), [events, filter, sortBy, search]);

  function handleSave(fd) {
    if (editingEvent) updateEvent(editingEvent.id, fd);
    else addEvent(fd);
    setShowModal(false);
    setEditingEvent(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }} className="pb-nav">
      {/* -- Hero Header -- */}
      <div
        style={{
          background: "linear-gradient(135deg, #4338ca 0%, #5b21b6 60%, #4f46e5 100%)",
          paddingLeft: 20, paddingRight: 20,
          paddingTop: "calc(var(--safe-t) + 20px)",
          paddingBottom: 24,
        }}
      >
        <div style={{ color: "rgba(199,210,254,0.9)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{monthLabel}</div>
        <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
          Your Schedule
        </h1>

        {events.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto" }} className="scrollbar-none">
            {gigCount > 0   && <Chip value={gigCount}  label="Gigs"      />}
            {vacCount > 0   && <Chip value={vacCount}  label="Vacations" />}
            {audCount > 0   && <Chip value={audCount}  label="Auditions" />}
            {upcoming > 0   && <Chip value={upcoming}  label="Upcoming"  />}
            {totalPay > 0   && <Chip value={"$" + totalPay.toLocaleString()} label="Earned" />}
          </div>
        )}
      </div>

      {/* -- Search + Filter (sticky) -- */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 16px 10px",
      }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, repertoire…"
            style={{
              width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
              background: "#f1f5f9", border: "none", borderRadius: 12,
              fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="scrollbar-none">
          {[
            { v: "all",      l: "All",        n: events.length },
            { v: "gig",      l: "?? Gigs",     n: gigCount },
            { v: "vacation", l: "??? Vacations", n: vacCount },
            { v: "audition", l: "?? Auditions", n: audCount },
          ].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)} style={{
              flexShrink: 0, padding: "6px 12px", borderRadius: 99, border: "none",
              background: filter === f.v ? "#4f46e5" : "#f1f5f9",
              color: filter === f.v ? "white" : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}>
              {f.l} <span style={{ opacity: 0.65 }}>{f.n}</span>
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              fontSize: 11, fontWeight: 600, color: "#64748b",
              border: "1px solid #e2e8f0", borderRadius: 8, padding: "4px 6px",
              background: "white", cursor: "pointer", fontFamily: "inherit",
            }}>
              <option value="startDate">Date</option>
              <option value="groupName">Name</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* -- List -- */}
      <div style={{ flex: 1, padding: "16px 16px 0" }}>
        {filtered.length === 0
          ? <EmptyState onAdd={() => { setEditingEvent(null); setShowModal(true); }} />
          : filtered.map((ev, i) => (
            <EventCard key={ev.id} event={ev} idx={i}
              onEdit={ev => { setEditingEvent(ev); setShowModal(true); }}
              onDelete={setDeletingEvent}
            />
          ))
        }
      </div>

      {/* -- FAB -- */}
      <button
        onClick={() => { setEditingEvent(null); setShowModal(true); }}
        style={{
          position: "fixed",
          right: "max(20px, calc(50vw - 300px))",
          bottom: "calc(var(--nav-h) + max(20px, env(safe-area-inset-bottom,0px)) + 8px)",
          width: 56, height: 56, borderRadius: 28,
          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
          color: "white", fontSize: 26, fontWeight: 300,
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(79,70,229,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 40, transition: "transform 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >+</button>

      {showModal && (
        <EventModal event={editingEvent} onSave={handleSave}
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
