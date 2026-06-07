import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils';
import './Topbar.css';

function Topbar({ title, count, user }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const nameParts = (user.name || user.username || 'User').split(' ');
  const initials = getInitials(nameParts[0], nameParts[1]) || 'U';
  const displayName = user.name || user.username || 'Matchmaker';
  const username = user.username || '';

  const signOut = () => {
    localStorage.removeItem('synora_user');
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        {count !== null && (
          <span className="topbar-count-badge">{count}</span>
        )}
      </div>
      <div className="topbar-right">
        <div className="topbar-profile" onClick={() => setDropdownOpen((prev) => !prev)}>
          <div className="topbar-avatar">{initials}</div>
          <svg className="topbar-chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {dropdownOpen && (
          <>
            <div className="topbar-overlay" onClick={() => setDropdownOpen(false)} />
            <div className="topbar-dropdown" role="menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">{initials}</div>
                <div className="dropdown-info">
                  <div className="dropdown-name">{displayName}</div>
                  {username && <div className="dropdown-username">@{username}</div>}
                </div>
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item danger"
                role="menuitem"
                onClick={signOut}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
