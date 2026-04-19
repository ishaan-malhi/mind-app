import { dateKey, loadEntry, saveEntry, deleteEntry, getAllEntryKeys, formatHistoryDate, getStreak, compressImage, markDayComplete, isDayComplete, clearDayComplete, likeQuote, getLikedQuotes, shuffle } from './utils.js';
import { QUOTES, BACKGROUNDS } from './quotes.js';
import { renderEntries, renderPhoto, renderVoice, renderThrowback, renderCalendar, renderDayDetail } from './render.js';

// ── State ──────────────────────────────────────────────────

const today = dateKey();
let state = loadEntry(today) || { date: today, entries: ['', '', ''], image: null, voice: null };
while (state.entries.length < 3) state.entries.push('');
if (state.entries.length > 3) state.entries = state.entries.slice(0, 3);

let visibleCount = Math.max(1, state.entries.filter(e => e.trim()).length);

let recorder  = null;
let recChunks = [];
let recTimer  = null;
let recSecs   = 0;

const now = new Date();
let calYear  = now.getFullYear();
let calMonth = now.getMonth();

// ── DOM ────────────────────────────────────────────────────

const $ = id => document.getElementById(id);
const todayView       = $('today-view');
const reviewView      = $('review-view');
const dayLabel        = $('day-label');
const dateHeading     = $('date-heading');
const streakDisplay   = $('streak-display');
const entriesSection  = $('entries-section');
const mediaSection    = $('media-section');
const photoArea       = $('photo-area');
const voiceArea       = $('voice-area');
const photoInput      = $('photo-input');
const reviewBtn       = $('review-btn');
const backBtn         = $('back-btn');
const tabThrowback    = $('tab-throwback');
const tabCalendar     = $('tab-calendar');
const throwbackFeed   = $('throwback-feed');
const throwbackPanel  = $('throwback-panel');
const calendarPanel   = $('calendar-panel');
const calendarWrap    = $('calendar-wrap');
const submitBtn       = $('submit-btn');
const imageViewer     = $('image-viewer');
const imageBackdrop   = $('image-backdrop');
const viewerImg       = $('viewer-img');
const closeViewerBtn  = $('close-viewer-btn');
const dayDetail       = $('day-detail');
const detailDate      = $('detail-date');
const detailBody      = $('detail-body');
const closeDetailBtn  = $('close-detail-btn');
const deleteDetailBtn = $('delete-detail-btn');
const editDetailBtn   = $('edit-detail-btn');
const quoteScreen     = $('quote-screen');
const quoteBg         = $('quote-bg');
const quoteTextEl     = $('quote-text');
const quoteAuthorEl   = $('quote-author');
const likeQuoteBtn    = $('like-quote-btn');
const skipQuoteBtn    = $('skip-quote-btn');
const closeQuoteBtn   = $('close-quote-btn');

let currentDetailKey = null;
let quoteDeck = [];
let quoteIndex = 0;

// ── Init ───────────────────────────────────────────────────

function init() {
  dayLabel.textContent    = now.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase();
  dateHeading.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  refreshStreak();
  refreshEntries();
  refreshMedia();

  // Open in focused state — shows accent animation, no keyboard popup on iOS
  requestAnimationFrame(() => {
    const firstInput = entriesSection.querySelector('.entry-input');
    if (firstInput) firstInput.focus({ preventScroll: true });
  });

  photoInput.addEventListener('change', onPhotoSelect);
  submitBtn.addEventListener('click', submitToday);
  reviewBtn.addEventListener('click', openReview);
  backBtn.addEventListener('click', closeReview);
  tabThrowback.addEventListener('click', () => switchTab('throwback'));
  tabCalendar.addEventListener('click', () => switchTab('calendar'));
  imageBackdrop.addEventListener('click', closeViewer);
  closeViewerBtn.addEventListener('click', closeViewer);
  dayDetail.addEventListener('click', e => { if (e.target.classList.contains('overlay-backdrop')) closeDetail(); });
  closeDetailBtn.addEventListener('click', closeDetail);
  if (deleteDetailBtn) deleteDetailBtn.addEventListener('click', deleteCurrentEntry);
  if (editDetailBtn) editDetailBtn.addEventListener('click', enableDetailEdit);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!quoteScreen.classList.contains('hidden')) { closeQuoteScreen(); openReview(); return; }
      closeDetail();
      closeViewer();
    }
  });
  closeQuoteBtn.addEventListener('click', () => { closeQuoteScreen(); openReview(); });
  likeQuoteBtn.addEventListener('click', onLikeQuote);
  skipQuoteBtn.addEventListener('click', onSkipQuote);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
  }

  setupNotifications();
}

// ── Save ───────────────────────────────────────────────────

function save() {
  saveEntry(today, state);
  refreshStreak();
  if (state.entries.some(e => e.trim())) markDayComplete(today);
}

// ── Submit (with completion feedback) ──────────────────────

function submitToday() {
  const hasContent = state.entries.some(e => e.trim());
  if (hasContent) {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') scheduleReminder();
      });
    }
    submitBtn.classList.add('submit-btn--done');
    setTimeout(openQuoteScreen, 320);
    setTimeout(() => submitBtn.classList.remove('submit-btn--done'), 800);
  } else {
    openReview();
  }
}

// ── Notifications ──────────────────────────────────────────

async function setupNotifications() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
  if (Notification.permission === 'granted') scheduleReminder();
}

async function scheduleReminder() {
  const complete = await isDayComplete(today);
  if (complete) return;
  const now = new Date();
  if (now.getHours() >= 17) return; // already past 5pm
  navigator.serviceWorker.ready.then(reg => {
    if (reg.active) reg.active.postMessage({ type: 'SCHEDULE_REMINDER', key: today });
  });
}

// ── Streak ─────────────────────────────────────────────────

function refreshStreak() {
  const n = getStreak();
  if (n === 0) { streakDisplay.innerHTML = ''; return; }
  streakDisplay.innerHTML =
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" aria-hidden="true">` +
      `<path d="M12 22V12M12 12C12 7 7 4 3 6c3 1 5 4 5 7M12 12c0-5 5-8 9-6-3 1-5 4-5 7"/>` +
    `</svg>` +
    `<span class="streak-count">${n}</span>` +
    `<span>${n === 1 ? 'day' : 'days'}</span>`;
}

// ── Entries ────────────────────────────────────────────────

function onAddEntry() {
  if (visibleCount >= 3) return;
  visibleCount++;
  refreshEntries();
  setTimeout(() => {
    const inputs = entriesSection.querySelectorAll('.entry-input');
    inputs[inputs.length - 1]?.focus();
  }, 0);
}

function onMaxReached() {
  submitBtn.classList.add('submit-btn--done');
  setTimeout(() => submitBtn.classList.remove('submit-btn--done'), 800);
}

function refreshEntries() {
  renderEntries(state, entriesSection, (idx, val) => { state.entries[idx] = val; save(); }, visibleCount, onAddEntry, onMaxReached);
}

// ── Media (photo + voice, compact layout when both idle) ───

function refreshMedia() {
  renderPhoto(state, photoArea,
    () => photoInput.click(),
    () => { state.image = null; save(); refreshMedia(); },
    src => openViewer(src)
  );
  renderVoice(state, voiceArea,
    recorder && recorder.state === 'recording',
    startRecording, stopRecording,
    () => { state.voice = null; save(); refreshMedia(); }
  );
  // Side-by-side icon layout only when both are idle
  const compact = !state.image && !state.voice && !(recorder && recorder.state === 'recording');
  mediaSection.classList.toggle('media-section--compact', compact);
}

// ── Photo ──────────────────────────────────────────────────

async function onPhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  try { state.image = await compressImage(file); save(); refreshMedia(); } catch (_) {}
  photoInput.value = '';
}

// ── Voice ──────────────────────────────────────────────────

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported('audio/mp4')  ? 'audio/mp4'  :
                 MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
    recorder  = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
    recChunks = []; recSecs = 0;

    recorder.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data); };
    recorder.onstop = () => {
      const blob   = new Blob(recChunks, { type: mime || 'audio/webm' });
      const reader = new FileReader();
      reader.onload = e => { state.voice = e.target.result; save(); refreshMedia(); };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach(t => t.stop());
      clearInterval(recTimer);
    };

    recorder.start();
    refreshMedia();

    recTimer = setInterval(() => {
      recSecs++;
      const el = document.getElementById('rec-timer');
      if (el) {
        const m = Math.floor(recSecs / 60);
        el.textContent = `${m}:${String(recSecs % 60).padStart(2, '0')}`;
      }
      if (recSecs >= 60) stopRecording(); // 60s cap
    }, 1000);

  } catch (_) {
    const msg = window.isSecureContext
      ? 'Microphone access was denied.\n\nPlease allow access in your browser settings.'
      : 'Microphone requires a secure connection.\n\nRun the app over HTTPS using ./start.sh';
    alert(msg);
  }
}

function stopRecording() {
  if (recorder && recorder.state === 'recording') recorder.stop();
}

// ── Quote screen ───────────────────────────────────────────

function openQuoteScreen() {
  quoteDeck = shuffle([...QUOTES]);
  quoteIndex = 0;
  showQuote();
  quoteScreen.classList.remove('hidden');
  closeQuoteBtn.focus();
}

function showQuote() {
  const quote = quoteDeck[quoteIndex];
  quoteTextEl.textContent = quote.text;
  quoteAuthorEl.textContent = quote.source
    ? `${quote.author} — ${quote.source}`
    : quote.author;
  // Rotate background by quote id
  quoteBg.className = `quote-bg quote-bg--${quote.id % 8}`;
  // Set photo background
  const bgIdx = quote.id % 8;
  quoteBg.className = `quote-bg quote-bg--${bgIdx}`;
  quoteBg.style.backgroundImage = `url(${BACKGROUNDS[bgIdx]})`;

  // Reflect liked state
  const liked = getLikedQuotes().includes(quote.id);
  likeQuoteBtn.classList.toggle('liked', liked);
}

function onLikeQuote() {
  const quote = quoteDeck[quoteIndex];
  likeQuote(quote.id);
  likeQuoteBtn.classList.add('liked');
  setTimeout(() => { closeQuoteScreen(); openReview(); }, 400);
}

function onSkipQuote() {
  closeQuoteScreen();
  openReview();
}

function closeQuoteScreen() {
  if (quoteScreen.classList.contains('hidden')) return;
  quoteScreen.classList.add('closing');
  setTimeout(() => {
    quoteScreen.classList.add('hidden');
    quoteScreen.classList.remove('closing');
  }, 250);
}

// ── Review view ────────────────────────────────────────────

function openReview() {
  renderThrowback(throwbackFeed, src => openViewer(src), key => openDetail(key));
  refreshCalendar();
  switchTab('throwback');
  todayView.classList.add('slide-out');
  reviewView.classList.add('active');
}

function closeReview() {
  reviewView.classList.remove('active');
  todayView.classList.remove('slide-out');
}

function switchTab(tab) {
  const isThrowback = tab === 'throwback';
  tabThrowback.classList.toggle('active', isThrowback);
  tabCalendar.classList.toggle('active', !isThrowback);
  tabThrowback.setAttribute('aria-selected', String(isThrowback));
  tabCalendar.setAttribute('aria-selected', String(!isThrowback));
  throwbackPanel.classList.toggle('active', isThrowback);
  calendarPanel.classList.toggle('active', !isThrowback);
}

// ── Calendar ───────────────────────────────────────────────

function refreshCalendar() {
  const keys = getAllEntryKeys().filter(k => {
    const entry = loadEntry(k);
    return entry && entry.entries && entry.entries.some(e => e.trim());
  });
  renderCalendar(calendarWrap, calYear, calMonth, keys,
    key => openDetail(key),
    () => { if (calMonth === 0) { calYear--; calMonth = 11; } else { calMonth--; } refreshCalendar(); },
    () => { if (calMonth === 11) { calYear++; calMonth = 0; } else { calMonth++; } refreshCalendar(); }
  );
}

// ── Day detail ─────────────────────────────────────────────

async function shareDetail() {
  if (!currentDetailKey) return;
  const entry = loadEntry(currentDetailKey);
  if (!entry) return;
  const filled = (entry.entries || []).filter(e => e.trim());
  if (!filled.length) return;
  const date = formatHistoryDate(currentDetailKey);
  const text = filled.length === 1
    ? `${date}\n\n${filled[0]}`
    : `${date}\n\n${filled.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;

  if (!navigator.share) {
    try { await navigator.clipboard.writeText(text); } catch (_) {}
    return;
  }

  // Share image as file if available
  if (entry.image && navigator.canShare) {
    try {
      const res = await fetch(entry.image);
      const blob = await res.blob();
      const file = new File([blob], 'memory.jpg', { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mind', text });
        return;
      }
    } catch (_) {}
  }

  // Text-only fallback
  try { await navigator.share({ title: 'Mind', text }); } catch (_) {}
}

function detailSaver(key) {
  return updatedEntry => {
    saveEntry(key, updatedEntry);
    if (key === today) { state = updatedEntry; refreshEntries(); }
    refreshStreak();
  };
}

function enableDetailEdit() {
  if (!currentDetailKey) return;
  const entry = loadEntry(currentDetailKey);
  if (!entry) return;
  renderDayDetail(detailBody, entry, detailSaver(currentDetailKey));
  detailBody.querySelector('.entry-input')?.focus();
}

function openDetail(key) {
  const entry = loadEntry(key);
  if (!entry) return;
  currentDetailKey = key;
  detailDate.textContent = formatHistoryDate(key);
  renderDayDetail(detailBody, entry, null, shareDetail, enableDetailEdit);
  dayDetail.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  closeDetailBtn.focus();
}

function deleteCurrentEntry() {
  if (!currentDetailKey) return;
  const key = currentDetailKey;
  deleteEntry(key);
  clearDayComplete(key);
  if (key === today) {
    state = { date: today, entries: ['', '', ''], image: null, voice: null };
    refreshEntries();
    refreshMedia();
  }
  closeDetail();
  refreshStreak();
  renderThrowback(throwbackFeed, src => openViewer(src), k => openDetail(k));
  refreshCalendar();
}

function closeDetail() {
  if (dayDetail.classList.contains('hidden')) return;
  dayDetail.classList.add('closing');
  setTimeout(() => {
    dayDetail.classList.add('hidden');
    dayDetail.classList.remove('closing');
    document.body.style.overflow = '';
  }, 280);
}

// ── Image viewer ───────────────────────────────────────────

function openViewer(src) {
  viewerImg.src = src;
  imageViewer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  closeViewerBtn.focus();
}

function closeViewer() {
  if (imageViewer.classList.contains('hidden')) return;
  imageViewer.classList.add('closing');
  setTimeout(() => {
    imageViewer.classList.add('hidden');
    imageViewer.classList.remove('closing');
    document.body.style.overflow = '';
  }, 200);
}

// ── Go ─────────────────────────────────────────────────────

init();
