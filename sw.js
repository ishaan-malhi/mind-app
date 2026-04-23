const CACHE = 'grateful-v25';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './utils.js',
  './render.js',
  './app.js',
  './quotes.js',
  './manifest.json',
  './icon.svg',
  './fonts/dm-sans.woff2',
  './fonts/lora.woff2',
  './fonts/lora-italic.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== 'grateful-meta').map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});

// ── 5pm reminder ──────────────────────────────────────────────

function msUntil5pm() {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
  const diff = target - now;
  return diff > 0 ? diff : null; // null = already past 5pm today
}

async function isDayComplete(key) {
  const cache = await caches.open('grateful-meta');
  const match = await cache.match('grateful-complete-' + key);
  return !!match;
}

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_REMINDER') {
    const key = e.data.key;
    const delay = msUntil5pm();
    if (delay === null) return; // already past 5pm, don't schedule

    setTimeout(async () => {
      const complete = await isDayComplete(key);
      if (complete) return;
      self.registration.showNotification('Mind', {
        body: 'Take a moment to record today\u2019s gratitude.',
        icon: './icon.svg',
        badge: './icon.svg',
        tag: 'daily-reminder',
      });
    }, delay);
  }
});
