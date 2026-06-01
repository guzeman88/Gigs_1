import React from 'react';
import { NavLink } from 'react-router-dom';

function ScheduleIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="6"  width="17" height="2"   rx="1" fill={active ? '#4f46e5' : '#94a3b8'} />
      <rect x="3.5" y="11" width="17" height="2"   rx="1" fill={active ? '#4f46e5' : '#94a3b8'} />
      <rect x="3.5" y="16" width="11" height="2"   rx="1" fill={active ? '#4f46e5' : '#94a3b8'} />
    </svg>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="3"
        fill={active ? '#4f46e5' : 'none'}
        stroke={active ? '#4f46e5' : '#94a3b8'} strokeWidth="1.8"/>
      <path d="M3 10h18" stroke={active ? 'white' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 3v4M16 3v4" stroke={active ? '#4f46e5' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round"/>
      {active && <>
        <circle cx="8"  cy="15" r="1.2" fill="white"/>
        <circle cx="12" cy="15" r="1.2" fill="white"/>
        <circle cx="16" cy="15" r="1.2" fill="white"/>
      </>}
    </svg>
  );
}

export default function Navigation() {
  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 640, zIndex: 50,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(226,232,240,0.8)',
      }}
    >
      <div className="flex" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))' }}>
        <NavLink to="/" end style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 4, textDecoration: 'none' }}>
          {({ isActive }) => (<>
            <div style={{ transition: 'transform 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
              <ScheduleIcon active={isActive} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: isActive ? '#4f46e5' : '#94a3b8' }}>
              SCHEDULE
            </span>
          </>)}
        </NavLink>

        <NavLink to="/calendar" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 4, textDecoration: 'none' }}>
          {({ isActive }) => (<>
            <div style={{ transition: 'transform 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
              <CalendarIcon active={isActive} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: isActive ? '#4f46e5' : '#94a3b8' }}>
              CALENDAR
            </span>
          </>)}
        </NavLink>
      </div>
    </nav>
  );
}
