export function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return '-';

  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value));
}
