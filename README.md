# 🕸️ Maheen Niazi — Portfolio

A playful, Spider-Man–inspired personal portfolio. Built with **zero frameworks** — just vanilla HTML, CSS and JavaScript.

**Live site:** https://maheenniazi.github.io/portfolio

## ✨ Features

- 💌 **3D envelope hero** — a pink envelope you open (flap flips, letter slides out) on a desk of floating stickers that move in 3D with your mouse (or phone tilt)
- 📖 **Scrapbook pages that tilt into place** as you scroll, with stickers floating at different depths (parallax)
- 🗂️ **Project "files"** — 3D cards that tilt under your cursor and flip open to show the details
- 🌐 **Skills globe** — every skill on a spinning 3D sphere you can drag
- 📌 **Pinned index cards**, perforated stamps, flip-over polaroids, washi tape & lace
- 🕷️ **Spider-Man touches** — web cursor + trailing strand, ambient web background, spidey stickers
- 🌗 **Light & dark mode** — remembers your choice (press `T` to flip)
- 📱 **Responsive** + ♿ **respects `prefers-reduced-motion`** — still zero frameworks, all CSS 3D + vanilla JS

## 📁 Structure

```
index.html        → markup & section scaffolding
styles.css        → theme tokens, layout, 3D transforms & animations
data.js           → ALL content lives here (bio, projects, skills, photos…)
main.js           → renders data.js into the DOM + all interactivity
assets/stickers/  → stickers cut out of the sheets in elements/ (optimised .webp)
assets/paper.jpg  → paper texture
elements/         → the original sticker sheets / element pics
```

> Want to update anything? Edit **`data.js`** — the whole site rebuilds from it.
> Add your photo: drop it in `assets/photos/` and set `photos.about` in `data.js`.
> Sticker placement lives in `HERO_STICKERS` / `PAGE_STICKERS` at the top of `main.js`.

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
