import React from 'react';
import StatusBadge from './StatusBadge';
import './CustomerCard.css';

export default function CustomerCard({ profile, onClick }) {
  const fullName = `${profile.first_name} ${profile.last_name}`;
  const initials = `${profile.first_name[0]}${profile.last_name[0]}`;

  return (
    <div className="customer-card" onClick={onClick}>
      <div className="cc-header">
        <div className="cc-avatar-wrap">
          <img
            className="cc-avatar"
            src={profile.photo_url}
            alt={fullName}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div className="cc-avatar-fallback" style={{ display: 'none' }}>
            {initials}
          </div>
          {profile.verified && <span className="cc-verified">✓</span>}
        </div>

        <div className="cc-info">
          <div className="cc-name">{fullName}</div>
          <div className="cc-sub">
            {profile.age} yrs · {profile.gender === 'Male' ? '♂' : '♀'} · {profile.city}
          </div>
          <div className="cc-job">{profile.designation}</div>
        </div>
      </div>

      <div className="cc-footer">
        <StatusBadge status={profile.status} />
        <span className="cc-religion">{profile.religion}</span>
      </div>
    </div>
  );
}
