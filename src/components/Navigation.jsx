import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  const base =
    'flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors';
  const active = 'text-blue-600';
  const inactive = 'text-slate-500 hover:text-slate-700';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex safe-area-inset-bottom z-50">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        List
      </NavLink>

      <NavLink
        to="/calendar"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Calendar
      </NavLink>
    </nav>
  );
}
