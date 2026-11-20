// Leonida Legend — offline GTA 6 trophy tracker.
// Loads data/trophies.json from this app only, saves progress in localStorage,
// and never makes a network request. All source links come from the data file
// and open only when the reader clicks them.
const STORE_KEY = 'leonida-legend-progress-v1';
const SPOILER_KEY = 'leonida-legend-spoilers-v1';

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoilers');
const earnedOnlyEl = document.getElementById('earnedOnly');
const progressText = document.getElementById('progressText');
const percentText = document.getElementById('percentText');
const progressFill = document.getElementById('progressFill');
const gradeCounts = document.getElementById('gradeCounts');
const shownCount = document.getElementById('shownCount');
const missableList = document.getElementById('missableList');

let trophies = [];
let earned = new Set(loadStored(STORE_KEY));
let selectedName = null;

spoilerEl.checked = loadStored(SPOILER_KEY) === true;

function loadStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

function saveProgress() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort()));
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function isSpoilerHidden(trophy) {
  return spoilerEl.checked && trophy.kind === 'story' && !earned.has(trophy.name);
}

function trophyMatches(trophy) {
  if (kindEl.value === 'missable') {
    if (!trophy.missable) return false;
  } else if (kindEl.value !== 'all' && trophy.kind !== kindEl.value) {
    return false;
  }
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  if (earnedOnlyEl.checked && !earned.has(trophy.name)) return false;
  const query = searchEl.value.trim().toLowerCase();
  if (query) {
    const hay = (trophy.name + ' ' + trophy.description + ' ' + trophy.guide + ' ' + trophy.kind).toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  progressText.textContent = done + ' of ' + total + ' earned';
  percentText.textContent = total ? Math.round((done / total) * 100) + '%' : '0%';
  progressFill.style.width = (total ? (done / total) * 100 : 0) + '%';
  const byGrade = {};
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const have = trophies.filter((t) => t.grade === grade && earned.has(t.name)).length;
    const all = trophies.filter((t) => t.grade === grade).length;
    byGrade[grade] = have + '/' + all + ' ' + grade;
  }
  gradeCounts.textContent = Object.values(byGrade).join('  ·  ');
}

function renderList() {
  rowsEl.replaceChildren();
  const visible = trophies.filter(trophyMatches);
  shownCount.textContent = '· ' + visible.length + ' shown';
  for (const trophy of visible) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'row' + (earned.has(trophy.name) ? ' earned' : '') + (selectedName === trophy.name ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', 'Earned: ' + trophy.name);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      if (box.checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      saveProgress();
      renderAll();
    });
    const body = document.createElement('div');
    body.className = 'body';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = isSpoilerHidden(trophy) ? 'Hidden story trophy' : trophy.name;
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'flag';
      flag.textContent = 'MISSABLE';
      name.append(flag);
    }
    if (trophy.hidden) {
      const flag = document.createElement('span');
      flag.className = 'flag hidden-flag';
      flag.textContent = 'HIDDEN';
      name.append(flag);
    }
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = isSpoilerHidden(trophy)
      ? 'Spoiler hidden — earn this story trophy to reveal its name and description.'
      : trophy.description;
    body.append(name, desc);
    const badge = document.createElement('span');
    badge.className = 'badge ' + trophy.grade;
    badge.textContent = trophy.grade;
    button.append(box, body, badge);
    button.addEventListener('click', () => {
      selectedName = trophy.name;
      renderAll();
    });
    item.append(button);
    rowsEl.append(item);
  }
  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'hint';
    empty.textContent = 'No trophies match these filters. Clear the search or change the filters.';
    rowsEl.append(empty);
  }
}

function renderDetail() {
  const trophy = trophies.find((t) => t.name === selectedName) || null;
  detailEl.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = 'Guide';
  detailEl.append(heading);
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Pick a trophy from the checklist to see its official description, our guide, and the sources behind it.';
    detailEl.append(hint);
    return;
  }
  const title = document.createElement('h3');
  title.textContent = isSpoilerHidden(trophy) ? 'Hidden story trophy' : trophy.name;
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = gradeLabel(trophy.grade) + ' · ' + trophy.kind +
    (trophy.missable ? ' · MISSABLE' : '') +
    (trophy.hidden ? ' · hidden on PlayStation until earned' : '') +
    ' · roadmap: ' + trophy.roadmap;
  const official = document.createElement('div');
  official.className = 'official';
  const officialLabel = document.createElement('strong');
  officialLabel.textContent = 'Official description: ';
  const officialText = document.createElement('span');
  officialText.textContent = isSpoilerHidden(trophy)
    ? 'Hidden until this story trophy is earned.'
    : trophy.description;
  official.append(officialLabel, officialText);
  const guideHeading = document.createElement('h4');
  guideHeading.textContent = 'How to earn it';
  const guideText = document.createElement('p');
  guideText.className = 'guide-text';
  guideText.textContent = trophy.guide;
  const sourcesHeading = document.createElement('h4');
  sourcesHeading.textContent = 'Sources';
  const sources = document.createElement('ul');
  sources.className = 'sources';
  for (const source of trophy.sources || []) {
    const item = document.createElement('li');
    // A source names its page in words and may carry its URL in parentheses;
    // turn the URL into a link the reader can follow (the app fetches nothing).
    const match = source.match(/(https?:\/\/[^\s)]+)/);
    if (match) {
      const before = source.slice(0, match.index);
      const after = source.slice(match.index + match[0].length);
      item.append(document.createTextNode(before));
      const link = document.createElement('a');
      link.href = match[0];
      link.textContent = match[0];
      link.target = '_blank';
      link.rel = 'noopener';
      item.append(link);
      item.append(document.createTextNode(after));
    } else {
      item.textContent = source;
    }
    sources.append(item);
  }
  const earnedLine = document.createElement('p');
  earnedLine.className = 'hint';
  earnedLine.textContent = earned.has(trophy.name) ? 'Earned — ticked off in your checklist.' : 'Not earned yet.';
  detailEl.append(title, meta, official, guideHeading, guideText, sourcesHeading, sources, earnedLine);
}

function renderMissables() {
  missableList.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  for (const trophy of missable) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = trophy.name + ' — ' + gradeLabel(trophy.grade);
    const text = document.createElement('p');
    text.textContent = trophy.guide;
    const sources = document.createElement('p');
    sources.className = 'dim';
    sources.textContent = 'Sources: ' + (trophy.sources || []).join(' | ');
    card.append(name, text, sources);
    missableList.append(card);
  }
  if (missable.length === 0) {
    const none = document.createElement('p');
    none.textContent = 'No missable trophies flagged.';
    missableList.append(none);
  }
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
}

function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

document.getElementById('export').addEventListener('click', () => {
  downloadFile('gta6-trophy-progress.json', JSON.stringify({
    game: 'Grand Theft Auto VI',
    exported: new Date().toISOString(),
    earned: [...earned].sort(),
  }, null, 2));
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('bad file');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((name) => known.has(name)));
    saveProgress();
    renderAll();
  } catch {
    alert('That file is not a progress export from this guide.');
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = new Set();
    saveProgress();
    renderAll();
  }
});

searchEl.addEventListener('input', renderAll);
kindEl.addEventListener('change', renderAll);
gradeEl.addEventListener('change', renderAll);
earnedOnlyEl.addEventListener('change', renderAll);
spoilerEl.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilerEl.checked));
  renderAll();
});

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
renderMissables();
renderAll();
