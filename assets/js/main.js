document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var menuClose = document.querySelector("[data-menu-close]");
  var header = document.querySelector("[data-header]");

  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = false;
    body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    var firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu(returnFocus) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = true;
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (returnFocus !== false) menuToggle.focus();
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", function () { closeMenu(true); });

  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (event) {
      if (event.target === mobileMenu) closeMenu(true);
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu(true);
    }
  });

  if (typeof SITE_CONFIG !== "undefined") {
    document.querySelectorAll("[data-social]").forEach(function (link) {
      var key = link.getAttribute("data-social");
      var url = SITE_CONFIG.social[key];
      if (url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });

    document.querySelectorAll("[data-email]").forEach(function (link) {
      link.href = "mailto:" + SITE_CONFIG.email;
      if (link.hasAttribute("data-email-text")) {
        link.textContent = SITE_CONFIG.email;
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-accordion] .accordion-item").forEach(function (item) {
    var button = item.querySelector("button");
    var panel = item.querySelector(".accordion-panel");
    if (!button || !panel) return;

    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
      var symbol = button.querySelector("span");
      if (symbol) symbol.textContent = expanded ? "+" : "−";
    });
  });

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".section, .story-index-item, .editorial-block").forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }
});
