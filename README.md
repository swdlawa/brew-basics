# Brew Basics — A Beginner's Guide to Coffee

A small, self-contained guide/tutorial website built with plain **HTML + CSS + JavaScript** — no framework, no build step, no server-side code or database. It is the **sample/placeholder** version: the structure, navigation, layout, interactivity, and identity assets are complete, and the topic content is a realistic example you must replace with your own.

---

## 1. What's here

```
guide-site/
├── index.html            Home (hero, what you'll learn, quick start)
├── getting-started.html  Part 1 — fundamentals
├── methods.html          Part 2 — brewing methods (recipes)
├── equipment.html        Part 3 — gear + interactive calculator
├── resources.html        Part 4 — troubleshooting, FAQ, glossary
├── about.html            About the author (placeholder)
├── manifest.webmanifest  Web app manifest (app icon + theme)
├── css/
│   └── styles.css        All styling (responsive + light/dark theme)
├── js/
│   └── main.js           Theme toggle, nav, calculator, copy, scrollspy…
├── assets/
│   ├── favicon.svg       Favicon (vector)
│   ├── favicon.png       Favicon (64×64 fallback)
│   ├── apple-touch-icon.png  App icon (180×180, iOS home screen)
│   ├── icon-192.png      App icon (manifest)
│   ├── icon-512.png      App icon (manifest + maskable)
│   └── og-image.png      Open Graph image (1200×630)
├── scripts/
│   └── generate-images.ps1  Regenerates every identity image
└── README.md
```

Six pages, all linked through a shared header navigation and a footer nav.

**Live site:** https://swdlawa.github.io/brew-basics/

---

## 2. How each requirement is met

| Requirement | How it's satisfied |
| --- | --- |
| **Pages** — at least four, with working navigation | Six pages, consistent header + footer nav, `aria-current="page"` on the active link |
| **Content** — your own words and images, or properly sourced | Placeholder copy marked `SAMPLE / PLACEHOLDER`. **Replace the text with your own, and use your own photos or clearly-attributed images** (see §5) |
| **Structure** — semantic HTML | `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<figure>`/`<figcaption>`, `<table>` with `<caption>`/`<th scope>`, `<dl>` glossary |
| **Layout** — responsive on a phone | Fluid `clamp()` typography, CSS Grid/Flexbox, collapsible mobile nav, horizontal-scroll tables |
| **Behaviour** — responds to the user | Dark-mode toggle, mobile nav, brew-ratio calculator, copy-to-clipboard buttons, scroll-spy table of contents, glossary filter, FAQ accordion, back-to-top |
| **Live** — reachable at a real address | **Live at https://swdlawa.github.io/brew-basics/** on GitHub Pages (see §7) |
| **History** — grows week by week | Git repo initialised; commit small steps each week so `git log` tells the story (see §8) |
| **Identity** — Open Graph image, favicon, app icon | `og-image.png` (1200×630), `favicon.svg` + `favicon.png`, `apple-touch-icon.png` + manifest icons, plus full OG/Twitter `<meta>` tags and `manifest.webmanifest` on every page |

Accessibility is baked in throughout: skip link, labelled form controls, keyboard-operable menus, `:focus-visible` outlines, `aria-live` calculator results, `aria-expanded` states, and `prefers-reduced-motion` support.

---

## 3. Run it locally

Just open `index.html` in a browser, or serve the folder:

```bash
cd guide-site
# Python 3
python -m http.server 8000
# or Node
npx serve .
```

Then visit <http://localhost:8000>.

---

## 4. Replace the sample content

Every page starts with a comment:

```html
<!-- ===== SAMPLE / PLACEHOLDER CONTENT — replace with your own topic ===== -->
```

Search the project for these and replace them:

- **Site name** — "Brew Basics" appears in every `<title>`, the header, the footer, the Open Graph tags, and `manifest.webmanifest`.
- **Topic copy** — all headings, paragraphs, tables, recipes, and glossary terms are coffee examples. Replace them with *your* topic.
- **About page** — `[Your name here]`, `you@example.com`, and the placeholder bio.
- **`<meta name="description">`** on each page.
- **Canonical / Open Graph URLs** — already point at the live site, **https://swdlawa.github.io/brew-basics/**. If you rename the repo or add a custom domain, update the `og:url` / `og:image` tags in every `<head>` (see §7).

Quick searches: `SAMPLE`, `[Your name here]`, `you@example.com`, `Brew Basics`.

**IMPORTANT — the content must be yours.** The rubric says your words and images must be your own or properly sourced, and any AI text must be edited until you own it. Rewrite the sample text in your own voice; don't submit it as-is.

---

## 5. Images: your own, or properly sourced

- **Identity images** (Open Graph, favicon, app icon) are generated from `scripts/generate-images.ps1` and are yours to keep and modify.
- **Content images** (photos/illustrations inside the pages) must be either:
  - your **own** photos/drawings, or
  - **properly licensed** images with credit. Good free sources: [Unsplash](https://unsplash.com) (Unsplash License), [Pexels](https://pexels.com) (Pexels License), and [Openverse](https://openverse.org) (search by licence — CC0 needs no attribution, CC-BY needs credit).
- When you use a sourced image, add a credit next to it, e.g. in a `<figcaption>`:

```html
<figure>
  <img src="assets/my-photo.jpg" alt="A pour-over coffee being brewed">
  <figcaption>Photo by <a href="https://unsplash.com/@author">Author Name</a> on Unsplash.</figcaption>
</figure>
```

The site already uses original inline SVG illustrations (the hero and banner), which count as your own images once you keep and edit them.

---

## 6. Regenerate the identity images

The three required images are generated by one script (requires Windows PowerShell with .NET's System.Drawing):

```powershell
cd guide-site
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\generate-images.ps1
```

Edit the parameters at the top of the script to make them match your own brand:

```powershell
param(
  [string]$SiteName  = "Brew Basics",
  [string]$Tagline   = "A beginner's guide to brewing better coffee at home."
)
```

It outputs:

| File | Size | Purpose |
| --- | --- | --- |
| `assets/og-image.png` | 1200×630 | Open Graph / social share image |
| `assets/favicon.png` | 64×64 | Favicon fallback |
| `assets/apple-touch-icon.png` | 180×180 | iOS home-screen app icon |
| `assets/icon-192.png`, `assets/icon-512.png` | 192/512 | `manifest.webmanifest` app icons |

---

## 7. Deploy to a real URL

**This project is already live on GitHub Pages:**

- **Site:** https://swdlawa.github.io/brew-basics/
- **Repository:** https://github.com/swdlawa/brew-basics
- **Hosting setting:** Settings → Pages → Deploy from a branch → `main` / root (already configured)

The canonical/Open Graph URLs in every page's `<head>` already point at this address.

**If you fork or rename the repo:** replace `https://swdlawa.github.io/brew-basics` in the `og:url` / `og:image` tags of every page's `<head>`, then commit and push.

**First-time setup (if starting fresh elsewhere):**

1. Create a new repository and push this folder:
   ```bash
   cd guide-site
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. In the repo on GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / root → Save**.
3. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

**Netlify or Vercel (drag-and-drop):**

- Netlify: drag the `guide-site` folder onto <https://app.netlify.com/drop>.
- Vercel: run `npx vercel` inside `guide-site`, or import the folder at <https://vercel.com/new>.

No server-side code is used, so any static host works. The `og:image` tag needs an **absolute** URL, which is why it must point at your final domain.

---

## 8. Show development week by week

The rubric wants a Git history that shows the site **grow, week by week** — not one big commit at the end. Commit small, logical steps on a regular cadence, each leaving the site working:

1. `docs: add README and project plan`
2. `feat: scaffold page structure and shared header/footer`
3. `feat: responsive stylesheet with light/dark theme`
4. `feat: navigation and theme toggle`
5. `feat: brew calculator and copy-to-clipboard`
6. `feat: Open Graph, favicon, and app icons`
7. `content: replace sample coffee copy with my own topic`
8. `content: add my own photos and image credits`

`git log --oneline --reverse` then reads as a timeline of your work. If you forget, you can still commit meaningfully as you go — consistency matters more than a perfect plan.
