export function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return '-';
  const s = Math.round(Number(amount) || 0).toString();
  if (s.length <= 3) return 'Rs ' + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return 'Rs ' + formatted + ',' + last3;
}

export function getInitials(firstName, lastName) {
  return (firstName?.[0] || '') + (lastName?.[0] || '');
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  let date = new Date(dateString);
  if (typeof dateString === 'string' && Number.isNaN(date.getTime())) {
    const parts = dateString.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (parts) {
      date = new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
    }
  }
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getProfileDateOfBirth(profile) {
  return profile?.date_of_birth || profile?.dob || profile?.birth_date || profile?.dateOfBirth || profile?.birthDate || '';
}

export function timeAgo(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return minutes + ' min ago';
  if (hours < 24) return hours + ' hours ago';
  if (days < 7) return days + ' days ago';
  return formatDate(dateString);
}
