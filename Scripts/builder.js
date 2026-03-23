// ================================================================
//  CREATORLINK BUILDER — Scripts/builder.js
// ================================================================

/* ── STATE ── */
let STATE = {
  name: '', handle: '', avatarBase64: '',
  taglines: ['streamer · creator · cyber', 'twitch · youtube · socials'],
  theme: 'cyber',
  project: { show: true, name: '', sublabel: '', progress: 75, url: '' },
  idle: { enabled: true, minutes: 5 },
  easterEgg: { enabled: false, keyword: '', url: '' },
  sections: [
    { title: 'STREAMING', links: [
      { icon:'twitch', label:'', badge:'Live Streams', url:'', platform:'twitch', highlight:false }
    ]},
    { title: 'YOUTUBE', links: [
      { icon:'youtube', label:'Main Channel', badge:'Main', url:'', platform:'youtube', highlight:false },
      { icon:'youtube', label:'Highlights',   badge:'Clips', url:'', platform:'youtube', highlight:false },
    ]},
    { title: 'SOCIALS', links: [
      { icon:'github',    label:'GitHub',     badge:'', url:'', platform:'github',    highlight:false },
      { icon:'x-twitter', label:'Twitter / X', badge:'', url:'', platform:'twitter',   highlight:false },
      { icon:'instagram', label:'Instagram',  badge:'', url:'', platform:'instagram', highlight:false },
      { icon:'discord',   label:'Discord',    badge:'', url:'', platform:'discord',   highlight:false },
    ]},
  ],
  pages: [],
  footer: '',
};

let currentStep = 0;
const TOTAL_STEPS = 4;
const PLATFORM_OPTIONS = ['','twitch','youtube','twitter','instagram','discord','spotify','github','tiktok','reddit'];
const SOLID_ICONS = ['robot','store','circle-info','dragon','bell','lock','flag','house','file','link','palette','satellite-dish'];

/* ── STEP NAV ── */
function goStep(n) {
  currentStep = Math.max(0, Math.min(TOTAL_STEPS - 1, n));
  document.querySelectorAll('.step-panel').forEach((p, i) => p.classList.toggle('active', i === currentStep));
  document.querySelectorAll('.step-btn').forEach((b, i)  => b.classList.toggle('active', i === currentStep));
  document.getElementById('step-indicator').textContent = `STEP ${currentStep + 1} OF ${TOTAL_STEPS}`;
  const prevBtn = document.getElementById('prev-btn');
  prevBtn.style.opacity = currentStep === 0 ? '0.3' : '1';
  prevBtn.style.pointerEvents = currentStep === 0 ? 'none' : 'auto';
  const isLast = currentStep === TOTAL_STEPS - 1;
  document.getElementById('next-btn').style.display  = isLast ? 'none' : '';
  document.getElementById('export-btn').style.display = isLast ? 'flex' : 'none';
}
function changeStep(dir) { goStep(currentStep + dir); }

/* ── AVATAR ── */
function handleAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    STATE.avatarBase64 = e.target.result;
    document.getElementById('avatar-preview').innerHTML = `<img src="${e.target.result}" alt="avatar">`;
    document.getElementById('avatar-drop-text').textContent = file.name;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

/* ── TAGLINES ── */
function renderTaglines() {
  const c = document.getElementById('taglines-container');
  c.innerHTML = '';
  STATE.taglines.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'tagline-row';
    row.innerHTML = `
      <input type="text" value="${t}" placeholder="creator · streamer · dev"
        oninput="STATE.taglines[${i}]=this.value;updatePreview()">
      <button class="del-tagline" onclick="STATE.taglines.splice(${i},1);renderTaglines();updatePreview()">
        <i class="fa-solid fa-xmark"></i>
      </button>`;
    c.appendChild(row);
  });
}
function addTagline() {
  STATE.taglines.push('');
  renderTaglines();
  updatePreview();
}

/* ── THEME PICKER ── */
function pickTheme(name) {
  STATE.theme = name;
  document.querySelectorAll('.theme-pick').forEach(c => c.classList.toggle('selected', c.dataset.theme === name));
  updatePreview();
}

/* ── SECTIONS & LINKS ── */
function renderSections() {
  const c = document.getElementById('sections-builder');
  c.innerHTML = '';
  STATE.sections.forEach((sec, si) => {
    const block = document.createElement('div');
    block.className = 'section-block';
    block.innerHTML = `
      <div class="section-title-row">
        <input type="text" value="${escQ(sec.title)}" placeholder="SECTION TITLE"
          oninput="STATE.sections[${si}].title=this.value;updatePreview()">
        <button class="del-section-btn" title="Delete section"
          onclick="STATE.sections.splice(${si},1);renderSections();updatePreview()">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div id="links-${si}"></div>
      <button class="add-link-btn" onclick="addLink(${si})">
        <i class="fa-solid fa-plus"></i> ADD LINK
      </button>`;
    c.appendChild(block);
    renderLinks(si);
  });
}

function renderLinks(si) {
  const c = document.getElementById(`links-${si}`);
  if (!c) return;
  c.innerHTML = '';
  STATE.sections[si].links.forEach((link, li) => {
    const platOpts = PLATFORM_OPTIONS.map(p =>
      `<option value="${p}" ${link.platform === p ? 'selected' : ''}>${p || 'generic'}</option>`
    ).join('');

    const entry = document.createElement('div');
    entry.className = 'link-entry';
    entry.innerHTML = `
      <div class="link-entry-header">
        <i class="fa-brands fa-${link.icon || 'link'} link-entry-icon"></i>
        <span class="link-entry-label">${escQ(link.label) || 'New Link'}</span>
        <button class="link-entry-del"
          onclick="STATE.sections[${si}].links.splice(${li},1);renderLinks(${si});updatePreview()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="link-entry-body">
        <div class="field-group">
          <div class="field-label">LABEL</div>
          <input type="text" value="${escQ(link.label)}" placeholder="YouTube Main"
            oninput="STATE.sections[${si}].links[${li}].label=this.value;updateLinkHeader(${si},${li},this.value);updatePreview()">
        </div>
        <div class="field-group">
          <div class="field-label">BADGE</div>
          <input type="text" value="${escQ(link.badge)}" placeholder="MAIN"
            oninput="STATE.sections[${si}].links[${li}].badge=this.value;updatePreview()">
        </div>
        <div class="field-group full">
          <div class="field-label">URL</div>
          <input type="url" value="${escQ(link.url)}" placeholder="https://..."
            oninput="STATE.sections[${si}].links[${li}].url=this.value;updatePreview()">
        </div>
        <div class="field-group">
          <div class="field-label">PLATFORM</div>
          <select onchange="STATE.sections[${si}].links[${li}].platform=this.value;updatePreview()">
            ${platOpts}
          </select>
        </div>
        <div class="field-group">
          <div class="field-label">ICON <span style="opacity:.5">(FA name)</span></div>
          <input type="text" value="${escQ(link.icon)}" placeholder="youtube"
            oninput="STATE.sections[${si}].links[${li}].icon=this.value;updatePreview()">
        </div>
        <div class="field-group" style="display:flex;align-items:center;gap:8px;padding-top:16px">
          <label class="toggle" title="Highlight this link">
            <input type="checkbox" ${link.highlight ? 'checked' : ''}
              onchange="STATE.sections[${si}].links[${li}].highlight=this.checked;updatePreview()">
            <span class="toggle-slider"></span>
          </label>
          <span style="font-size:9px;letter-spacing:1px;color:var(--muted)">HIGHLIGHT</span>
        </div>
      </div>`;
    c.appendChild(entry);
  });
}

// Updates just the header label text in-place — keeps focus on the input while typing
function updateLinkHeader(si, li, val) {
  const entries = document.querySelectorAll(`#links-${si} .link-entry`);
  if (entries[li]) {
    const lbl = entries[li].querySelector('.link-entry-label');
    if (lbl) lbl.textContent = val || 'New Link';
  }
}

function addLink(si) {
  STATE.sections[si].links.push({ icon:'link', label:'', badge:'', url:'', platform:'', highlight:false });
  renderLinks(si);
  updatePreview();
}
function addSection() {
  STATE.sections.push({ title: 'NEW SECTION', links: [] });
  renderSections();
  updatePreview();
}

/* ── PAGES ── */
function renderPages() {
  const c = document.getElementById('pages-builder');
  c.innerHTML = '';
  STATE.pages.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'page-entry';
    row.innerHTML = `
      <input type="text" value="${escQ(p.label)}" placeholder="Label (e.g. Challenges)"
        oninput="STATE.pages[${i}].label=this.value;updatePreview()">
      <input type="text" value="${escQ(p.url)}" placeholder="e.g. Challenges/ctf_hub.html"
        oninput="STATE.pages[${i}].url=this.value;updatePreview()">
      <button class="del-btn" onclick="STATE.pages.splice(${i},1);renderPages();updatePreview()">
        <i class="fa-solid fa-xmark"></i>
      </button>`;
    c.appendChild(row);
  });
}
function addPage() {
  STATE.pages.push({ label:'', url:'', icon:'file' });
  renderPages();
}

/* ── READ FORM ── */
function readForm() {
  STATE.name   = document.getElementById('f-name').value   || 'YourName';
  STATE.handle = document.getElementById('f-handle').value || '@yourhandle';

  // Keep avatar in sync from preview slot in case direct DOM paste was used.
  const avatarImg = document.querySelector('#avatar-preview img');
  if (avatarImg && avatarImg.src && avatarImg.src.startsWith('data:')) {
    STATE.avatarBase64 = avatarImg.src;
  }

  // Taglines may be changed in the DOM for safety, sync from fields.
  const taglineInputs = document.querySelectorAll('#taglines-container input');
  if (taglineInputs.length) {
    STATE.taglines = Array.from(taglineInputs)
      .map(i => i.value.trim())
      .filter(Boolean);
  }

  // Theme sync from selected tile as a backup and for export accuracy.
  const themePick = document.querySelector('.theme-pick.selected');
  if (themePick && themePick.dataset.theme) {
    STATE.theme = themePick.dataset.theme;
  }

  STATE.project.show     = document.getElementById('f-proj-show').checked;
  STATE.project.name     = document.getElementById('f-proj-name').value;
  STATE.project.sublabel = document.getElementById('f-proj-sub').value;
  STATE.project.progress = parseInt(document.getElementById('f-proj-prog').value) || 75;
  STATE.project.url      = document.getElementById('f-proj-url').value;
  STATE.idle.enabled = document.getElementById('f-idle').checked;
  STATE.idle.minutes = parseInt(document.getElementById('f-idle-mins').value) || 5;
  STATE.easterEgg.enabled = document.getElementById('f-egg').checked;
  STATE.easterEgg.keyword = document.getElementById('f-egg-kw').value;
  STATE.easterEgg.url     = document.getElementById('f-egg-url').value;
  STATE.footer = document.getElementById('f-footer').value;

  document.getElementById('egg-fields').style.display  = STATE.easterEgg.enabled ? '' : 'none';
  document.getElementById('proj-fields').style.display = STATE.project.show ? '' : 'none';
}

/* ── CONFIG GENERATOR ── */
/* ── buildDataJS: bakes all user data into the site as a const — no loose config file ── */
function buildDataJS() {
  const s = STATE;
  return `const CONFIG = ${JSON.stringify({
    name:       s.name,
    handle:     s.handle,
    avatar:     s.avatarBase64 || "",
    taglines:   s.taglines,
    theme:      s.theme,
    project:    s.project,
    idle:       s.idle,
    easterEgg:  s.easterEgg,
    sections:   s.sections,
    pages:      s.pages,
    footer:     s.footer,
  }, null, 2)};`;
}
/* Keep buildConfigJS as alias for buildPreviewHTML compatibility */
function buildConfigJS() { return buildDataJS(); }

function dataUrlToArrayBuffer(dataUrl) {
  const parts = dataUrl.split(',');
  if (parts.length !== 2 || !parts[0].includes('base64')) {
    throw new Error('Invalid data URL for avatar');
  }
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function extractDataUrlExtension(dataUrl) {
  const match = dataUrl.match(/^data:.*\/(.*?);base64,/);
  return match ? match[1].split('+')[0] : 'png';
}

/* ── INDEX.HTML GENERATOR ── */
function buildIndexHTML() {
  const data   = buildDataJS();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(STATE.name)} — Links</title>
<meta property="og:title" content="${escHtml(STATE.name)}">
<meta property="og:description" content="Official links for ${escHtml(STATE.name)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;600;700&family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
<link rel="stylesheet" href="Styles/styles.css">
</head>
<body>
<div id="cursor"></div>
<div id="cursorRing"></div>
<div class="noise"></div>
<div class="grid-bg"></div>
<div class="glow-orb o1"></div>
<div class="glow-orb o2"></div>
<div class="glow-orb o3"></div>
<div class="corner-deco tl"></div>
<div class="corner-deco tr"></div>
<div class="corner-deco bl"></div>
<div class="corner-deco br"></div>
<div class="wrapper" id="main-wrapper">
  <header class="hero">
    <div class="avatar-ring">
      <div class="avatar-placeholder" id="avatar-el"></div>
    </div>
    <h1 class="hero-name" id="hero-name"></h1>
    <p class="hero-handle" id="hero-handle"></p>
    <p class="hero-sub" id="hero-sub"><span id="typing-text"></span><span class="typing-cursor"></span></p>
  </header>
  <div class="section" id="project-section">
    <div class="section-label">Projects</div>
    <a class="featured-card" id="project-card" href="#">
      <div class="featured-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="featured-content">
        <div class="featured-title" id="proj-name"></div>
        <div class="featured-sub" id="proj-sub"></div>
        <div class="progress-wrap">
          <div class="progress-track"><div class="progress-fill" id="proj-bar"></div></div>
          <div class="progress-label" id="proj-pct"></div>
        </div>
      </div>
      <i class="fa-solid fa-arrow-right link-arrow" style="opacity:.4;transform:none"></i>
    </a>
  </div>
  <div id="sections-container"></div>
  <footer class="footer"><span id="footer-text"></span></footer>
</div>
<div id="theme-switcher">
  <div id="theme-toggle-btn" title="Switch theme"><i class="fa-solid fa-palette"></i></div>
  <div id="theme-options">
    <button class="theme-opt" data-theme="cyber">Cyber</button>
    <button class="theme-opt" data-theme="minimal">Minimal</button>
    <button class="theme-opt" data-theme="terminal">Terminal</button>
    <button class="theme-opt" data-theme="soft">Soft</button>
    <button class="theme-opt" data-theme="sakura">Sakura</button>
    <button class="theme-opt" data-theme="sunset">Sunset</button>
    <button class="theme-opt" data-theme="ocean">Ocean</button>
    <button class="theme-opt" data-theme="void">Void</button>
    <button class="theme-opt" data-theme="gold">Gold</button>
    <button class="theme-opt" data-theme="neon">Neon</button>
    <button class="theme-opt" data-theme="blood">Blood</button>
    <button class="theme-opt" data-theme="midnight">Midnight</button>
    <button class="theme-opt" data-theme="forest">Forest</button>
    <button class="theme-opt" data-theme="retro">Retro</button>
    <button class="theme-opt" data-theme="arctic">Arctic</button>
    <a class="theme-opt" href="themes.html" style="text-decoration:none;display:block;text-align:center">Theme Gallery</a>
  </div>
</div>
<script>${data}<\/script>
<script src="Scripts/themes.js"></script>
<script src="Scripts/app.js"></script>
</body>
</html>`;
}

/* ── PREVIEW HTML (self-contained, cursor disabled inside iframe) ── */
async function buildPreviewHTML() {
  const cfg = buildConfigJS();
  const baseHref = new URL('.', location.href).href;

  // Inject a flag so app.js knows it's inside the builder preview
  // This disables the custom cursor (pointer-events:none on iframe anyway)
  const previewOverride = `
    /* Preview mode — disable custom cursor */
    #cursor, #cursorRing { display: none !important; }
    body, a, button { cursor: default !important; }
    * { cursor: default !important; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<base href="${baseHref}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;600;700&family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
<link rel="stylesheet" href="Styles/styles.css">
<style>${previewOverride}</style>
</head>
<body>
<div id="cursor"></div><div id="cursorRing"></div>
<div class="noise"></div><div class="grid-bg"></div>
<div class="glow-orb o1"></div><div class="glow-orb o2"></div><div class="glow-orb o3"></div>
<div class="corner-deco tl"></div><div class="corner-deco tr"></div>
<div class="corner-deco bl"></div><div class="corner-deco br"></div>
<div class="wrapper" id="main-wrapper">
  <header class="hero">
    <div class="avatar-ring"><div class="avatar-placeholder" id="avatar-el"></div></div>
    <h1 class="hero-name" id="hero-name"></h1>
    <p class="hero-handle" id="hero-handle"></p>
    <p class="hero-sub" id="hero-sub"><span id="typing-text"></span><span class="typing-cursor"></span></p>
  </header>
  <div class="section" id="project-section">
    <div class="section-label">Projects</div>
    <a class="featured-card" id="project-card" href="#">
      <div class="featured-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="featured-content">
        <div class="featured-title" id="proj-name"></div>
        <div class="featured-sub" id="proj-sub"></div>
        <div class="progress-wrap">
          <div class="progress-track"><div class="progress-fill" id="proj-bar"></div></div>
          <div class="progress-label" id="proj-pct"></div>
        </div>
      </div>
    </a>
  </div>
  <div id="sections-container"></div>
  <footer class="footer"><span id="footer-text"></span></footer>
</div>
<script>
  // Builder preview — force theme from CONFIG, never localStorage
  const PREVIEW_MODE = true;
  try { localStorage.removeItem('cl-theme'); } catch(e) {}
  const _origGet = Storage.prototype.getItem;
  Storage.prototype.getItem = function(k) {
    if (k === 'cl-theme') return CONFIG.theme;
    return _origGet.call(this, k);
  };
<\/script>
<script>${cfg}<\/script>
<script src="Scripts/themes.js"></script>
<script src="Scripts/app.js"></script>
</body></html>`;
}

/* ── LIVE PREVIEW ── */
let previewTimer = null;
async function updatePreview() {
  readForm();
  clearTimeout(previewTimer);
  previewTimer = setTimeout(async () => {
    const frame = document.getElementById('preview-frame');
    const html  = await buildPreviewHTML();
    frame.srcdoc = html;
  }, 700);
}

/* ── RESOURCE LOADER (file:// fallback) ── */
async function loadAsset(path) {
  // For file:// protocol, try different approaches
  const isFileProtocol = location.protocol === 'file:';
  const baseUrl = isFileProtocol ? location.href.replace(/\/[^\/]*$/, '/') : location.href.replace(/\/[^\/]*$/, '/');
  const url = new URL(path, baseUrl).href;
  console.log('Loading asset:', url, 'isFile:', isFileProtocol);

  // First try: fetch
  try {
    const res = await fetch(url, { mode: isFileProtocol ? 'no-cors' : 'cors' });
    if (res.ok || (isFileProtocol && res.type === 'opaque')) {
      const text = await res.text();
      console.log('Loaded via fetch:', path, text.length, 'chars');
      return text;
    }
    throw new Error('Fetch status ' + res.status);
  } catch (fetchErr) {
    console.log('Fetch failed, trying XHR:', fetchErr.message);

    // Second try: XHR
    try {
      const text = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain');
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Loaded via XHR:', path, xhr.responseText.length, 'chars');
            resolve(xhr.responseText);
          } else {
            reject(new Error('XHR status ' + xhr.status));
          }
        };
        xhr.onerror = function () {
          reject(new Error('XHR network error'));
        };
        xhr.send();
      });
      return text;
    } catch (xhrErr) {
      console.log('XHR failed, trying import:', xhrErr.message);

      // Third try: dynamic import (for JS files)
      if (path.endsWith('.js')) {
        try {
          // This might not work for file:// but let's try
          const module = await import(url);
          console.log('Loaded via import');
          return '// Loaded via dynamic import\n' + JSON.stringify(module);
        } catch (importErr) {
          console.log('Import failed:', importErr.message);
        }
      }

      // Final fallback: return error message
      throw new Error(`Failed to load ${path}: fetch(${fetchErr.message}), xhr(${xhrErr.message})`);
    }
  }
}

/* ── PREVIEW MODE TOGGLE ── */
function setPreviewMode(mode) {
  const stage = document.getElementById('preview-stage');
  stage.classList.toggle('desktop-mode', mode === 'desktop');
  document.querySelectorAll('.preview-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
}

/* ── EXPORT ZIP ── */
async function exportZip() {
  readForm();
  const btn = document.getElementById('export-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> &nbsp;BUILDING...';

  try {
    console.log('Starting ZIP export...');
    const zip      = new JSZip();
    const root     = zip.folder('creatorlink');
    const scripts  = root.folder('Scripts');
    const styles   = root.folder('Styles');

    console.log('Building index.html from preview state...');

    // For strongest fidelity to what the user saw, use the same preview HTML
    // output, then include assets in the zip folder.
    const finalIndexHtml = await buildPreviewHTML();
    root.file('index.html', finalIndexHtml);

    // Removed themes.html from export per request.
    console.log('Building README.md...');
    root.file('README.md',    buildReadme());

    console.log('Loading app.js...');
    let appJsContent;
    try {
      appJsContent = await loadAsset('Scripts/app.js');
    } catch (e) {
      console.warn('Failed to load app.js via loadAsset, using embedded fallback:', e.message);
      // Fallback content - the actual app.js content
      appJsContent = `// ================================================================
//  CREATORLINK — Scripts/app.js
//  Runtime script for generated sites.
// ================================================================

(function() {
  'use strict';

  // ── CONFIG ──
  const CONFIG = {
    idleTimeout: 30000, // 30 seconds
    idleCheckInterval: 1000, // 1 second
    cursorUpdateInterval: 16, // ~60fps
    themeTransitionDuration: 400,
    scanlinesOpacity: 0.13,
    noiseOpacity: 0.025,
    orbOpacity: 0.12,
    gridOpacity: 0.04,
    cornerOpacity: 0.3,
    cursorRingSize: 36,
    cursorRingBorder: 'rgba(0,200,255,0.4)',
    minimalCursorRingSize: 24,
    minimalCursorRingBorder: 'rgba(255,255,255,0.2)',
    typingSpeed: 50,
    typingDelay: 1000,
    typingCursorBlink: 1000,
    progressAnimationDelay: 500,
    progressAnimationDuration: 1500,
    navLinkHoverDelay: 150,
    themeSwitcherDelay: 200,
    idleOverlayDelay: 350,
    idleScanlinesOpacity: 0.3,
    idleStaticBarOpacity: 0.06,
    idleIconFlickerDuration: 2500,
    idleTitleGlitchDuration: 4000,
    idleBarFlickerDuration: 1800,
    idlePulseDuration: 1200,
    idleBtnHoverDelay: 200,
    mobileBreakpoint: 480
  };

  // ── UTILS ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, evt, fn) => el.addEventListener(evt, fn);
  const off = (el, evt, fn) => el.removeEventListener(evt, fn);
  const hasClass = (el, cls) => el.classList.contains(cls);
  const addClass = (el, cls) => el.classList.add(cls);
  const removeClass = (el, cls) => el.classList.remove(cls);
  const toggleClass = (el, cls) => el.classList.toggle(cls);
  const setAttr = (el, attr, val) => el.setAttribute(attr, val);
  const getAttr = (el, attr) => el.getAttribute(attr);
  const setStyle = (el, prop, val) => el.style[prop] = val;
  const getStyle = (el, prop) => getComputedStyle(el)[prop];
  const debounce = (fn, delay) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; };
  const throttle = (fn, delay) => { let t; return (...args) => { if (!t) { fn = setTimeout(() => t = null, delay); } }; };
  const rand = (min, max) => Math.random() * (max - min) + min;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // ── THEME APPLICATION ──
  function applyTheme(themeName) {
    const body = document.body;
    const theme = THEMES[themeName];
    if (!theme) return;

    // Remove existing theme classes
    Object.keys(THEMES).forEach(t => removeClass(body, \`theme-\${t}\`));
    addClass(body, \`theme-\${themeName}\`);

    // Apply CSS variables
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(\`--\${key}\`, value);
    });

    // Apply theme-specific features
    toggleClass(body, 'has-grid', theme.features.grid);
    toggleClass(body, 'has-orbs', theme.features.orbs);
    toggleClass(body, 'has-noise', theme.features.noise);
    toggleClass(body, 'has-corners', theme.features.corners);
    toggleClass(body, 'has-cursor', theme.features.cursor);
    toggleClass(body, 'scanlines', theme.features.scanlines);
    toggleClass(body, 'name-gradient', theme.features.nameGradient);
    toggleClass(body, 'name-flat', !theme.features.nameGradient);
    toggleClass(body, 'cursor-minimal', theme.features.minimalCursor);

    // Update theme switcher
    $$('.theme-opt').forEach(opt => {
      toggleClass(opt, 'active', getAttr(opt, 'data-theme') === themeName);
    });

    // Store preference
    localStorage.setItem('creatorlink-theme', themeName);
  }

  // ── BUILD SECTIONS ──
  function buildSections() {
    const sections = $$('.section[data-section]');
    sections.forEach(section => {
      const type = getAttr(section, 'data-section');
      const items = getAttr(section, 'data-items') || '';
      const content = section.querySelector('.section-content');

      if (!content) return;

      switch (type) {
        case 'links':
          buildLinksSection(content, items);
          break;
        case 'featured':
          buildFeaturedSection(content, items);
          break;
        case 'warning':
          buildWarningSection(content, items);
          break;
      }
    });
  }

  function buildLinksSection(container, itemsStr) {
    if (!itemsStr) return;
    const items = JSON.parse(itemsStr);
    const linksHtml = items.map(item => \`
      <a href="\${item.url}" target="_blank" rel="noopener noreferrer"
         class="link-item \${item.highlight ? 'highlight' : ''} \${item.disabled ? 'disabled' : ''}"
         data-platform="\${item.platform || ''}">
        <div class="link-icon">\${item.icon || '🔗'}</div>
        <div class="link-name">\${item.name}</div>
        \${item.badge ? \`<div class="link-badge">\${item.badge}</div>\` : ''}
        <div class="link-arrow">→</div>
      </a>
    \`).join('');
    container.innerHTML = \`<div class="links">\${linksHtml}</div>\`;
  }

  function buildFeaturedSection(container, itemsStr) {
    if (!itemsStr) return;
    const items = JSON.parse(itemsStr);
    const featuredHtml = items.map(item => \`
      <a href="\${item.url}" target="_blank" rel="noopener noreferrer" class="featured-card">
        <div class="featured-icon">\${item.icon || '⭐'}</div>
        <div class="featured-content">
          <div class="featured-title">\${item.title}</div>
          <div class="featured-sub">\${item.subtitle}</div>
          \${item.progress !== undefined ? \`
            <div class="progress-wrap">
              <div class="progress-track">
                <div class="progress-fill" style="width: \${item.progress}%"></div>
              </div>
              <div class="progress-label">\${item.progress}%</div>
            </div>
          \` : ''}
        </div>
      </a>
    \`).join('');
    container.innerHTML = featuredHtml;
  }

  function buildWarningSection(container, itemsStr) {
    if (!itemsStr) return;
    const items = JSON.parse(itemsStr);
    const warningHtml = items.map(item => \`
      <div class="warning-box">
        <div class="warning-icon">\${item.icon || '⚠️'}</div>
        <div class="warning-text">\${item.text}</div>
      </div>
    \`).join('');
    container.innerHTML = warningHtml;
  }

  // ── TYPING EFFECT ──
  function initTypingEffect() {
    const subEl = $('.hero-sub');
    if (!subEl || !subEl.textContent.trim()) return;

    const text = subEl.textContent.trim();
    subEl.textContent = '';
    subEl.insertAdjacentHTML('afterend', '<span class="typing-cursor"></span>');
    const cursor = $('.typing-cursor');

    let i = 0;
    const type = () => {
      if (i < text.length) {
        subEl.textContent += text.charAt(i);
        i++;
        setTimeout(type, CONFIG.typingSpeed);
      } else {
        setTimeout(() => {
          cursor.style.animation = 'none';
          setTimeout(() => cursor.remove(), CONFIG.typingCursorBlink);
        }, CONFIG.typingDelay);
      }
    };
    setTimeout(type, CONFIG.typingDelay);
  }

  // ── CUSTOM CURSOR ──
  function initCursor() {
    if (!hasClass(document.body, 'has-cursor')) return;

    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);

    const cursorRing = document.createElement('div');
    cursorRing.id = 'cursorRing';
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    const updateCursor = () => {
      cursorX = lerp(cursorX, mouseX, 0.2);
      cursorY = lerp(cursorY, mouseY, 0.2);
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);

      setStyle(cursor, 'left', \`\${cursorX}px\`);
      setStyle(cursor, 'top', \`\${cursorY}px\`);
      setStyle(cursorRing, 'left', \`\${ringX}px\`);
      setStyle(cursorRing, 'top', \`\${ringY}px\`);

      requestAnimationFrame(updateCursor);
    };
    updateCursor();

    on(document, 'mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    on(document, 'mouseenter', () => {
      addClass(cursor, 'visible');
      addClass(cursorRing, 'visible');
    });

    on(document, 'mouseleave', () => {
      removeClass(cursor, 'visible');
      removeClass(cursorRing, 'visible');
    });

    // Hover effects
    $$('a, button, .link-item').forEach(el => {
      on(el, 'mouseenter', () => {
        addClass(cursorRing, 'hover');
        setStyle(cursorRing, 'width', '48px');
        setStyle(cursorRing, 'height', '48px');
        setStyle(cursorRing, 'borderColor', 'rgba(0,200,255,0.8)');
      });
      on(el, 'mouseleave', () => {
        removeClass(cursorRing, 'hover');
        setStyle(cursorRing, 'width', \`\${hasClass(document.body, 'cursor-minimal') ? CONFIG.minimalCursorRingSize : CONFIG.cursorRingSize}px\`);
        setStyle(cursorRing, 'height', \`\${hasClass(document.body, 'cursor-minimal') ? CONFIG.minimalCursorRingSize : CONFIG.cursorRingSize}px\`);
        setStyle(cursorRing, 'borderColor', hasClass(document.body, 'cursor-minimal') ? CONFIG.minimalCursorRingBorder : CONFIG.cursorRingBorder);
      });
    });
  }

  // ── THEME SWITCHER ──
  function initThemeSwitcher() {
    const switcher = $('#theme-switcher');
    if (!switcher) return;

    const toggleBtn = $('#theme-toggle-btn');
    const options = $('#theme-options');

    on(toggleBtn, 'click', () => {
      toggleClass(options, 'open');
    });

    $$('.theme-opt').forEach(opt => {
      on(opt, 'click', () => {
        const theme = getAttr(opt, 'data-theme');
        applyTheme(theme);
        removeClass(options, 'open');
      });
    });

    // Close on outside click
    on(document, 'click', e => {
      if (!switcher.contains(e.target)) {
        removeClass(options, 'open');
      }
    });
  }

  // ── IDLE DETECTION ──
  function initIdleDetection() {
    let idleTimer;
    let lastActivity = Date.now();

    const resetTimer = () => {
      lastActivity = Date.now();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showIdleOverlay, CONFIG.idleTimeout);
      hideIdleOverlay();
    };

    const showIdleOverlay = () => {
      const overlay = $('#idle-overlay');
      if (!overlay) return;
      addClass(overlay, 'visible');
    };

    const hideIdleOverlay = () => {
      const overlay = $('#idle-overlay');
      if (!overlay) return;
      removeClass(overlay, 'visible');
    };

    // Activity events
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
      on(document, evt, resetTimer);
    });

    // Idle overlay click to resume
    const overlay = $('#idle-overlay');
    if (overlay) {
      on(overlay, 'click', resetTimer);
    }

    resetTimer();
  }

  // ── PROGRESS ANIMATION ──
  function initProgressAnimation() {
    $$('.progress-fill').forEach(fill => {
      const width = getAttr(fill, 'style').match(/width:\\s*(\\d+)%/)?.[1] || 0;
      setStyle(fill, 'width', '0%');
      setTimeout(() => {
        setStyle(fill, 'width', \`\${width}%\`);
      }, CONFIG.progressAnimationDelay);
    });
  }

  // ── SITE NAVIGATION ──
  function initSiteNav() {
    const nav = $('#site-nav');
    if (!nav) return;

    $$('.nav-link').forEach(link => {
      on(link, 'click', e => {
        e.preventDefault();
        const page = getAttr(link, 'data-page');
        // Implement page switching logic here
        console.log('Navigate to page:', page);
      });
    });
  }

  // ── INITIALIZATION ──
  function init() {
    // Apply saved theme or default
    const savedTheme = localStorage.getItem('creatorlink-theme') || 'cyber';
    applyTheme(savedTheme);

    // Build dynamic sections
    buildSections();

    // Initialize features
    initTypingEffect();
    initCursor();
    initThemeSwitcher();
    initIdleDetection();
    initProgressAnimation();
    initSiteNav();

    // Show wrapper with animation
    setTimeout(() => addClass($('.wrapper'), 'visible'), 100);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    on(document, 'DOMContentLoaded', init);
  } else {
    init();
  }

})();
`;
    }

    console.log('Loading styles.css...');
    let stylesCssContent;
    try {
      stylesCssContent = await loadAsset('Styles/styles.css');
    } catch (e) {
      console.warn('Failed to load styles.css via loadAsset, using embedded fallback:', e.message);
      stylesCssContent = `/* ================================================================
   CREATORLINK — Styles/styles.css
   Theme variables are injected by app.js at runtime.
   Do not edit the :root block — those values get overridden.
   ================================================================ */

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

/* ── CSS VARIABLES (overridden by app.js) ── */
:root {
  --bg:          #020812;
  --surface:     rgba(255,255,255,0.03);
  --border:      rgba(0,200,255,0.15);
  --accent:      #00c8ff;
  --accent-alt:  #ff2d78;
  --accent-tri:  #a259ff;
  --text:        #e0f4ff;
  --muted:       #4a7a9b;
  --ff-display:  'Bebas Neue', sans-serif;
  --ff-body:     'Rajdhani', sans-serif;
  --ff-mono:     'Share Tech Mono', monospace;
}

/* ── BASE ── */
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--ff-body);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  transition: background .4s, color .4s;
}

/* ── SCANLINES ── */
body.scanlines::before {
  content: '';
  position: fixed; inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px
  );
  pointer-events: none;
  z-index: 100;
}

/* ── ANIMATED GRID BACKGROUND ── */
.grid-bg {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 20s linear infinite;
  pointer-events: none; z-index: 0;
  opacity: 0; transition: opacity .4s;
}
body.has-grid .grid-bg { opacity: 1; }
@keyframes gridMove { to { transform: translateY(40px); } }

/* ── GLOW ORBS ── */
.glow-orb {
  position: fixed; border-radius: 50%;
  filter: blur(80px);
  pointer-events: none; z-index: 0;
  opacity: 0; transition: opacity .6s;
}
body.has-orbs .glow-orb { opacity: 1; }
.o1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(0,200,255,0.12) 0%, transparent 70%);
  top: -150px; left: -150px;
  animation: orbFloat1 12s ease-in-out infinite;
}
.o2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(162,89,255,0.1) 0%, transparent 70%);
  bottom: 100px; right: -100px;
  animation: orbFloat2 15s ease-in-out infinite;
}
.o3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,45,120,0.08) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  animation: orbFloat3 18s ease-in-out infinite;
}
@keyframes orbFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,80px)} }
@keyframes orbFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,-60px)} }
@keyframes orbFloat3 {
  0%,100%{transform:translate(-50%,-50%) scale(1)}
  50%{transform:translate(-50%,-50%) scale(1.3)}
}

/* ── NOISE OVERLAY ── */
.noise {
  position: fixed; inset: 0; opacity: .025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 99; display: none;
}
body.has-noise .noise { display: block; }

/* ── CORNER DECORATIONS ── */
.corner-deco {
  position: fixed; width: 60px; height: 60px;
  pointer-events: none; z-index: 2;
  opacity: 0; transition: opacity .4s;
}
body.has-corners .corner-deco { opacity: 1; }
.corner-deco.tl { top:16px;  left:16px;  border-top:1px solid rgba(0,200,255,0.3); border-left:1px solid rgba(0,200,255,0.3); }
.corner-deco.tr { top:16px;  right:16px; border-top:1px solid rgba(0,200,255,0.3); border-right:1px solid rgba(0,200,255,0.3); }
.corner-deco.bl { bottom:16px; left:16px;  border-bottom:1px solid rgba(0,200,255,0.3); border-left:1px solid rgba(0,200,255,0.3); }
.corner-deco.br { bottom:16px; right:16px; border-bottom:1px solid rgba(0,200,255,0.3); border-left:1px solid rgba(0,200,255,0.3); }

/* ── PAGE WRAPPER ── */
.wrapper {
  position: relative; z-index: 1;
  max-width: 680px; margin: 0 auto;
  padding: 52px 28px 100px;
  opacity: 0; transform: translateY(20px);
  transition: opacity .5s, transform .5s;
}
.wrapper.visible { opacity: 1; transform: none; }

/* ── HERO ── */
.hero {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeDown .7s ease both;
}
@keyframes fadeDown { from{opacity:0;transform:translateY(-24px)} to{opacity:1;transform:none} }

/* ── AVATAR RING ── */
.avatar-ring {
  display: inline-block;
  margin-bottom: 18px;
  position: relative;
}
.avatar-ring::before {
  content: '';
  position: absolute; inset: -4px; border-radius: 50%;
  background: conic-gradient(var(--accent), var(--accent-tri), var(--accent-alt), var(--accent));
  animation: spin 4s linear infinite;
  z-index: -1;
}
@keyframes spin { to { transform: rotate(360deg); } }

.avatar-placeholder {
  width: 110px; height: 110px; border-radius: 50%;
  border: 3px solid var(--bg);
  background: linear-gradient(135deg, #071323, #0d1f3c);
  display: flex; align-items: center; justify-content: center;
  font-size: 2.4rem; color: var(--accent);
  overflow: hidden;
  font-family: var(--ff-display); letter-spacing: 2px;
}
.avatar-placeholder img {
  width: 100%; height: 100%;
  object-fit: cover; border-radius: 50%;
}

/* ── HERO TEXT ── */
.hero-name {
  font-family: var(--ff-display);
  font-size: clamp(2.4rem, 9vw, 4.4rem);
  letter-spacing: .08em; line-height: 1;
  margin-bottom: 5px; transition: all .4s;
}
body.name-gradient .hero-name {
  background: linear-gradient(135deg, #fff 30%, var(--accent) 60%, var(--accent-tri) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 0 28px color-mix(in srgb, var(--accent) 50%, transparent));
}
body.name-flat .hero-name { color: var(--text); }

.hero-handle {
  font-family: var(--ff-mono);
  font-size: .8rem; color: var(--accent);
  letter-spacing: .28em; margin-bottom: 7px; opacity: .8;
}

.hero-sub {
  font-family: var(--ff-mono);
  font-size: .84rem; color: var(--muted);
  letter-spacing: .14em; min-height: 1.4em;
}
.hero-sub::before { content: '[ '; color: var(--accent); opacity: .5; }
.hero-sub::after  { content: ' ]'; color: var(--accent); opacity: .5; }
body.theme-minimal .hero-sub::before,
body.theme-minimal .hero-sub::after { display: none; }

/* Blinking typing cursor */
.typing-cursor {
  display: inline-block; width: 2px; height: .8em;
  background: var(--accent); vertical-align: middle; margin-left: 2px;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── SECTIONS ── */
.section {
  margin-bottom: 28px;
  animation: fadeUp .6s ease both;
}
@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }

.section-label {
  font-family: var(--ff-mono);
  font-size: .76rem; letter-spacing: .34em;
  color: var(--muted); text-transform: uppercase;
  margin-bottom: 10px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::before { content: ''; display: block; width: 18px; height: 1px; background: var(--muted); }
.section-label::after  { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

/* ── LINK ITEMS ── */
.links { display: flex; flex-direction: column; gap: 9px; }

.link-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid transparent;
  border-radius: 4px;
  color: var(--text); text-decoration: none;
  font-family: var(--ff-body);
  font-size: 1.05rem; font-weight: 600; letter-spacing: .05em;
  transition: all .2s cubic-bezier(.4,0,.2,1);
  position: relative; overflow: hidden; cursor: pointer;
}

/* Hover light sweep */
.link-item::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
  transform: translateX(-100%); transition: transform .4s;
}
.link-item:hover::before { transform: translateX(100%); }

.link-item:hover {
  background: rgba(0,200,255,0.05);
  border-left-color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
  transform: translateX(3px);
}

/* ── Platform-specific hover colours ── */
.link-item[data-platform="twitch"]:hover    { --ph:#9146ff; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="youtube"]:hover   { --ph:#ff0000; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="twitter"]:hover   { --ph:#1da1f2; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="instagram"]:hover { --ph:#e1306c; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="discord"]:hover   { --ph:#5865f2; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="spotify"]:hover   { --ph:#1db954; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="tiktok"]:hover    { --ph:#ff0050; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }
.link-item[data-platform="reddit"]:hover    { --ph:#ff4500; border-left-color:var(--ph)!important; border-color:color-mix(in srgb,var(--ph) 30%,transparent)!important; background:color-mix(in srgb,var(--ph) 6%,transparent)!important; }

/* Highlighted link variant */
.link-item.highlight {
  border-color: color-mix(in srgb, var(--accent-tri) 30%, transparent);
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent-tri) 8%, transparent), var(--surface));
}
.link-item.highlight::after {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: linear-gradient(180deg, var(--accent), var(--accent-tri));
}

.link-icon    { font-size: 1.2rem; width: 24px; text-align: center; flex-shrink: 0; opacity: .85; }
.link-name    { flex: 1; font-size: 1.05rem; letter-spacing: .05em; }
.link-badge   {
  font-family: var(--ff-mono); font-size: .68rem; letter-spacing: .14em;
  color: var(--muted); background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  padding: 3px 8px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;
}
.link-arrow   { font-size: .82rem; color: var(--muted); opacity: 0; transform: translateX(-4px); transition: all .2s; }
.link-item:hover .link-arrow { opacity: 1; transform: translateX(0); }
.link-item.disabled { opacity: .4; cursor: not-allowed; pointer-events: none; }

/* ── FEATURED PROJECT CARD ── */
.featured-card {
  position: relative;
  padding: 16px 16px 20px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent-tri) 8%, transparent),
    color-mix(in srgb, var(--accent) 4%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--accent-tri) 25%, transparent);
  border-radius: 6px;
  text-decoration: none; color: var(--text);
  display: flex; align-items: center; gap: 14px;
  overflow: hidden; transition: all .26s; margin-bottom: 4px;
}
.featured-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-tri), transparent);
}
.featured-card:hover {
  border-color: color-mix(in srgb, var(--accent-tri) 50%, transparent);
  transform: translateY(-2px);
}
.featured-icon    { font-size: 1.8rem; color: var(--accent-tri); flex-shrink: 0; }
.featured-content { flex: 1; }
.featured-title   { font-family: var(--ff-display); font-size: 1.5rem; letter-spacing: .1em; color: #fff; line-height: 1.1; }
.featured-sub     { font-family: var(--ff-mono); font-size: .72rem; color: var(--accent-tri); letter-spacing: .18em; opacity: .8; }
.progress-wrap    { margin-top: 7px; display: flex; align-items: center; gap: 9px; }
.progress-track   { flex: 1; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.progress-fill    {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, var(--accent-tri), var(--accent));
  border-radius: 2px;
  transition: width 1.5s cubic-bezier(.4,0,.2,1) .5s;
}
.progress-label   { font-family: var(--ff-mono); font-size: .72rem; color: var(--accent-tri); min-width: 28px; text-align: right; }

/* ── WARNING BOX ── */
.warning-box {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 13px; margin-top: 7px;
  background: rgba(255,200,0,.05);
  border: 1px solid rgba(255,200,0,.14);
  border-radius: 3px;
  font-family: var(--ff-mono); font-size: .8rem; color: rgba(255,200,0,.65);
}

/* ── FOOTER ── */
.footer {
  text-align: center; margin-top: 52px;
  font-family: var(--ff-mono); font-size: .7rem;
  color: var(--muted); letter-spacing: .2em; opacity: .5;
}

/* ── CUSTOM CURSOR ── */
@media (pointer: fine) { body { cursor: none; } a, button { cursor: none; } }

#cursor {
  position: fixed; width: 10px; height: 10px;
  background: var(--accent); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 14px var(--accent); mix-blend-mode: screen;
  opacity: 0; transition: opacity .3s;
}
#cursorRing {
  position: fixed; width: 36px; height: 36px;
  border: 1px solid rgba(0,200,255,0.4); border-radius: 50%;
  pointer-events: none; z-index: 9998;
  transform: translate(-50%,-50%);
  transition: width .18s, height .18s, border-color .18s, opacity .3s;
  opacity: 0;
}
body.has-cursor #cursor,
body.has-cursor #cursorRing { opacity: 1; }

/* Minimal cursor variant (used by minimal + soft themes) */
body.cursor-minimal #cursor     { width: 6px; height: 6px; box-shadow: none; mix-blend-mode: normal; }
body.cursor-minimal #cursorRing { width: 24px; height: 24px; border-color: rgba(255,255,255,0.2); }

/* ── SITE NAV (appears if extra pages are configured) ── */
#site-nav {
  position: relative; z-index: 2;
  display: flex; gap: 4px; flex-wrap: wrap;
  max-width: 680px; margin: 0 auto; padding: 14px 28px 0;
}
.nav-link {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: 2px;
  text-transform: uppercase; padding: 6px 13px; border-radius: 2px;
  color: var(--muted); text-decoration: none;
  border: 1px solid transparent; transition: all .15s;
  display: flex; align-items: center; gap: 6px;
}
.nav-link:hover  { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 25%, transparent); background: color-mix(in srgb, var(--accent) 6%, transparent); }
.nav-link.active { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 30%, transparent); background: color-mix(in srgb, var(--accent) 8%, transparent); }

/* ── THEME SWITCHER (bottom-right palette button) ── */
#theme-switcher {
  position: fixed; bottom: 18px; right: 18px; z-index: 500;
  display: flex; flex-direction: column; align-items: flex-end; gap: 7px;
}
#theme-toggle-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  color: var(--muted); display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 13px; transition: all .2s;
}
#theme-toggle-btn:hover { color: var(--accent); border-color: var(--accent); }
#theme-options {
  display: flex; flex-direction: column; gap: 4px;
  opacity: 0; pointer-events: none;
  transform: translateY(8px); transition: all .2s;
}
#theme-options.open { opacity: 1; pointer-events: all; transform: none; }
.theme-opt {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: 2px;
  padding: 5px 11px; border-radius: 2px;
  background: var(--surface); border: 1px solid var(--border);
  color: var(--muted); cursor: pointer; transition: all .14s; white-space: nowrap;
}
.theme-opt:hover  { color: var(--accent); border-color: var(--accent); }
.theme-opt.active { color: var(--accent); border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent); }

/* ── IDLE / CONNECTION LOST OVERLAY ── */
#idle-overlay {
  position: fixed; inset: 0; z-index: 8000;
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity .35s; overflow: hidden;
}
#idle-overlay.visible { opacity: 1; pointer-events: all; }

.idle-scanlines {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px);
  pointer-events: none; z-index: 1;
}
.idle-static      { position: absolute; inset: 0; pointer-events: none; z-index: 2; overflow: hidden; }
.idle-static-bar  { position: absolute; left: 0; right: 0; background: rgba(0,200,255,0.06); mix-blend-mode: screen; }
.idle-content     { position: relative; z-index: 3; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 13px; padding: 36px 24px; }

.idle-icon {
  font-size: 2.8rem;
  color: color-mix(in srgb, var(--accent) 35%, transparent);
  animation: iconFlicker 2.5s ease-in-out infinite;
}
@keyframes iconFlicker {
  0%,100%{opacity:1} 50%{opacity:.2} 55%{opacity:1} 82%{opacity:1} 85%{opacity:.3} 88%{opacity:1}
}

.idle-title {
  font-family: var(--ff-display);
  font-size: clamp(1.8rem, 7vw, 3.2rem);
  letter-spacing: .15em; color: #fff;
  animation: titleGlitch 4s ease-in-out infinite;
}
@keyframes titleGlitch {
  0%,85%,100% { text-shadow: none; transform: none; }
  87% { text-shadow: -4px 0 #ff2d78, 4px 0 #00c8ff; transform: skewX(-2deg); }
  91% { text-shadow: none; transform: none; }
}

.idle-sub {
  font-family: var(--ff-mono); font-size: .76rem;
  letter-spacing: .18em; color: var(--muted); text-transform: uppercase;
}

.idle-bars { display: flex; align-items: flex-end; gap: 4px; height: 26px; }
.idle-bar {
  width: 7px;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  border-radius: 2px;
  animation: barFlicker 1.8s ease-in-out infinite;
}
.idle-bar.b1 { height: 7px;  }
.idle-bar.b2 { height: 12px; animation-delay: .15s; }
.idle-bar.b3 { height: 17px; animation-delay: .3s; }
.idle-bar.b4 { height: 21px; animation-delay: .45s; }
.idle-bar.b5 { height: 26px; animation-delay: .6s; }
@keyframes barFlicker { 0%,100%{opacity:.8} 50%{opacity:.15} }

.idle-code {
  font-family: var(--ff-mono); font-size: .65rem;
  letter-spacing: .14em;
  color: color-mix(in srgb, var(--accent-alt) 50%, transparent);
}
.idle-dot {
  width: 6px; height: 6px; background: var(--accent); border-radius: 50%;
  animation: idlePulse 1.2s ease-in-out infinite;
  display: inline-block; margin-right: 7px; vertical-align: middle;
}
@keyframes idlePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }

.idle-btn {
  margin-top: 6px;
  font-family: var(--ff-mono); font-size: .73rem;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  padding: 10px 24px; border-radius: 2px; cursor: pointer; transition: all .2s;
}
.idle-btn:hover {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  transform: translateY(-1px);
}

/* ── MOBILE ── */
@media (max-width: 480px) {
  .wrapper { padding: 40px 18px 80px; }
  .corner-deco { display: none; }
}`;
    }

    scripts.file('app.js',    appJsContent);
    styles.file('styles.css', stylesCssContent);

    console.log('Generating ZIP...');
    const blob = await zip.generateAsync({ type:'blob', compression:'DEFLATE' });
    console.log('ZIP generated, size:', blob.size);

    const a = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'creatorlink.zip';
    a.click();
    toast('ZIP DOWNLOADED — check your downloads folder');
  } catch(e) {
    console.error('Export error:', e);
    toast('ERROR: ' + e.message);
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-download"></i> &nbsp;DOWNLOAD ZIP';
}

/* ── THEMES.HTML FOR ZIP ── */
function buildThemesHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>CreatorLink — Themes</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}body{background:#030609;color:#c8dce8;font-family:'Share Tech Mono',monospace;min-height:100vh}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,200,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,.04) 1px,transparent 1px);background-size:40px 40px;animation:gm 20s linear infinite;pointer-events:none;z-index:0}
@keyframes gm{to{transform:translateY(40px)}}
.wrap{position:relative;z-index:1;max-width:1000px;margin:0 auto;padding:52px 24px 80px}
.hd{text-align:center;margin-bottom:48px}
.back{display:inline-flex;align-items:center;gap:6px;font-size:10px;letter-spacing:2px;color:#4a7a9b;text-decoration:none;margin-bottom:24px;padding:6px 14px;border:1px solid rgba(0,200,255,.12);border-radius:2px;transition:all .15s}
.back:hover{color:#00c8ff;border-color:rgba(0,200,255,.35)}
.title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,6vw,3.6rem);letter-spacing:4px;background:linear-gradient(135deg,#fff 30%,#00c8ff 70%,#a259ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{font-size:10px;letter-spacing:2px;color:#4a7a9b;margin-top:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,220px));gap:16px;justify-content:center}
.card{border-radius:6px;overflow:hidden;border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:transform .2s,box-shadow .2s}
.card:hover{transform:translateY(-4px)}
.card.sel{outline:2px solid var(--ca);outline-offset:2px}
.preview{height:200px;padding:16px;display:flex;flex-direction:column;align-items:center}
.av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;margin-bottom:8px;border:2px solid var(--ca)}
.pname{font-size:16px;letter-spacing:2px;margin-bottom:2px}
.phandle{font-size:9px;opacity:.7;margin-bottom:10px}
.plinks{width:100%;display:flex;flex-direction:column;gap:4px}
.pl{padding:6px 10px;border-radius:3px;font-size:9px;letter-spacing:1px;border-left:2px solid var(--ca)}
.foot{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.06)}
.fn{font-size:11px;letter-spacing:2px}.fd{font-size:8px;opacity:.5;margin-top:2px}
.sb{font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;padding:5px 12px;border-radius:2px;background:transparent;border:1px solid rgba(255,255,255,.15);color:#888;cursor:pointer;transition:all .15s}
.sb:hover,.sb.act{color:var(--ca);border-color:var(--ca)}
.cta{text-align:center;margin-top:40px}
.go{font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:3px;padding:13px 34px;border-radius:2px;cursor:pointer;background:rgba(0,200,255,.08);border:1px solid rgba(0,200,255,.3);color:#00c8ff;transition:all .2s;text-decoration:none;display:inline-block}
.go:hover{background:rgba(0,200,255,.15);transform:translateY(-1px)}
.cur{display:inline-block;margin-bottom:14px;font-size:10px;letter-spacing:2px;color:#4a7a9b}#ct{color:#00c8ff}
</style>
</head>
<body>
<div class="wrap">
  <div class="hd">
    <a class="back" href="index.html"><i class="fa-solid fa-arrow-left"></i> BACK</a>
    <div class="title">CHOOSE YOUR THEME</div>
    <div class="sub">Saves automatically. Switch any time from the palette button.</div>
  </div>
  <div class="grid">
    <div class="card" data-theme="cyber" style="--ca:#00c8ff;background:#020812" onclick="sel('cyber')">
      <div class="preview" style="background:#020812;background-image:linear-gradient(rgba(0,200,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,.04) 1px,transparent 1px);background-size:20px 20px">
        <div class="av" style="background:#071323;color:#00c8ff">KK</div>
        <div class="pname" style="color:#fff">YOURNAME</div><div class="phandle" style="color:#00c8ff">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,255,255,.03);color:#c8dce8">Twitch</div><div class="pl" style="background:rgba(255,255,255,.03);color:#c8dce8">YouTube</div></div>
      </div>
      <div class="foot" style="background:#030a14"><div><div class="fn" style="color:#00c8ff">CYBER</div><div class="fd">Neon · Grid · Atmospheric</div></div><button class="sb" id="b-cyber">SELECT</button></div>
    </div>
    <div class="card" data-theme="minimal" style="--ca:#fff;background:#0a0a0a" onclick="sel('minimal')">
      <div class="preview" style="background:#0a0a0a">
        <div class="av" style="background:#1a1a1a;color:#fff;font-family:sans-serif">KK</div>
        <div class="pname" style="color:#e8e8e8;font-family:sans-serif;letter-spacing:1px">YOURNAME</div><div class="phandle" style="color:#888">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,255,255,.04);color:#e8e8e8;font-family:sans-serif">Twitch</div><div class="pl" style="background:rgba(255,255,255,.04);color:#e8e8e8;font-family:sans-serif">YouTube</div></div>
      </div>
      <div class="foot" style="background:#0d0d0d"><div><div class="fn" style="color:#e8e8e8;font-family:sans-serif">Minimal</div><div class="fd">Clean · Simple · Sharp</div></div><button class="sb" id="b-minimal">SELECT</button></div>
    </div>
    <div class="card" data-theme="terminal" style="--ca:#00ff41;background:#000" onclick="sel('terminal')">
      <div class="preview" style="background:#000;background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.3) 2px,rgba(0,0,0,.3) 4px)">
        <div class="av" style="background:#001800;color:#00ff41">KK</div>
        <div class="pname" style="color:#00ff41">&gt; YOURNAME</div><div class="phandle" style="color:#009922">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(0,255,65,.03);color:#00ff41">&gt; twitch</div><div class="pl" style="background:rgba(0,255,65,.03);color:#00ff41">&gt; youtube</div></div>
      </div>
      <div class="foot" style="background:#050505"><div><div class="fn" style="color:#00ff41">TERMINAL</div><div class="fd">Green · Mono · Old school</div></div><button class="sb" id="b-terminal">SELECT</button></div>
    </div>
    <div class="card" data-theme="soft" style="--ca:#c89aff;background:#0d0a14" onclick="sel('soft')">
      <div class="preview" style="background:#0d0a14">
        <div class="av" style="background:#150e22;color:#c89aff;font-family:sans-serif">KK</div>
        <div class="pname" style="color:#f0e8ff;font-family:sans-serif;letter-spacing:1px">YOURNAME</div><div class="phandle" style="color:#c89aff">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,255,255,.04);color:#f0e8ff;font-family:sans-serif">Twitch</div><div class="pl" style="background:rgba(255,255,255,.04);color:#f0e8ff;font-family:sans-serif">YouTube</div></div>
      </div>
      <div class="foot" style="background:#0a0812"><div><div class="fn" style="color:#c89aff;font-family:sans-serif">Soft</div><div class="fd">Purple · Pastel · Aesthetic</div></div><button class="sb" id="b-soft">SELECT</button></div>
    </div>
    <div class="card" data-theme="sakura" style="--ca:#ff6eb4;background:#0f0509" onclick="sel('sakura')">
      <div class="preview" style="background:linear-gradient(135deg,#0f0509,#1a0812)">
        <div class="av" style="background:#1a0812;color:#ff6eb4;font-family:sans-serif">KK</div>
        <div class="pname" style="color:#ffe8f4;font-family:sans-serif;letter-spacing:1px">YOURNAME</div><div class="phandle" style="color:#ff6eb4">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,110,180,.05);color:#ffe8f4;font-family:sans-serif">Twitch</div><div class="pl" style="background:rgba(255,110,180,.05);color:#ffe8f4;font-family:sans-serif">YouTube</div></div>
      </div>
      <div class="foot" style="background:#0a0307"><div><div class="fn" style="color:#ff6eb4;font-family:sans-serif">Sakura</div><div class="fd">Pink · Soft · Glowy</div></div><button class="sb" id="b-sakura">SELECT</button></div>
    </div>
    <div class="card" data-theme="sunset" style="--ca:#ff7c2a;background:#0d0805" onclick="sel('sunset')">
      <div class="preview" style="background:linear-gradient(135deg,#0d0805,#1a0f08)">
        <div class="av" style="background:#1a1008;color:#ff7c2a">KK</div>
        <div class="pname" style="color:#fff0e0;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#ff7c2a">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,124,42,.05);color:#fff0e0">Twitch</div><div class="pl" style="background:rgba(255,124,42,.05);color:#fff0e0">YouTube</div></div>
      </div>
      <div class="foot" style="background:#0a0603"><div><div class="fn" style="color:#ff7c2a">SUNSET</div><div class="fd">Warm · Amber · Retro</div></div><button class="sb" id="b-sunset">SELECT</button></div>
    </div>
    <div class="card" data-theme="ocean" style="--ca:#00d4b4;background:#020d12" onclick="sel('ocean')">
      <div class="preview" style="background:linear-gradient(135deg,#020d12,#041820);background-image:linear-gradient(rgba(0,210,180,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.04) 1px,transparent 1px);background-size:20px 20px">
        <div class="av" style="background:#041820;color:#00d4b4">KK</div>
        <div class="pname" style="color:#d0f4f0;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#00d4b4">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(0,212,180,.05);color:#d0f4f0">Twitch</div><div class="pl" style="background:rgba(0,212,180,.05);color:#d0f4f0">YouTube</div></div>
      </div>
      <div class="foot" style="background:#010a0e"><div><div class="fn" style="color:#00d4b4">OCEAN</div><div class="fd">Teal · Deep · Calm</div></div><button class="sb" id="b-ocean">SELECT</button></div>
    </div>
    <div class="card" data-theme="void" style="--ca:#444;background:#000" onclick="sel('void')">
      <div class="preview" style="background:#000">
        <div class="av" style="background:#111;color:#666;font-family:sans-serif">KK</div>
        <div class="pname" style="color:#aaa;font-family:sans-serif;letter-spacing:1px">YOURNAME</div><div class="phandle" style="color:#555">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,255,255,.03);color:#aaa;font-family:sans-serif">Twitch</div><div class="pl" style="background:rgba(255,255,255,.03);color:#aaa;font-family:sans-serif">YouTube</div></div>
      </div>
      <div class="foot" style="background:#050505"><div><div class="fn" style="color:#666;font-family:sans-serif">Void</div><div class="fd">Black · Silent · Raw</div></div><button class="sb" id="b-void">SELECT</button></div>
    </div>
    <div class="card" data-theme="gold" style="--ca:#d4af37;background:#080600" onclick="sel('gold')">
      <div class="preview" style="background:linear-gradient(135deg,#080600,#120e00)">
        <div class="av" style="background:#120e00;color:#d4af37">KK</div>
        <div class="pname" style="color:#fff8e0;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#d4af37">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(212,175,55,.05);color:#fff8e0">Twitch</div><div class="pl" style="background:rgba(212,175,55,.05);color:#fff8e0">YouTube</div></div>
      </div>
      <div class="foot" style="background:#060400"><div><div class="fn" style="color:#d4af37">GOLD</div><div class="fd">Luxury · Rich · Bold</div></div><button class="sb" id="b-gold">SELECT</button></div>
    </div>
    <div class="card" data-theme="neon" style="--ca:#ff00cc;background:#0a0010" onclick="sel('neon')">
      <div class="preview" style="background:linear-gradient(135deg,#0a0010,#1a0028);background-image:linear-gradient(rgba(255,0,200,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,200,.04) 1px,transparent 1px);background-size:20px 20px">
        <div class="av" style="background:#1a0028;color:#ff00cc">KK</div>
        <div class="pname" style="color:#ffe8ff;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#ff00cc">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(255,0,200,.05);color:#ffe8ff">Twitch</div><div class="pl" style="background:rgba(255,0,200,.05);color:#ffe8ff">YouTube</div></div>
      </div>
      <div class="foot" style="background:#080010"><div><div class="fn" style="color:#ff00cc">NEON</div><div class="fd">Magenta · Grid · Streamer</div></div><button class="sb" id="b-neon">SELECT</button></div>
    </div>
    <div class="card" data-theme="blood" style="--ca:#cc0020;background:#080003" onclick="sel('blood')">
      <div class="preview" style="background:linear-gradient(135deg,#080003,#150008)">
        <div class="av" style="background:#1a0008;color:#cc0020">KK</div>
        <div class="pname" style="color:#ffe8e8;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#cc0020">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(200,0,30,.05);color:#ffe8e8">Twitch</div><div class="pl" style="background:rgba(200,0,30,.05);color:#ffe8e8">YouTube</div></div>
      </div>
      <div class="foot" style="background:#060002"><div><div class="fn" style="color:#cc0020">BLOOD</div><div class="fd">Crimson · Dark · Horror</div></div><button class="sb" id="b-blood">SELECT</button></div>
    </div>
    <div class="card" data-theme="midnight" style="--ca:#5b7fff;background:#03050f" onclick="sel('midnight')">
      <div class="preview" style="background:linear-gradient(135deg,#03050f,#080c20)">
        <div class="av" style="background:#0c1028;color:#5b7fff;font-family:sans-serif">KK</div>
        <div class="pname" style="color:#e8ecff;font-family:sans-serif;letter-spacing:1px">YOURNAME</div><div class="phandle" style="color:#5b7fff">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(80,100,255,.06);color:#e8ecff;font-family:sans-serif">Twitch</div><div class="pl" style="background:rgba(80,100,255,.06);color:#e8ecff;font-family:sans-serif">YouTube</div></div>
      </div>
      <div class="foot" style="background:#02040c"><div><div class="fn" style="color:#5b7fff;font-family:sans-serif">Midnight</div><div class="fd">Blue · Indigo · Music</div></div><button class="sb" id="b-midnight">SELECT</button></div>
    </div>
    <div class="card" data-theme="forest" style="--ca:#2aaa4a;background:#020a04" onclick="sel('forest')">
      <div class="preview" style="background:linear-gradient(135deg,#020a04,#051408)">
        <div class="av" style="background:#081a0c;color:#2aaa4a">KK</div>
        <div class="pname" style="color:#d8f0d8;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#2aaa4a">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(42,170,74,.05);color:#d8f0d8">Twitch</div><div class="pl" style="background:rgba(42,170,74,.05);color:#d8f0d8">YouTube</div></div>
      </div>
      <div class="foot" style="background:#010802"><div><div class="fn" style="color:#2aaa4a">FOREST</div><div class="fd">Green · Nature · Chill</div></div><button class="sb" id="b-forest">SELECT</button></div>
    </div>
    <div class="card" data-theme="retro" style="--ca:#e8a020;background:#0e0800" onclick="sel('retro')">
      <div class="preview" style="background:linear-gradient(135deg,#0e0800,#1c1000);background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)">
        <div class="av" style="background:#1c1000;color:#e8a020">KK</div>
        <div class="pname" style="color:#fff4d0;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#e8a020">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(232,160,32,.05);color:#fff4d0">Twitch</div><div class="pl" style="background:rgba(232,160,32,.05);color:#fff4d0">YouTube</div></div>
      </div>
      <div class="foot" style="background:#0a0600"><div><div class="fn" style="color:#e8a020">RETRO</div><div class="fd">80s · VHS · Warm</div></div><button class="sb" id="b-retro">SELECT</button></div>
    </div>
    <div class="card" data-theme="arctic" style="--ca:#a8d8ff;background:#04080f" onclick="sel('arctic')">
      <div class="preview" style="background:linear-gradient(135deg,#04080f,#081018)">
        <div class="av" style="background:#0c1828;color:#a8d8ff">KK</div>
        <div class="pname" style="color:#eef6ff;letter-spacing:2px">YOURNAME</div><div class="phandle" style="color:#a8d8ff">@handle</div>
        <div class="plinks"><div class="pl" style="background:rgba(168,216,255,.05);color:#eef6ff">Twitch</div><div class="pl" style="background:rgba(168,216,255,.05);color:#eef6ff">YouTube</div></div>
      </div>
      <div class="foot" style="background:#03060c"><div><div class="fn" style="color:#a8d8ff">ARCTIC</div><div class="fd">Ice · Silver · Esports</div></div><button class="sb" id="b-arctic">SELECT</button></div>
    </div>
  </div>
  <div class="cta">
    <div class="cur">CURRENT: <span id="ct">CYBER</span></div><br>
    <a class="go" href="index.html"><i class="fa-solid fa-arrow-right"></i>&nbsp; GO TO MY PAGE</a>
  </div>
</div>
<script>
const L={cyber:'CYBER',minimal:'MINIMAL',terminal:'TERMINAL',soft:'SOFT',sakura:'SAKURA',sunset:'SUNSET',ocean:'OCEAN',void:'VOID',gold:'GOLD',neon:'NEON',blood:'BLOOD',midnight:'MIDNIGHT',forest:'FOREST',retro:'RETRO',arctic:'ARCTIC'};
function sel(n){localStorage.setItem('cl-theme',n);document.querySelectorAll('.sb').forEach(b=>{b.textContent='SELECT';b.classList.remove('act')});document.querySelectorAll('.card').forEach(c=>{c.classList.toggle('sel',c.dataset.theme===n)});const b=document.getElementById('b-'+n);if(b){b.textContent='SELECTED';b.classList.add('act')}document.getElementById('ct').textContent=L[n]||n.toUpperCase()}
window.addEventListener('DOMContentLoaded',()=>sel(localStorage.getItem('cl-theme')||'cyber'));
<\/script>
</body></html>`;
}

/* ── README FOR ZIP ── */
function buildReadme() {
  return `# CreatorLink

Your personal links page. Built with CreatorLink Builder.

---

## Files

\`\`\`
creatorlink/
├── index.html       ← Your main page
├── themes.html      ← Visual theme picker gallery
├── Scripts/
│   └── app.js       ← Page engine
└── Styles/
    └── styles.css   ← Styles
\`\`\`

---

## Hosting on GitHub Pages (free)

1. Create a new repo on github.com (public)
2. Push this folder:
\`\`\`bash
git init
git add .
git commit -m "my site"
git remote add origin https://github.com/YOURUSERNAME/REPONAME.git
git push -u origin main
\`\`\`
3. Go to repo Settings → Pages → Deploy from \`main\` branch root
4. Your site goes live at: \`https://YOURUSERNAME.github.io/REPONAME\`

---

## Custom Domain (optional, ~$10/yr)

Buy from Namecheap / Porkbun / Cloudflare Registrar.

1. Create a \`CNAME\` file in this folder containing just your domain:
\`\`\`
yourdomain.com
\`\`\`
2. In your DNS settings add these A records:
\`\`\`
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
\`\`\`
And a CNAME record: \`www\` → \`YOURUSERNAME.github.io\`

3. In GitHub Pages settings, enter your custom domain and tick Enforce HTTPS.
4. DNS propagation takes up to 24hrs.

---

## Making Changes

To update your site, go back to the **CreatorLink Builder**, make your changes, and download a new zip. Replace the files in your repo and push — your live site updates automatically.

You can also switch themes any time using the palette button on your page, or by visiting \`themes.html\`.

---

Built with CreatorLink · github.com/Kill3rKai/creatorlink`;
}

/* ── UTILS ── */
function escQ(s) { return (s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function updateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  const el = document.getElementById('phone-time');
  if (el) el.textContent = t;
}

/* ── INIT ── */
window.addEventListener('DOMContentLoaded', () => {
  renderTaglines();
  renderSections();
  renderPages();
  goStep(0);
  updatePreview();
  updateClock();
  setInterval(updateClock, 30000);

  document.getElementById('f-egg').addEventListener('change', function() {
    document.getElementById('egg-fields').style.display = this.checked ? '' : 'none';
  });
  document.getElementById('f-proj-show').addEventListener('change', function() {
    document.getElementById('proj-fields').style.display = this.checked ? '' : 'none';
  });
});