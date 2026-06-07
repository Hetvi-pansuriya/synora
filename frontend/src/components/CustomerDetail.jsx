import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE from '../config';
import { formatDate, formatIndianCurrency, getInitials, getProfileDateOfBirth, timeAgo } from '../utils';
import NoteSection from './NoteSection';
import StatusBadge from './StatusBadge';
import './CustomerDetail.css';

const statusOptions = ['New Lead', 'Profile Verification', 'Active Matching', 'Meeting Scheduled', 'Follow Up', 'Matched', 'Closed'];

function FieldRow({ label, value }) {
  return (
    <div className="detail-field-row">
      <div className="detail-field-label">{label}</div>
      <div className="detail-field-value">{value || '—'}</div>
    </div>
  );
}

function CustomerDetail({ setTitle, setCount, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setCount(null);
    fetch(`${API_BASE}/customers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setTitle(`${data.first_name || ''} ${data.last_name || ''}`.trim());
      });
    fetch(`${API_BASE}/customers/${id}/notes`)
      .then((r) => r.json())
      .then((data) => setNotes(Array.isArray(data) ? data : data.notes || []))
      .catch(() => setNotes([]));
  }, [id, setTitle, setCount]);

  const updateStatus = async (status) => {
    const previous = profile.status;
    setProfile({ ...profile, status });
    try {
      await fetch(`${API_BASE}/customers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      showToast({ title: 'Status updated', message: `Changed to "${status}"` });
    } catch {
      setProfile({ ...profile, status: previous });
      showToast({ title: 'Error', message: 'Could not update status' });
    }
  };

  if (!profile) {
    return (
      <div className="detail-loading page-fade">
        <div className="detail-loading-spinner" />
        <span>Loading profile…</span>
      </div>
    );
  }

  const initials = getInitials(profile.first_name, profile.last_name);
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  const tabs = [
    { key: 'personal', label: 'Personal & Family' },
    { key: 'career',   label: 'Career & Education' },
    { key: 'lifestyle', label: 'Lifestyle' },
  ];

  const fields = {
    personal: [
      ['First Name', profile.first_name],
      ['Last Name', profile.last_name],
      ['Gender', profile.gender],
      ['Date of Birth', formatDate(getProfileDateOfBirth(profile))],
      ['Age', profile.age ? `${profile.age} years` : null],
      ['Height', profile.height_cm ? `${profile.height_cm} cm` : null],
      ['Weight', profile.weight_kg ? `${profile.weight_kg} kg` : null],
      ['Complexion', profile.complexion],
      ['Blood Group', profile.blood_group],
      ['Email', profile.email],
      ['Phone', profile.phone],
      ['City', profile.city],
      ['State', profile.state],
      ['Country', profile.country],
      ["Father's Name", profile.father_name],
      ["Father's Occupation", profile.father_occupation],
      ["Mother's Name", profile.mother_name],
      ["Mother's Occupation", profile.mother_occupation],
      ['Siblings', profile.siblings],
      ['Family Type', profile.family_type],
      ['Family Values', profile.family_values],
      ['Religion', profile.religion],
      ['Caste', profile.caste],
      ['Mother Tongue', profile.mother_tongue],
      ['Languages Known', profile.languages],
      ['Marital Status', profile.marital_status],
    ],
    career: [
      ['Degree', profile.degree],
      ['College / University', profile.college],
      ['Postgraduate', profile.postgraduate || 'None'],
      ['Current Company', profile.company],
      ['Designation', profile.designation],
      ['Annual Income', formatIndianCurrency(profile.annual_income)],
      ['Work Mode', profile.work_mode],
    ],
    lifestyle: [
      ['Diet', profile.diet],
      ['Smoking', profile.smoking],
      ['Drinking', profile.drinking],
      ['Exercise', profile.exercise],
      ['Hobbies', profile.hobbies],
      ['Pets', profile.pets],
      ['Open to Pets', profile.open_to_pets],
      ['Want Kids', profile.want_kids],
      ['Open to Relocate', profile.open_to_relocate],
      ['Partner Age Range', (profile.partner_age_min || profile.partner_age_max) ? `${profile.partner_age_min || '-'} – ${profile.partner_age_max || '-'} years` : null],
      ['Timeline to Marry', profile.timeline_to_marry],
      ['About Me', profile.about_me],
    ]
  };

  return (
    <div className="customer-detail page-fade">
      {/* Back navigation */}
      <div className="detail-nav">
        <button type="button" className="detail-back-btn" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          All Customers
        </button>
        <span className="detail-last-activity">Last activity: {timeAgo(profile.last_activity)}</span>
      </div>

      {/* Header Card */}
      <section className="detail-header-card">
        <div className="detail-header-photo-col">
          {!imageError && profile.photo_url ? (
            <img
              className="detail-photo"
              src={profile.photo_url}
              alt=""
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="detail-photo fallback">{initials}</div>
          )}
        </div>

        <div className="detail-header-info">
          <div className="detail-header-name-row">
            <h1>{fullName}</h1>
            {profile.verified && <span className="verified-pill">Verified</span>}
          </div>

          <p className="detail-header-sub">
            {[profile.age ? `${profile.age} yrs` : null, profile.city, profile.religion].filter(Boolean).join(' · ')}
          </p>
          <p className="detail-header-job">
            {[profile.designation, profile.company].filter(Boolean).join(' at ')}
          </p>

          <div className="detail-income-row">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {formatIndianCurrency(profile.annual_income)}
          </div>

          <div className="detail-status-row">
            <StatusBadge status={profile.status} />
            <div className="detail-status-select-wrap">
              <label htmlFor={`status-select-${id}`} className="sr-only">Change status</label>
              <select
                id={`status-select-${id}`}
                className="field-control detail-status-select"
                value={profile.status || ''}
                onChange={(e) => updateStatus(e.target.value)}
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="detail-header-quick">
          <div className="quick-info-item">
            <span className="quick-info-label">Gender</span>
            <span className="quick-info-value">{profile.gender || '—'}</span>
          </div>
          <div className="quick-info-item">
            <span className="quick-info-label">Marital Status</span>
            <span className="quick-info-value">{profile.marital_status || '—'}</span>
          </div>
          <div className="quick-info-item">
            <span className="quick-info-label">Mother Tongue</span>
            <span className="quick-info-value">{profile.mother_tongue || '—'}</span>
          </div>
          <div className="quick-info-item">
            <span className="quick-info-label">Family Type</span>
            <span className="quick-info-value">{profile.family_type || '—'}</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="detail-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`detail-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <section className="detail-fields" key={activeTab}>
        {fields[activeTab].map(([label, value]) => (
          <FieldRow key={label} label={label} value={value} />
        ))}
      </section>

      {/* Notes */}
      <NoteSection customerId={id} notes={notes} setNotes={setNotes} />

      {/* Matches CTA */}
      <div className="matches-cta-wrap">
        <button
          type="button"
          className="matches-cta"
          onClick={() => navigate(`/customers/${id}/matches`)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>View Suggested Matches</span>
        </button>
      </div>
    </div>
  );
}

export default CustomerDetail;
