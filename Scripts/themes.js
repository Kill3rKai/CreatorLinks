// ================================================================
//  CREATORLINK — themes.js (embedded in index.html)
//  Theme definitions. Variables are applied by app.js.
// ================================================================

const THEMES = {
  // ── CYBER ── neon blue, animated grid, glow orbs, atmospheric
  cyber: {
    bg:          '#020812',
    surface:     'rgba(255,255,255,0.03)',
    border:      'rgba(0,200,255,0.15)',
    accent:      '#00c8ff',
    accentAlt:   '#ff2d78',
    accentTri:   '#a259ff',
    text:        '#e0f4ff',
    muted:       '#4a7a9b',
    fontDisplay: "'Bebas Neue', sans-serif",
    fontBody:    "'Rajdhani', sans-serif",
    fontMono:    "'Share Tech Mono', monospace",
    gridBg:      true,
    glowOrbs:    true,
    scanlines:   true,
    noise:       true,
    cursorRing:  true,
    cursorStyle: 'full',
    nameStyle:   'gradient',
  },

  // ── MINIMAL ── clean white-on-dark, no effects
  minimal: {
    bg:          '#0a0a0a',
    surface:     'rgba(255,255,255,0.04)',
    border:      'rgba(255,255,255,0.1)',
    accent:      '#ffffff',
    accentAlt:   '#888888',
    accentTri:   '#555555',
    text:        '#e8e8e8',
    muted:       '#555555',
    fontDisplay: "'DM Sans', sans-serif",
    fontBody:    "'DM Sans', sans-serif",
    fontMono:    "'DM Mono', monospace",
    gridBg:      false,
    glowOrbs:    false,
    scanlines:   false,
    noise:       false,
    cursorRing:  true,
    cursorStyle: 'minimal',
    nameStyle:   'flat',
  },

  // ── TERMINAL ── green on black, scanlines, old school hacker
  terminal: {
    bg:          '#000000',
    surface:     'rgba(0,255,65,0.03)',
    border:      'rgba(0,255,65,0.2)',
    accent:      '#00ff41',
    accentAlt:   '#00cc33',
    accentTri:   '#009922',
    text:        '#00ff41',
    muted:       '#006614',
    fontDisplay: "'Share Tech Mono', monospace",
    fontBody:    "'Share Tech Mono', monospace",
    fontMono:    "'Share Tech Mono', monospace",
    gridBg:      false,
    glowOrbs:    false,
    scanlines:   true,
    noise:       true,
    cursorRing:  true,
    cursorStyle: 'full',
    nameStyle:   'flat',
  },

  // ── SOFT ── dark purple, pastel accents, vtuber/aesthetic
  soft: {
    bg:          '#0d0a14',
    surface:     'rgba(255,255,255,0.04)',
    border:      'rgba(200,160,255,0.18)',
    accent:      '#c89aff',
    accentAlt:   '#ff9ac8',
    accentTri:   '#9ac8ff',
    text:        '#f0e8ff',
    muted:       '#7a6a8a',
    fontDisplay: "'DM Sans', sans-serif",
    fontBody:    "'DM Sans', sans-serif",
    fontMono:    "'DM Mono', monospace",
    gridBg:      false,
    glowOrbs:    true,
    scanlines:   false,
    noise:       false,
    cursorRing:  true,
    cursorStyle: 'minimal',
    nameStyle:   'gradient',
  },

};

// Platform accent colours — used for link hover effects
const PLATFORM_COLORS = {
  twitch:    '#9146ff',
  youtube:   '#ff0000',
  twitter:   '#1da1f2',
  instagram: '#e1306c',
  discord:   '#5865f2',
  spotify:   '#1db954',
  github:    '#ffffff',
  tiktok:    '#ff0050',
  reddit:    '#ff4500',
};