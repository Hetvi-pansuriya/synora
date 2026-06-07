import { useEffect, useState } from 'react';
import API_BASE from '../config';
import CustomerCard from './CustomerCard';
import FilterBar from './FilterBar';
import SkeletonCard from './SkeletonCard';
import './Dashboard.css';

function deriveStats(rows) {
  return rows.reduce((acc, profile) => {
    const status = profile.status || '';
    acc.total += 1;
    if (status === 'Active Matching') acc.active += 1;
    if (status === 'Matched') acc.matched += 1;
    if (['New Lead', 'Profile Verification', 'Follow Up', 'Meeting Scheduled'].includes(status)) acc.pending += 1;
    return acc;
  }, { total: 0, active: 0, matched: 0, pending: 0 });
}

// Always derive from real customer data — the /stats endpoint can return stale/zero values
function computeStats(allProfiles, statsData) {
  const derived = deriveStats(allProfiles);
  return {
    // Use backend total only if we have no profiles (edge case), else use real count
    total: allProfiles.length || Number(statsData?.total ?? 0),
    // Always use derived values for per-status counts — they come from real profile.status fields
    active: derived.active,
    matched: derived.matched,
    pending: derived.pending,
  };
}

const TODAY = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function Dashboard({ setTitle, setCount }) {
  const [stats, setStats] = useState({ total: 0, active: 0, matched: 0, pending: 0 });
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', gender: '', city: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle('Customers');
  }, [setTitle]);

  useEffect(() => {
    async function loadStats() {
      let allProfiles = [];
      let statsData = null;
      try {
        // Fetch ALL customers (no filters) to compute accurate status-based stats
        const r = await fetch(`${API_BASE}/customers`);
        const d = await r.json();
        allProfiles = Array.isArray(d) ? d : d.customers || [];
      } catch { allProfiles = []; }
      try {
        const r = await fetch(`${API_BASE}/stats`);
        statsData = await r.json();
      } catch { statsData = null; }
      // Derive from real customer data — not from /stats which can be stale
      setStats(computeStats(allProfiles, statsData));
    }
    loadStats();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setLoading(true);
    fetch(`${API_BASE}/customers?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        const rows = Array.isArray(data) ? data : data.customers || [];
        setProfiles(rows);
        setCount(rows.length);
      })
      .catch(() => { setProfiles([]); setCount(0); })
      .finally(() => setLoading(false));
  }, [filters, setCount]);

  const statCards = [
    {
      label: 'Total Profiles',
      value: stats.total,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: 'default'
    },
    {
      label: 'Active Matching',
      value: stats.active,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: 'accent'
    },
    {
      label: 'Matched',
      value: stats.matched,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      color: 'success'
    },
    {
      label: 'Pending Follow-up',
      value: stats.pending,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      color: 'warning'
    }
  ];

  return (
    <div className="dashboard page-fade">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Customers</h1>
          <p className="dashboard-date">{TODAY}</p>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="stat-strip">
        {statCards.map((card, i) => (
          <article className={`stat-card stat-card--${card.color}`} key={card.label} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="stat-card-icon">{card.icon}</div>
            <div className="stat-card-body">
              <div className="stat-number">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </article>
        ))}
      </div>

      {/* Workbench */}
      <section className="dashboard-workbench">
        <div className="workbench-header">
          <div className="workbench-header-left">
            <h2>All Profiles</h2>
            <p>
              {loading
                ? 'Loading…'
                : profiles.length
                  ? `${profiles.length} profile${profiles.length !== 1 ? 's' : ''} found`
                  : 'No profiles match your filters'}
            </p>
          </div>
        </div>

        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {loading ? (
          <div className="customer-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : profiles.length ? (
          <div className="customer-grid">
            {profiles.map((profile) => (
              <CustomerCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 120 80" aria-hidden="true">
              <ellipse cx="60" cy="40" rx="36" ry="28" />
            </svg>
            <div className="empty-state-title">No profiles found</div>
            <p>Try adjusting or clearing your filters</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
