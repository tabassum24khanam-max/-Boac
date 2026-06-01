/* =================================================================
   BOAC Café — script.js
   Vanilla JS. No dependencies.
   Handles: sticky-nav shadow, mobile menu, scroll reveal,
            menu filter tabs, gallery lightbox, form validation,
            back-to-top, footer year.
   ================================================================= */
(function () {
  "use strict";

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =============================================================
     STICKY HEADER SHADOW
     ============================================================= */
  var header = document.getElementById("site-header");
  var backToTop = document.getElementById("back-to-top");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (backToTop) {
      backToTop.hidden = false;
      backToTop.classList.toggle("show", y > 600);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =============================================================
     MOBILE NAV (hamburger / slide-in)
     ============================================================= */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");
  var overlay = document.getElementById("mobile-overlay");

  function openMenu() {
    mobileNav.hidden = false;
    overlay.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(function () {
      mobileNav.classList.add("show");
      overlay.classList.add("show");
    });
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  function closeMenu() {
    mobileNav.classList.remove("show");
    overlay.classList.remove("show");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    // hide after the transition finishes
    window.setTimeout(function () {
      if (!mobileNav.classList.contains("show")) {
        mobileNav.hidden = true;
        overlay.hidden = true;
      }
    }, 350);
  }

  if (hamburger && mobileNav && overlay) {
    hamburger.addEventListener("click", function () {
      if (mobileNav.classList.contains("show")) closeMenu();
      else openMenu();
    });
    overlay.addEventListener("click", closeMenu);
    // close on any link tap inside the menu
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("show")) closeMenu();
    });
  }

  /* =============================================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================================= */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* =============================================================
     MENU FILTER TABS
     ============================================================= */
  var tabs = document.querySelectorAll(".menu-tabs .tab");
  var cards = document.querySelectorAll(".menu-card");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.getAttribute("data-filter");
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-cat") === filter;
        card.classList.toggle("hide", !show);
      });
    });
  });

  /* =============================================================
     GALLERY LIGHTBOX
     ============================================================= */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbClose = document.getElementById("lb-close");
  var lbPrev = document.getElementById("lb-prev");
  var lbNext = document.getElementById("lb-next");
  var currentIndex = 0;
  var lastFocused = null;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;
    var item = galleryItems[index];
    lbImg.src = item.getAttribute("data-full");
    var innerImg = item.querySelector("img");
    lbImg.alt = innerImg ? innerImg.alt : "";
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-open");
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
    lbImg.src = "";
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener("click", function () { openLightbox(i); });
  });

  if (lightbox) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showImage(currentIndex - 1); });
    lbNext.addEventListener("click", function () { showImage(currentIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      else if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });

    /* Swipe support on touch devices */
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) showImage(currentIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* =============================================================
     RESERVATION FORM — validation + WhatsApp handoff
     ============================================================= */
  var form = document.getElementById("reserve-form");
  var success = document.getElementById("form-success");
  // TODO: replace with the café's real WhatsApp number (digits only, incl. country code)
  var WHATSAPP_NUMBER = "966500000000";

  function setError(name, msg) {
    var input = form.elements[name];
    var errEl = form.querySelector('.error[data-for="' + name + '"]');
    if (input) input.classList.toggle("invalid", !!msg);
    if (errEl) errEl.textContent = msg || "";
  }

  function validate() {
    var ok = true;
    var name = form.elements["name"].value.trim();
    var phone = form.elements["phone"].value.trim();
    var date = form.elements["date"].value;
    var party = form.elements["party"].value;

    if (!name) { setError("name", "Please enter your name."); ok = false; }
    else setError("name", "");

    // accept +, spaces, digits; need at least 7 digits
    var digits = phone.replace(/\D/g, "");
    if (digits.length < 7) { setError("phone", "Enter a valid phone number."); ok = false; }
    else setError("phone", "");

    if (!date) { setError("date", "Pick a date and time."); ok = false; }
    else setError("date", "");

    if (!party || Number(party) < 1) { setError("party", "Party size must be at least 1."); ok = false; }
    else setError("party", "");

    return ok;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        // focus the first invalid field
        var firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = form.elements["name"].value.trim();
      var phone = form.elements["phone"].value.trim();
      var date = form.elements["date"].value;
      var party = form.elements["party"].value;
      var message = form.elements["message"].value.trim();

      var text =
        "Hello BOAC Café! I'd like to reserve a table.\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Date/Time: " + date.replace("T", " ") + "\n" +
        "Party size: " + party +
        (message ? "\nNote: " + message : "");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

      if (success) success.hidden = false;
      // open WhatsApp in a new tab with the prefilled message
      window.open(url, "_blank", "noopener");
      form.reset();
    });

    // clear an error as soon as the user fixes the field
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        if (el.classList.contains("invalid")) setError(el.name, "");
      });
    });
  }
})();
