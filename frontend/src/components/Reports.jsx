import { useEffect, useState } from 'react';
import API_BASE from '../config';
import { formatIndianCurrency } from '../utils';
import './Reports.css';

const REPORT_TYPES = [
  {
    key: 'matched',
    title: 'Matched Profiles',
    description: 'All profiles with Matched status',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    color: 'success',
    filter: (c) => c.status === 'Matched',
  },
  {
    key: 'active',
    title: 'Active Matching',
    description: 'Profiles currently in active matching',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: 'accent',
    filter: (c) => c.status === 'Active Matching',
  },
  {
    key: 'followup',
    title: 'Needs Follow-up',
    description: 'Follow Up + Meeting Scheduled profiles',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: 'warning',
    filter: (c) => ['Follow Up', 'Meeting Scheduled'].includes(c.status),
  },
  {
    key: 'verified',
    title: 'Verified Profiles',
    description: 'All profiles marked as verified',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 11 3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: 'info',
    filter: (c) => c.verified === true,
  },
];

function ReportTable({ customers }) {
  if (!customers.length) {
    return <div className="report-empty">No profiles in this report.</div>;
  }
  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>City</th>
            <th>Religion</th>
            <th>Designation</th>
            <th>Annual Income</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={c.id}>
              <td className="report-td-num">{i + 1}</td>
              <td className="report-td-name">{c.first_name} {c.last_name}</td>
              <td>{c.age || '—'}</td>
              <td>{c.gender || '—'}</td>
              <td>{c.city || '—'}</td>
              <td>{c.religion || '—'}</td>
              <td>{c.designation || '—'}</td>
              <td>{formatIndianCurrency(c.annual_income)}</td>
              <td>
                <span className={`report-status report-status--${(c.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                  {c.status || '—'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reports({ setTitle, setCount }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    setTitle('Reports');
    setCount(null);
  }, [setTitle, setCount]);

  useEffect(() => {
    fetch(`${API_BASE}/customers`)
      .then((r) => r.json())
      .then((d) => setCustomers(Array.isArray(d) ? d : d.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const activeConfig = REPORT_TYPES.find((r) => r.key === activeReport);
  const filteredCustomers = activeConfig ? customers.filter(activeConfig.filter) : [];

  if (loading) {
    return (
      <div className="reports-loading page-fade">
        <div className="reports-spinner" />
        <span>Loading reports…</span>
      </div>
    );
  }

  return (
    <div className="reports page-fade">
      <div className="reports-header">
        <h1>Reports</h1>
        <p>Select a report below to view the matching profiles</p>
      </div>

      {/* Report type tiles */}
      <div className="report-tiles">
        {REPORT_TYPES.map((rt) => {
          const count = customers.filter(rt.filter).length;
          return (
            <button
              key={rt.key}
              type="button"
              className={`report-tile report-tile--${rt.color} ${activeReport === rt.key ? 'active' : ''}`}
              onClick={() => setActiveReport(activeReport === rt.key ? null : rt.key)}
            >
              <div className="report-tile-icon">{rt.icon}</div>
              <div className="report-tile-body">
                <div className="report-tile-title">{rt.title}</div>
                <div className="report-tile-desc">{rt.description}</div>
              </div>
              <div className="report-tile-count">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Report table */}
      {activeReport && activeConfig && (
        <div className="report-result page-fade">
          <div className="report-result-header">
            <div>
              <h2>{activeConfig.title}</h2>
              <p>{filteredCustomers.length} profile{filteredCustomers.length !== 1 ? 's' : ''} found</p>
            </div>
            <button
              type="button"
              className="report-close-btn"
              onClick={() => setActiveReport(null)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
          <ReportTable customers={filteredCustomers} />
        </div>
      )}
    </div>
  );
}

export default Reports;
