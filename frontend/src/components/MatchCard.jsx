import { useState } from 'react';
import { formatIndianCurrency, getInitials } from '../utils';
import './MatchCard.css';

function scoreKind(score) {
  if (score >= 75) return 'high';
  if (score >= 55) return 'good';
  return 'possible';
}

function MatchCard({ match, index, onSend, isSent }) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(match.first_name, match.last_name);
  const kind = scoreKind(match.score);
  const scoreLabel = kind === 'high' ? 'Strong Match' : kind === 'good' ? 'Good Match' : 'Possible Match';

  return (
    <article className="match-card" style={{ animationDelay: `${index * 70}ms` }}>
      {/* Left: Profile */}
      <div className="match-left">
        {!imageError && match.photo_url ? (
          <img className="match-photo" src={match.photo_url} alt="" onError={() => setImageError(true)} />
        ) : (
          <div className="match-photo fallback">{initials}</div>
        )}
        <div className="match-left-info">
          <div className="match-name">{match.first_name} {match.last_name}</div>
          <div className="match-muted">{match.age || '-'} yrs · {match.city || '-'}</div>
          <div className="match-designation">{match.designation || '-'}</div>
          {match.verified && <span className="verified-pill">Verified</span>}
        </div>
      </div>

      {/* Center: Score & Notes */}
      <div className="match-center">
        <div className="score-row">
          <div className={`score-circle ${kind}`}>{match.score || 0}</div>
          <div className="score-info">
            <span className={`score-label ${kind}`}>{scoreLabel}</span>
          </div>
        </div>

        {match.ai_explanation && (
          <p className="match-notes">{match.ai_explanation}</p>
        )}

        {(match.strengths || []).length > 0 && (
          <div className="chips">
            {match.strengths.map((item) => (
              <span className="chip strength" key={item}>{item}</span>
            ))}
          </div>
        )}

        {(match.concerns || []).length > 0 && (
          <div className="chips">
            {match.concerns.map((item) => (
              <span className="chip concern" key={item}>{item}</span>
            ))}
          </div>
        )}
      </div>

      {/* Right: Details & Action */}
      <div className="match-right">
        <div className="match-info-block">
          <span className="match-info-label">Income</span>
          <span className="match-info-value">{formatIndianCurrency(match.annual_income)}</span>
        </div>
        <div className="match-info-block">
          <span className="match-info-label">Religion</span>
          <span className="match-info-value">{match.religion || '—'}</span>
        </div>
        <div className="match-info-block">
          <span className="match-info-label">Company</span>
          <span className="match-info-value">{match.company || '—'}</span>
        </div>

        <button
          type="button"
          className={`match-send-btn ${isSent ? 'sent' : ''}`}
          disabled={isSent}
          onClick={() => onSend(match)}
        >
          {isSent ? (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5" /></svg>
              Sent
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send Match
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default MatchCard;
