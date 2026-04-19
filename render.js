import { loadEntry, getAllEntryKeys, formatHistoryDate, formatMonthYear, getCalendarDays, dateKey, getRelativeTimeLabel, shuffle } from './utils.js';

// ── Entries (progressive, 1–3) ────────────────────────────

export function renderEntries(state, section, onInput, visibleCount, onAddEntry, onMaxReached) {
  section.innerHTML = '';
  section.classList.remove('show-add');

  for (let i = 0; i < visibleCount; i++) {
    const isLast = i === visibleCount - 1;
    const isLastAddable = isLast && visibleCount < 3;
    const isAtMax = isLast && visibleCount === 3;
    section.appendChild(buildEntry(
      state.entries[i], i, onInput, section,
      isLastAddable,
      isAtMax ? onMaxReached : null
    ));
  }

  if (visibleCount < 3) {
    const addBtn = document.createElement('button');
    addBtn.className = 'entry-add-btn';
    addBtn.setAttribute('aria-label', 'Add another');
    addBtn.innerHTML =
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">` +
        `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>` +
      `</svg>`;
    addBtn.addEventListener('click', () => {
      section.classList.remove('show-add');
      onAddEntry();
    });
    section.appendChild(addBtn);
  }
}

function buildEntry(text, idx, onInput, section, isLastAddable, onMaxReached) {
  const item = document.createElement('div');
  item.className = 'entry-item';

  const ta = document.createElement('textarea');
  ta.className   = 'entry-input';
  ta.value       = text;
  ta.placeholder = '';
  ta.rows        = 1;
  ta.setAttribute('autocorrect', 'on');
  ta.setAttribute('autocapitalize', 'sentences');
  ta.setAttribute('aria-label', `Entry ${idx + 1}`);

  const resize = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
  setTimeout(resize, 0);

  ta.addEventListener('input', () => {
    resize();
    onInput(idx, ta.value);
    if (isLastAddable) {
      const hasContent = !!ta.value.trim();
      section.classList.toggle('show-add', hasContent);
      if (hasContent) {
        const addBtn = section.querySelector('.entry-add-btn');
        if (addBtn) addBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });

  // Prevent newline; pulse submit on Enter at max
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onMaxReached && ta.value.trim()) onMaxReached();
    }
  });

  item.appendChild(ta);
  return item;
}

// ── Photo ──────────────────────────────────────────────────

export function renderPhoto(state, area, onPick, onRemove, onView) {
  area.innerHTML = '';

  if (!state.image) {
    const btn = document.createElement('button');
    btn.className = 'media-icon-btn';
    btn.setAttribute('aria-label', 'Add a photo');
    btn.innerHTML =
      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">` +
        `<rect x="3" y="7" width="18" height="13" rx="2"/>` +
        `<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>` +
        `<circle cx="12" cy="13.5" r="2.5"/>` +
      `</svg>`;
    btn.addEventListener('click', onPick);
    area.appendChild(btn);
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'photo-filled';
  const img = document.createElement('img');
  img.src = state.image;
  img.alt = "Today's photo";
  img.addEventListener('load', () => img.classList.add('loaded'));
  img.addEventListener('click', () => onView(state.image));
  const removeBtn = document.createElement('button');
  removeBtn.className = 'photo-remove';
  removeBtn.innerHTML = '&times;';
  removeBtn.setAttribute('aria-label', 'Remove photo');
  removeBtn.addEventListener('click', e => { e.stopPropagation(); onRemove(); });
  wrap.appendChild(img);
  wrap.appendChild(removeBtn);
  area.appendChild(wrap);
}

// ── Voice ──────────────────────────────────────────────────

export function renderVoice(state, area, isRecording, onStart, onStop, onDelete) {
  area.innerHTML = '';
  if (state.voice)      { area.appendChild(buildPlaybackUI(state.voice, onDelete)); }
  else if (isRecording) { area.appendChild(buildRecordingUI(onStop)); }
  else                  { area.appendChild(buildIdleBtn(onStart)); }
}

function buildIdleBtn(onStart) {
  const btn = document.createElement('button');
  btn.className = 'media-icon-btn';
  btn.setAttribute('aria-label', 'Record a voice note');
  btn.innerHTML =
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">` +
      `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>` +
      `<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>` +
      `<line x1="12" y1="19" x2="12" y2="22"/>` +
    `</svg>`;
  btn.addEventListener('click', onStart);
  return btn;
}

function buildRecordingUI(onStop) {
  const el = document.createElement('div');
  el.className = 'voice-recording';
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', 'Stop recording');

  const dot = document.createElement('div');
  dot.className = 'rec-dot';

  const wf = document.createElement('div');
  wf.className = 'waveform';
  for (let i = 0; i < 7; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    wf.appendChild(bar);
  }

  const timer = document.createElement('span');
  timer.className = 'rec-timer';
  timer.id = 'rec-timer';
  timer.textContent = '0:00';

  const stopBtn = document.createElement('button');
  stopBtn.className = 'rec-stop-btn';
  stopBtn.setAttribute('aria-label', 'Stop recording');
  stopBtn.innerHTML =
    `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">` +
      `<rect x="4" y="4" width="16" height="16" rx="2"/>` +
    `</svg>`;
  stopBtn.addEventListener('click', e => { e.stopPropagation(); onStop(); });

  el.appendChild(dot);
  el.appendChild(wf);
  el.appendChild(timer);
  el.appendChild(stopBtn);
  el.addEventListener('click', onStop);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStop(); } });
  return el;
}

export function buildPlaybackUI(voiceData, onDelete) {
  const el = document.createElement('div');
  el.className = 'voice-playback';

  const audio = new Audio(voiceData);
  let playing = false;

  const playBtn = document.createElement('button');
  playBtn.className = 'voice-play-btn';
  playBtn.setAttribute('aria-label', 'Play voice note');
  playBtn.innerHTML = playIcon();

  playBtn.addEventListener('click', () => {
    if (playing) {
      audio.pause(); audio.currentTime = 0;
      playBtn.innerHTML = playIcon();
      playBtn.setAttribute('aria-label', 'Play voice note');
      playing = false;
    } else {
      audio.play();
      playBtn.innerHTML = pauseIcon();
      playBtn.setAttribute('aria-label', 'Pause voice note');
      playing = true;
    }
  });

  audio.addEventListener('ended', () => {
    playBtn.innerHTML = playIcon();
    playBtn.setAttribute('aria-label', 'Play voice note');
    playing = false;
  });

  const info = document.createElement('div');
  info.className = 'voice-pb-info';
  info.textContent = 'Voice note';

  const delBtn = document.createElement('button');
  delBtn.className = 'voice-del-btn';
  delBtn.innerHTML = '&times;';
  delBtn.setAttribute('aria-label', 'Delete voice note');
  delBtn.addEventListener('click', () => { audio.pause(); onDelete(); });

  el.appendChild(playBtn);
  el.appendChild(info);
  el.appendChild(delBtn);
  return el;
}

const playIcon  = () => `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
const pauseIcon = () => `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>`;

// ── Throwback feed ─────────────────────────────────────────

export function renderThrowback(feedEl, onViewPhoto, onOpenDay) {
  feedEl.innerHTML = '';
  const keys = getAllEntryKeys();

  if (keys.length === 0) {
    feedEl.innerHTML = `<p class="throwback-empty">Your story starts here.</p>`;
    return;
  }

  const contentKeys = shuffle(
    keys.filter(k => {
      const e = loadEntry(k);
      return e && ((e.entries || []).some(t => t.trim()) || e.image);
    })
  ).slice(0, 20);

  if (contentKeys.length === 0) {
    feedEl.innerHTML = `<p class="throwback-empty">Your story starts here.</p>`;
    return;
  }

  contentKeys.forEach(key => {
    const entry = loadEntry(key);
    if (!entry) return;
    const filled = (entry.entries || []).filter(e => e.trim());

    const card = document.createElement('div');
    card.className = 'throwback-card';
    card.addEventListener('click', () => onOpenDay(key));

    const pill = document.createElement('div');
    pill.className = 'throwback-pill';
    pill.textContent = getRelativeTimeLabel(key);
    card.appendChild(pill);

    if (entry.image) {
      const photoWrap = document.createElement('div');
      photoWrap.className = 'throwback-photo';
      const img = document.createElement('img');
      img.src = entry.image;
      img.alt = '';
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('click', e => { e.stopPropagation(); onViewPhoto(entry.image); });
      photoWrap.appendChild(img);
      card.appendChild(photoWrap);
    }

    if (filled.length > 0) {
      const text = document.createElement('p');
      text.className = 'throwback-text';
      text.textContent = filled[0];
      card.appendChild(text);
    }

    feedEl.appendChild(card);
  });
}

// ── Calendar ───────────────────────────────────────────────

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function renderCalendar(wrap, year, month, entryKeys, onDayClick, onPrevMonth, onNextMonth) {
  wrap.innerHTML = '';
  const todayKey = dateKey();

  const header = document.createElement('div');
  header.className = 'cal-header';
  const prevBtn = document.createElement('button');
  prevBtn.className = 'cal-nav icon-btn';
  prevBtn.setAttribute('aria-label', 'Previous month');
  prevBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`;
  prevBtn.addEventListener('click', onPrevMonth);
  const nextBtn = document.createElement('button');
  nextBtn.className = 'cal-nav icon-btn';
  nextBtn.setAttribute('aria-label', 'Next month');
  nextBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
  nextBtn.addEventListener('click', onNextMonth);
  const label = document.createElement('span');
  label.className = 'cal-month-label';
  label.textContent = formatMonthYear(year, month);
  header.appendChild(prevBtn); header.appendChild(label); header.appendChild(nextBtn);
  wrap.appendChild(header);

  const wdRow = document.createElement('div');
  wdRow.className = 'cal-weekdays';
  WEEKDAYS.forEach(d => {
    const el = document.createElement('span');
    el.className = 'cal-weekday';
    el.textContent = d;
    wdRow.appendChild(el);
  });
  wrap.appendChild(wdRow);

  const grid = document.createElement('div');
  grid.className = 'cal-days';
  const days = getCalendarDays(year, month);
  const entrySet = new Set(entryKeys);

  days.forEach(({ day, month: dm, year: dy, other }) => {
    const key = `${dy}-${String(dm + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasEntry = entrySet.has(key);
    const isToday  = key === todayKey;

    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = day;
    btn.setAttribute('aria-label', `${day} ${formatMonthYear(dy, dm)}`);

    if (other)    btn.classList.add('other-month');
    if (isToday)  btn.classList.add('is-today');
    if (hasEntry) { btn.classList.add('has-entry'); btn.addEventListener('click', () => onDayClick(key)); }
    else          { btn.disabled = !isToday; }

    grid.appendChild(btn);
  });
  wrap.appendChild(grid);
}

// ── Day detail ─────────────────────────────────────────────

export function renderDayDetail(bodyEl, entry, onSave) {
  bodyEl.innerHTML = '';
  const allEntries = entry.entries || ['', '', ''];
  const filled = allEntries.filter(e => e.trim());

  const list = document.createElement('div');
  list.className = 'detail-entries';

  if (onSave) {
    // Edit mode: all 3 editable textareas
    allEntries.forEach((text, idx) => {
      const item = document.createElement('div');
      item.className = 'entry-item';
      const ta = document.createElement('textarea');
      ta.className = 'entry-input';
      ta.value = text;
      ta.placeholder = 'grateful for\u2026';
      ta.rows = 1;
      ta.setAttribute('autocorrect', 'on');
      ta.setAttribute('autocapitalize', 'sentences');
      ta.setAttribute('aria-label', `Entry ${idx + 1}`);
      const resize = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
      setTimeout(resize, 0);
      ta.addEventListener('input', () => { resize(); entry.entries[idx] = ta.value; onSave(entry); });
      item.appendChild(ta);
      list.appendChild(item);
    });
  } else {
    // Read-only: only filled entries, no number if single
    filled.forEach((text, i) => {
      const item = document.createElement('div');
      item.className = 'detail-entry-ro';
      if (filled.length > 1) {
        const num = document.createElement('span');
        num.className = 'detail-num';
        num.textContent = i + 1;
        num.setAttribute('aria-hidden', 'true');
        item.appendChild(num);
      }
      const p = document.createElement('p');
      p.className = 'detail-entry-text';
      p.textContent = text;
      item.appendChild(p);
      list.appendChild(item);
    });
  }

  if (list.children.length > 0) bodyEl.appendChild(list);

  if (entry.image || entry.voice) {
    const media = document.createElement('div');
    media.className = 'detail-media';
    if (entry.image) {
      const img = document.createElement('img');
      img.className = 'detail-photo';
      img.src = entry.image;
      img.alt = 'Photo';
      img.addEventListener('load', () => img.classList.add('loaded'));
      media.appendChild(img);
    }
    if (entry.voice) {
      media.appendChild(buildPlaybackUI(entry.voice, () => {}));
    }
    bodyEl.appendChild(media);
  }
}
