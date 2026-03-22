# CreatorLink Builder

A browser-based site builder for creating your own self-hosted links page. Fill in your details, pick a theme, add your links, and download a ready-to-host zip — no account, no server, no npm.

> Built by [Kill3rKai](https://kill3rkai.ai)

---

## How to use

**1. Open the builder**

Just open `builder.html` in any browser. Nothing to install other than this git repo

```
git clone https://github.com/Kill3rKai/CreatorLinks.git
```  

or download this repo by clicking on the "Code" button on the top right above commits

or if you're lazy... heres a live server... [CreatorLinks]()

```
creatorlink-builder/
├── builder.html          ← open this
├── Scripts/
│   └── builder.js
└── Styles/
    └── builder.css
```

**2. Fill in your details — 4 steps**

| Step | What you do |
|---|---|
| 1 · Identity | Your name, handle, avatar (upload image), taglines, featured project |
| 2 · Theme | Pick Cyber / Minimal / Terminal / Soft. Toggle idle screen + easter egg |
| 3 · Links | Add sections (YouTube, Twitch, Socials, etc.) and links inside them |
| 4 · Extras | Extra pages for the nav bar, footer text, then download |

The **live preview** on the right updates as you type — phone and desktop views.

**3. Download your site**

Hit **Download ZIP** on step 4. You get a `creatorlink.zip` containing your complete site, ready to host.

---

## What's in the zip

```
creatorlink/
├── index.html       ← your main page (all your data baked in)
├── themes.html      ← visual theme switcher gallery
├── Scripts/
│   └── app.js       ← page engine
├── Styles/
│   └── styles.css   ← all styles
└── README.md        ← hosting instructions
```

No `config.js`, no `themes.js` — everything is compiled directly into `index.html` when you export. The README inside the zip has full hosting instructions.

---

## Features built into your exported site

- **4 themes** — Cyber, Minimal, Terminal, Soft. Switchable live from a palette button
- **Typing animation** — cycles through your taglines
- **Avatar ring** — spinning gradient border around your profile image
- **Featured project bar** — with animated progress fill
- **Platform hover colours** — Twitch, YouTube, Twitter, Instagram, Discord, Spotify etc all get their own accent colour on hover
- **Custom cursor** — dot + trailing ring (style varies by theme)
- **CONNECTION LOST idle screen** — fires after inactivity, with glitch static effect
- **Easter egg** — type a secret keyword anywhere on the page to get redirected
- **Auto nav bar** — appears if you added extra pages
- **Theme gallery** — `themes.html` lets visitors pick their own theme

---

## Tips

- **Avatar** is embedded as base64 — no external image hosting needed
- **Multiple YouTube/Twitch channels?** — just add multiple links inside the same section
- **Additional pages?** — add it in step 4 under Extra Pages, it'll appear in the nav
- **Updating your site?** — come back to the builder, make changes, download a new zip, replace files in your repo

---