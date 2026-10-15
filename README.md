# 🕸️ Maheen Niazi — Portfolio

A playful, Spider-Man–inspired personal portfolio. Built with **zero frameworks** — just vanilla HTML, CSS and JavaScript.

**Live site:** https://maheenniazi.github.io/portfolio

## ✨ Features

- 🕷️ **Spider-Man theme** — red/blue web palette, comic-book headings, an animated spidey-mask avatar
- 🌗 **Light & dark mode** — smooth transitions, remembers your choice (press `T` to flip)
- 🕸️ **Animated web background** — a live particle web on `<canvas>` that reacts to your cursor ("spidey sense")
- 🎬 **Smooth interactivity** — typewriter intro, scroll-reveal sections, hover-reactive project cards, scroll progress bar, active-nav highlighting
- 📱 **Responsive** — looks good on phone, tablet and desktop
- ♿ **Respects `prefers-reduced-motion`**

## 📁 Structure

```
index.html   → markup & section scaffolding
styles.css   → theme tokens, layout, animations
data.js      → ALL content lives here (bio, projects, skills, experience…)
main.js      → renders data.js into the DOM + all interactivity
README.md    → you are here
```

> Want to update anything? Edit **`data.js`** — the whole site rebuilds from it.

## 🚀 Running locally

It's a static site, so just open `index.html` — or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Deployment

Hosted free on **GitHub Pages** from the `main` branch.

---

Built with 🕸️ by Maheen Niazi.
