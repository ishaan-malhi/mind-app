// Storage

const PREFIX = 'grateful-';

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadEntry(key) {
  const raw = localStorage.getItem(PREFIX + key);
  return raw ? JSON.parse(raw) : null;
}

export function saveEntry(key, data) {
  localStorage.setItem(PREFIX + key, JSON.stringify(data));
}

export function getAllEntryKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k.slice(PREFIX.length));
  }
  return keys.sort().reverse();
}

// Date formatting

export function formatDisplayDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDayName(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase();
}

export function formatHistoryDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

// Streak

export function getStreak() {
  const now = new Date();
  let streak = 0;
  for (let i = 0; i < 366; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const entry = loadEntry(dateKey(d));
    if (entry && Array.isArray(entry.entries) && entry.entries.some(e => e.trim())) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Image compression

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1200;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Relative time label

export function getRelativeTimeLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const entry = new Date(y, m - 1, d);
  const days  = Math.floor((Date.now() - entry.getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 21) return '2 weeks ago';
  if (days < 28) return '3 weeks ago';
  if (days < 45) return '1 month ago';
  const months = Math.round(days / 30.5);
  if (months < 12) return `${months} months ago`;
  const years = Math.round(days / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

// Completion tracking (Cache API — accessible from SW)

export async function markDayComplete(key) {
  try {
    const cache = await caches.open('grateful-meta');
    await cache.put('grateful-complete-' + key, new Response('1'));
  } catch (_) {}
}

export async function isDayComplete(key) {
  try {
    const cache = await caches.open('grateful-meta');
    return !!(await cache.match('grateful-complete-' + key));
  } catch (_) {
    return false;
  }
}

export async function clearDayComplete(key) {
  try {
    const cache = await caches.open('grateful-meta');
    await cache.delete('grateful-complete-' + key);
  } catch (_) {}
}

export function deleteEntry(key) {
  localStorage.removeItem(PREFIX + key);
}

export function getLikedQuotes() {
  try { return JSON.parse(localStorage.getItem('mind-liked-quotes')) || []; } catch { return []; }
}

export function likeQuote(id) {
  const liked = getLikedQuotes();
  if (!liked.includes(id)) {
    liked.push(id);
    localStorage.setItem('mind-liked-quotes', JSON.stringify(liked));
  }
}

// Array shuffle (Fisher-Yates)

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Calendar — Monday-first grid, 42 cells

export function getCalendarDays(year, month) {
  const jsFirstDay = new Date(year, month, 1).getDay();
  const firstDay   = (jsFirstDay + 6) % 7; // Mon=0 … Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const dm = month - 1, dy = dm < 0 ? year - 1 : year;
    days.push({ day: prevDays - i, month: dm < 0 ? 11 : dm, year: dy, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, month, year, other: false });
  }
  let n = 1;
  while (days.length < 42) {
    const nm = month + 1, ny = nm > 11 ? year + 1 : year;
    days.push({ day: n++, month: nm > 11 ? 0 : nm, year: ny, other: true });
  }
  return days;
}
