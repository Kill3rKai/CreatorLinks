// ================================================================
//  CREATORLINK — Scripts/app.js
//  Reads CONFIG and THEMES, builds the page.
// ================================================================

(function () {

  // ── Apply theme ──────────────────────────────────────────────
  function applyTheme(n) {
    var t = THEMES[n] || THEMES['cyber'];
    var r = document.documentElement;
    r.style.setProperty('--bg',         t.bg);
    r.style.setProperty('--surface',    t.surface);
    r.style.setProperty('--border',     t.border);
    r.style.setProperty('--accent',     t.accent);
    r.style.setProperty('--accent-alt', t.accentAlt);
    r.style.setProperty('--accent-tri', t.accentTri);
    r.style.setProperty('--text',       t.text);
    r.style.setProperty('--muted',      t.muted);
    r.style.setProperty('--ff-display', t.fontDisplay);
    r.style.setProperty('--ff-body',    t.fontBody);
    r.style.setProperty('--ff-mono',    t.fontMono);

    var b = document.body;
    b.classList.toggle('has-grid',    !!t.gridBg);
    b.classList.toggle('has-orbs',    !!t.glowOrbs);
    b.classList.toggle('scanlines',   !!t.scanlines);
    b.classList.toggle('has-noise',   !!t.noise);
    b.classList.toggle('has-cursor',  !!t.cursorRing);
    b.classList.toggle('has-corners', n === 'cyber' || n === 'terminal');

    b.classList.remove('cursor-minimal', 'cursor-full');
    b.classList.add(t.cursorStyle === 'minimal' ? 'cursor-minimal' : 'cursor-full');

    b.classList.remove('name-gradient', 'name-flat', 'name-glitch');
    b.classList.add('name-' + (t.nameStyle || 'flat'));

    b.classList.remove('theme-cyber', 'theme-minimal', 'theme-terminal', 'theme-soft');
    b.classList.add('theme-' + n);

    document.querySelectorAll('.theme-opt').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === n);
    });

    localStorage.setItem('cl-theme', n);
  }

  // ── Build nav bar (only if extra pages are configured) ───────
  function buildNav() {
    var pages = CONFIG.pages;
    if (!pages || !pages.length) return;

    var nav = document.createElement('nav');
    nav.id = 'site-nav';

    var homeActive = pages.every(function (p) { return !p.active; });
    nav.innerHTML = '<a class="nav-link' + (homeActive ? ' active' : '') + '" href="index.html">'
      + '<i class="fa-solid fa-house"></i> Home</a>';

    pages.forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'nav-link' + (p.active ? ' active' : '');
      a.href = p.url;
      if (!p.url.startsWith('#')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.innerHTML = '<i class="fa-solid fa-' + (p.icon || 'file') + '"></i> ' + p.label;
      nav.appendChild(a);
    });

    var w = document.getElementById('main-wrapper');
    w.parentNode.insertBefore(nav, w);
  }

  // ── Build header ─────────────────────────────────────────────
  function buildHeader() {
    document.title = CONFIG.name + ' — Links';
    document.getElementById('hero-name').textContent   = CONFIG.name;
    document.getElementById('hero-handle').textContent = CONFIG.handle;

    var av = document.getElementById('avatar-el');
    if (CONFIG.avatar) {
      av.innerHTML = '<img src="' + CONFIG.avatar + '" alt="' + CONFIG.name + '">';
    } else {
      av.textContent = CONFIG.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '??';
    }
  }

  // ── Build featured project bar ───────────────────────────────
  function buildProject() {
    var p = CONFIG.project;
    if (!p || !p.show) {
      document.getElementById('project-section').style.display = 'none';
      return;
    }
    document.getElementById('proj-name').textContent = p.name;
    document.getElementById('proj-sub').textContent  = p.sublabel;
    document.getElementById('proj-pct').textContent  = p.progress + '%';
    document.getElementById('project-card').href     = p.url || '#';
    document.getElementById('project-card').target   = (p.url && p.url !== '#') ? '_blank' : '_self';

    // Animate progress bar after paint
    requestAnimationFrame(function () {
      setTimeout(function () {
        document.getElementById('proj-bar').style.width = p.progress + '%';
      }, 400);
    });
  }

  // ── Build link sections ──────────────────────────────────────
  function buildSections() {
    var c = document.getElementById('sections-container');
    var solidIcons = ['robot','store','circle-info','dragon','bell','lock',
      'flag','house','file','link','palette','satellite-dish'];

    CONFIG.sections.forEach(function (sec) {
      if (!sec.links || !sec.links.length) return;

      var div = document.createElement('div');
      div.className = 'section';
      div.innerHTML = '<div class="section-label">' + sec.title + '</div><div class="links"></div>';
      var le = div.querySelector('.links');

      sec.links.forEach(function (link) {
        // Disabled / coming-soon link
        if (link.disabled) {
          var a = document.createElement('div');
          a.className = 'link-item disabled';
          a.innerHTML = '<i class="fa-solid fa-' + (link.icon || 'link') + ' link-icon"></i>'
            + '<span class="link-name">' + link.label + '</span>'
            + (link.badge ? '<span class="link-badge">' + link.badge + '</span>' : '');
          le.appendChild(a);
          if (link.warning) {
            var w = document.createElement('div');
            w.className = 'warning-box';
            w.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><span>' + link.warning + '</span>';
            le.appendChild(w);
          }
          return;
        }

        var a = document.createElement('a');
        a.className = 'link-item' + (link.highlight ? ' highlight' : '');
        a.href   = link.url || '#';
        a.target = (link.url && link.url !== '#') ? '_blank' : '_self';
        a.rel    = 'noopener noreferrer';
        if (link.platform) a.dataset.platform = link.platform;

        var ic     = (link.platform && PLATFORM_COLORS[link.platform])
          ? 'style="color:' + PLATFORM_COLORS[link.platform] + '"' : '';
        var prefix = (solidIcons.indexOf(link.icon) > -1) ? 'fa-solid' : 'fa-brands';

        a.innerHTML = '<i class="' + prefix + ' fa-' + (link.icon || 'link') + ' link-icon" ' + ic + '></i>'
          + '<span class="link-name">' + link.label + '</span>'
          + (link.badge ? '<span class="link-badge">' + link.badge + '</span>' : '')
          + '<i class="fa-solid fa-arrow-right link-arrow"></i>';

        le.appendChild(a);
      });

      c.appendChild(div);
    });
  }

  // ── Build footer ─────────────────────────────────────────────
  function buildFooter() {
    document.getElementById('footer-text').textContent = CONFIG.footer || '';
  }

  // ── Typing tagline animation ──────────────────────────────────
  function startTyping() {
    var lines  = CONFIG.taglines || ['creator'];
    var target = document.getElementById('typing-text');
    var si = 0, ci = 0, del = false;

    function tick() {
      var str = lines[si];
      if (!del) {
        ci++;
        target.textContent = str.slice(0, ci);
        if (ci === str.length) { del = true; setTimeout(tick, 2000); return; }
      } else {
        ci--;
        target.textContent = str.slice(0, ci);
        if (ci === 0) { del = false; si = (si + 1) % lines.length; setTimeout(tick, 350); return; }
      }
      setTimeout(tick, del ? 32 : 58);
    }

    setTimeout(tick, 900);
  }

  // ── Custom cursor ────────────────────────────────────────────
  function initCursor() {
    var dot  = document.getElementById('cursor');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var mx = 0, my = 0, rx = 0, ry = 0, ready = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!ready) { rx = mx; ry = my; ready = true; }
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Lagging ring loop
    (function loop() {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    // Grow ring on interactive elements
    document.querySelectorAll('a, button, .link-item, .featured-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.style.width  = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--accent').trim();
      });
      el.addEventListener('mouseleave', function () {
        ring.style.width  = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = '';
      });
    });
  }

  // ── Idle / CONNECTION LOST screen ────────────────────────────
  function initIdle() {
    var cfg = CONFIG.idle;
    if (!cfg || !cfg.enabled) return;

    var ms     = (cfg.minutes || 5) * 60 * 1000;
    var timer  = null;
    var active = false;
    var gi     = null;

    // Build overlay
    var ov = document.createElement('div');
    ov.id  = 'idle-overlay';
    ov.innerHTML = '<div class="idle-scanlines"></div>'
      + '<div class="idle-static" id="idle-static"></div>'
      + '<div class="idle-content">'
      + '<div class="idle-icon"><i class="fa-solid fa-satellite-dish"></i></div>'
      + '<div class="idle-title">CONNECTION LOST</div>'
      + '<div class="idle-sub">No activity detected</div>'
      + '<div class="idle-bars">'
      + '<div class="idle-bar b1"></div><div class="idle-bar b2"></div>'
      + '<div class="idle-bar b3"></div><div class="idle-bar b4"></div>'
      + '<div class="idle-bar b5"></div></div>'
      + '<div class="idle-code">ERR::SIGNAL_TIMEOUT_0x'
      + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
      + '</div>'
      + '<div style="font-family:var(--ff-mono);font-size:.7rem;color:var(--muted);letter-spacing:.14em">'
      + '<span class="idle-dot"></span>Attempting to reconnect...</div>'
      + '<button class="idle-btn" id="idle-dismiss-btn">'
      + '<i class="fa-solid fa-rotate-right"></i>&nbsp; Restore Connection</button></div>';

    document.body.appendChild(ov);
    document.getElementById('idle-dismiss-btn').addEventListener('click', dismiss);

    function spawnStatic() {
      var el = document.getElementById('idle-static');
      if (!el) return;
      el.innerHTML = '';
      for (var i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
        var b = document.createElement('div');
        b.className  = 'idle-static-bar';
        b.style.cssText = 'top:' + Math.random() * 100 + '%;'
          + 'height:' + (Math.random() * 16 + 2) + 'px;'
          + 'opacity:' + (Math.random() * .35 + .04).toFixed(2);
        el.appendChild(b);
      }
    }

    function show() {
      if (active) return;
      active = true;
      spawnStatic();
      gi = setInterval(spawnStatic, 750);
      requestAnimationFrame(function () { ov.classList.add('visible'); });
    }

    function dismiss() {
      active = false;
      clearInterval(gi);
      ov.classList.remove('visible');
      reset();
    }

    function reset() {
      clearTimeout(timer);
      if (!active) timer = setTimeout(show, ms);
    }

    ['mousemove','mousedown','keydown','touchstart','scroll','click'].forEach(function (ev) {
      document.addEventListener(ev, function () { if (!active) reset(); }, { passive: true });
    });

    reset();
  }

  // ── Easter egg keyword redirect ───────────────────────────────
  function initEasterEgg() {
    var eg = CONFIG.easterEgg;
    if (!eg || !eg.enabled || !eg.keyword) return;

    var typed = '';
    document.addEventListener('keydown', function (e) {
      typed += e.key.toLowerCase();
      if (typed.includes(eg.keyword.toLowerCase())) window.location.href = eg.url || '#';
      if (typed.length > 30) typed = typed.slice(-30);
    });
  }

  // ── Theme switcher (palette button) ─────────────────────────
  function initThemeSwitcher() {
    var btn  = document.getElementById('theme-toggle-btn');
    var opts = document.getElementById('theme-options');
    if (!btn || !opts) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      opts.classList.toggle('open');
    });
    document.addEventListener('click', function () {
      opts.classList.remove('open');
    });
    document.querySelectorAll('.theme-opt').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        applyTheme(b.dataset.theme);
        opts.classList.remove('open');
      });
    });
  }

  // ── Init ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // In the builder preview: always use CONFIG.theme so live theme switching works.
    // In the exported site: respect the user's previously chosen theme from localStorage.
    var theme = (typeof PREVIEW_MODE !== 'undefined' && PREVIEW_MODE)
      ? (CONFIG.theme || 'cyber')
      : (localStorage.getItem('cl-theme') || CONFIG.theme || 'cyber');

    applyTheme(theme);
    buildNav();
    buildHeader();
    buildProject();
    buildSections();
    buildFooter();
    startTyping();
    initCursor();
    initThemeSwitcher();
    initEasterEgg();
    document.getElementById('main-wrapper').classList.add('visible');
    initIdle();
  });

})();