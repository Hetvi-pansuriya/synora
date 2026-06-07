import { useEffect, useState } from 'react';
import API_BASE from '../config';
import './Analytics.css';

/* ── helpers ───────────────────────────────────────────── */

function countBy(rows, key) {
  const map = {};
  rows.forEach((r) => {
    const val = r[key] || 'Unknown';
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function ageGroup(age) {
  if (!age) return 'Unknown';
  if (age < 25) return '18–24';
  if (age < 30) return '25–29';
  if (age < 35) return '30–34';
  if (age < 40) return '35–39';
  return '40+';
}

function incomeGroup(income) {
  if (!income) return 'Unknown';
  const lakh = income / 100000;
  if (lakh < 5)  return '< 5L';
  if (lakh < 10) return '5–10L';
  if (lakh < 20) return '10–20L';
  if (lakh < 30) return '20–30L';
  return '30L+';
}

const incomeOrder = ['< 5L', '5–10L', '10–20L', '20–30L', '30L+'];
const ageOrder    = ['18–24', '25–29', '30–34', '35–39', '40+'];

/* ── chart components ───────────────────────────────────── */

function HorizontalBar({ label, value, max, color = 'var(--color-accent)', percent }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="hbar-row">
      <div className="hbar-label">{label}</div>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="hbar-value">{percent ? `${Math.round(pct)}%` : value}</div>
    </div>
  );
}

function DonutChart({ data, total }) {
  const colors = [
    'var(--color-accent)',
    '#2563EB',
    '#7C3AED',
    '#DB2777',
    '#D97706',
    '#059669',
    '#64748B',
  ];
  const size = 140;
  const r = 52;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  let cumPct = 0;
  const segments = data.map(([label, count], i) => {
    const pct = total > 0 ? count / total : 0;
    const offset = circ * (1 - cumPct);
    const dash = circ * pct;
    cumPct += pct;
    return { label, count, pct, offset, dash, color: colors[i % colors.length] };
  });

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={24}
            strokeDasharray={`${seg.dash} ${circ - seg.dash}`}
            strokeDashoffset={seg.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--color-text-primary)">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">total</text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg) => (
          <div className="donut-legend-item" key={seg.label}>
            <span className="donut-dot" style={{ background: seg.color }} />
            <span className="donut-legend-label">{seg.label}</span>
            <span className="donut-legend-val">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── main component ─────────────────────────────────────── */

function Analytics({ setTitle, setCount }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle('Analytics');
    setCount(null);
  }, [setTitle, setCount]);

  useEffect(() => {
    fetch(`${API_BASE}/customers`)
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : d.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading page-fade">
        <div className="analytics-spinner" />
        <span>Loading data…</span>
      </div>
    );
  }

  const total = customers.length;

  /* derived breakdowns */
  const byStatus   = countBy(customers, 'status');
  const byGender   = countBy(customers, 'gender');
  const byReligion = countBy(customers, 'religion');
  const byCity     = countBy(customers, 'city').slice(0, 8);
  const byAge      = ageOrder.map((g) => [g, customers.filter((c) => ageGroup(c.age) === g).length]);
  const byIncome   = incomeOrder.map((g) => [g, customers.filter((c) => incomeGroup(c.annual_income) === g).length]);
  const byWorkMode = countBy(customers, 'work_mode');
  const byFamilyType = countBy(customers, 'family_type');

  const verified   = customers.filter((c) => c.verified).length;
  const maxCity    = Math.max(...byCity.map(([, v]) => v), 1);
  const maxRelig   = Math.max(...byReligion.map(([, v]) => v), 1);
  const maxAge     = Math.max(...byAge.map(([, v]) => v), 1);
  const maxIncome  = Math.max(...byIncome.map(([, v]) => v), 1);

  const statusColors = {
    'Active Matching':    'var(--color-accent)',
    'Matched':            'var(--color-success)',
    'New Lead':           'var(--color-info)',
    'Profile Verification': '#7C3AED',
    'Meeting Scheduled':  '#4338CA',
    'Follow Up':          'var(--color-warning)',
    'Closed':             '#64748B',
  };

  return (
    <div className="analytics page-fade">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Profile data overview — {total} customer records</p>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="analytics-summary">
        <div className="analytics-summary-card">
          <div className="ascard-value">{verified}</div>
          <div className="ascard-label">Verified profiles</div>
          <div className="ascard-bar">
            <div className="ascard-bar-fill" style={{ width: `${(verified / total) * 100}%` }} />
          </div>
          <div className="ascard-pct">{Math.round((verified / total) * 100)}% of total</div>
        </div>
        <div className="analytics-summary-card">
          <div className="ascard-value">{customers.filter((c) => c.gender === 'Male').length}</div>
          <div className="ascard-label">Male profiles</div>
          <div className="ascard-bar">
            <div className="ascard-bar-fill" style={{ width: `${(customers.filter((c) => c.gender === 'Male').length / total) * 100}%`, background: 'var(--color-info)' }} />
          </div>
          <div className="ascard-pct">{Math.round((customers.filter((c) => c.gender === 'Male').length / total) * 100)}% of total</div>
        </div>
        <div className="analytics-summary-card">
          <div className="ascard-value">{customers.filter((c) => c.gender === 'Female').length}</div>
          <div className="ascard-label">Female profiles</div>
          <div className="ascard-bar">
            <div className="ascard-bar-fill" style={{ width: `${(customers.filter((c) => c.gender === 'Female').length / total) * 100}%`, background: '#DB2777' }} />
          </div>
          <div className="ascard-pct">{Math.round((customers.filter((c) => c.gender === 'Female').length / total) * 100)}% of total</div>
        </div>
        <div className="analytics-summary-card">
          <div className="ascard-value">{Math.round(customers.reduce((s, c) => s + (c.age || 0), 0) / (customers.filter((c) => c.age).length || 1))}</div>
          <div className="ascard-label">Average age</div>
          <div className="ascard-bar">
            <div className="ascard-bar-fill" style={{ width: '60%', background: '#7C3AED' }} />
          </div>
          <div className="ascard-pct">years</div>
        </div>
      </div>

      {/* Row 1: Status + Gender */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Status Breakdown</h2>
            <span>{total} profiles</span>
          </div>
          <div className="status-bar-list">
            {byStatus.map(([label, count]) => (
              <HorizontalBar
                key={label}
                label={label}
                value={count}
                max={total}
                color={statusColors[label] || 'var(--color-accent-muted)'}
              />
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Gender & Family Type</h2>
          </div>
          <div className="donut-section">
            <div className="donut-group">
              <div className="donut-title">Gender</div>
              <DonutChart data={byGender} total={total} />
            </div>
            <div className="donut-divider" />
            <div className="donut-group">
              <div className="donut-title">Family Type</div>
              <DonutChart data={byFamilyType} total={total} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: City + Religion */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Top Cities</h2>
            <span>by profile count</span>
          </div>
          <div className="bar-list">
            {byCity.map(([city, count]) => (
              <HorizontalBar key={city} label={city} value={count} max={maxCity} />
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Religion Distribution</h2>
          </div>
          <div className="bar-list">
            {byReligion.map(([rel, count], i) => (
              <HorizontalBar
                key={rel}
                label={rel}
                value={count}
                max={maxRelig}
                color={['var(--color-accent)', 'var(--color-info)', '#7C3AED', '#DB2777', '#D97706', '#059669', '#64748B'][i % 7]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Age + Income */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Age Distribution</h2>
          </div>
          <div className="vbar-group">
            {byAge.map(([group, count]) => (
              <div className="vbar-col" key={group}>
                <div className="vbar-count">{count}</div>
                <div className="vbar-outer">
                  <div
                    className="vbar-inner"
                    style={{ height: maxAge > 0 ? `${(count / maxAge) * 100}%` : '0%' }}
                  />
                </div>
                <div className="vbar-label">{group}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Annual Income Range</h2>
          </div>
          <div className="vbar-group">
            {byIncome.map(([group, count]) => (
              <div className="vbar-col" key={group}>
                <div className="vbar-count">{count}</div>
                <div className="vbar-outer">
                  <div
                    className="vbar-inner income"
                    style={{ height: maxIncome > 0 ? `${(count / maxIncome) * 100}%` : '0%' }}
                  />
                </div>
                <div className="vbar-label">{group}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Work mode */}
      <div className="analytics-card analytics-card--wide">
        <div className="analytics-card-header">
          <h2>Work Mode Preference</h2>
        </div>
        <div className="workmode-grid">
          {byWorkMode.map(([mode, count]) => (
            <div className="workmode-item" key={mode}>
              <div className="workmode-icon">
                {mode === 'Remote' && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                )}
                {mode === 'Office' && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                )}
                {mode === 'Hybrid' && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                )}
                {!['Remote', 'Office', 'Hybrid'].includes(mode) && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /></svg>
                )}
              </div>
              <div className="workmode-count">{count}</div>
              <div className="workmode-label">{mode}</div>
              <div className="workmode-pct">{Math.round((count / total) * 100)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
