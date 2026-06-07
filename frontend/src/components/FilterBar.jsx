import { useEffect, useRef, useState } from 'react';
import './FilterBar.css';

const statuses = ['New Lead', 'Profile Verification', 'Active Matching', 'Meeting Scheduled', 'Follow Up', 'Matched', 'Closed'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Surat', 'Vadodara', 'Indore', 'Bhopal', 'Lucknow', 'Nagpur'];

function FilterBar({ filters, onFiltersChange }) {
  const [search, setSearch] = useState(filters.search || '');
  const hasFilters = filters.search || filters.status || filters.gender || filters.city;

  const onFiltersChangeRef = useRef(onFiltersChange);
  const filtersRef = useRef(filters);
  useEffect(() => { onFiltersChangeRef.current = onFiltersChange; }, [onFiltersChange]);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChangeRef.current({ ...filtersRef.current, search });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setSearch('');
    onFiltersChange({ search: '', status: '', gender: '', city: '' });
  };

  return (
    <div className="filter-bar">
      <div className="filter-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or company…"
        />
        {search && (
          <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="filter-selects">
        <select className="field-control" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="field-control" value={filters.gender} onChange={(e) => updateFilter('gender', e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select className="field-control" value={filters.city} onChange={(e) => updateFilter('city', e.target.value)}>
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {hasFilters && (
          <button type="button" className="filter-clear" onClick={clearFilters}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
