import { useState } from 'react';
import API_BASE from '../config';
import { formatDate } from '../utils';
import './NoteSection.css';

function NoteSection({ customerId, notes, setNotes }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const addNote = async (event) => {
    event.preventDefault();
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: text.trim() })
      });
      const note = await response.json();
      setNotes([note, ...notes]);
      setText('');
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId) => {
    await fetch(`${API_BASE}/notes/${noteId}`, { method: 'DELETE' });
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  return (
    <section className="note-section">
      <div className="note-section-header">
        <div className="note-section-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h2>Notes</h2>
          {notes.length > 0 && <span className="note-count">{notes.length}</span>}
        </div>
      </div>

      {notes.length > 0 && (
        <div className="note-list">
          {notes.map((note) => (
            <div className="note-item" key={note.id}>
              <div className="note-body">
                <p className="note-text">{note.note}</p>
                <div className="note-meta">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {formatDate(note.created_at)}
                </div>
              </div>
              <button
                type="button"
                className="note-delete-btn"
                aria-label="Delete note"
                onClick={() => deleteNote(note.id)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <form className="note-form" onSubmit={addNote}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Add a private note about this customer…"
        />
        <div className="note-form-actions">
          <span className="note-form-hint">{text.length} characters</span>
          <button type="submit" className="note-submit-btn" disabled={!text.trim() || saving}>
            {saving ? 'Saving…' : 'Add Note'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NoteSection;
