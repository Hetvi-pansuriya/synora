import React, { useState } from 'react';
import './MatchCard.css';

function ScoreRing({ score }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = score >= 75 ? '#9c4dcc' : score >= 55 ? '#1976d2' : '#757575';

  return (
    <div className="score-ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#f0e8dc" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div className="score-ring-value" style={{ color }}>{score}</div>
    </div>
  );
}

export default function MatchCard({ match, customerName }) {
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  function handleSendMatch() {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  }

  const fullName = `${match.first_name} ${match.last_name}`;
  const initials = `${match.first_name[0]}${match.last_name[0]}`;

  function formatIncome(val) {
    if (!val) return '—';
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  }

  return (
    <div className="match-card">
      {/* Top: Photo + Score */}
      <div className="match-card-top">
        <div className="match-photo-wrap">
          <img
            className="match-photo"
            src={match.photo_url}
            alt={fullName}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="match-photo-fallback" style={{ display: 'none' }}>
            {initials}
          </div>
          {match.verified && <span className="match-verified">✓</span>}
        </div>

        <div className="match-info">
          <div className="match-name">{fullName}</div>
          <div className="match-sub">{match.age} yrs · {match.city}</div>
          <div className="match-job">{match.designation}</div>
          <div className="match-company">{match.company}</div>
          <div className="match-income">{formatIncome(match.annual_income)} / yr</div>
        </div>

        <ScoreRing score={match.score} />
      </div>

      {/* Label */}
      <div className={`match-label match-label-${match.score >= 75 ? 'high' : match.score >= 55 ? 'good' : 'possible'}`}>
        {match.emoji} {match.label}
      </div>

      {/* AI Explanation */}
      {match.ai_explanation && (
        <div className="match-explanation">
          <div className="match-explanation-header">✦ Synora says</div>
          <p className="match-explanation-text">{match.ai_explanation}</p>
        </div>
      )}

      {/* Strengths & Concerns */}
      <div className="match-tags-section">
        {match.strengths && match.strengths.length > 0 && (
          <div className="match-tags">
            {match.strengths.slice(0, 4).map((s, i) => (
              <span key={i} className="tag tag-strength">✓ {s}</span>
            ))}
          </div>
        )}
        {match.concerns && match.concerns.length > 0 && (
          <div className="match-tags">
            {match.concerns.slice(0, 2).map((c, i) => (
              <span key={i} className="tag tag-concern">⚠ {c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="match-actions">
        <button
          className="action-btn action-btn-secondary"
          onClick={() => setShowEmail(e => !e)}
        >
          {showEmail ? 'Hide Email' : '✉ View Intro Email'}
        </button>
        <button
          className={`action-btn action-btn-primary ${emailSent ? 'sent' : ''}`}
          onClick={handleSendMatch}
        >
          {emailSent ? '✓ Match Sent!' : '↗ Send Match'}
        </button>
      </div>

      {/* Email Preview */}
      {showEmail && match.intro_email && (
        <div className="email-preview">
          <div className="email-preview-header">
            <span>Introduction Email</span>
            <button
              className="email-copy-btn"
              onClick={() => navigator.clipboard.writeText(match.intro_email)}
            >
              Copy
            </button>
          </div>
          <pre className="email-body">{match.intro_email}</pre>
        </div>
      )}
    </div>
  );
}
