import { NavLink, useNavigate } from 'react-router-dom';
import { getInitials } from '../utils';
import './Sidebar.css';

function Sidebar({ user, showToast }) {
  const navigate = useNavigate();
  const nameParts = (user.name || user.username || 'User').split(' ');
  const initials = getInitials(nameParts[0], nameParts[1]) || 'U';

  const signOut = () => {
    localStorage.removeItem('synora_user');
    navigate('/login', { replace: true });
  };



  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-wordmark"><span>S</span>ynora</div>
        <div className="sidebar-tagline">Matchmaker Workspace</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Customers</span>
        </NavLink>

        <div className="sidebar-section-label" style={{ marginTop: 16 }}>Reports</div>
        <NavLink
          to="/analytics"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3v18h18" />
            <path d="m7 15 4-4 3 3 5-7" />
          </svg>
          <span>Analytics</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-name">{user.name || user.username || 'Matchmaker'}</div>
            {user.username && (
              <div className="sidebar-role">@{user.username}</div>
            )}
          </div>
        </div>
        <button type="button" className="sidebar-signout" onClick={signOut}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
