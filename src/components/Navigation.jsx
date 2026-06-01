import React from 'react';
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
