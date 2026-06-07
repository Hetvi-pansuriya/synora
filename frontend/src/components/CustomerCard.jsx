import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils';
import StatusBadge from './StatusBadge';
import './CustomerCard.css';

function CustomerCard({ profile }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(profile.first_name, profile.last_name);

  return (
    <article className="customer-card" onClick={() => navigate(`/customers/${profile.id}`)}>
      <div className="customer-card-inner">
        <div className="customer-card-top">
          {!imageError && profile.photo_url ? (
            <img
              className="customer-photo"
              src={profile.photo_url}
              alt=""
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="customer-photo fallback">{initials}</div>
          )}
          <div className="customer-headline">
            <div className="customer-name">{profile.first_name} {profile.last_name}</div>
            <div className="customer-meta">
              <span>{profile.age || '-'} yrs</span>
              <span className="dot">·</span>
              <span>{profile.city || '-'}</span>
            </div>
          </div>
        </div>

        <div className="customer-divider" />

        <div className="customer-details">
          <div className="customer-detail-row">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>{profile.designation || '-'}{profile.company ? ` · ${profile.company}` : ''}</span>
          </div>
          <div className="customer-detail-row">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{profile.religion || '-'}</span>
          </div>
        </div>

        <div className="customer-card-bottom">
          <StatusBadge status={profile.status} />
          {profile.verified && <span className="verified-pill">Verified</span>}
        </div>
      </div>
    </article>
  );
}

export default CustomerCard;
