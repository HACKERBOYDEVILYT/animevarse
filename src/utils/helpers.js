export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text, length = 120) {
  if (!text) return "";
  return text.length > length
    ? `${text.slice(0, length)}...`
    : text;
}
