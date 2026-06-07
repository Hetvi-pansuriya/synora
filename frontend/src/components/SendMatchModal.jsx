import { useState } from 'react';
import API_BASE from '../config';
import { getInitials } from '../utils';
import './SendMatchModal.css';

function scoreKind(score) {
  if (score >= 75) return 'high';
  if (score >= 55) return 'good';
  return 'possible';
}

function SendMatchModal({ match, customer, onClose, onSent }) {
  void API_BASE;
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState('idle');
  const kind = scoreKind(match.score);
  const matchInitials = getInitials(match.first_name, match.last_name);

  // Get logged-in user's name from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('synora_user') || '{}');
  const senderName = loggedInUser.name || loggedInUser.username || 'Matchmaker';

  const copyEmail = async () => {
    await navigator.clipboard.writeText(match.intro_email || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendMatch = () => {
    if (sendState !== 'idle') return;
    setSendState('sending');
    setTimeout(() => {
      setSendState('sent');
      setTimeout(() => {
        onClose();
        onSent(match);
      }, 600);
    }, 1200);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Introduction Email">
      <div className="send-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Introduction Email</div>
            <div className="modal-subtitle">Sent by {senderName} to {customer.first_name}</div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-divider" />

        {/* Match preview */}
        <div className="match-preview-row">
          {match.photo_url ? (
            <img className="modal-match-photo" src={match.photo_url} alt="" />
          ) : (
            <div className="modal-match-photo fallback">{matchInitials}</div>
          )}
          <div className="match-preview-info">
            <strong>{match.first_name} {match.last_name}</strong>
            <span>{match.designation || '—'} {match.company ? `· ${match.company}` : ''}</span>
          </div>
          <div className={`modal-score ${kind}`}>{match.score || 0}</div>
        </div>

        <div className="modal-divider" />

        {/* Email content */}
        <div className="email-preview-wrap">
          <div className="email-preview-label">Email Draft</div>
          <div className="email-preview">
            {match.intro_email || 'No introduction email was generated for this match.'}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            type="button"
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={copyEmail}
            disabled={!match.intro_email}
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5" /></svg>
                Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Email
              </>
            )}
          </button>
          <button
            type="button"
            className={`send-button ${sendState}`}
            onClick={sendMatch}
            disabled={sendState !== 'idle'}
          >
            {sendState === 'idle' && (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Match
              </>
            )}
            {sendState === 'sending' && (
              <>
                <span className="send-spinner" />
                Sending…
              </>
            )}
            {sendState === 'sent' && (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5" /></svg>
                Sent!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendMatchModal;
