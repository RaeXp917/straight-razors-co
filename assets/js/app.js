/* ============================================================================
   APP ENGINE  —  reads config.js + the blueprint and builds the whole site.
   No per-client edits. The blueprint (presets.js) decides which sections exist
   and in what order; each section type has a renderer in SECTION_RENDERERS.
   ============================================================================ */

(function () {
  "use strict";

  // config.js / presets.js are classic scripts loaded before this one, so their
  // top-level declarations live in the shared global scope — reference by name.
  // (A top-level `const` does NOT become a property of `window`, so we must not
  //  read `window.SITE_CONFIG` — that would be undefined.)
  let CFG = (typeof SITE_CONFIG !== "undefined") ? SITE_CONFIG : window.SITE_CONFIG;
  let preset = BUSINESS_PRESETS[CFG.businessType] || BUSINESS_PRESETS.generic;

  // Current language (persisted in the browser so a visitor's choice sticks).
  let lang = localStorage.getItem("lang") || CFG.defaultLang || "el";

  /* ---------- tiny helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const t = (obj) => (obj && (obj[lang] ?? obj.el ?? obj.en)) || "";   // localized field
  const tx = (v) => (typeof v === "string" ? v : t(v));               // string OR localized
  const ui = (key) => (UI_TEXT[lang] && UI_TEXT[lang][key]) || key;    // static UI string
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const isImg = (s) => typeof s === "string" && /\.(png|jpe?g|svg|webp|gif|avif)$/i.test(s);
  const isExternal = (s) => /^(?:[a-z]+:|\/)/i.test(s || "");
  const assetDir = String((CFG.brand && (CFG.brand.assetsDir || (CFG.brand.assets && CFG.brand.assets.dir))) || "").replace(/\/+$/, "");
  const resolveAsset = (value) => {
    if (typeof value !== "string" || !value || !assetDir || isExternal(value) || value.includes("/") || !isImg(value)) return value;
    return `${assetDir}/${value}`;
  };
  // Resolve a named slot from the brand folder. A client can replace the whole
  // folder and keep the same filenames; explicit paths still remain supported.
  const brandAsset = (slot, explicit, defaultFile) => {
    const assets = (CFG.brand && CFG.brand.assets) || {};
    const value = explicit || assets[slot] || (assetDir ? defaultFile : "");
    return resolveAsset(value);
  };
  const telHref = (p) => "tel:" + (p || "").replace(/[^\d+]/g, "");
  const personLabel = (name) => {
    // first/last may be plain strings OR localized {el,en} objects.
    if (name && typeof name === "object" && !("el" in name) && !("en" in name)) {
      return [tx(name.first), tx(name.last)].filter(Boolean).join(" ").trim();
    }
    return tx(name).trim();
  };
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>\"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[ch]));
  const initials = (name) =>
    personLabel(name).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const personNameMarkup = (name) => {
    const parts = personLabel(name).split(/\s+/).filter(Boolean);
    const first = escapeHtml(parts.shift() || "");
    const last = escapeHtml(parts.join(" "));
    return `<span class="team-first">${first}</span>${last ? ` <span class="team-last">${last}</span>` : ""}`;
  };
  const hasIcons = typeof ICONS !== "undefined";
  // Build a sized <svg> from an icon name (empty string if unknown).
  const icon = (name) =>
    hasIcons && ICONS[name]
      ? `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`
      : "";
  // An icon "slot" that accepts: an image path, an ICON name, or an emoji/text.
  const iconMarkup = (val, fallbackName) => {
    if (isImg(val)) return `<img src="${resolveAsset(val)}" alt="">`;
    if (val && hasIcons && ICONS[val]) return icon(val);
    if (val) return `<span class="emoji">${val}</span>`;
    return fallbackName ? icon(fallbackName) : "";
  };
  // Five stars with the first N filled — used by the reviews section.
  const stars = (n) => {
    const full = Math.round(Number(n) || 0);
    let out = "";
    for (let i = 0; i < 5; i++) out += `<span class="star${i < full ? " on" : ""}">${icon("star")}</span>`;
    return out;
  };
  const mapsLink = () => {
    const q = encodeURIComponent((CFG.contact && (CFG.contact.mapQuery || CFG.contact.address)) || "");
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  };

  /* The active blueprint's section order. */
  const layout = () => (preset.layout && preset.layout.length ? preset.layout : BUSINESS_PRESETS.generic.layout);
  /* Section title resolution: config wins, then blueprint label, then default. */
  const sectionLabel = (type, cfgSection) =>
    (cfgSection && t(cfgSection.title)) ||
    (preset.labels && t(preset.labels[type])) ||
    t(DEFAULT_LABELS[type]) || "";

  /* ---------- section DOM helpers ---------- */
  const sectionEl = (id, innerHTML, extraClass) => {
    const s = el("section", "section" + (extraClass ? " " + extraClass : ""), `<div class="container">${innerHTML}</div>`);
    s.id = id;
    return s;
  };
  const titledSection = (id, title, innerHTML, extraClass) =>
    sectionEl(id, `<h2 class="section-title">${escapeHtml(title)}</h2>${innerHTML}`, extraClass);

  /* ---------- theme ---------- */
  function applyTheme() {
    const th = { ...(preset.theme || {}), ...(CFG.theme || {}) };
    // Write onto <body> (same element as the .dark class) so inline vars win
    // over .dark's defaults — otherwise config bg/surface/primary get shadowed.
    const r = document.body.style;
    const map = { primary: "--primary", accent: "--accent", accent2: "--accent2",
                  bg: "--bg", surface: "--surface", emerald: "--emerald",
                  wood: "--wood", font: "--font", radius: "--radius" };
    Object.keys(map).forEach((k) => { if (th[k]) r.setProperty(map[k], th[k]); });
    document.body.classList.toggle("dark", !!th.dark);
  }

  function setFavicon() {
    const v = brandAsset("favicon", CFG.brand.favicon || CFG.brand.logo, "logo.png") || preset.icon;
    if (isImg(v)) { $("favicon").href = v; return; }
    const accent = (CFG.theme && CFG.theme.accent) || (preset.theme && preset.theme.accent) || "#c69a5b";
    let svg;
    if (hasIcons && ICONS[v]) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[v]}</svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="52" font-size="52">${v}</text></svg>`;
    }
    $("favicon").href = "data:image/svg+xml," + encodeURIComponent(svg);
  }

  /* ---------- brand markup (shared header + footer) ---------- */
  function brandMarkup() {
    const name = CFG.brand.showName === false ? "" : `<span>${escapeHtml(CFG.brand.name)}</span>`;
    const logo = brandAsset("logo", CFG.brand.logo, "logo.png") || preset.icon;
    return `${iconMarkup(logo, preset.icon)}${name}`;
  }

  /* ============================================================================
     SECTION RENDERERS  —  each returns a <section> node (or null to skip).
     ============================================================================ */

  function renderHero(h) {
    h = h || {};
    const sec = el("section", "hero");
    sec.id = "hero";
    const heroImage = brandAsset("hero", h.image, "hero.jpg");
    if (heroImage) sec.style.backgroundImage = `url('${heroImage}')`;
    else sec.classList.add("no-image");
    const demoTag = preset.demo && preset.demo.tagline;
    const title = t(h.title) || CFG.brand.name;
    const subtitle = t(h.subtitle) || t(CFG.brand.tagline) || t(demoTag) || "";
    sec.innerHTML = `
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
        <div class="hero-cta"></div>
      </div>`;
    const cta = sec.querySelector(".hero-cta");
    const ctaText = t(h.ctaText) || t(preset.ctaText) || ui("call");
    if (ctaText) {
      const call = el("a", "btn btn-accent", icon("phone") + `<span>${escapeHtml(ctaText)}</span>`);
      call.href = telHref(CFG.contact.phone);
      cta.appendChild(call);
    }
    if (CFG.contact.mapQuery || CFG.contact.address) {
      const dir = el("a", "btn btn-outline", icon("navigation") + `<span>${ui("directions")}</span>`);
      dir.href = mapsLink(); dir.target = "_blank"; dir.rel = "noopener";
      cta.appendChild(dir);
    }
    return sec;
  }

  function renderAbout(a) {
    const title = sectionLabel("about", a);
    const text = t(a && a.text) || "";
    const logo = brandAsset("logo", CFG.brand.logo, "logo.png") || preset.icon;
    const inner = `
      <div class="about-grid">
        <div class="about-text"><h2>${escapeHtml(title)}</h2>${text ? `<p>${escapeHtml(text)}</p>` : ""}</div>
        <div class="about-badge">${iconMarkup(logo, preset.icon)}</div>
      </div>`;
    return sectionEl("about", inner);
  }

  function renderServices(s) {
    const items = (s && s.items) || [];
    if (!items.length) return null;
    const title = sectionLabel("services", s);
    const cards = items.map((it) => `
      <div class="service-card reveal">
        <div class="ico">${iconMarkup(it.icon, preset.icon)}</div>
        <h3>${escapeHtml(t(it.name))}</h3>
        ${t(it.desc) ? `<p>${escapeHtml(t(it.desc))}</p>` : ""}
        ${it.price ? `<span class="price">${escapeHtml(it.price)}</span>` : ""}
      </div>`).join("");
    // Bigger cards in a slow auto-scrolling horizontal carousel with arrows
    // (wired up by initCarousels after render).
    const inner = `
      <div class="carousel">
        <button class="car-arrow car-prev" type="button" aria-label="${ui("nav_services")} ◀">${icon("chevronLeft")}</button>
        <div class="car-viewport"><div class="car-track">${cards}</div></div>
        <button class="car-arrow car-next" type="button" aria-label="${ui("nav_services")} ▶">${icon("chevronRight")}</button>
      </div>`;
    return titledSection("services", title, inner);
  }

  function renderProducts(p) {
    const items = (p && p.items) || [];
    if (!items.length) return null;
    const title = sectionLabel("products", p);
    const cards = items.map((it) => {
      const name = escapeHtml(tx(it.name));
      const desc = t(it.desc) ? `<p>${escapeHtml(t(it.desc))}</p>` : "";
      // Brand mode: an item with `url` renders as a simple wordmark "logo" (the
      // brand NAME as text — no third-party logo artwork) that links to the
      // brand's official site. Legal: nominative fair use + a plain link.
      if (it.url) {
        const host = String(it.url).replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./i, "");
        return `<a class="product-card brand-card reveal" href="${escapeHtml(it.url)}" target="_blank" rel="noopener nofollow">
            <div class="brand-media"><span class="brand-wordmark">${name}</span></div>
            ${desc}
            <span class="brand-site">${icon("globe")}${escapeHtml(host)}</span>
          </a>`;
      }
      const img = brandAsset("product", it.image, it.image);
      const media = img
        ? `<img src="${img}" alt="${name}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false"><div class="product-ph" hidden>${icon("box")}</div>`
        : `<div class="product-ph">${icon("box")}</div>`;
      return `<div class="product-card reveal">
          <div class="product-media">${media}</div>
          <h3>${name}</h3>
          ${desc}
          ${it.price ? `<span class="price">${escapeHtml(it.price)}</span>` : ""}
        </div>`;
    }).join("");
    return titledSection("products", title, `<div class="products-grid">${cards}</div>`);
  }

  function renderMenu(m) {
    let categories = (m && m.categories) || null;
    if (!categories) {
      const items = (CFG.services && CFG.services.items) || [];
      if (!items.length) return null;
      categories = [{ name: null, items }];   // fall back to the services list
    }
    const title = sectionLabel("menu", m);
    const blocks = categories.map((cat) => {
      const rows = (cat.items || []).map((it) => `
        <div class="menu-item">
          <div class="menu-item-main">
            <span class="menu-item-name">${escapeHtml(t(it.name))}</span>
            ${it.price ? `<span class="menu-dots"></span><span class="menu-item-price">${escapeHtml(it.price)}</span>` : ""}
          </div>
          ${t(it.desc) ? `<p class="menu-item-desc">${escapeHtml(t(it.desc))}</p>` : ""}
        </div>`).join("");
      return `<div class="menu-category reveal">${cat.name ? `<h3 class="menu-cat-title">${escapeHtml(t(cat.name))}</h3>` : ""}<div class="menu-list">${rows}</div></div>`;
    }).join("");
    return titledSection("menu", title, `<div class="menu-wrap">${blocks}</div>`);
  }

  function renderPlans(p) {
    let items = (p && p.items) || null;
    if (!items) {
      const svc = (CFG.services && CFG.services.items) || [];
      if (!svc.length) return null;
      items = svc.map((it) => ({ name: it.name, price: it.price, features: t(it.desc) ? [it.desc] : [] }));
    }
    const title = sectionLabel("plans", p);
    const cards = items.map((pl) => {
      const feats = (pl.features || []).map((f) => `<li>${icon("check")}<span>${escapeHtml(tx(f))}</span></li>`).join("");
      const ctaText = tx(pl.cta) || t(preset.ctaText) || ui("call");
      return `
        <div class="plan-card reveal${pl.featured ? " featured" : ""}">
          <h3 class="plan-name">${escapeHtml(tx(pl.name))}</h3>
          ${pl.price ? `<div class="plan-price">${escapeHtml(tx(pl.price))}${pl.period ? `<span class="plan-period">/${escapeHtml(tx(pl.period))}</span>` : ""}</div>` : ""}
          ${feats ? `<ul class="plan-features">${feats}</ul>` : ""}
          <a class="btn ${pl.featured ? "btn-accent" : "btn-ghost"} plan-cta" href="${telHref(CFG.contact.phone)}"><span>${escapeHtml(ctaText)}</span></a>
        </div>`;
    }).join("");
    return titledSection("plans", title, `<div class="plans-grid">${cards}</div>`);
  }

  function renderTeam(tm) {
    const members = (tm && tm.members) || [];
    if (!members.length) return null;
    const title = sectionLabel("team", tm);
    const cards = members.map((m, index) => {
      // Sample portrait shown until a real staff-N.jpg is dropped in. It's a
      // proper placeholder headshot (silhouette), NOT a coloured box.
      const SAMPLE = "assets/img/sample-portrait.svg";
      const name = personLabel(m.name);
      const src = brandAsset("team", m.photo, `staff-${index + 1}.jpg`) || SAMPLE;
      // If the real photo is missing, fall back to the sample portrait.
      const photo = `<img class="team-photo" src="${src}" alt="${escapeHtml(name)}" onerror="this.onerror=null; this.src='${SAMPLE}'">`;
      // Card = picture + name + role (owner / employee, etc.) + optional IG link.
      const role = t(m.role);
      const igUrl = m.instagram || (m.social && m.social.instagram) || "";
      const igLink = igUrl
        ? `<a class="team-ig" href="${escapeHtml(igUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${icon("instagram")}</a>`
        : "";
      return `<div class="team-card reveal">${photo}<div class="team-info"><h3>${personNameMarkup(m.name)}</h3>${role ? `<p class="team-role">${escapeHtml(role)}</p>` : ""}${igLink}</div></div>`;
    }).join("");
    return titledSection("team", title, `<div class="team-grid">${cards}</div>`);
  }

  function renderGallery(g) {
    const images = (g && g.images && g.images.length) ? g.images : [1, 2, 3].map((n) => `gallery-${n}.jpg`);
    const title = sectionLabel("gallery", g);
    const items = images.map((src) => {
      const imageSrc = brandAsset("gallery", src, src);
      const inner = imageSrc
        ? `<img src="${imageSrc}" alt="" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false"><span hidden>${icon("image")}</span>`
        : icon("image");
      return `<div class="gallery-item reveal">${inner}</div>`;
    }).join("");
    return titledSection("gallery", title, `<div class="gallery-grid">${items}</div>`);
  }

  function renderPortfolio(pf) {
    const title = sectionLabel("portfolio", pf);
    const items = (pf && pf.items) || null;
    // Before/after mode when items carry before+after images.
    if (items && items.length && items.some((it) => it.before || it.after)) {
      const cards = items.map((it) => {
        const b = brandAsset("gallery", it.before, it.before);
        const a = brandAsset("gallery", it.after, it.after);
        return `<div class="ba-card reveal">
            <div class="ba-pair">
              <figure><img src="${b}" alt="" loading="lazy"><figcaption>${ui("before")}</figcaption></figure>
              <figure><img src="${a}" alt="" loading="lazy"><figcaption>${ui("after")}</figcaption></figure>
            </div>${it.label ? `<p class="ba-label">${escapeHtml(tx(it.label))}</p>` : ""}</div>`;
      }).join("");
      return titledSection("portfolio", title, `<div class="ba-grid">${cards}</div>`);
    }
    // Otherwise a showcase grid (falls back to the gallery images).
    const images = (pf && pf.images)
      || (CFG.gallery && CFG.gallery.images)
      || [1, 2, 3].map((n) => `gallery-${n}.jpg`);
    const tiles = images.map((src) => {
      const s = brandAsset("gallery", src, src);
      return `<div class="portfolio-item reveal"><img src="${s}" alt="" loading="lazy" onerror="this.parentElement.classList.add('empty')"></div>`;
    }).join("");
    return titledSection("portfolio", title, `<div class="portfolio-grid">${tiles}</div>`);
  }

  /* ---------- Google reviews (LIVE, from the cache the CI writes) ------------
     Cards + the overall rating come from assets/data/reviews.json, which the
     scheduled GitHub Action fills from the official Google Business Profile API.
     The browser NEVER calls Google directly and never sees any credentials —
     it only reads a static, public JSON file. No hard-coded or fake reviews:
     on any failure we show a clean message + a link to Google, never invented
     testimonials. */
  const REVIEWS_URL = "assets/data/reviews.json";
  const clampRating = (n) => Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  const ratingAria = (n) => (lang === "en" ? `Rated ${n} out of 5 stars` : `Βαθμολογία ${n} στα 5 αστέρια`);
  function relTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const diff = Math.round((d.getTime() - Date.now()) / 1000);   // seconds (negative = past)
    const table = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    let unit = "minute", value = Math.round(diff / 60);
    for (const [u, s] of table) { if (Math.abs(diff) >= s) { unit = u; value = Math.round(diff / s); break; } }
    try { return new Intl.RelativeTimeFormat(lang || "el", { numeric: "auto" }).format(value, unit); }
    catch (e) { return d.toLocaleDateString(lang || "el"); }
  }
  function reviewCard(r) {
    const rating = clampRating(r.rating);
    const name = escapeHtml(r.author || "");
    const initialsTxt = escapeHtml(initials(r.author) || "★");
    const ph = `<span class="rv-avatar rv-avatar-ph"${r.profilePhotoUrl ? " hidden" : ""}>${initialsTxt}</span>`;
    const img = r.profilePhotoUrl
      ? `<img class="rv-avatar" src="${escapeHtml(r.profilePhotoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.previousElementSibling.hidden=false">`
      : "";
    const hasText = r.comment && String(r.comment).trim();
    const body = hasText
      ? `<p class="rv-text rv-clamp">${escapeHtml(r.comment)}</p><button type="button" class="rv-more" hidden>${escapeHtml(ui("reviews_more"))}</button>`
      : `<p class="rv-text rv-nocomment">${escapeHtml(ui("reviews_no_comment"))}</p>`;
    const date = relTime(r.updateTime || r.createTime);
    return `<article class="review-card">
      <header class="rv-head">
        ${ph}${img}
        <div class="rv-id">
          <span class="rv-name">${name}</span>
          <span class="review-stars" role="img" aria-label="${escapeHtml(ratingAria(rating))}">${stars(rating)}</span>
        </div>
      </header>
      ${body}
      <footer class="rv-foot">
        <span class="rv-src">${icon("google")}<span>${escapeHtml(ui("reviews_attribution"))}</span></span>
        ${date ? `<span class="rv-date">${escapeHtml(date)}</span>` : ""}
      </footer>
    </article>`;
  }
  // Only offer "Περισσότερα" when the text is actually clipped by the clamp.
  function wireReviewExpanders(root) {
    root.querySelectorAll(".rv-clamp").forEach((p) => {
      const btn = p.nextElementSibling;
      if (!btn || !btn.classList.contains("rv-more")) return;
      if (p.scrollHeight - p.clientHeight > 4) {
        btn.hidden = false;
        btn.addEventListener("click", () => {
          const open = p.classList.toggle("rv-open");
          btn.textContent = ui(open ? "reviews_less" : "reviews_more");
        });
      }
    });
  }
  function renderReviewsSummary(avg, count) {
    if (avg == null || isNaN(Number(avg))) return "";
    const r = Number(avg);
    return `<div class="reviews-summary">
        <span class="reviews-score">${escapeHtml(r.toFixed(1))}</span>
        <span class="reviews-stars" role="img" aria-label="${escapeHtml(ratingAria(clampRating(r)))}">${stars(r)}</span>
        ${count != null ? `<span class="reviews-count">${escapeHtml(String(count))} ${ui("reviews_word")}</span>` : ""}
      </div>`;
  }
  // Config review items → the same shape reviewCard() expects for live ones.
  const normalizeItem = (it) => ({
    author: tx(it.author) || "",
    profilePhotoUrl: it.photo ? resolveAsset(it.photo) : "",
    rating: it.rating != null ? it.rating : 5,
    comment: tx(it.quote) || tx(it.comment) || "",
    createTime: it.date || "",
    updateTime: it.date || ""
  });
  function loadGoogleReviews(sec, ts) {
    const summaryBox = sec.querySelector(".reviews-summary-slot");
    const grid = sec.querySelector(".reviews-grid");
    const foot = sec.querySelector(".reviews-foot");
    const cfgUrl = tx(ts && ts.reviewsPageUrl) || "";
    const cfgSummary = ts && ts.summary;
    const staticItems = (ts && Array.isArray(ts.items) ? ts.items : []).map(normalizeItem).slice(0, 6);
    const seeAll = (url) => `<a class="reviews-all" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${icon("google")}<span>${escapeHtml(ui("reviews_see_all"))}</span></a>`;
    const paint = (list, summaryHtml, noteHtml, url) => {
      if (summaryBox) summaryBox.innerHTML = summaryHtml || "";
      grid.setAttribute("aria-busy", "false");
      if (list.length) {
        grid.classList.remove("is-empty");
        grid.innerHTML = list.map(reviewCard).join("");
        wireReviewExpanders(grid);
      } else {
        grid.classList.add("is-empty");
        grid.innerHTML = `<p class="reviews-empty">${escapeHtml(ui("reviews_empty"))}</p>`;
      }
      foot.innerHTML = (noteHtml || "") + seeAll(url);
    };
    // Static fallback (no live API data): real overall rating + any curated
    // cards from config. Never invents reviews.
    const fallbackStatic = (url) => {
      const summaryHtml = cfgSummary ? renderReviewsSummary(cfgSummary.rating, cfgSummary.count) : "";
      paint(staticItems, summaryHtml, "", url);
    };
    const ctrl = ("AbortController" in window) ? new AbortController() : null;
    const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 8000);
    fetch(REVIEWS_URL, { cache: "no-cache", signal: ctrl ? ctrl.signal : undefined })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const url = (data && data.reviewsPageUrl) || cfgUrl || mapsLink();
        const live = (data && Array.isArray(data.reviews) ? data.reviews : [])
          .filter((r) => clampRating(r.rating) >= 4).slice(0, 6);
        // Live API data (if the cache is ever populated) takes priority.
        if (!live.length) return fallbackStatic(url);
        const summaryHtml = renderReviewsSummary(data.averageRating, data.totalReviewCount);
        const note = `<p class="reviews-note">${escapeHtml(ui("reviews_filter_note"))}</p>`;
        paint(live, summaryHtml, note, url);
      })
      .catch(() => fallbackStatic(cfgUrl || mapsLink()))
      .finally(() => clearTimeout(timer));
  }
  function renderTestimonials(ts) {
    ts = ts || {};
    if (ts.enabled === false) return null;
    const title = sectionLabel("testimonials", ts);
    const subtitle = t(ts.subtitle);
    const skeleton = Array.from({ length: 6 }).map(() => `
      <div class="review-card rv-skeleton" aria-hidden="true">
        <div class="rv-head"><span class="sk sk-avatar"></span>
          <div class="rv-id"><span class="sk sk-line sk-name"></span><span class="sk sk-line sk-stars"></span></div></div>
        <span class="sk sk-line"></span><span class="sk sk-line"></span><span class="sk sk-line sk-short"></span>
      </div>`).join("");
    const inner = `
      ${subtitle ? `<p class="reviews-sub">${escapeHtml(subtitle)}</p>` : ""}
      <div class="reviews-summary-slot"></div>
      <div class="reviews-grid" aria-live="polite" aria-busy="true">${skeleton}</div>
      <div class="reviews-foot"></div>`;
    const sec = titledSection("testimonials", title, inner);
    loadGoogleReviews(sec, ts);
    return sec;
  }

  function renderBooking(bk) {
    const title = sectionLabel("booking", bk);
    const text = t(bk && bk.text) || t(CFG.brand.tagline) || "";
    const sec = sectionEl("booking", `
      <div class="booking-band">
        <div class="booking-copy"><h2>${escapeHtml(title)}</h2>${text ? `<p>${escapeHtml(text)}</p>` : ""}</div>
        <div class="booking-actions"></div>
      </div>`, "booking-section");
    const actions = sec.querySelector(".booking-actions");
    const call = el("a", "btn btn-accent", icon("phone") + `<span>${t(bk && bk.ctaText) || t(preset.ctaText) || ui("call")}</span>`);
    call.href = telHref(CFG.contact.phone);
    actions.appendChild(call);
    if (CFG.contact.whatsapp) {
      const wa = el("a", "btn btn-ghost", icon("whatsapp") + `<span>${ui("whatsapp")}</span>`);
      wa.href = "https://wa.me/" + CFG.contact.whatsapp.replace(/[^\d]/g, "");
      wa.target = "_blank"; wa.rel = "noopener"; actions.appendChild(wa);
    }
    return sec;
  }

  function renderContact(c) {
    c = c || {};
    const sec = el("section", "section");
    sec.id = "contact";
    sec.innerHTML = `<div class="container contact-grid">
      <div class="contact-info">
        <h2>${escapeHtml(ui("findus"))}</h2>
        <ul class="contact-list"></ul>
        <div class="hours" id="hoursBlock"></div>
        <div class="contact-btns"></div>
      </div>
      <div class="contact-map"><iframe title="map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>`;
    const list = sec.querySelector(".contact-list");
    const row = (ic, label, value, href) => {
      const li = el("li");
      const v = href ? `<a class="cv" href="${href}">${escapeHtml(value)}</a>` : `<span class="cv">${escapeHtml(value)}</span>`;
      li.innerHTML = `<span class="ci">${ic}</span><span><span class="cl">${escapeHtml(label)}</span><br>${v}</span>`;
      list.appendChild(li);
    };
    if (c.phone)   row(icon("phone"), ui("phone"),   c.phone, telHref(c.phone));
    if (c.email)   row(icon("mail"),  ui("email"),   c.email, "mailto:" + c.email);
    if (c.address) row(icon("pin"),   ui("address"), c.address, mapsLink());

    const hb = sec.querySelector("#hoursBlock");
    if (CFG.hours && CFG.hours.enabled !== false && CFG.hours.days) {
      hb.innerHTML = `<h3>${icon("clock")} ${ui("hours")}</h3>` +
        CFG.hours.days.map((d) => `<div class="row"><span class="d">${escapeHtml(d[lang] || d.el)}</span><span>${escapeHtml(d.open)}</span></div>`).join("");
    } else hb.remove();

    const btns = sec.querySelector(".contact-btns");
    const call = el("a", "btn btn-accent", icon("phone") + `<span>${ui("call")}</span>`);
    call.href = telHref(c.phone); btns.appendChild(call);
    if (c.whatsapp) {
      const wa = el("a", "btn btn-ghost", icon("whatsapp") + `<span>${ui("whatsapp")}</span>`);
      wa.href = "https://wa.me/" + c.whatsapp.replace(/[^\d]/g, "");
      wa.target = "_blank"; wa.rel = "noopener"; btns.appendChild(wa);
    }
    const q = encodeURIComponent(c.mapQuery || c.address || "Greece");
    sec.querySelector("iframe").src = "https://www.google.com/maps?q=" + q + "&output=embed";
    return sec;
  }

  // Inject a widget's embed snippet and re-run any <script> it carries — nodes
  // added via innerHTML don't execute their scripts, so we recreate them.
  function injectEmbed(holder, html) {
    if (!holder) return;
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    Array.from(tpl.content.childNodes).forEach((node) => {
      if (node.tagName === "SCRIPT") {
        const s = document.createElement("script");
        Array.from(node.attributes).forEach((a) => s.setAttribute(a.name, a.value));
        s.textContent = node.textContent;
        holder.appendChild(s);
      } else {
        holder.appendChild(node.cloneNode(true));
      }
    });
    // Official Instagram post embeds need a manual re-process once the lib is in.
    if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
  }

  // Load Instagram's official embed library once, then (re)render any
  // blockquote.instagram-media on the page into real post cards.
  function processInstagramPosts() {
    const run = () => { if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process(); };
    if (document.getElementById("ig-embed-js")) { run(); return; }
    const s = document.createElement("script");
    s.id = "ig-embed-js"; s.async = true; s.src = "https://www.instagram.com/embed.js";
    s.onload = run;
    document.body.appendChild(s);
  }

  // AUTOMATED FEED: fetch a CORS-enabled JSON feed — from YOUR OWN backend that
  // uses the official Instagram Graph API (NOT a scraper) — and render the latest
  // posts as a grid. Runs on every load, so it always shows current posts with
  // zero admin work. On any failure it silently falls back to the Follow card.
  function loadInstagramFeed(holder, feedUrl, profileUrl, at, limit) {
    if (!holder || typeof fetch !== "function") return;
    const fallback = () => {
      holder.className = "ig-card-wrap";
      holder.innerHTML = profileUrl
        ? `<a class="ig-card" href="${profileUrl}" target="_blank" rel="noopener">${icon("instagram")}${at ? `<span>${escapeHtml(at)}</span>` : ""}</a>`
        : "";
    };
    fetch(feedUrl, { mode: "cors" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const items = ((data && data.items) || []).slice(0, limit || 12);
        if (!items.length) return fallback();
        holder.innerHTML = items.map((it) => {
          const img = it.image || it.banner_image || (it.attachments && it.attachments[0] && it.attachments[0].url) || "";
          const link = it.url || it.external_url || profileUrl || "";
          const cap = escapeHtml(String(it.title || it.summary || "").slice(0, 160));
          if (!img) return "";
          return `<a class="ig-tile" href="${link}" target="_blank" rel="noopener" title="${cap}">` +
                 `<img src="${img}" alt="${cap}" loading="lazy" onerror="this.closest('.ig-tile').remove()"></a>`;
        }).join("") || (fallback(), "");
      })
      .catch(fallback);
  }

  function renderInstagram(ig) {
    ig = ig || {};
    const handle = String(ig.handle || "").replace(/^@/, "");
    const url = ig.url || (handle ? `https://www.instagram.com/${handle}/` : "");
    const posts = Array.isArray(ig.posts) ? ig.posts.map((p) => (typeof p === "string" ? p : (p && p.url) || "")).filter(Boolean) : [];
    const feedUrl = ig.feedUrl || "";
    if (!url && !ig.embedHtml && !posts.length && !feedUrl) return null;   // nothing to show
    const title = sectionLabel("instagram", ig);
    const at = handle ? "@" + handle : "";
    const sub = t(ig.subtitle);   // no default — only shown if explicitly set
    const followText = t(ig.ctaText) || ui("ig_follow");
    const follow = url
      ? `<a class="btn btn-accent ig-follow" href="${url}" target="_blank" rel="noopener noreferrer">${icon("instagram")}<span>${escapeHtml(followText)}</span></a>`
      : "";
    // Feed priority: widget snippet (auto grid) → auto JSON feed (scraper proxy,
    // renders on load) → official post embeds (posts you list) → a CTA card. The
    // feed shows a loading state first. Stories are never embeddable via any of these.
    let feed;
    if (ig.embedHtml) {
      feed = `<div class="ig-embed"></div>`;
    } else if (feedUrl) {
      feed = `<div class="ig-feed" aria-live="polite"><div class="ig-loading">${icon("instagram")}<span>…</span></div></div>`;
    } else if (posts.length) {
      const cards = posts.map((permalink) => {
        const sep = permalink.includes("?") ? "&amp;" : "?";
        const link = `${escapeHtml(permalink)}${sep}utm_source=ig_embed&amp;utm_campaign=loading`;
        return `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${link}" data-instgrm-version="14"></blockquote>`;
      }).join("");
      feed = `<div class="ig-posts">${cards}</div>`;
    } else {
      feed = url ? `<a class="ig-card" href="${url}" target="_blank" rel="noopener">${icon("instagram")}${at ? `<span>${escapeHtml(at)}</span>` : ""}</a>` : "";
    }
    const head = (at || sub)
      ? `<div class="ig-head">${at ? `<p class="ig-handle">${escapeHtml(at)}</p>` : ""}${sub ? `<p class="ig-sub">${escapeHtml(sub)}</p>` : ""}</div>`
      : "";
    const inner = `
      ${head}
      ${feed}
      ${follow ? `<div class="ig-cta">${follow}</div>` : ""}`;
    const sec = titledSection("instagram", title, inner, "instagram-section");
    if (ig.embedHtml) injectEmbed(sec.querySelector(".ig-embed"), ig.embedHtml);
    else if (feedUrl) loadInstagramFeed(sec.querySelector(".ig-feed"), feedUrl, url, at, ig.limit);
    else if (posts.length) processInstagramPosts();
    return sec;
  }

  // Shared price-list body: dotted-leader rows; a nested `items` becomes a group
  // heading with indented sub-rows (e.g. the SPA package). Used by the standalone
  // price section AND the compact bottom location block.
  function priceRowsMarkup(pl) {
    const items = (pl && pl.items) || [];
    const priceCell = (v) => (v ? `<span class="pl-dots"></span><span class="pl-price">${escapeHtml(tx(v))}</span>` : "");
    const line = (it, cls) => `<div class="pl-row${cls ? " " + cls : ""}"><span class="pl-name">${escapeHtml(tx(it.name))}</span>${priceCell(it.price)}</div>`;
    return items.map((it) => {
      if (it.items && it.items.length) {
        const note = it.note ? `<div class="pl-note">${escapeHtml(tx(it.note))}</div>` : "";
        return `<div class="pl-group"><div class="pl-row pl-grouphead"><span class="pl-name">${escapeHtml(tx(it.name))}</span>${priceCell(it.price)}</div>` +
          it.items.map((s) => line(s, "pl-sub")).join("") + note + `</div>`;
      }
      return line(it);
    }).join("");
  }

  // Price list (ΤΙΜΟΚΑΤΑΛΟΓΟΣ): brand logo on the left, priced list on the right.
  // NOTE: for this client it's rendered INSIDE the bottom location block instead
  // of as its own section (see renderLocationInfo), so it's off the layout.
  function renderPriceList(pl) {
    const items = (pl && pl.items) || [];
    if (!items.length) return null;
    const title = sectionLabel("priceList", pl);
    const logo = brandAsset("logo", (pl && pl.logo) || CFG.brand.logo, "logo.png") || preset.icon;
    const inner = `
      <div class="pl-wrap">
        <div class="pl-logo">${iconMarkup(logo, preset.icon)}</div>
        <div class="pl-list">${priceRowsMarkup(pl)}</div>
      </div>`;
    return titledSection("priceList", title, inner, "priceList-section");
  }

  // Compact bottom "location" block: contact + hours (left) · map (center) ·
  // price list (right). Lives directly above the footer. Merges what used to be
  // the standalone contact and price-list sections into one tidy strip.
  function renderLocationInfo() {
    const c = CFG.contact || {};
    const rows = [];
    if (c.phone) {
      rows.push(`<li><span class="ci">${icon("phone")}</span><span><span class="cl">${ui("phone")}</span><br>` +
        `<a class="cv" href="${telHref(c.phone)}">${escapeHtml(c.phone)}</a></span></li>`);
    }
    if (c.email) {
      rows.push(`<li><span class="ci">${icon("mail")}</span><span><span class="cl">${ui("email")}</span><br>` +
        `<a class="cv" href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></span></li>`);
    }
    if (c.address) {
      rows.push(`<li><span class="ci">${icon("pin")}</span><span><span class="cl">${ui("address")}</span><br>` +
        `<a class="cv" href="${mapsLink()}" target="_blank" rel="noopener">${escapeHtml(c.address)}</a></span></li>`);
    }
    const contactList = rows.length ? `<ul class="contact-list loc-list">${rows.join("")}</ul>` : "";

    let hoursBlock = "";
    if (CFG.hours && CFG.hours.enabled !== false && CFG.hours.days) {
      hoursBlock = `<div class="hours loc-hours"><h3>${icon("clock")} ${ui("hours")}</h3>` +
        CFG.hours.days.map((d) => `<div class="row"><span class="d">${escapeHtml(d[lang] || d.el)}</span><span>${escapeHtml(d.open)}</span></div>`).join("") +
        `</div>`;
    }

    const q = encodeURIComponent(c.mapQuery || c.address || "Greece");
    const mapBlock = `<div class="loc-col loc-map"><iframe title="map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${q}&output=embed"></iframe></div>`;

    const pl = CFG.priceList || {};
    const priceBlock = (pl.items && pl.items.length)
      ? `<div class="loc-col loc-prices"><h3 class="loc-prices-title">${escapeHtml(sectionLabel("priceList", pl))}</h3>` +
        `<div class="pl-list">${priceRowsMarkup(pl)}</div></div>`
      : "";

    const inner = `<div class="container">
      <h2 class="section-title loc-title">${escapeHtml(ui("findus"))}</h2>
      <div class="loc-grid">
        <div class="loc-col loc-contact">${contactList}${hoursBlock}</div>
        ${mapBlock}
        ${priceBlock}
      </div>
    </div>`;
    const sec = el("section", "section location-section", inner);
    sec.id = "locationInfo";
    return sec;
  }

  /* ---------- registry: section type -> (config key, renderer) ---------- */
  const SECTION_CONFIG_KEY = {
    hero: "hero", about: "about", services: "services", products: "products", menu: "menu", plans: "plans",
    portfolio: "portfolio", team: "team", gallery: "gallery",
    testimonials: "testimonials", booking: "booking", instagram: "instagram", priceList: "priceList", contact: "contact"
  };
  const SECTION_RENDERERS = {
    hero: renderHero, about: renderAbout, services: renderServices, products: renderProducts, menu: renderMenu,
    plans: renderPlans, portfolio: renderPortfolio, team: renderTeam, gallery: renderGallery,
    testimonials: renderTestimonials, booking: renderBooking, instagram: renderInstagram, priceList: renderPriceList, contact: renderContact,
    locationInfo: renderLocationInfo
  };

  /* ---------- build all sections from the blueprint ---------- */
  function renderSections() {
    const app = $("app");
    app.innerHTML = "";
    const rendered = [];
    layout().forEach((entry) => {
      const type = typeof entry === "string" ? entry : entry.section;
      const renderer = SECTION_RENDERERS[type];
      if (!renderer) return;
      const key = SECTION_CONFIG_KEY[type];
      const cfgSection = key ? CFG[key] : null;
      if (cfgSection && cfgSection.enabled === false) return;   // client hid it
      // Data = the client's config block if present, else the type's built-in
      // demo content. This is why changing ONLY businessType yields a full site.
      const data = cfgSection || (preset.demo && preset.demo[type]) || null;
      const node = renderer(data, type);
      if (!node) return;                                        // nothing to show
      app.appendChild(node);
      rendered.push(type);
    });
    // Alternate background on standard content sections for visual rhythm
    // (hero has its own treatment; the booking band is always accent).
    let alt = false;
    Array.from(app.children).forEach((node) => {
      if (!node.classList.contains("section") || node.classList.contains("booking-section")) return;
      if (alt) node.classList.add("section-alt");
      alt = !alt;
    });
    return rendered;
  }

  /* ---------- header / nav / footer chrome ---------- */
  function renderHeader(rendered) {
    $("brand").innerHTML = brandMarkup();

    const nav = $("nav");
    const burger = $("burger");
    // showNav:false (config) strips the whole navigation — links + hamburger —
    // for a short one-scroll ad site. Otherwise build it from rendered sections.
    if (CFG.showNav === false) {
      if (nav) nav.remove();
      if (burger) burger.remove();
    } else if (nav) {
      nav.innerHTML = "";
      rendered.forEach((type) => {
        const key = NAV_SECTIONS[type];
        if (!key) return;
        const a = el("a", "", ui(key));
        a.setAttribute("href", "#" + type);
        nav.appendChild(a);
      });
      if (burger) burger.onclick = () => nav.classList.toggle("open");
      nav.onclick = (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); };
    }

    const ls = $("langSwitch");
    if (CFG.showSwitcher) {
      ls.innerHTML = "";
      ["el", "en"].forEach((L) => {
        const b = el("button", L === lang ? "active" : "", L.toUpperCase());
        b.onclick = () => setLang(L);
        ls.appendChild(b);
      });
    } else if (ls) ls.remove();

    $("navCall").href = telHref(CFG.contact.phone);
    $("navCall").innerHTML = icon("phone");
    $("fab").href = telHref(CFG.contact.phone);
    $("fab").innerHTML = icon("phone");
  }

  function renderFooter() {
    $("footerBrand").innerHTML = brandMarkup();
    const social = $("social");
    social.innerHTML = "";
    const SOCIAL_ICON = { facebook: "facebook", instagram: "instagram", tiktok: "tiktok", website: "globe" };
    Object.keys(CFG.social || {}).forEach((k) => {
      const url = CFG.social[k];
      if (!url) return;
      const a = el("a", "", icon(SOCIAL_ICON[k] || "globe"));
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.title = k;
      social.appendChild(a);
    });
    const year = new Date().getFullYear();
    $("copyright").textContent = `© ${year} ${CFG.brand.name}. ${ui("rights")}`;

    // Maker credit: "Made with ❤ and ☕ by <name → GitHub>".
    const credit = $("credit");
    if (credit) {
      credit.innerHTML =
        `${ui("made_with")} <span class="credit-heart">${icon("heart")}</span> ${ui("and_coffee")} ${ui("credit_by")} ` +
        `<a href="https://raexp917.github.io/" target="_blank" rel="noopener">Klearxos Xlioumphs</a>`;
    }
  }

  /* ---------- scroll reveal (replays every time an element enters view) ---------- */
  let revealIO = null;
  function initReveal() {
    if (revealIO) revealIO.disconnect();
    // Toggle `.in` on BOTH enter and leave, so scrolling back up hides the
    // cards and re-reveals them (no unobserve → it re-triggers every pass).
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { e.target.classList.toggle("in", e.isIntersecting); });
    }, { threshold: 0.12 });
    // Stagger the cards inside each grid so they pop in one-by-one on scroll
    // (staff, services, gallery, plans, reviews, menu, portfolio…).
    const GRIDS = ".services-grid,.car-track,.products-grid,.team-grid,.gallery-grid,.plans-grid,.reviews-grid,.portfolio-grid,.ba-grid,.menu-wrap";
    document.querySelectorAll("#app " + GRIDS).forEach((grid) => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.setProperty("--reveal-delay", (i * 120) + "ms");   // slower stagger
      });
    });
    document.querySelectorAll(".reveal").forEach((n) => revealIO.observe(n));
    document.querySelectorAll("#app .section").forEach((s) => { s.classList.add("reveal"); revealIO.observe(s); });
  }

  /* ---------- carousels (slow auto-scroll + arrow navigation) ---------- */
  let carousels = [];   // {raf} handles, cancelled on every re-render
  function stopCarousels() {
    carousels.forEach((c) => cancelAnimationFrame(c.raf));
    carousels = [];
  }
  function initCarousels() {
    stopCarousels();
    document.querySelectorAll("#app .carousel").forEach((car) => {
      const vp = car.querySelector(".car-viewport");
      const track = car.querySelector(".car-track");
      const prev = car.querySelector(".car-prev");
      const next = car.querySelector(".car-next");
      if (!vp || !track) return;
      const cardStep = () => {
        const first = track.children[0];
        return first ? first.getBoundingClientRect().width + 22 : 300;
      };
      // Only loop when the cards actually overflow the viewport.
      const willLoop = track.scrollWidth - vp.clientWidth > 4;
      if (willLoop) {
        // Cards in the loop are always visible (not individually reveal-animated),
        // then the whole set is duplicated once so the wrap-around is seamless.
        Array.from(track.children).forEach((n) => { n.classList.remove("reveal", "in"); n.style.opacity = "1"; n.style.transform = "none"; });
        Array.from(track.children).forEach((n) => { const c = n.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c); });
      }
      if (prev) prev.style.display = willLoop ? "" : "none";
      if (next) next.style.display = willLoop ? "" : "none";

      // hover pauses; any manual nav (arrows/touch/wheel) pauses for 5s then
      // auto-scroll resumes on its own.
      const handle = { raf: 0, hover: false, resumeAt: 0, pos: 0 };   // pos = float scroll accumulator
      const nudge = () => { handle.resumeAt = Date.now() + 5000; };
      const half = () => track.scrollWidth / 2;   // width of one set (after cloning)
      car.addEventListener("mouseenter", () => { handle.hover = true; });
      car.addEventListener("mouseleave", () => { handle.hover = false; });
      vp.addEventListener("touchstart", nudge, { passive: true });
      vp.addEventListener("wheel", nudge, { passive: true });
      if (prev) prev.addEventListener("click", () => { if (vp.scrollLeft - cardStep() < 0) vp.scrollLeft += half(); vp.scrollBy({ left: -cardStep(), behavior: "smooth" }); nudge(); });
      if (next) next.addEventListener("click", () => { vp.scrollBy({ left: cardStep(), behavior: "smooth" }); nudge(); });

      // Continuous one-way loop, slow. We keep a FLOAT accumulator (handle.pos)
      // and write it to scrollLeft — browsers round scrollLeft to whole pixels,
      // so a raw `scrollLeft += 0.25` truncates to 0 every frame and never moves.
      const SPEED = 0.25;   // px/frame (~15px/s) — lower = slower
      const step = () => {
        if (willLoop) {
          const h = half();
          if (!handle.hover && Date.now() >= handle.resumeAt) {
            handle.pos += SPEED;                 // advance precisely
            if (handle.pos >= h) handle.pos -= h;
            vp.scrollLeft = handle.pos;           // browser may round the render; pos stays exact
          } else {
            handle.pos = vp.scrollLeft;           // paused: follow manual scrolling, don't fight it
            if (handle.pos >= h) { handle.pos -= h; vp.scrollLeft = handle.pos; }
          }
        }
        handle.raf = requestAnimationFrame(step);
      };
      handle.raf = requestAnimationFrame(step);
      carousels.push(handle);
    });
  }

  /* ---------- lightbox: let visitors click a picture to view it large ---------- */
  function initLightbox() {
    let ov = document.getElementById("lightbox");
    if (!ov) {
      ov = el("div", "lightbox");
      ov.id = "lightbox";
      ov.innerHTML = `<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img alt="">`;
      document.body.appendChild(ov);
      const close = () => ov.classList.remove("open");
      ov.addEventListener("click", (e) => { if (e.target === ov || e.target.classList.contains("lightbox-close")) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }
    const big = ov.querySelector("img");
    // Any real picture (gallery, portfolio, products, staff portrait) is clickable.
    document.querySelectorAll("#app #gallery img, #app #portfolio img, #app #products img, #app #team img").forEach((im) => {
      im.classList.add("pic-zoom");
      im.addEventListener("click", () => { big.src = im.currentSrc || im.src; ov.classList.add("open"); });
    });
  }

  /* ---------- language switch ---------- */
  function setLang(L) {
    lang = L;
    localStorage.setItem("lang", L);
    document.documentElement.lang = L;
    renderAll();
  }

  /* ---------- master render ---------- */
  function renderAll() {
    applyTheme();
    document.title = CFG.brand.name + " — " + (t(CFG.brand.tagline) || t(preset.demo && preset.demo.tagline) || CFG.businessType);
    const rendered = renderSections();
    renderHeader(rendered);
    renderFooter();
    initReveal();
    initCarousels();
    initLightbox();
  }

  function mergeConfig(base, override) {
    if (Array.isArray(override)) return override.slice();
    if (!override || typeof override !== "object") return override;
    const result = { ...(base && typeof base === "object" ? base : {}) };
    Object.keys(override).forEach((key) => {
      result[key] = override[key] && typeof override[key] === "object" && !Array.isArray(override[key])
        ? mergeConfig(result[key], override[key])
        : override[key];
    });
    return result;
  }

  function listenForPreviewChanges() {
    if (window.parent === window) return;
    window.addEventListener("message", (event) => {
      if (event.source !== window.parent || !event.data || event.data.type !== "site-preview-config") return;
      CFG = mergeConfig(SITE_CONFIG, event.data.config || {});
      preset = BUSINESS_PRESETS[CFG.businessType] || BUSINESS_PRESETS.generic;
      lang = CFG.defaultLang || lang;
      document.documentElement.lang = lang;
      renderAll();
      setFavicon();
      window.parent.postMessage({ type: "site-preview-updated" }, "*");
    });
    window.parent.postMessage({ type: "site-preview-ready" }, "*");
  }

  /* ---------- boot ---------- */
  document.documentElement.lang = lang;
  applyTheme();
  setFavicon();
  renderAll();
  listenForPreviewChanges();
})();
