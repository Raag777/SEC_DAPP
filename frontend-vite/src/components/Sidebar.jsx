// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "text-slate-700 hover:bg-white/30"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 p-5 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-md border-r border-white/20">
      <div className="mb-8">
        <div className="rounded-xl p-3 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-bold text-lg flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-md">🌞</div>
          <div>SEC DApp</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <NavItem to="/producer"> 
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" /></svg>
          Producer
        </NavItem>

        <NavItem to="/company">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M3 11h18" /></svg>
          Company Dashboard
        </NavItem>

        <NavItem to="/explorer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7v10l8-5L8 7z" /></svg>
          Explorer
        </NavItem>

        <NavItem to="/certificate/1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3" /></svg>
          Viewer
        </NavItem>

        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-slate-600">
          <div className="mb-2 px-2">Utilities</div>
          <NavItem to="/admin">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg>
            Admin
          </NavItem>
        </div>
      </nav>
    </aside>
  );
}
