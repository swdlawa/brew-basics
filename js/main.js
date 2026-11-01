/* ==========================================================================
   Brew Basics — shared script (progressive enhancement, no dependencies)
   Every feature guards for the presence of its own elements, so the site
   remains fully usable if JavaScript is disabled.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Theme toggle (persisted, respects OS preference)
     ------------------------------------------------------------------ */
  var root = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    if (root.getAttribute("data-theme")) return root.getAttribute("data-theme");
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  // Restore a saved choice; otherwise mirror the OS preference.
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) { /* storage unavailable */ }
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else {
    applyTheme(currentTheme());
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) { /* ignore */ }
    });
  }

  /* ------------------------------------------------------------------
     2. Mobile navigation toggle
     ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  function setNav(open) {
    if (!siteNav) return;
    siteNav.classList.toggle("is-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNav(!siteNav.classList.contains("is-open"));
    });
    // Close when a link is chosen (mobile), and on Escape.
    siteNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
  }

  /* ------------------------------------------------------------------
     3. Copy-to-clipboard buttons
     ------------------------------------------------------------------ */
  var copyButtons = document.querySelectorAll(".copy-button");
  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-copy-target"));
      if (!target) return;
      var text = target.innerText;
      var done = function () {
        btn.setAttribute("data-copied", "true");
        btn.textContent = "Copied!";
        window.setTimeout(function () {
          btn.removeAttribute("data-copied");
          btn.textContent = "Copy";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text); done();
        });
      } else {
        fallbackCopy(text); done();
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ------------------------------------------------------------------
     4. Brew ratio calculator
     ------------------------------------------------------------------ */
  var calc = document.getElementById("brew-calculator");
  if (calc) {
    var modeRadios = calc.querySelectorAll('input[name="calc-mode"]');
    var coffeeInput = calc.querySelector("#coffee");
    var ratioInput = calc.querySelector("#ratio");
    var cupsInput = calc.querySelector("#cups");
    var cupSizeInput = calc.querySelector("#cup-size");
    var resultText = calc.querySelector("#calc-result");
    var resultUnit = calc.querySelector("#calc-result-unit");
    var resultLabel = calc.querySelector("#calc-result-label");
    var output = calc.querySelector("#calc-output");
    var mode = "coffee-to-water"; // default

    function readNum(el) {
      var v = parseFloat(el && el.value);
      return isNaN(v) ? null : v;
    }

    function update() {
      var coffee = readNum(coffeeInput);
      var ratio = readNum(ratioInput);
      var cups = readNum(cupsInput);
      var cupSize = readNum(cupSizeInput);

      var value = null;
      var unit = "ml";

      if (mode === "coffee-to-water") {
        if (resultLabel) resultLabel.textContent = "Water needed:";
        if (coffee !== null && ratio !== null && coffee > 0 && ratio > 0) {
          value = Math.round(coffee * ratio);
        }
      } else {
        if (resultLabel) resultLabel.textContent = "Coffee needed:";
        if (cups !== null && cupSize !== null && ratio !== null && cups > 0 && cupSize > 0 && ratio > 0) {
          var totalWater = cups * cupSize;
          value = Math.round(totalWater / ratio);
          unit = "g";
        }
      }

      if (value !== null) {
        resultText.textContent = value;
        resultUnit.textContent = unit;
        output.classList.remove("is-empty");
      } else {
        resultText.textContent = "—";
        resultUnit.textContent = "";
      }
    }

    calc.addEventListener("input", function (e) {
      if (e.target.name === "calc-mode") {
        mode = e.target.value;
        // Toggle which field groups are shown for clarity.
        calc.classList.toggle("mode-cups", mode === "cups-to-coffee");
        calc.classList.toggle("mode-coffee", mode === "coffee-to-water");
      }
      update();
    });

    update();
  }

  /* ------------------------------------------------------------------
     5. Scrollspy for the on-page table of contents
     ------------------------------------------------------------------ */
  var toc = document.querySelector(".toc");
  if (toc && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(
      toc.querySelectorAll('a[href^="#"]')
    );
    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.removeAttribute("aria-current"); });
            var link = map[entry.target.id];
            if (link) link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  /* ------------------------------------------------------------------
     6. Back-to-top button
     ------------------------------------------------------------------ */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    var onScroll = function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     7. Glossary filter (resources page)
     ------------------------------------------------------------------ */
  var glossarySearch = document.getElementById("glossary-search");
  if (glossarySearch) {
    var terms = document.querySelectorAll(".glossary .term");
    glossarySearch.addEventListener("input", function () {
      var q = glossarySearch.value.trim().toLowerCase();
      terms.forEach(function (term) {
        var text = term.innerText.toLowerCase();
        term.classList.toggle("is-hidden", q !== "" && text.indexOf(q) === -1);
      });
    });
  }

  /* ------------------------------------------------------------------
     8. Current year in the footer
     ------------------------------------------------------------------ */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
