import React from 'react';
import './StatusBadge.css';

const STATUS_COLORS = {
  'Active': 'green',
  'New Lead': 'blue',
  'Profile Verification': 'orange',
  'Active Matching': 'purple',
  'Meeting Scheduled': 'teal',
  'Follow Up': 'yellow',
  'Matched': 'rose',
  'Closed': 'gray',
  'Pending': 'orange',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || 'gray';
  return (
    <span className={`status-badge status-${color}`}>
      {status}
    </span>
  );
}
