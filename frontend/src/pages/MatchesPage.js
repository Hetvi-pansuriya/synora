import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MatchCard from '../components/MatchCard';
import { getCustomer, getMatches } from '../api';
import './MatchesPage.css';

export default function MatchesPage({ customerId, user, onBack, onBackToDashboard }) {
  const [customer, setCustomer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [cust, matchList] = await Promise.all([
          getCustomer(customerId),
          getMatches(customerId)
        ]);
        setCustomer(cust);
        setMatches(matchList);
      } catch (err) {
        setError('Failed to load matches. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [customerId]);

  function getHighCount() { return matches.filter(m => m.score >= 75).length; }
  function getGoodCount() { return matches.filter(m => m.score >= 55 && m.score < 75).length; }

  return (
    <div className="matches-layout">
      <Sidebar user={user} onLogout={() => {}} activePage="customers" />

      <main className="matches-main">
        <div className="matches-nav">
          <button className="back-btn" onClick={onBack}>
            ← Back to Profile
          </button>
          <button className="back-btn" onClick={onBackToDashboard} style={{ marginLeft: 'auto' }}>
            Dashboard →
          </button>
        </div>

        {loading ? (
          <div className="matches-loading">
            <div className="loading-spinner" />
            <div>
              <div className="loading-title">Finding Compatible Matches</div>
              <div className="loading-sub">Synora AI is analyzing compatibility — this may take a moment...</div>
            </div>
          </div>
        ) : error ? (
          <div className="matches-error">{error}</div>
        ) : (
          <>
            {/* Header */}
            <div className="matches-header">
              <div>
                <h1 className="matches-title">
                  AI Matches for{' '}
                  <span className="serif-italic">
                    {customer?.first_name} {customer?.last_name}
                  </span>
                </h1>
                <p className="matches-sub">
                  {customer?.age} yrs · {customer?.city} · {customer?.designation} at {customer?.company}
                </p>
              </div>

              <div className="matches-summary">
                <div className="summary-pill summary-high">
                  <span className="pill-num">{getHighCount()}</span>
                  <span>High Potential</span>
                </div>
                <div className="summary-pill summary-good">
                  <span className="pill-num">{getGoodCount()}</span>
                  <span>Good Match</span>
                </div>
                <div className="summary-pill summary-all">
                  <span className="pill-num">{matches.length}</span>
                  <span>Total Matches</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="matches-divider">
              <span>Ranked by Compatibility Score</span>
            </div>

            {matches.length === 0 ? (
              <div className="matches-empty">
                <div className="empty-icon">◈</div>
                <p>No compatible matches found for this profile based on current preferences.</p>
              </div>
            ) : (
              <div className="matches-grid">
                {matches.map((match, i) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    customerName={customer?.first_name}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
