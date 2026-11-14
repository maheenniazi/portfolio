// ============================================================
//  main.js — renders content from data.js + light interactivity
//  Arty editorial build: cursor-parallax centerpiece, custom
//  cursor ring, gentle reveals, expandable project cards, theme.
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
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const ICONS = {
    github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.18 9.05 7.6 10.52.56.1.76-.24.76-.53v-1.9c-3.1.67-3.75-1.3-3.75-1.3-.5-1.3-1.24-1.64-1.24-1.64-1.02-.7.08-.68.08-.68 1.12.08 1.7 1.16 1.7 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.72-1.5-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.1-2.96 0 0 .94-.3 3.07 1.15a10.7 10.7 0 0 1 5.6 0c2.12-1.45 3.06-1.15 3.06-1.15.6 1.54.22 2.68.1 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.24-5.1 5.52.42.36.78 1.06.78 2.14v3.17c0 .3.2.63.78.52a11.1 11.1 0 0 0 7.58-10.52C23.1 5.33 18.27.5 12 .5Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.76V1.74C24 .78 23.2 0 22.22 0Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 6l9 7 9-7"/></svg>`,
    external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="15" height="15"><path d="M6 9l6 6 6-6"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>`,
    guitar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3l6 6"/><path d="M13 5l-7.5 7.5a4 4 0 1 0 2 2L15 7"/><circle cx="8.5" cy="15.5" r="1.3"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>`,
    flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V3"/><path d="M5 4h13l-2 4 2 4H5"/></svg>`,
    tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 3l4 4 4-4"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/></svg>`,
    spider: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 9V3M15 10l4-4M15 14l5 2M9 14l-5 2M9 10 5 6M12 15v6"/></svg>`,
  };

  // ---------------------------------------------------------- render
  function render() {
    const p = DATA.profile;
    const photos = DATA.photos || {};

    $("#hero-gh").innerHTML = ICONS.github;
    $("#hero-intro").textContent = p.heroIntro || p.tagline || "";

    // hero centerpiece
    const av = $("#avatar");
    const frames = photos.heroFrames;
    if (frames && frames.front) {
      av.classList.add("is-cutout");
      av.innerHTML = ["left", "front", "right", "wink"].map((k) =>
        `<img class="avatar-frame${k === "front" ? " on" : ""}" data-frame="${k}" src="${frames[k]}" alt="${k === "front" ? "Maheen Niazi" : ""}" ${k === "front" ? "" : 'aria-hidden="true"'} />`
      ).join("");
    } else if (photos.hero) {
      av.innerHTML = `<img src="${photos.hero}" alt="Maheen Niazi" />`;
      av.classList.add("is-cutout");
    } else if (photos.about) {
      av.innerHTML = `<img src="${photos.about}" alt="Maheen Niazi" />`;
    }

    // about
    const at = $("#about-text");
    p.about.forEach((para, i) => at.appendChild(el("p", i === 0 ? "lead" : null, para)));
    const ed = DATA.education;
    $("#education-card").innerHTML =
      `<span class="k">Education</span><h4>${ed.school}</h4><p>${ed.degree}</p><p>${ed.location} · ${ed.date}</p>`;
    fillSlot($('[data-slot="about"]'), photos.about);

    // projects
    const pg = $("#projects-grid");
    DATA.projects.forEach((proj, i) => {
      const num = String(i + 1).padStart(2, "0");
      const summary = proj.points[0];
      const rest = proj.points.slice(1);
      const card = el("article", "project reveal");
      const links = [`<a class="project-link" href="${proj.repo}" target="_blank" rel="noopener">${ICONS.github}<span>Code</span></a>`];
      if (proj.demo) links.unshift(`<a class="project-link" href="${proj.demo}" target="_blank" rel="noopener">${ICONS.play}<span>Live demo</span></a>`);
      card.innerHTML = `
        <div class="project-top"><span class="project-num">${num}</span><span class="project-dot" style="background:${proj.color || "var(--accent)"}"></span></div>
        <h3 class="project-name">${proj.name}</h3>
        <p class="project-blurb">${proj.blurb}</p>
        <p class="project-summary">${summary}</p>
        <div class="project-tags">${proj.stack.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
        <div class="project-details"><div><ul class="project-points">${rest.map((x) => `<li>${x}</li>`).join("")}</ul></div></div>
        <div class="project-foot">${links.join("")}${rest.length ? `<button class="project-toggle" aria-expanded="false"><span class="label">details</span><span class="chev">${ICONS.chevron}</span></button>` : ""}</div>`;
      const btn = $(".project-toggle", card);
      if (btn) btn.addEventListener("click", () => {
        const open = card.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        $(".label", btn).textContent = open ? "less" : "details";
      });
      pg.appendChild(card);
    });

    // skills
    const sw = $("#skills-wrap");
    DATA.skills.forEach((g) => {
      const node = el("div", "skill-group");
      node.innerHTML = `<span class="skill-label">${g.group}</span><div class="skill-tags">${g.items.map((i) => `<span class="skill-tag">${i}</span>`).join("")}</div>`;
      sw.appendChild(node);
    });

    // timelines
    fillTimeline("#experience-list", DATA.experience, true);
    fillTimeline("#teaching-list", DATA.teaching, false);
    fillTimeline("#leadership-list", DATA.leadership, false);
    $("#certs-list").innerHTML = DATA.certifications.map((c) => `<li>${c}</li>`).join("");
    $("#awards-list").innerHTML = DATA.awards.map((a) => `<li>${a}</li>`).join("");

    // interests
    const ig = $("#interests-grid");
    (DATA.interests || []).forEach((it) => {
      const node = el("article", "interest reveal");
      node.innerHTML = `<span class="interest-icon">${ICONS[it.icon] || ICONS.book}</span><h4>${it.title}</h4><p>${it.note}</p>`;
      ig.appendChild(node);
    });

    // contact
    const cl = $("#contact-links");
    [
      { icon: ICONS.mail, label: "Email", sub: p.email, href: `mailto:${p.email}` },
      { icon: ICONS.linkedin, label: "LinkedIn", sub: "in/maheen-niazi", href: p.links.linkedin },
      { icon: ICONS.github, label: "GitHub", sub: "@maheenniazi", href: p.links.github },
      { icon: ICONS.instagram, label: "Instagram", sub: "@maheenniazi_", href: p.links.instagram },
    ].forEach((c) => {
      const a = el("a", "contact-card reveal");
      a.href = c.href;
      if (c.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML = `<span class="contact-ic">${c.icon}</span><span class="contact-meta"><span class="contact-label">${c.label}</span><span class="contact-sub">${c.sub}</span></span>`;
      cl.appendChild(a);
    });
  }

  function fillSlot(slot, src) { if (slot && src) slot.innerHTML = `<img src="${src}" alt="Maheen Niazi" />`; }
  function fillTimeline(sel, items, bullets) {
    const root = $(sel);
    if (!root || !items) return;
    items.forEach((it) => {
      let note = "";
      if (bullets && it.points) note = `<div class="tl-note"><ul>${it.points.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
      else if (it.note) note = `<div class="tl-note">${it.note}</div>`;
      const loc = it.location ? ` · ${it.location}` : "";
      const item = el("div", "tl-item");
      item.innerHTML = `<span class="tl-role">${it.role}</span><span class="tl-date">${it.date}</span><span class="tl-org">${it.org}${loc}</span>${note}`;
      root.appendChild(item);
    });
  }

  // ---------------------------------------------------------- cursor parallax + ring
  // the head + eyes follow the cursor: swap angle frames and tilt the whole bust
  function headTracking() {
    const inner = $("#stage-inner"), avatar = $("#avatar");
    const fr = {};
    $$(".avatar-frame", avatar).forEach((n) => (fr[n.dataset.frame] = n));
    const hasFrames = fr.front && fr.left && fr.right;
    let tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5, winking = false, cur = "front";

    const show = (k) => {
      if (winking || cur === k || !fr[k]) return;
      cur = k;
      Object.entries(fr).forEach(([n, el]) => el.classList.toggle("on", n === k));
    };
    const wink = () => {
      if (!fr.wink || winking) return;
      winking = true;
      const prev = cur;
      Object.entries(fr).forEach(([n, el]) => el.classList.toggle("on", n === "wink"));
      setTimeout(() => { winking = false; cur = "__"; show(prev); }, 260);
    };

    if (finePointer && !reduced) {
      addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; });
    }
    // a wink on click, and a soft auto-blink now and then
    if (hasFrames && !reduced) {
      $("#top").addEventListener("click", (e) => { if (e.target.closest(".avatar, .stage-inner")) wink(); });
      const loop = () => { wink(); setTimeout(loop, 6000 + Math.random() * 6000); };
      setTimeout(loop, 4500);
    }

    function raf() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      const dx = cx - 0.5, dy = cy - 0.5;
      if (inner) inner.style.transform = `translate(${dx * 24}px, ${dy * 18}px)`;
      if (avatar) avatar.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 10}deg)`;
      if (hasFrames) show(dx < -0.12 ? "left" : dx > 0.12 ? "right" : "front");
      requestAnimationFrame(raf);
    }
    if (avatar) avatar.style.transformStyle = "preserve-3d";
    if (finePointer && !reduced) raf();
  }

  // reveal on scroll
  function reveals() {
    const items = $$(".section .panel, .sec-head, .project, .interest, .contact-card");
    items.forEach((n) => n.classList.add("reveal"));
    if (reduced || !("IntersectionObserver" in window)) { items.forEach((n) => n.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    items.forEach((n) => io.observe(n));
  }

  // theme
  function theme() {
    const root = document.documentElement, icon = $(".theme-icon");
    const SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>`;
    const MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>`;
    let saved = null;
    try { saved = localStorage.getItem("mn-theme"); } catch (e) { /* blocked */ }
    if (saved) root.setAttribute("data-theme", saved);
    const sync = () => (icon.innerHTML = root.getAttribute("data-theme") === "dark" ? SUN : MOON);
    sync();
    const flip = () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mn-theme", next); } catch (e) { /* blocked */ }
      sync();
    };
    $("#theme-toggle").addEventListener("click", flip);
    addEventListener("keydown", (e) => {
      if ((e.key === "t" || e.key === "T") && !/input|textarea/i.test(e.target.tagName) && !e.metaKey && !e.ctrlKey) flip();
    });
  }

  // ---------------------------------------------------------- gaming layer
  // achievement toasts when each section first scrolls into view
  function achievements() {
    const wrap = $("#toast-wrap");
    const secs = [
      ["about", "Player profile"], ["work", "Projects unlocked"], ["skills", "Toolkit acquired"],
      ["experience", "Quest log opened"], ["interests", "Hobbies discovered"], ["contact", "Comms online"],
    ];
    const star = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 17.8 6.1 20.3l1.7-6.6L2.6 9.3l6.8-.5z"/></svg>`;
    const toast = (label) => {
      const t = el("div", "toast", `<span class="toast-ic">${star}</span><span class="toast-txt"><span class="toast-t">Achievement unlocked</span><span class="toast-m">${label}</span></span>`);
      wrap.appendChild(t);
      requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("show")));
      setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 600); }, 3200);
    };
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const hit = secs.find((x) => x[0] === e.target.id);
          if (hit) toast(hit[1]);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    secs.forEach(([id]) => { const n = $("#" + id); if (n) io.observe(n); });
  }

  // bottom HUD: hearts (full) + an XP bar that fills with scroll; level per section
  function hud() {
    const hud = $("#hud"), fill = $("#hud-fill"), lvl = $("#hud-lvl"), hearts = $("#hud-hearts");
    if (!hud) return;
    hearts.innerHTML = Array.from({ length: 5 }, () => `<span class="heart">&#10084;</span>`).join("");
    const secs = ["about", "work", "skills", "experience", "interests", "contact"].map((id) => $("#" + id)).filter(Boolean);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? clamp(scrollY / h, 0, 1) : 0;
      fill.style.width = (p * 100).toFixed(1) + "%";
      hud.classList.toggle("show", scrollY > innerHeight * 0.75);
      let cur = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.5) cur = i + 1; });
      lvl.textContent = "LVL " + Math.max(1, cur);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    render(); reveals(); theme(); headTracking(); achievements(); hud();
  });
})();
