import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import CustomerCard from '../components/CustomerCard';
import { getStats, getCustomers } from '../api';
import './DashboardPage.css';

const STATUS_OPTIONS = [
  '', 'New Lead', 'Profile Verification', 'Active Matching',
  'Meeting Scheduled', 'Follow Up', 'Matched', 'Closed'
];

const GENDER_OPTIONS = ['', 'Male', 'Female'];

export default function DashboardPage({ user, onLogout, onSelectCustomer }) {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCustomers({ status: statusFilter, gender: genderFilter, search })
      .then(data => { setCustomers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [statusFilter, genderFilter, search]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} onLogout={onLogout} activePage="dashboard" />

      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Good morning, {user.name?.split(' ')[0] || 'Matchmaker'}</h1>
            <p className="dashboard-sub">Here's an overview of your matchmaking pipeline</p>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="stats-grid">
            <StatCard label="Total Profiles" value={stats.total} icon="◈" accent="gold" />
            <StatCard label="Active Members" value={stats.active} icon="◎" />
            <StatCard label="Successful Matches" value={stats.matched} icon="♡" accent="rose" />
            <StatCard label="Verified Profiles" value={stats.verified} icon="✓" />
            <StatCard label="New Leads" value={stats.pending} icon="◷" />
            <StatCard label="Male / Female" value={`${stats.male} / ${stats.female}`} icon="⚥" />
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, company, designation..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
            {search && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => { setSearch(''); setSearchInput(''); }}
              >
                ✕ Clear
              </button>
            )}
          </form>

          <div className="filter-selects">
            <select
              className="filter-select"
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              {GENDER_OPTIONS.filter(Boolean).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.filter(Boolean).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Grid */}
        <div className="section-title-row">
          <h2 className="section-title">Your Clients</h2>
          <span className="customer-count">{customers.length} profiles</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>Loading profiles...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <p>No profiles found matching your filters.</p>
          </div>
        ) : (
          <div className="customers-grid">
            {customers.map(c => (
              <CustomerCard
                key={c.id}
                profile={c}
                onClick={() => onSelectCustomer(c.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
