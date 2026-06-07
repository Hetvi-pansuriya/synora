import API_BASE from '../config';
import './StatusBadge.css';

const classMap = {
  'New Lead': 'info',
  'Profile Verification': 'warning',
  'Active Matching': 'active',
  'Meeting Scheduled': 'meeting',
  'Follow Up': 'warning',
  Matched: 'matched',
  Closed: 'closed'
};

function StatusBadge({ status }) {
  void API_BASE;
  const badgeClass = classMap[status] || 'closed';
  return <span className={`status-badge ${badgeClass}`}>{status || 'New Lead'}</span>;
}

export default StatusBadge;
