import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE from '../config';
import MatchCard from './MatchCard';
import SendMatchModal from './SendMatchModal';
import './MatchesView.css';

const loadingMessages = [
  'Fetching profiles…',
  'Comparing key details…',
  'Reviewing preferences…',
  'Checking family values…',
  'Sorting by score…',
];

function MatchesView({ setTitle, setCount, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [sentMatchIds, setSentMatchIds] = useState([]);

  useEffect(() => {
    setTitle('Suggested Matches');
    setCount(null);
  }, [setTitle, setCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadMatches() {
      try {
        const cr = await fetch(`${API_BASE}/customers/${id}`);
        const cd = await cr.json();
        if (!active) return;
        setCustomer(cd);
        setTitle(`${cd.first_name || ''} ${cd.last_name || ''}`.trim());

        const mr = await fetch(`${API_BASE}/customers/${id}/matches`);
        const md = await mr.json();
        const rows = Array.isArray(md) ? md : md.matches || [];
        if (!active) return;
        setMatches(rows);
        setCount(rows.length);
      } catch {
        if (active) { setMatches([]); setCount(0); }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMatches();
    return () => { active = false; };
  }, [id, setTitle, setCount]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`synora_sent_matches_${id}`) || '[]');
    setSentMatchIds(stored);
  }, [id]);

  const sentToast = (match) => {
    const nextIds = Array.from(new Set([...sentMatchIds, match.id]));
    setSentMatchIds(nextIds);
    localStorage.setItem(`synora_sent_matches_${id}`, JSON.stringify(nextIds));
    showToast({ title: 'Match sent!', message: `${match.first_name} introduced to ${customer?.first_name}` });
  };

  if (loading) {
    return (
      <div className="matches-loading page-fade">
        <div className="matches-spinner" />
        <div className="loading-message">{loadingMessages[messageIndex]}</div>
        <div className="loading-subtext">This may take a few seconds</div>
        <div className="progress-track"><div className="progress-bar" /></div>
      </div>
    );
  }

  return (
    <div className="matches-view page-fade">
      {selectedMatch && customer && (
        <SendMatchModal
          match={selectedMatch}
          customer={customer}
          onClose={() => setSelectedMatch(null)}
          onSent={sentToast}
        />
      )}

      <div className="matches-header">
        <button type="button" className="matches-back-btn" onClick={() => navigate(`/customers/${id}`)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          Back to {customer?.first_name || 'Customer'}
        </button>

        <div className="matches-header-info">
          <h1>Suggested Matches</h1>
          <p>
            {matches.length > 0
              ? `${matches.length} profile${matches.length !== 1 ? 's' : ''} · Ranked by match score`
              : 'No matches found for this profile'}
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="matches-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p>No match profiles found</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              index={index}
              onSend={setSelectedMatch}
              isSent={sentMatchIds.includes(match.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchesView;
