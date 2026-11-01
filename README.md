# Brew Basics — A Beginner's Guide to Coffee

A small, self-contained guide/tutorial website built with plain **HTML + CSS + JavaScript** — no framework, no build step, no server-side code or database. It is the **sample/placeholder** version: the structure, navigation, layout, and interactivity are complete, and the topic content is a realistic example you should replace with your own.

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
├── css/
│   └── styles.css        All styling (responsive + light/dark theme)
├── js/
│   └── main.js           Theme toggle, nav, calculator, copy, scrollspy…
├── assets/
│   └── favicon.svg
└── README.md
```

Six pages, all linked through a shared header navigation and a footer nav.

---

## 2. How the course requirements are met

| Requirement | How it's satisfied |
| --- | --- |
| At least four pages with working navigation | Six pages, consistent header + footer nav, `aria-current="page"` on the active link |
| Your own content | Placeholder copy marked `SAMPLE / PLACEHOLDER` — swap in your own text (see §4) |
| Semantic, accessible markup | `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<figure>`, skip link, labelled form controls, keyboard-accessible menus, `:focus-visible`, `aria-live` results, `prefers-reduced-motion` |
| Responsive layout | Fluid `clamp()` typography, CSS Grid/Flexbox, collapsible mobile nav, horizontal-scroll tables |
| At least one interactive element | Dark-mode toggle, mobile nav, brew-ratio calculator, copy-to-clipboard buttons, scroll-spy table of contents, glossary filter, FAQ accordion, back-to-top |
| Real hosting | Deploy to GitHub Pages / Netlify / Vercel (see §5) |
| Git history over the semester | Git repo initialised; keep committing as you develop (see §6) |

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

Do a project-wide search for the following and replace them:

- **Site name** — "Brew Basics" appears in every page's `<title>`, header, and footer.
- **Topic copy** — all headings, paragraphs, tables, recipes, and glossary terms are coffee examples. Replace them with *your* topic.
- **About page** — `[Your name here]`, `you@example.com`, and the placeholder bio.
- **`<meta name="description">`** on each page.
- **Favicon** — replace `assets/favicon.svg` with your own icon.

A quick way to find every placeholder: search for `SAMPLE` and `[Your name here]` and `you@example.com` and `Brew Basics`.

---

## 5. Deploy to a real URL

**GitHub Pages (free, easiest if you already use GitHub):**

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
3. Your site is live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

**Netlify or Vercel (drag-and-drop):**

- Netlify: drag the `guide-site` folder onto <https://app.netlify.com/drop>.
- Vercel: run `npx vercel` inside `guide-site`, or import the folder at <https://vercel.com/new>.

No server-side code is used, so any static host works.

---

## 6. Show development in Git

The repository is initialised with the working tree ready to commit. To demonstrate work *over time*, commit in small, logical steps rather than one big dump — for example:

1. `docs: add README and project plan`
2. `feat: scaffold page structure and shared header/footer`
3. `feat: add responsive stylesheet with light/dark theme`
4. `feat: add navigation and theme toggle`
5. `feat: add brew calculator and copy-to-clipboard`
6. `content: replace sample coffee copy with my own topic`

Each commit should leave the site in a working state. `git log --oneline` then shows a real development history for the semester.
