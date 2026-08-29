export function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString();
}
