import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { getCustomer, updateStatus, getNotes, addNote, deleteNote } from '../api';
import './CustomerDetailPage.css';

const STATUS_OPTIONS = [
  'New Lead', 'Profile Verification', 'Active Matching',
  'Meeting Scheduled', 'Follow Up', 'Matched', 'Closed'
];

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <div className="info-section">
      <div className="info-section-title">{title}</div>
      <div className="info-rows">{children}</div>
    </div>
  );
}

function formatIncome(val) {
  if (!val) return '—';
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L / year`;
  return `₹${val.toLocaleString('en-IN')} / year`;
}

export default function CustomerDetailPage({ customerId, user, onBack, onViewMatches }) {
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  useEffect(() => {
    Promise.all([getCustomer(customerId), getNotes(customerId)])
      .then(([p, n]) => {
        setProfile(p);
        setStatus(p.status);
        setNotes(n);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [customerId]);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSavingStatus(true);
    await updateStatus(customerId, newStatus);
    setSavingStatus(false);
    setStatusSaved(true);
    setTimeout(() => setStatusSaved(false), 2000);
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    const note = await addNote(customerId, newNote.trim());
    setNotes(prev => [...prev, note]);
    setNewNote('');
    setAddingNote(false);
  }

  async function handleDeleteNote(noteId) {
    await deleteNote(noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }

  if (loading) {
    return (
      <div className="detail-layout">
        <Sidebar user={user} onLogout={() => {}} activePage="customers" />
        <main className="detail-main loading-state">
          <div className="loading-spinner" />
          <span>Loading profile...</span>
        </main>
      </div>
    );
  }

  if (!profile) return null;

  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="detail-layout">
      <Sidebar user={user} onLogout={() => {}} activePage="customers" />

      <main className="detail-main">
        {/* Back nav */}
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>

        {/* Profile Hero */}
        <div className="profile-hero">
          <div className="profile-hero-left">
            <div className="profile-photo-wrap">
              <img
                className="profile-photo"
                src={profile.photo_url}
                alt={fullName}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="profile-photo-fallback" style={{ display: 'none' }}>
                {profile.first_name[0]}{profile.last_name[0]}
              </div>
              {profile.verified && <div className="profile-verified-badge">✓ Verified</div>}
            </div>

            <div className="profile-hero-info">
              <h1 className="profile-name">{fullName}</h1>
              <p className="profile-tagline">
                {profile.age} years · {profile.gender} · {profile.city}, {profile.state}
              </p>
              <p className="profile-job">{profile.designation} at {profile.company}</p>
              <p className="profile-religion">{profile.religion} · {profile.caste}</p>

              <div className="profile-hero-actions">
                <div className="status-change-wrap">
                  <label className="status-change-label">Journey Stage</label>
                  <select
                    className="status-select"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {savingStatus && <span className="status-saving">Saving...</span>}
                  {statusSaved && <span className="status-saved">✓ Saved</span>}
                </div>

                <button className="matches-btn" onClick={() => onViewMatches(customerId)}>
                  ✦ View AI Matches
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-body">
          {/* Left column */}
          <div className="detail-col">
            <InfoSection title="Personal Details">
              <InfoRow label="Date of Birth" value={profile.date_of_birth} />
              <InfoRow label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : null} />
              <InfoRow label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : null} />
              <InfoRow label="Complexion" value={profile.complexion} />
              <InfoRow label="Blood Group" value={profile.blood_group} />
              <InfoRow label="Marital Status" value={profile.marital_status} />
              <InfoRow label="Mother Tongue" value={profile.mother_tongue} />
              <InfoRow label="Languages" value={profile.languages} />
            </InfoSection>

            <InfoSection title="Contact Information">
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Phone" value={profile.phone} />
              <InfoRow label="City" value={profile.city} />
              <InfoRow label="State" value={profile.state} />
              <InfoRow label="Country" value={profile.country} />
            </InfoSection>

            <InfoSection title="Family Background">
              <InfoRow label="Father's Name" value={profile.father_name} />
              <InfoRow label="Father's Occupation" value={profile.father_occupation} />
              <InfoRow label="Mother's Name" value={profile.mother_name} />
              <InfoRow label="Mother's Occupation" value={profile.mother_occupation} />
              <InfoRow label="Siblings" value={profile.siblings} />
              <InfoRow label="Family Type" value={profile.family_type} />
              <InfoRow label="Family Values" value={profile.family_values} />
            </InfoSection>
          </div>

          {/* Right column */}
          <div className="detail-col">
            <InfoSection title="Education & Career">
              <InfoRow label="Degree" value={profile.degree} />
              <InfoRow label="College" value={profile.college} />
              <InfoRow label="Post Graduate" value={profile.postgraduate} />
              <InfoRow label="Company" value={profile.company} />
              <InfoRow label="Designation" value={profile.designation} />
              <InfoRow label="Annual Income" value={formatIncome(profile.annual_income)} />
              <InfoRow label="Work Mode" value={profile.work_mode} />
            </InfoSection>

            <InfoSection title="Lifestyle">
              <InfoRow label="Diet" value={profile.diet} />
              <InfoRow label="Smoking" value={profile.smoking} />
              <InfoRow label="Drinking" value={profile.drinking} />
              <InfoRow label="Exercise" value={profile.exercise} />
              <InfoRow label="Hobbies" value={profile.hobbies} />
              <InfoRow label="Pets" value={profile.pets} />
            </InfoSection>

            <InfoSection title="Partner Preferences">
              <InfoRow label="Preferred Age Range" value={`${profile.partner_age_min} – ${profile.partner_age_max} years`} />
              <InfoRow label="Wants Kids" value={profile.want_kids} />
              <InfoRow label="Open to Relocate" value={profile.open_to_relocate} />
              <InfoRow label="Open to Pets" value={profile.open_to_pets} />
              <InfoRow label="Timeline to Marry" value={profile.timeline_to_marry} />
            </InfoSection>

            {profile.about_me && (
              <div className="about-section">
                <div className="info-section-title">About</div>
                <p className="about-text">{profile.about_me}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <div className="notes-header">
            <h2 className="notes-title">Matchmaker Notes</h2>
            <span className="notes-count">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
          </div>

          <form onSubmit={handleAddNote} className="note-form">
            <textarea
              className="note-textarea"
              placeholder="Add a note from your call or meeting..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              rows={3}
            />
            <button type="submit" className="note-submit-btn" disabled={addingNote || !newNote.trim()}>
              {addingNote ? 'Adding...' : '+ Add Note'}
            </button>
          </form>

          {notes.length === 0 ? (
            <div className="notes-empty">No notes yet. Add your first note above.</div>
          ) : (
            <div className="notes-list">
              {[...notes].reverse().map(note => (
                <div className="note-item" key={note.id}>
                  <p className="note-text">{note.note}</p>
                  <div className="note-meta">
                    <span className="note-date">
                      {note.created_at ? new Date(note.created_at).toLocaleString('en-IN') : ''}
                    </span>
                    <button
                      className="note-delete"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
