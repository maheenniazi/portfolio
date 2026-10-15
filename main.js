// ============================================================
//  main.js — renders content from data.js + all interactivity
//  Cover screen -> folder-tab portfolio. Web cursor + trail.
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

  // ---- Inline SVG icons (stroke/fill use currentColor) ----
  const ICONS = {
    github: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.18 9.05 7.6 10.52.56.1.76-.24.76-.53v-1.9c-3.1.67-3.75-1.3-3.75-1.3-.5-1.3-1.24-1.64-1.24-1.64-1.02-.7.08-.68.08-.68 1.12.08 1.7 1.16 1.7 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.72-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.1-2.96 0 0 .94-.3 3.07 1.15a10.7 10.7 0 0 1 5.6 0c2.12-1.45 3.06-1.15 3.06-1.15.6 1.54.22 2.68.1 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.24-5.1 5.52.42.36.78 1.06.78 2.14v3.17c0 .3.2.63.78.52a11.1 11.1 0 0 0 7.58-10.52C23.1 5.33 18.27.5 12 .5Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.76V1.74C24 .78 23.2 0 22.22 0Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 6l9 7 9-7"/></svg>`,
    star: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2 6.3h6.6l-5.3 3.9 2 6.3-5.3-3.9-5.3 3.9 2-6.3-5.3-3.9H10z"/></svg>`,
    // interests
    guitar: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3l6 6"/><path d="M13 5l-7.5 7.5a4 4 0 1 0 2 2L15 7"/><circle cx="8.5" cy="15.5" r="1.3"/></svg>`,
    music: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>`,
    flag: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V3"/><path d="M5 4h13l-2 4 2 4H5"/></svg>`,
    tv: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 3l4 4 4-4"/></svg>`,
    spider: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 9V3M15 10l4-4M15 14l5 2M9 14l-5 2M9 10 5 6M12 15v6"/></svg>`,
    book: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/></svg>`,
  };

  // ----------------------------------------------------------
  //  Render content
  // ----------------------------------------------------------
  function render() {
    const p = DATA.profile;

    // about
    const at = $("#about-text");
    p.about.forEach((para) => at.appendChild(el("p", null, para)));
    const ed = DATA.education;
    $("#education-card").innerHTML = `
      <span class="eyebrow">Education</span>
      <h3>${ed.school}</h3>
      <p class="muted">${ed.degree}</p>
      <p class="muted">${ed.location} &middot; ${ed.date}</p>`;

    // projects
    const pg = $("#projects-grid");
    DATA.projects.forEach((proj, i) => {
      const num = String(i + 1).padStart(2, "0");
      const card = el("article", "project-card");
      card.innerHTML = `
        <div class="proj-head"><span class="proj-num">${num}</span><span class="proj-name">${proj.name}</span></div>
        <div class="proj-blurb">${proj.blurb}</div>
        <ul class="proj-points">${proj.points.map((x) => `<li>${x}</li>`).join("")}</ul>
        <div class="proj-stack">${proj.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        <a class="proj-link" href="${proj.repo}" target="_blank" rel="noopener">${ICONS.github} View on GitHub <span class="arrow">&rarr;</span></a>`;
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

    // timelines
    fillTimeline("#experience-timeline", DATA.experience, true);
    fillTimeline("#teaching-timeline", DATA.teaching, false);
    fillTimeline("#leadership-timeline", DATA.leadership, false);

    // creds
    $("#certs-list").innerHTML = DATA.certifications.map((c) => `<li>${c}</li>`).join("");
    $("#awards-list").innerHTML = DATA.awards.map((a) => `<li>${a}</li>`).join("");
    $$(".cred-mark").forEach((m) => (m.innerHTML = ICONS.star));

    // interests
    const ig = $("#interests-grid");
    (DATA.interests || []).forEach((it) => {
      const slot = "interest-" + it.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      const card = el("article", "interest-card");
      card.innerHTML = `
        <div class="interest-photo" data-slot="${slot}">
          <span class="interest-icon">${ICONS[it.icon] || ICONS.star}</span>
          <span class="slot-hint">add a pic</span>
        </div>
        <div class="interest-body"><h3>${it.title}</h3><p>${it.note}</p></div>`;
      ig.appendChild(card);
    });

    // contact
    const cl = $("#contact-links");
    [
      { icon: ICONS.mail, label: "Email", sub: p.email, href: `mailto:${p.email}` },
      { icon: ICONS.linkedin, label: "LinkedIn", sub: "let's connect", href: p.links.linkedin },
      { icon: ICONS.github, label: "GitHub", sub: "see the code", href: p.links.github },
      { icon: ICONS.instagram, label: "Instagram", sub: "@maheenniazi_", href: p.links.instagram },
    ].forEach((c) => {
      const a = el("a", "contact-card");
      a.href = c.href;
      if (c.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML = `<span class="c-icon">${c.icon}</span><span>${c.label}<span class="c-sub">${c.sub}</span></span>`;
      cl.appendChild(a);
    });
  }

  function fillTimeline(sel, items, withBullets) {
    const root = $(sel);
    if (!root || !items) return;
    items.forEach((it) => {
      let note = "";
      if (withBullets && it.points) note = `<div class="tl-note"><ul>${it.points.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
      else if (it.note) note = `<div class="tl-note">${it.note}</div>`;
      const loc = it.location ? ` &middot; ${it.location}` : "";
      const item = el("div", "tl-item");
      item.innerHTML = `<div class="tl-top"><span class="tl-role">${it.role}</span><span class="tl-date">${it.date}</span></div>
        <div class="tl-org">${it.org}${loc}</div>${note}`;
      root.appendChild(item);
    });
  }

  // ----------------------------------------------------------
  //  Cover -> portfolio
  // ----------------------------------------------------------
  function coverFlow() {
    const cover = $("#cover"), pf = $("#portfolio");
    const open = () => {
      cover.classList.add("leaving");
      setTimeout(() => { cover.style.display = "none"; pf.hidden = false; window.scrollTo(0, 0); }, 560);
    };
    $("#enter-btn").addEventListener("click", open);
    $("#back-cover").addEventListener("click", () => {
      pf.hidden = true; cover.style.display = ""; cover.classList.remove("leaving"); window.scrollTo(0, 0);
    });
  }

  // ----------------------------------------------------------
  //  Folder tabs
  // ----------------------------------------------------------
  function tabs() {
    const tabEls = $$(".tab");
    const panels = $$(".panel");
    const show = (name) => {
      tabEls.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
      panels.forEach((pn) => pn.classList.toggle("is-active", pn.dataset.panel === name));
    };
    tabEls.forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));
    // arrow-key folder flipping
    document.addEventListener("keydown", (e) => {
      if ($("#portfolio").hidden) return;
      if (/input|textarea/i.test(e.target.tagName)) return;
      const i = tabEls.findIndex((t) => t.getAttribute("aria-selected") === "true");
      if (e.key === "ArrowRight") show(tabEls[(i + 1) % tabEls.length].dataset.tab);
      if (e.key === "ArrowLeft") show(tabEls[(i - 1 + tabEls.length) % tabEls.length].dataset.tab);
    });
  }

  // ----------------------------------------------------------
  //  Theme toggle
  // ----------------------------------------------------------
  function theme() {
    const root = document.documentElement, icon = $(".theme-icon");
    const SUN = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>`;
    const MOON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>`;
    const saved = localStorage.getItem("mn-theme");
    if (saved) root.setAttribute("data-theme", saved);
    const sync = () => (icon.innerHTML = root.getAttribute("data-theme") === "dark" ? SUN : MOON);
    sync();
    const flip = () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next); localStorage.setItem("mn-theme", next); sync();
    };
    $("#theme-toggle").addEventListener("click", flip);
    document.addEventListener("keydown", (e) => {
      if ((e.key === "t" || e.key === "T") && !/input|textarea/i.test(e.target.tagName)) flip();
    });
  }

  // ----------------------------------------------------------
  //  Web cursor + trailing strand
  // ----------------------------------------------------------
  function webCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = $("#cursor-web");
    const canvas = $("#cursor-trail");
    const ctx = canvas.getContext("2d");
    let w, h; const pts = []; const mouse = { x: -99, y: -99 };
    const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
    resize(); addEventListener("resize", resize);

    addEventListener("mousemove", (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      pts.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (pts.length > 18) pts.shift();
      const hot = e.target.closest("a, button, .tab, .project-card, .interest-card, .skill-tag");
      dot.classList.toggle("hot", !!hot);
    });
    addEventListener("mousedown", () => dot.classList.add("tap"));
    addEventListener("mouseup", () => dot.classList.remove("tap"));

    const web = getComputedStyle(document.documentElement);
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const col = web.getPropertyValue("--web").trim() || "rgba(192,54,44,0.16)";
      ctx.strokeStyle = col; ctx.lineWidth = 1;
      for (let i = 1; i < pts.length; i++) {
        pts[i - 1].life *= 0.9;
        ctx.globalAlpha = pts[i].life;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        // little cross-strands for a web feel
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
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) frame();
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
      const col = web.getPropertyValue("--web").trim() || "rgba(192,54,44,0.12)";
      ctx.strokeStyle = col; ctx.lineWidth = 0.5;
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
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) frame();
  }

  // ---- boot ----
  document.addEventListener("DOMContentLoaded", () => {
    render(); coverFlow(); tabs(); theme(); webCursor(); bgWeb();
  });
})();
