import React from 'react';
import './Sidebar.css';

export default function Sidebar({ user, onLogout, activePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">✦</span>
        <span className="sidebar-name">Synora</span>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user.name ? user.name[0] : 'M'}
        </div>
        <div>
          <div className="sidebar-user-name">{user.name || user.username}</div>
          <div className="sidebar-user-role">Matchmaker</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className={`sidebar-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
          <span className="nav-icon">◫</span>
          <span>Dashboard</span>
        </div>
        <div className={`sidebar-nav-item ${activePage === 'customers' ? 'active' : ''}`}>
          <span className="nav-icon">♡</span>
          <span>Customers</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <span>↩</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
