const body = document.body;
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".site-nav__toggle");
const navList = document.getElementById("menu");
const toggleButton = document.querySelector("[data-animation-toggle]");
const toggleStatus = document.querySelector("[data-animation-status]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const yearLabel = document.getElementById("year");

let manualOverride = null; // null = auto, boolean = user preference

function updateNavCurrent(targetLink) {
  if (!targetLink) return;
  document
    .querySelectorAll('.site-nav__link[aria-current="page"]')
    .forEach((activeLink) => activeLink.removeAttribute("aria-current"));
  targetLink.setAttribute("aria-current", "page");
}

function setAnimationState(paused, origin = "auto") {
  body.classList.toggle("animation-paused", paused);
  body.dataset.animation = paused ? "paused" : "playing";

  if (toggleButton) {
    toggleButton.setAttribute("aria-pressed", paused ? "false" : "true");
    if (toggleStatus) {
      toggleStatus.textContent = paused
        ? "Animation en pause"
        : "Animation active";
    }
  }

  if (origin === "user") {
    manualOverride = paused;
  }
}

function initAnimationControls() {
  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const currentlyPaused = body.classList.contains("animation-paused");
    setAnimationState(!currentlyPaused, "user");
  });

  if (prefersReducedMotion.matches) {
    setAnimationState(true, "auto");
  }

  const motionListener = (event) => {
    if (manualOverride === null) {
      setAnimationState(event.matches, "auto");
    }
  };

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", motionListener);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(motionListener);
  }

  if ("deviceMemory" in navigator && Number(navigator.deviceMemory) <= 2) {
    body.classList.add("animation-frugal");
  }
}

function initNavigation() {
  if (!nav || !navToggle || !navList) return;

  navToggle.setAttribute("aria-expanded", "false");
  nav.setAttribute("aria-expanded", "false");

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.setAttribute("aria-expanded", String(!expanded));
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-expanded", "false");
      updateNavCurrent(link);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navToggle.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-expanded", "false");
    }
  });
}

function initFooterYear() {
  if (!yearLabel) return;
  const now = new Date();
  yearLabel.textContent = String(now.getFullYear());
}

function initScrollSpy() {
  if (!("IntersectionObserver" in window)) return;

  const links = Array.from(
    document.querySelectorAll('.site-nav__link[href^="#"]'),
  );
  if (!links.length) return;

  const sectionMap = new Map();
  links.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) {
      sectionMap.set(section, link);
    }
  });

  if (!sectionMap.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = sectionMap.get(entry.target);
        if (link) {
          updateNavCurrent(link);
        }
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0.15,
    },
  );

  sectionMap.forEach((_, section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initAnimationControls();
  initFooterYear();
  initScrollSpy();
});
