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

/* ── INDEX.HTML GENERATOR ── */
function buildIndexHTML() {
  const themes = document.getElementById('asset-themes').textContent.trim();
  const appjs  = document.getElementById('asset-appjs').textContent.trim();
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
    <a class="theme-opt" href="themes.html" style="text-decoration:none;display:block;text-align:center">Theme Gallery</a>
  </div>
</div>
<script>${data}<\/script>
<script>${themes}<\/script>
<script>${appjs}<\/script>
</body>
</html>`;
}

/* ── PREVIEW HTML (self-contained, cursor disabled inside iframe) ── */
function buildPreviewHTML() {
  const cfg    = buildConfigJS();
  const themes = document.getElementById('asset-themes').textContent;
  const css    = document.getElementById('asset-css').textContent;
  const appjs  = document.getElementById('asset-appjs').textContent;

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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;600;700&family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
<style>${css}${previewOverride}</style>
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
<\/script>
<script>${cfg}<\/script>
<script>${themes}<\/script>
<script>
  // Patch: override saved theme lookup so CONFIG.theme always wins in preview
  const _origGet = Storage.prototype.getItem;
  Storage.prototype.getItem = function(k) {
    if (k === 'cl-theme') return CONFIG.theme;
    return _origGet.call(this, k);
  };
<\/script>
<script>${appjs}<\/script>
</body></html>`;
}

/* ── LIVE PREVIEW ── */
let previewTimer = null;
function updatePreview() {
  readForm();
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    const frame = document.getElementById('preview-frame');
    const html  = buildPreviewHTML();
    const blob  = new Blob([html], { type: 'text/html' });
    const url   = URL.createObjectURL(blob);
    const old   = frame.src;
    frame.src   = url;
    if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
  }, 700);
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
    const zip      = new JSZip();
    const root     = zip.folder('creatorlink');
    const scripts  = root.folder('Scripts');
    const styles   = root.folder('Styles');

    root.file('index.html',   buildIndexHTML());
    root.file('themes.html',  buildThemesHTML());
    root.file('README.md',    buildReadme());
    scripts.file('app.js',    document.getElementById('asset-appjs').textContent.trim());
    styles.file('styles.css', document.getElementById('asset-css').textContent.trim());

    const blob = await zip.generateAsync({ type:'blob', compression:'DEFLATE' });
    const a = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'creatorlink.zip';
    a.click();
    toast('ZIP DOWNLOADED — check your downloads folder');
  } catch(e) {
    toast('ERROR: ' + e.message);
    console.error(e);
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
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
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
  </div>
  <div class="cta">
    <div class="cur">CURRENT: <span id="ct">CYBER</span></div><br>
    <a class="go" href="index.html"><i class="fa-solid fa-arrow-right"></i>&nbsp; GO TO MY PAGE</a>
  </div>
</div>
<script>
const L={cyber:'CYBER',minimal:'MINIMAL',terminal:'TERMINAL',soft:'SOFT'};
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