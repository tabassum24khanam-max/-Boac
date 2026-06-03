/* =================================================================
   BOAC Café — script.js  ·  vanilla, no dependencies
   ================================================================= */
(function () {
  "use strict";

  /* ---- Image fallback (declared first so inline onerror can use it) ---- */
  window.__fb = function (img, label) {
    if (!img || img.dataset.fb) return;
    img.dataset.fb = "1";
    var d = document.createElement("div");
    d.className = "img-fallback";
    d.textContent = label || "BOAC";
    if (img.parentNode) img.parentNode.replaceChild(d, img);
  };

  /* ---- IntersectionObserver declared up front; observe() used everywhere ---- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = ("IntersectionObserver" in window) && !reduce
    ? new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  function observe(node) { if (io) io.observe(node); else node && node.classList.add("in"); }
  function revealAll(scope) { (scope || document).querySelectorAll(".reveal:not(.in)").forEach(observe); }

  /* ===================== DATA ===================== */
  var MENU = [
    { name: "Espresso",          price: 13, cat: "coffee", img: "assets/menu/espresso.jpg",     note: "A clean, balanced double shot — the heart of the house." },
    { name: "Flat White",        price: 17, cat: "coffee", img: "assets/menu/flatwhite.jpg",     note: "Velvety micro-foam over a rich ristretto base." },
    { name: "V60 Single Origin", price: 24, cat: "coffee", img: "assets/menu/v60.jpg",           note: "A rotating Guji single-origin, brewed by hand." },
    { name: "Drip of the Day",   price: 16, cat: "coffee", img: "assets/ig/post_3_DT86L3JiJGe.jpg", note: "Our cup to-go — filter coffee, fresh all day.", real: true },
    { name: "Iced Spanish Latte",price: 21, cat: "cold",   img: "assets/menu/spanish_latte.jpg", note: "Espresso, milk & a touch of sweet — over ice." },
    { name: "Cold Brew",         price: 20, cat: "cold",   img: "assets/menu/cold_brew.jpg",     note: "Slow-steeped 18 hours, mellow and low-acidity." },
    { name: "Matcha Latte",      price: 23, cat: "cold",   img: "assets/menu/matcha.jpg",        note: "Ceremonial-grade matcha over cold milk." },
    { name: "Saffron Cake",      price: 26, cat: "sweets", img: "assets/ig/post_2_DYEwQUNMAC3.jpg", note: "كيكة الزعفران — our signature, drenched in saffron cream.", tag: "Signature", real: true },
    { name: "Blueberry Cheesecake", price: 25, cat: "sweets", img: "assets/menu/cheesecake.jpg", note: "Creamy centre, buttery base, wild-blueberry top." },
    { name: "Butter Croissant",  price: 14, cat: "sweets", img: "assets/menu/croissant.jpg",     note: "Laminated, flaky and baked through the day." },
    { name: "House Beans · 250g",price: 65, cat: "beans",  img: "assets/ig/post_0_DYK9u9Boykk.jpg", note: "Take BOAC home — Guji & rotating single origins.", real: true }
  ];

  // Real @boac.sa posts (newest/most-liked first). shortcode -> instagram.com/p/<code>
  var POSTS = [
    { code: "CvsoQuto3F9", img: "assets/ig/post_5_CvsoQuto3F9.jpg", likes: 92, cap: "Inside BOAC — cream arches & the sun logo", vid: false },
    { code: "CvsoO_Xojqy", img: "assets/ig/post_6_CvsoO_Xojqy.jpg", likes: 63, cap: "Rattan light & arched alcoves", vid: false },
    { code: "Cuv2LPgIz2a", img: "assets/ig/post_7_Cuv2LPgIz2a.jpg", likes: 59, cap: "Slow mornings & olive branches", vid: false },
    { code: "Cukjvc3LBDN", img: "assets/ig/post_8_Cukjvc3LBDN.jpg", likes: 55, cap: "Terracotta jars in plaster niches", vid: false },
    { code: "DO7Rxn2iCNt", img: "assets/ig/post_4_DO7Rxn2iCNt.jpg", likes: 17, cap: "Saudi National Day · all drinks 9.95", vid: false },
    { code: "DT86L3JiJGe", img: "assets/ig/post_3_DT86L3JiJGe.jpg", likes: 11, cap: "A BOAC cup by the window", vid: false },
    { code: "DYEwQUNMAC3", img: "assets/ig/post_2_DYEwQUNMAC3.jpg", likes: 10, cap: "كيكة الزعفران · saffron cake", vid: true },
    { code: "DYK9u9Boykk", img: "assets/ig/post_0_DYK9u9Boykk.jpg", likes: 6,  cap: "Our beans, illustrated", vid: true },
    { code: "DYHywntoHuX", img: "assets/ig/post_1_DYHywntoHuX.jpg", likes: 5,  cap: "قهوة BOAC · شرق الرياض", vid: true }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ===================== RENDER MENU ===================== */
  var menuGrid = document.getElementById("menuGrid");
  if (menuGrid) {
    menuGrid.innerHTML = MENU.map(function (m) {
      return '<article class="dish reveal" data-cat="' + m.cat + '">' +
        '<div class="dish-imgwrap">' +
          (m.tag ? '<span class="dish-tag">' + esc(m.tag) + "</span>" : "") +
          '<img src="' + m.img + '" alt="' + esc(m.name) + '" loading="lazy" decoding="async" onerror="window.__fb&&window.__fb(this,\'' + esc(m.name.charAt(0)) + '\')">' +
        "</div>" +
        '<div class="dish-body"><div class="dish-top"><h3>' + esc(m.name) + "</h3>" +
        '<span class="dish-price">' + m.price + " <small>SAR</small></span></div>" +
        "<p>" + esc(m.note) + "</p></div></article>";
    }).join("");
    revealAll(menuGrid);
  }

  /* Menu filter + "View more" (show 4, then expand) */
  var MENU_LIMIT = 4;
  var currentFilter = "all";
  var menuExpanded = false;
  var menuMore = document.getElementById("menuMore");

  function applyMenu() {
    var dishes = Array.prototype.slice.call(document.querySelectorAll("#menuGrid .dish"));
    var matching = 0, shown = 0;
    dishes.forEach(function (d) {
      var match = currentFilter === "all" || d.dataset.cat === currentFilter;
      if (match && (menuExpanded || shown < MENU_LIMIT)) {
        d.classList.remove("hide"); d.classList.add("in"); shown++; matching++;
      } else {
        d.classList.add("hide");
        if (match) matching++;
      }
    });
    if (menuMore) {
      if (matching > MENU_LIMIT) {
        menuMore.hidden = false;
        menuMore.textContent = menuExpanded ? "View less" : "View more (" + (matching - MENU_LIMIT) + ")";
      } else { menuMore.hidden = true; }
    }
  }

  var pills = document.querySelectorAll(".menu-tabs .pill");
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      currentFilter = p.dataset.filter;
      menuExpanded = false;
      pills.forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
      p.classList.add("is-active"); p.setAttribute("aria-selected", "true");
      applyMenu();
    });
  });
  if (menuMore) menuMore.addEventListener("click", function () {
    menuExpanded = !menuExpanded;
    applyMenu();
    if (!menuExpanded) { var m = document.getElementById("menu"); if (m) m.scrollIntoView({ behavior: "smooth" }); }
  });
  applyMenu();

  /* ===================== RENDER FEED ===================== */
  var feedGrid = document.getElementById("feedGrid");
  if (feedGrid) {
    feedGrid.innerHTML = POSTS.map(function (p) {
      return '<a class="post reveal" href="https://www.instagram.com/p/' + p.code + '/" target="_blank" rel="noopener" aria-label="View this post on Instagram">' +
        '<img src="' + p.img + '" alt="' + esc(p.cap) + '" loading="lazy" decoding="async" onerror="window.__fb&&window.__fb(this,\'BOAC\')">' +
        (p.vid ? '<span class="post-vid" aria-hidden="true">&#9658;</span>' : "") +
        '<span class="post-ov"><span class="post-likes">&#9829; ' + p.likes + "</span>" +
        '<span class="post-cap">' + esc(p.cap) + "</span></span></a>";
    }).join("");
    revealAll(feedGrid);
  }

  /* Feed "View more" (show 4, then expand) */
  var FEED_LIMIT = 4;
  var feedExpanded = false;
  var feedMore = document.getElementById("feedMore");
  function applyFeed() {
    var posts = Array.prototype.slice.call(document.querySelectorAll("#feedGrid .post"));
    posts.forEach(function (p, i) {
      var show = feedExpanded || i < FEED_LIMIT;
      p.classList.toggle("hide", !show);
      if (show) p.classList.add("in");
    });
    if (feedMore) {
      if (posts.length > FEED_LIMIT) {
        feedMore.hidden = false;
        feedMore.textContent = feedExpanded ? "View less" : "View more (" + (posts.length - FEED_LIMIT) + ")";
      } else { feedMore.hidden = true; }
    }
  }
  if (feedMore) feedMore.addEventListener("click", function () {
    feedExpanded = !feedExpanded;
    applyFeed();
    if (!feedExpanded) { var f = document.getElementById("feed"); if (f) f.scrollIntoView({ behavior: "smooth" }); }
  });
  applyFeed();

  /* reveal everything already in markup */
  revealAll(document);

  /* ===================== NAV: scroll state + scrollspy ===================== */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  var toTop = document.getElementById("toTop");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });

  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle("scrolled", y > 12);
    if (toTop) { toTop.hidden = false; toTop.classList.toggle("show", y > 600); }
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    // scrollspy
    var mid = y + window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("active", i === cur); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ===================== THEME TOGGLE ===================== */
  var meta = document.getElementById("metaTheme");
  var themeBtn = document.getElementById("themeToggle");
  function applyTheme(night) {
    document.body.classList.toggle("night", night);
    if (meta) meta.setAttribute("content", night ? "#1c241e" : "#e9dcc6");
  }
  var saved;
  try { saved = localStorage.getItem("boac-theme"); } catch (e) {}
  applyTheme(saved === "night");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var night = !document.body.classList.contains("night");
    applyTheme(night);
    try { localStorage.setItem("boac-theme", night ? "night" : "day"); } catch (e) {}
  });

  /* ===================== MOBILE MENU ===================== */
  var burger = document.getElementById("burger");
  var mMenu = document.getElementById("mobileMenu");
  function closeMenu() {
    if (!mMenu) return;
    mMenu.classList.remove("show");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    setTimeout(function () { if (!mMenu.classList.contains("show")) mMenu.hidden = true; }, 300);
  }
  function openMenu() {
    mMenu.hidden = false;
    requestAnimationFrame(function () { mMenu.classList.add("show"); });
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }
  if (burger && mMenu) {
    burger.addEventListener("click", function () {
      mMenu.classList.contains("show") ? closeMenu() : openMenu();
    });
    mMenu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  }

  /* ===================== RESERVE MODAL ===================== */
  var modal = document.getElementById("reserveModal");
  var form = document.getElementById("reserveForm");
  var formOk = document.getElementById("formOk");
  var lastFocus = null;
  var WHATSAPP = "966500000000"; // TODO: replace with BOAC's real WhatsApp number

  function openModal() {
    lastFocus = document.activeElement;
    closeMenu();
    modal.hidden = false;
    document.body.classList.add("menu-open");
    var f = modal.querySelector("input");
    if (f) setTimeout(function () { f.focus(); }, 50);
    document.addEventListener("keydown", escClose);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("menu-open");
    document.removeEventListener("keydown", escClose);
    if (lastFocus) lastFocus.focus();
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }

  document.querySelectorAll("[data-reserve]").forEach(function (b) {
    b.addEventListener("click", openModal);
  });
  if (modal) modal.querySelectorAll("[data-close]").forEach(function (b) {
    b.addEventListener("click", closeModal);
  });

  /* form validation + WhatsApp handoff */
  function setErr(name, msg) {
    var input = form.elements[name];
    var e = form.querySelector('.err[data-for="' + name + '"]');
    if (input) input.classList.toggle("invalid", !!msg);
    if (e) e.textContent = msg || "";
  }
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var date = form.elements.date.value;
      var party = form.elements.party.value;
      if (!name) { setErr("name", "Please enter your name."); ok = false; } else setErr("name", "");
      if (phone.replace(/\D/g, "").length < 7) { setErr("phone", "Enter a valid phone number."); ok = false; } else setErr("phone", "");
      if (!date) { setErr("date", "Pick a date & time."); ok = false; } else setErr("date", "");
      if (!party || Number(party) < 1) { setErr("party", "At least 1 guest."); ok = false; } else setErr("party", "");
      if (!ok) { var bad = form.querySelector(".invalid"); if (bad) bad.focus(); return; }

      var text = "Hello BOAC! I'd like to reserve a table.\n" +
        "Name: " + name + "\nPhone: " + phone + "\nDate/Time: " + date.replace("T", " ") +
        "\nParty: " + party + (form.elements.message.value.trim() ? "\nNote: " + form.elements.message.value.trim() : "");
      if (formOk) formOk.hidden = false;
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      form.reset();
    });
    form.querySelectorAll("input,textarea").forEach(function (el) {
      el.addEventListener("input", function () { if (el.classList.contains("invalid")) setErr(el.name, ""); });
    });
  }

  /* ===================== HERO: per-word reveal ===================== */
  var heroTitle = document.getElementById("heroTitle");
  if (heroTitle && !reduce) {
    var html = heroTitle.innerHTML; // keep <em>
    // wrap top-level text words in .w spans, preserving <em>…</em>
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var idx = 0;
    function wrapNode(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (/^\s+$/.test(part) || part === "") { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span");
            s.className = "w"; s.textContent = part;
            s.style.animationDelay = (idx++ * 0.09) + "s";
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          n.classList.add("w");
          n.style.display = "inline-block";
          n.style.animationDelay = (idx++ * 0.09) + "s";
        }
      });
    }
    wrapNode(tmp);
    heroTitle.innerHTML = tmp.innerHTML;
  }

  /* ===================== STATUS BADGE (24h = always open) ===================== */
  var badge = document.getElementById("statusBadge");
  if (badge) badge.childNodes[badge.childNodes.length - 1].nodeValue = " Open now · 24 hours";

  /* ===================== FOOTER YEAR ===================== */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
