// ============================================================
//  main.js — renders content from data.js + all interactivity
//  3D envelope hero -> scrapbook pages that tilt in as you scroll.
//  No frameworks: CSS 3D transforms driven by a little JS.
// ============================================================
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const STK = (name) => `assets/stickers/${name}.webp`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---- Inline SVG icons (stroke/fill use currentColor) ----
  const ICONS = {
    github: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.18 9.05 7.6 10.52.56.1.76-.24.76-.53v-1.9c-3.1.67-3.75-1.3-3.75-1.3-.5-1.3-1.24-1.64-1.24-1.64-1.02-.7.08-.68.08-.68 1.12.08 1.7 1.16 1.7 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.72-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.1-2.96 0 0 .94-.3 3.07 1.15a10.7 10.7 0 0 1 5.6 0c2.12-1.45 3.06-1.15 3.06-1.15.6 1.54.22 2.68.1 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.24-5.1 5.52.42.36.78 1.06.78 2.14v3.17c0 .3.2.63.78.52a11.1 11.1 0 0 0 7.58-10.52C23.1 5.33 18.27.5 12 .5Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.76V1.74C24 .78 23.2 0 22.22 0Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 6l9 7 9-7"/></svg>`,
    star: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2 6.3h6.6l-5.3 3.9 2 6.3-5.3-3.9-5.3 3.9 2-6.3-5.3-3.9H10z"/></svg>`,
    guitar: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3l6 6"/><path d="M13 5l-7.5 7.5a4 4 0 1 0 2 2L15 7"/><circle cx="8.5" cy="15.5" r="1.3"/></svg>`,
    music: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>`,
    flag: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V3"/><path d="M5 4h13l-2 4 2 4H5"/></svg>`,
    tv: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 3l4 4 4-4"/></svg>`,
    spider: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 9V3M15 10l4-4M15 14l5 2M9 14l-5 2M9 10 5 6M12 15v6"/></svg>`,
    book: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/></svg>`,
  };

  // ----------------------------------------------------------
  //  Sticker layouts
  //  x / y = centre position in % of the container
  //  w = width (vmin in the hero, px on pages), d = depth (translateZ px)
  //  a = idle animation class, r = resting rotation, sm = hide on phones
  // ----------------------------------------------------------
  const HERO_STICKERS = [
    { s: "spidey-hang",  x: 20, y: 13, w: 15, d: 120, a: "swing", web: true },
    { s: "vinyl-red",    x: 79, y: 18, w: 20, d: 60,  a: "spin" },
    { s: "butterfly",    x: 60, y: 9,  w: 10, d: 190, a: "flap", sm: true },
    { s: "camera",       x: 15, y: 44, w: 17, d: 90,  a: "bob", r: -10, sm: true },
    { s: "disco",        x: 19, y: 74, w: 14, d: 170, a: "spin-slow" },
    { s: "hibiscus-red", x: 12, y: 93, w: 14, d: 60,  a: "bob", r: 12 },
    { s: "kiss",         x: 32, y: 88, w: 9,  d: 140, a: "bob", r: -14, sm: true },
    { s: "star-silver",  x: 43, y: 93, w: 6,  d: 260, a: "spin3d" },
    { s: "star-chrome",  x: 68, y: 87, w: 9,  d: 230, a: "spin3d" },
    { s: "cherries",     x: 83, y: 74, w: 11, d: 200, a: "bob", r: 8 },
    { s: "cassette",     x: 86, y: 45, w: 8,  d: 40,  a: "bob", r: 14, sm: true },
    { s: "web-heart",    x: 74, y: 60, w: 7,  d: 300, a: "bob", sm: true },
    { s: "tulips",       x: 36, y: 8,  w: 9,  d: 80,  a: "bob", r: -12, sm: true },
    { s: "ticket-lucky", x: 88, y: 92, w: 11, d: 110, r: -8, sm: true },
  ];

  const PAGE_STICKERS = {
    about: [
      { s: "butterfly",      x: 97, y: 5,  w: 96,  d: 70, a: "flap" },
      { s: "ribbon",         x: 2,  y: 2,  w: 70,  d: 30, r: -10 },
      { s: "hibiscus-cream", x: -2, y: 92, w: 130, d: 50, a: "bob" },
      { s: "wax-rose",       x: 95, y: 95, w: 84,  d: 90, r: 10 },
    ],
    work: [
      { s: "spidey-headphones", x: 96, y: 1,  w: 120, d: 90, a: "bob", r: 8 },
      { s: "star-red",          x: -2, y: 30, w: 90,  d: 60, a: "spin3d", sm: true },
      { s: "lucky",             x: 98, y: 55, w: 86,  d: 30, r: 8, sm: true },
      { s: "cherries",          x: 2,  y: 97, w: 84,  d: 80, a: "bob" },
    ],
    skills: [
      { s: "spider-red",  x: 95, y: 6,  w: 110, d: 60, a: "swing" },
      { s: "button-red",  x: -2, y: 64, w: 70,  d: 50, a: "spin-slow", sm: true },
      { s: "button-gold", x: 3,  y: 80, w: 56,  d: 90, a: "spin-slow", sm: true },
      { s: "balloon-dog", x: 94, y: 92, w: 120, d: 80, a: "bob" },
    ],
    experience: [
      { s: "binder-clip",  x: 50, y: -1, w: 120, d: 20 },
      { s: "stamp-maroon", x: 97, y: 16, w: 90,  d: 50, r: 9, sm: true },
      { s: "locket-444",   x: -2, y: 46, w: 80,  d: 80, a: "swing", sm: true },
      { s: "swan",         x: 95, y: 82, w: 120, d: 40, a: "bob", sm: true },
      { s: "star-felt",    x: 2,  y: 97, w: 70,  d: 60, a: "spin3d" },
    ],
    interests: [
      { s: "bunny",        x: 96, y: 4,  w: 92,  d: 60, a: "bob" },
      { s: "flowers",      x: -1, y: 8,  w: 110, d: 40, r: -8 },
      { s: "spotify-code", x: -1, y: 66, w: 38,  d: 30, r: -6, sm: true },
      { s: "cats",         x: 93, y: 97, w: 120, d: 70 },
    ],
    contact: [
      { s: "spidey-upside", x: 6,  y: 0,  w: 92,  d: 50, a: "swing" },
      { s: "envelope",      x: 95, y: 10, w: 120, d: 70, a: "bob", r: 10 },
      { s: "kiss-print",    x: 3,  y: 90, w: 86,  d: 40, r: -12, sm: true },
      { s: "plate-iyou",    x: 92, y: 92, w: 120, d: 80, r: 6 },
    ],
  };

  function makeSticker(o, unit) {
    const wrap = el("span", `stk${o.sm ? " sm-hide" : ""}`);
    wrap.style.cssText = `left:${o.x}%;top:${o.y}%;--w:${o.w}${unit};--d:${o.d}px;--r:${o.r || 0}deg`;
    wrap.dataset.depth = o.d;
    if (o.web) wrap.appendChild(el("span", "web-line"));
    const img = el("img", o.a ? `anim-${o.a}` : "");
    img.src = STK(o.s); img.alt = ""; img.loading = unit === "vmin" ? "eager" : "lazy"; img.draggable = false;
    img.style.animationDelay = `${-(o.x * 37 + o.y * 13) % 6}s`;
    wrap.appendChild(img);
    return wrap;
  }

  // ----------------------------------------------------------
  //  Render content
  // ----------------------------------------------------------
  function render() {
    const p = DATA.profile;
    const photos = DATA.photos || {};

    // stickers
    const hs = $("#hero-stickers");
    HERO_STICKERS.forEach((o) => hs.appendChild(makeSticker(o, "vmin")));
    $$("[data-stickers]").forEach((box) => (PAGE_STICKERS[box.dataset.stickers] || []).forEach((o) => box.appendChild(makeSticker(o, "px"))));

    // about
    const at = $("#about-text");
    p.about.forEach((para) => at.appendChild(el("p", null, para)));
    const ed = DATA.education;
    $("#education-card").innerHTML = `
      <span class="ticket-label">education</span>
      <h3>${ed.school}</h3>
      <p>${ed.degree}</p>
      <p class="ticket-meta">${ed.location} &middot; ${ed.date}</p>`;
    fillSlot($('[data-slot="about"]'), photos.about);

    // projects — 3D flip files
    const pg = $("#projects-grid");
    DATA.projects.forEach((proj, i) => {
      const num = String(i + 1).padStart(2, "0");
      const card = el("article", "file");
      card.style.setProperty("--c", proj.color || "var(--blush)");
      card.innerHTML = `
        <span class="file-tab">file ${num}</span>
        <div class="file-flip">
          <div class="face face-front">
            <span class="file-num">${num}</span>
            ${proj.sticker ? `<img class="file-sticker" src="${STK(proj.sticker)}" alt="" loading="lazy" />` : ""}
            <h3 class="file-name">${proj.name}</h3>
            <p class="file-blurb">${proj.blurb}</p>
            <div class="file-stack">${proj.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
            <button class="file-btn" data-flip aria-label="Open the ${proj.name} file">open file <span>&rarr;</span></button>
          </div>
          <div class="face face-back">
            <div class="back-top"><span class="file-num sm">${num}</span><span class="back-name">${proj.name}</span>
              <button class="file-close" data-flip aria-label="Close the ${proj.name} file">&times;</button></div>
            <ul class="file-points">${proj.points.map((x) => `<li>${x}</li>`).join("")}</ul>
            <a class="file-link" href="${proj.repo}" target="_blank" rel="noopener">${ICONS.github} view on github <span>&rarr;</span></a>
          </div>
        </div>`;
      pg.appendChild(card);
    });

    // skills
    const sw = $("#skills-wrap");
    DATA.skills.forEach((g) => {
      const node = el("div", "skill-group");
      node.innerHTML = `<span class="skill-label">${g.group}</span>
        <div class="skill-tags">${g.items.map((i) => `<span class="skill-tag">${i}</span>`).join("")}</div>`;
      sw.appendChild(node);
    });

    // experience / teaching / leadership
    fillCards("#experience-timeline", DATA.experience, true);
    fillCards("#teaching-timeline", DATA.teaching, false);
    fillCards("#leadership-timeline", DATA.leadership, false);

    $("#certs-list").innerHTML = DATA.certifications.map((c) => `<li><span class="li-star">${ICONS.star}</span>${c}</li>`).join("");
    $("#awards-list").innerHTML = DATA.awards.map((a) => `<li><span class="li-star">${ICONS.star}</span>${a}</li>`).join("");

    // interests — flip polaroids
    const ig = $("#interests-grid");
    (DATA.interests || []).forEach((it, i) => {
      const card = el("button", "pol");
      card.style.setProperty("--tilt", `${[-4, 3, -2, 4, -3, 2][i % 6]}deg`);
      card.setAttribute("aria-label", `${it.title}: ${it.note}`);
      const art = it.photo
        ? `<img class="pol-photo" src="${it.photo}" alt="" loading="lazy" />`
        : `<img class="pol-art" src="${STK(it.sticker || "star-red")}" alt="" loading="lazy" />`;
      card.innerHTML = `
        <span class="pol-inner">
          <span class="pol-face pol-front"><span class="pol-pic">${art}</span><span class="pol-cap">${it.title}</span></span>
          <span class="pol-face pol-back"><span class="pol-icon">${ICONS[it.icon] || ICONS.star}</span><span class="pol-title">${it.title}</span><span class="pol-note">${it.note}</span></span>
        </span>`;
      ig.appendChild(card);
    });

    // contact
    const cl = $("#contact-links");
    [
      { icon: ICONS.mail, label: "email", sub: p.email, href: `mailto:${p.email}` },
      { icon: ICONS.linkedin, label: "linkedin", sub: "let's connect", href: p.links.linkedin },
      { icon: ICONS.github, label: "github", sub: "see the code", href: p.links.github },
      { icon: ICONS.instagram, label: "instagram", sub: "@maheenniazi_", href: p.links.instagram },
    ].forEach((c, i) => {
      const a = el("a", "contact-card");
      a.href = c.href;
      a.dataset.tiltCard = "";
      if (c.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML = `<span class="c-no">no. ${String(i + 1).padStart(3, "0")}</span><span class="c-icon">${c.icon}</span><span class="c-label">${c.label}</span><span class="c-sub">${c.sub}</span>`;
      cl.appendChild(a);
    });
  }

  function fillSlot(slot, src) {
    if (!slot || !src) return;
    slot.innerHTML = `<img src="${src}" alt="Maheen Niazi" />`;
  }

  function fillCards(sel, items, withBullets) {
    const root = $(sel);
    if (!root || !items) return;
    items.forEach((it, i) => {
      let note = "";
      if (withBullets && it.points) note = `<ul class="card-note">${it.points.map((x) => `<li>${x}</li>`).join("")}</ul>`;
      else if (it.note) note = `<p class="card-note">${it.note}</p>`;
      const loc = it.location ? ` &middot; ${it.location}` : "";
      const card = el("article", "xcard");
      card.style.setProperty("--tilt", `${[-1.4, 1.1, -0.8, 1.5, -1.2, 0.9][i % 6]}deg`);
      card.style.setProperty("--delay", `${(i % 3) * 0.12}s`);
      card.innerHTML = `<img class="pin" src="${STK("pushpin")}" alt="" aria-hidden="true" loading="lazy" />
        <div class="card-top"><span class="card-role">${it.role}</span><span class="card-date">${it.date}</span></div>
        <div class="card-org">${it.org}${loc}</div>${note}`;
      root.appendChild(card);
    });
  }

  // ----------------------------------------------------------
  //  Hero: mouse-driven 3D scene, envelope, typewriter
  // ----------------------------------------------------------
  function hero() {
    const scene = $("#scene"), stage = $("#stage"), hero = $("#hero"), env = $("#envelope");
    let tx = 0, ty = 0, cx = 0, cy = 0, scrollP = 0;

    const open = () => {
      if (env.classList.contains("open")) return;
      env.classList.add("open");
      hero.classList.add("is-open");
      $("#env-hint").textContent = "scroll down to come in";
    };
    env.addEventListener("click", () => {
      if (env.classList.contains("open")) $("#about").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      else open();
    });

    // auto-open after a moment so nobody misses the letter
    setTimeout(open, 2600);

    addEventListener("pointermove", (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    });
    // phone tilt = parallax too
    addEventListener("deviceorientation", (e) => {
      if (e.gamma == null) return;
      tx = clamp(e.gamma / 30, -1, 1); ty = clamp((e.beta - 40) / 30, -1, 1);
    });

    const stickers = $$(".stk", scene);
    function frame() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      scrollP = clamp(scrollY / innerHeight, 0, 1);
      if (scrollP > 0.08) open();
      if (scrollP < 1) {
        scene.style.transform =
          `translateZ(${-scrollP * 420}px) rotateX(${-cy * 8 + scrollP * 28}deg) rotateY(${cx * 12}deg)`;
        stage.style.opacity = String(1 - scrollP * 0.9); // opacity on the 3D root would flatten it
        stickers.forEach((s) => {
          const d = +s.dataset.depth;
          s.style.setProperty("--px", `${cx * d * 0.12}px`);
          s.style.setProperty("--py", `${cy * d * 0.12 - scrollP * d * 1.4}px`);
        });
      }
      requestAnimationFrame(frame);
    }
    if (!reduced) frame();
  }

  function typewriter() {
    const t = $("#typer");
    const roles = DATA.profile.roles || [];
    if (!roles.length) return;
    if (reduced) { t.textContent = roles[0]; return; }
    let r = 0, c = 0, del = false;
    (function tick() {
      const word = roles[r];
      c += del ? -1 : 1;
      t.textContent = word.slice(0, c);
      let wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1700; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  // ----------------------------------------------------------
  //  Pages tilt into place in 3D as they scroll in;
  //  their stickers float at different depths (parallax)
  // ----------------------------------------------------------
  function pages() {
    const list = $$(".page").map((page) => ({ page, stickers: $$(".stk", page) }));
    let mx = 0, my = 0, smx = 0, smy = 0;
    addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

    function frame() {
      const vh = innerHeight;
      smx += (mx - smx) * 0.08; smy += (my - smy) * 0.08;
      list.forEach(({ page, stickers }) => {
        const r = page.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        // 1 = waiting below the fold, 0 = settled
        const p = clamp((r.top - vh * 0.12) / (vh * 0.78), 0, 1);
        const e = p * p * (3 - 2 * p);
        page.style.setProperty("--p", e.toFixed(4));
        // centre offset drives sticker parallax
        const off = (r.top + r.height / 2 - vh / 2) / vh;
        stickers.forEach((s) => {
          const d = +s.dataset.depth;
          s.style.setProperty("--px", `${smx * d * 0.5}px`);
          s.style.setProperty("--py", `${off * d * 0.9 + smy * d * 0.5}px`);
        });
      });
      requestAnimationFrame(frame);
    }
    if (reduced) list.forEach(({ page }) => page.style.setProperty("--p", "0"));
    else frame();
  }

  // ----------------------------------------------------------
  //  Project files: hover tilt + click to flip open
  // ----------------------------------------------------------
  function files() {
    $$(".file").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        if (e.target.closest("[data-flip]") || !card.classList.contains("flipped")) {
          card.classList.toggle("flipped");
          const focusTarget = card.classList.contains("flipped") ? $(".file-close", card) : $(".file-btn", card);
          setTimeout(() => focusTarget.focus({ preventScroll: true }), 350);
        }
      });
    });
    tiltCards($$(".file"), 9);
    tiltCards($$("[data-tilt-card]"), 14);
  }

  function tiltCards(cards, max) {
    if (!finePointer || reduced) return;
    cards.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", `${x * max}deg`);
        card.style.setProperty("--rx", `${-y * max}deg`);
        card.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg");
      });
    });
  }

  // ----------------------------------------------------------
  //  Skills globe — tags on a rotating 3D sphere (drag to spin)
  // ----------------------------------------------------------
  function sphere() {
    const box = $("#sphere");
    const words = DATA.skills.flatMap((g) => g.items.map((w) => w.replace(/\s*\(.*\)/, "")));
    const n = words.length;
    const pts = words.map((w, i) => {
      // fibonacci sphere = even spacing
      const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
      const tag = el("span", "orb-tag", w);
      box.appendChild(tag);
      return { x: Math.cos(th) * rad, y, z: Math.sin(th) * rad, tag };
    });
    let R = 160, dragging = false, lx = 0, ly = 0, vx = 0.0042, vy = 0.0016;
    const size = () => (R = box.clientWidth / 2 * 0.82);
    size(); addEventListener("resize", size);

    box.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; box.setPointerCapture(e.pointerId); });
    box.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      vx = (e.clientX - lx) * 0.0016; vy = (e.clientY - ly) * 0.0016; lx = e.clientX; ly = e.clientY;
    });
    const up = () => (dragging = false);
    box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);

    function step(rx, ry) {
      const cX = Math.cos(rx), sX = Math.sin(rx), cY = Math.cos(ry), sY = Math.sin(ry);
      pts.forEach((p) => {
        let { x, y, z } = p;
        const x1 = x * cY + z * sY, z1 = -x * sY + z * cY;
        const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
        p.x = x1; p.y = y1; p.z = z2;
        const s = (p.z + 2) / 3;
        p.tag.style.transform = `translate(-50%,-50%) translate3d(${p.x * R}px, ${p.y * R}px, ${p.z * R}px) scale(${0.6 + s * 0.55})`;
        p.tag.style.opacity = String(0.25 + s * 0.75);
        p.tag.style.zIndex = String(Math.round(s * 100));
      });
    }
    function frame() {
      if (!dragging) { vx += (0.0042 - vx) * 0.02; vy += (0.0012 - vy) * 0.02; }
      step(vy, vx);
      requestAnimationFrame(frame);
    }
    step(0.3, 0.3);
    if (!reduced) frame();
  }

  // ----------------------------------------------------------
  //  Reveal-on-scroll (index cards fall onto the page)
  // ----------------------------------------------------------
  function reveals() {
    const items = $$(".xcard, .pol, .contact-card, .stamp-col li, .skill-group");
    if (!("IntersectionObserver" in window) || reduced) { items.forEach((i) => i.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach((i) => io.observe(i));

    // polaroids flip on tap (hover handles desktop)
    $$(".pol").forEach((p) => p.addEventListener("click", () => p.classList.toggle("flipped")));
  }

  // ----------------------------------------------------------
  //  Nav: show after hero, highlight active folder, scroll bar
  // ----------------------------------------------------------
  function nav() {
    const tabs = $$(".tab"), bar = $("#scroll-bar"), navEl = $("#tabs");
    const secs = tabs.map((t) => $("#" + t.dataset.tab));
    function onScroll() {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      navEl.classList.toggle("shown", scrollY > innerHeight * 0.6);
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = i; });
      tabs.forEach((t, i) => t.classList.toggle("active", i === cur && scrollY > innerHeight * 0.6));
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // ----------------------------------------------------------
  //  Theme toggle
  // ----------------------------------------------------------
  function theme() {
    const root = document.documentElement, icon = $(".theme-icon");
    const SUN = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>`;
    const MOON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>`;
    let saved = null;
    try { saved = localStorage.getItem("mn-theme"); } catch (e) { /* storage blocked */ }
    if (saved) root.setAttribute("data-theme", saved);
    const sync = () => (icon.innerHTML = root.getAttribute("data-theme") === "dark" ? SUN : MOON);
    sync();
    const flip = () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mn-theme", next); } catch (e) { /* storage blocked */ }
      sync();
    };
    $("#theme-toggle").addEventListener("click", flip);
    document.addEventListener("keydown", (e) => {
      if ((e.key === "t" || e.key === "T") && !/input|textarea/i.test(e.target.tagName) && !e.metaKey && !e.ctrlKey) flip();
    });
  }

  // ----------------------------------------------------------
  //  Web cursor + trailing strand
  // ----------------------------------------------------------
  function webCursor() {
    if (!finePointer) return;
    const dot = $("#cursor-web");
    const canvas = $("#cursor-trail");
    const ctx = canvas.getContext("2d");
    let w, h; const pts = [];
    const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
    resize(); addEventListener("resize", resize);

    addEventListener("mousemove", (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      pts.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (pts.length > 18) pts.shift();
      const hot = e.target.closest("a, button, .file, .pol, .skill-tag, .sphere");
      dot.classList.toggle("hot", !!hot);
    });
    addEventListener("mousedown", () => dot.classList.add("tap"));
    addEventListener("mouseup", () => dot.classList.remove("tap"));

    const web = getComputedStyle(document.documentElement);
    function frame() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = web.getPropertyValue("--web").trim() || "rgba(110,31,44,0.2)"; ctx.lineWidth = 1;
      for (let i = 1; i < pts.length; i++) {
        pts[i - 1].life *= 0.9;
        ctx.globalAlpha = pts[i].life;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x - 4, pts[i].y); ctx.lineTo(pts[i].x + 4, pts[i].y);
          ctx.moveTo(pts[i].x, pts[i].y - 4); ctx.lineTo(pts[i].x, pts[i].y + 4);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    if (!reduced) frame();
  }

  // ----------------------------------------------------------
  //  Ambient background web (very subtle)
  // ----------------------------------------------------------
  function bgWeb() {
    const canvas = $("#web-canvas"); const ctx = canvas.getContext("2d");
    let w, h, nodes = [];
    const resize = () => {
      w = canvas.width = innerWidth; h = canvas.height = innerHeight;
      const count = Math.min(60, Math.floor((w * h) / 26000));
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
    };
    resize(); addEventListener("resize", resize);
    const web = getComputedStyle(document.documentElement);
    function frame() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = web.getPropertyValue("--web").trim() || "rgba(110,31,44,0.14)"; ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]; n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j], d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 150) { ctx.globalAlpha = (1 - d / 150) * 0.6; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
        }
      }
      ctx.globalAlpha = 1; requestAnimationFrame(frame);
    }
    if (!reduced) frame();
  }

  // ---- boot ----
  document.addEventListener("DOMContentLoaded", () => {
    render(); hero(); typewriter(); pages(); files(); sphere(); reveals(); nav(); theme(); webCursor(); bgWeb();
  });
  addEventListener("load", () => document.body.classList.add("loaded"));
  setTimeout(() => document.body.classList.add("loaded"), 4000);
})();
