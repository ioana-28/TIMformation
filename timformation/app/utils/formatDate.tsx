export function formatDate(isoString?: string | null) {
  if (!isoString) return '-';

  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Bucharest'
  }).format(new Date(isoString));
}
