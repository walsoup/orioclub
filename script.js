const animationToggle = document.querySelector("[data-animation-toggle]");
const animationStatus = document.querySelector("[data-animation-status]");
const membersList = document.getElementById("members-list");
const yearTargets = document.querySelectorAll("[data-year]");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const STORAGE_KEY = "orioclub-ambient";

function applyAnimationState(enabled) {
  document.body.classList.toggle("is-animated", enabled);

  if (animationToggle) {
    animationToggle.setAttribute("aria-pressed", String(enabled));
  }
  if (animationStatus) {
    animationStatus.textContent = enabled
      ? "Animation activée"
      : "Animation désactivée";
  }
}

function initAnimationControls() {
  if (!animationToggle) return;

  let storedPreference = null;
  try {
    storedPreference = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    storedPreference = null;
  }

  const initialState =
    storedPreference === "on"
      ? true
      : storedPreference === "off"
        ? false
        : !prefersReducedMotion.matches;

  applyAnimationState(initialState);

  animationToggle.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("is-animated");
    applyAnimationState(nextState);
    try {
      localStorage.setItem(STORAGE_KEY, nextState ? "on" : "off");
    } catch (error) {
      /* stockage optionnel */
    }
  });

  const handleMotionPreference = (event) => {
    let preference = null;
    try {
      preference = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      preference = null;
    }
    if (preference !== null) return;
    applyAnimationState(!event.matches);
  };

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", handleMotionPreference);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(handleMotionPreference);
  }
}

function parseMembers(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length && !line.startsWith("#"))
    .map((line) => {
      const [name = "", role = "", description = ""] = line
        .split("|")
        .map((part) => part.trim());
      return { name, role, description };
    })
    .filter((member) => member.name);
}

function renderMembers(members) {
  if (!membersList) return;
  membersList.innerHTML = "";

  if (!members.length) {
    const empty = document.createElement("p");
    empty.className = "members-list__empty";
    empty.textContent = "Aucun membre renseigné pour le moment.";
    membersList.append(empty);
    return;
  }

  members.forEach(({ name, role, description }) => {
    const card = document.createElement("article");
    card.className = "members-card";

    const nameEl = document.createElement("h3");
    nameEl.className = "members-card__name";
    nameEl.textContent = name;

    const roleEl = document.createElement("p");
    roleEl.className = "members-card__role";
    roleEl.textContent = role || "Membre";

    const descEl = document.createElement("p");
    descEl.textContent = description || "Description à venir.";

    card.append(nameEl, roleEl, descEl);
    membersList.append(card);
  });
}

async function loadMembers() {
  if (!membersList) return;

  try {
    const response = await fetch("members.txt", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    const members = parseMembers(text);
    renderMembers(members);
  } catch (error) {
    membersList.innerHTML = "";
    const errorMessage = document.createElement("p");
    errorMessage.className = "members-list__error";
    errorMessage.textContent =
      "Impossible de charger la liste des membres. Vérifiez que le fichier members.txt est présent.";
    membersList.append(errorMessage);
  }
}

function initYear() {
  if (!yearTargets.length) return;
  const currentYear = new Date().getFullYear();
  yearTargets.forEach((element) => {
    element.textContent = String(currentYear);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAnimationControls();
  loadMembers();
  initYear();
});
