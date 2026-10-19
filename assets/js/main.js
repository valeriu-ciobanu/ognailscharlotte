(function () {
  "use strict";
  var doc = document.documentElement;

  /* Transparent header over image heroes */
  if (document.body.classList.contains("has-overlay-header")) {
    var onScroll = function () { document.body.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = doc.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        doc.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && doc.classList.contains("nav-open")) {
        doc.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Track Book Now clicks (works once Google Analytics / gtag is added) */
  document.querySelectorAll("[data-book]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (typeof window.gtag === "function") {
        window.gtag("event", "book_now_click", { location: el.getAttribute("data-book") || "unknown" });
      }
    });
  });

  document.querySelectorAll("[data-gift]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (typeof window.gtag === "function") {
        window.gtag("event", "gift_card_click", { location: el.getAttribute("data-gift") || "unknown" });
      }
    });
  });

  /* Promo bar dismiss */
  var promo = document.getElementById("promo-bar");
  if (promo) {
    var pc = promo.querySelector(".promo-close");
    if (pc) pc.addEventListener("click", function () {
      promo.remove();
      try { localStorage.setItem("promo-efile-closed", "1"); } catch (e) {}
    });
    var pl = promo.querySelector("[data-promo]");
    if (pl) pl.addEventListener("click", function () {
      if (typeof window.gtag === "function") window.gtag("event", "promo_click", { promo: pl.getAttribute("data-promo") });
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Services page: highlight active jump link */
  var jumpLinks = document.querySelectorAll(".jump-nav a[href^='#']");
  if (jumpLinks.length && "IntersectionObserver" in window) {
    var map = {};
    jumpLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          jumpLinks.forEach(function (a) { a.classList.remove("active"); });
          var link = map[en.target.id];
          if (link) {
            link.classList.add("active");
            link.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) so.observe(s);
    });
  }

  /* Gallery filters */
  var grid = document.querySelector("[data-gallery]");
  var filters = document.querySelectorAll(".filter[data-filter]");
  var tiles = grid ? Array.prototype.slice.call(grid.querySelectorAll(".tile")) : [];
  var status = document.querySelector(".gallery-status");

  if (filters.length && tiles.length) {
    filters.forEach(function (btn) {
      var f = btn.getAttribute("data-filter");
      var n = f === "all" ? tiles.length : tiles.filter(function (t) { return (" " + t.dataset.tags + " ").indexOf(" " + f + " ") > -1; }).length;
      var c = btn.querySelector(".count");
      if (c) c.textContent = n;
      if (n === 0) btn.hidden = true; // categories without photos yet stay hidden
      btn.addEventListener("click", function () { applyFilter(f, true); });
    });
    var initial = (location.hash || "").replace("#", "");
    var valid = Array.prototype.some.call(filters, function (b) { return b.dataset.filter === initial && !b.hidden; });
    applyFilter(valid ? initial : "all", false);
  }

  function applyFilter(f, push) {
    filters.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.filter === f ? "true" : "false"); });
    var shown = 0;
    tiles.forEach(function (t) {
      var match = f === "all" || (" " + t.dataset.tags + " ").indexOf(" " + f + " ") > -1;
      t.hidden = !match;
      if (match) shown++;
    });
    if (status) status.textContent = "Showing " + shown + " photo" + (shown === 1 ? "" : "s");
    if (push && history.replaceState) history.replaceState(null, "", f === "all" ? location.pathname : "#" + f);
  }

  /* Lightbox */
  var lb = document.querySelector(".lightbox");
  if (lb && tiles.length && typeof lb.showModal === "function") {
    var img = lb.querySelector(".lb-stage img");
    var cap = lb.querySelector(".lb-caption");
    var counter = lb.querySelector(".lb-count");
    var current = 0;
    var visible = function () { return tiles.filter(function (t) { return !t.hidden; }); };

    function show(i) {
      var v = visible();
      if (!v.length) return;
      current = (i + v.length) % v.length;
      var t = v[current];
      var thumb = t.querySelector("img");
      img.src = t.getAttribute("data-full");
      img.alt = thumb.alt;
      cap.textContent = thumb.alt;
      counter.textContent = (current + 1) + " / " + v.length;
      // preload neighbour
      var nxt = v[(current + 1) % v.length];
      if (nxt) { var p = new Image(); p.src = nxt.getAttribute("data-full"); }
    }
    tiles.forEach(function (t) {
      t.addEventListener("click", function () {
        show(visible().indexOf(t));
        lb.showModal();
        doc.style.overflow = "hidden";
      });
    });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("close", function () { doc.style.overflow = ""; });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* Footer year */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
