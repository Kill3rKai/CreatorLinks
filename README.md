# CreatorLink Builder

A browser-based site builder for creating your own self-hosted links page. Fill in your details, pick a theme, add your links, and download a ready-to-host zip

> Built by [Kill3rKai](https://kill3rkai.ai)

---

## How to use

### Download

```
git clone https://github.com/Kill3rKai/CreatorLinks.git
```  

or download this repo by clicking on the "Code" button on the top right above commits

or if you're lazy... heres a live server... [CreatorLinks](https://kill3rkai.github.io/CreatorLinks/)  

Just open `builder.html` in any browser. Nothing to install other than this git repo

```
creatorlinks/
│   builder.html          ← open this
│   README.md
│
├───Scripts/
│       builder.js        ← builder logic
│       app.js            ← site page engine (baked into exported zip)
│       themes.js         ← theme definitions (baked into exported zip)
│
└───Styles/
        builder.css       ← builder UI styles
        styles.css        ← site styles (baked into exported zip)
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

when you get this file **Unblock it** by going into propeties and ticking unblock and then apply.

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

## How To Host The Site Made

- You could buy a domain and upload the code files under pages, for cloudflare etc.
- You could host on github  

### How host on Github

1. Upload files to a repo
2. got to the repo settings => pages
3. under "Build and deployment" you can use "Deploy From Branch" or "Github Actions"  ***I tend to use github actions but its usually less work to use Deploy From Branch***
4. if you used "Deploy From Branch", select main branch, and it should be live in a few minutes
4. if you used "Github Actions", select "Static HTML" option and then "Commit changes" in the top right of the screen

### Confirming the site is live

1. if you bought a domain you should be able to access the domain in your browser. or check DNS, with something like [DNSchecker](https://dnschecker.org/)  

2. if you used github. go back to the main page of the repository and you should see a green tick under the branch nexto your username and the latest commit

---

## Showcase

here is a hyperlink to a very basic site i made, of course you can do much more with it, this is just a template to work on.  
it is live hosted on github. [Showcase](https://kill3rkai.github.io/CreatorLinksShowcase/)

---


## Features built into your exported site

- **8 themes** — 8 themes available to use wen making your site :D
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

