document.addEventListener("DOMContentLoaded", () => {
  const membersList = document.getElementById("members-list");
  const yearSpan = document.querySelector("[data-year]");
  const posterContainer = document.querySelector(".hero__poster");
  const toggleAnimBtn = document.getElementById('toggle-anim-btn');

  // Apply persisted reduce-motion preference
  const RM_KEY = 'orioclub-reduce-motion';
  const persisted = localStorage.getItem(RM_KEY);
  if (persisted === 'true') {
    document.body.classList.add('reduce-motion');
  }
  updateAnimToggleButton();

  function updateAnimToggleButton() {
    if (!toggleAnimBtn) return;
    const isReduced = document.body.classList.contains('reduce-motion');
    toggleAnimBtn.setAttribute('aria-pressed', String(isReduced));
    toggleAnimBtn.textContent = isReduced ? 'Activer les animations' : 'Désactiver les animations';
  }

  if (toggleAnimBtn) {
    toggleAnimBtn.addEventListener('click', () => {
      document.body.classList.toggle('reduce-motion');
      const isReduced = document.body.classList.contains('reduce-motion');
      localStorage.setItem(RM_KEY, String(isReduced));
      updateAnimToggleButton();
    });
  }

  // Set current year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Squiggle dash length setup
  const squiggle = document.getElementById('squiggle-path');
  if (squiggle) {
    try {
      const len = Math.ceil(squiggle.getTotalLength());
      squiggle.style.setProperty('--squiggle-length', `${len}`);
      // Optional: reset to ensure proper animation if reflowed
      squiggle.style.strokeDasharray = `${len}`;
      squiggle.style.strokeDashoffset = `${len}`;
    } catch (e) {
      // ignore if SVG not ready
    }
  }

  // Fetch and display members
  async function loadMembers() {
    if (!membersList) return;
    membersList.innerHTML = '<p>Chargement des membres...</p>';

    try {
      const response = await fetch("members.txt", { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const members = parseMembers(text);
      renderMembers(members);
    } catch (error) {
      membersList.innerHTML = `<p style=\"color: red;\">Erreur: Impossible de charger les membres. Assurez-vous que le fichier members.txt existe.</p>`;
      console.error("Failed to load members:", error);
    }
  }

  function parseMembers(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [name, role, description, avatar] = line.split('|').map(s => s.trim());
        return { name, role, description, avatar };
      })
      .filter(member => member.name);
  }

  function renderMembers(members) {
    const list = membersList;
    if (!list) return;
    list.innerHTML = '';
    if (members.length === 0) {
      list.innerHTML = '<p>Aucun membre à afficher.</p>';
      return;
    }

    members.forEach(({ name, role, description, avatar }) => {
      const card = document.createElement('div');
      card.className = 'members-card';

      const avatarSrc = avatar || 'assets/polaroid-placeholder.png';

      card.innerHTML = `
        <img src="${avatarSrc}" alt="Avatar de ${name}" class="members-card__avatar" onerror="this.onerror=null;this.src='assets/polaroid-placeholder.png';" loading="lazy" decoding="async" width="100" height="100">
        <h3 class="members-card__name">${name}</h3>
        <p class="members-card__role">${role || 'Membre'}</p>
        <p class="members-card__description">${description || 'Aucune description.'}</p>
      `;
      list.appendChild(card);
    });
  }

  // Check for poster.jpg
  async function checkPoster() {
    if (!posterContainer) return;

    const posterUrl = 'assets/poster.jpg';
    try {
      const response = await fetch(posterUrl, { method: 'HEAD', cache: 'no-cache' });
      if (response.ok) {
        const img = document.createElement('img');
        img.src = posterUrl;
        img.alt = "Poster du club";
        img.loading = 'lazy';
        img.decoding = 'async';
        posterContainer.innerHTML = ''; // Clear placeholder
        posterContainer.appendChild(img);
      }
    } catch (error) {
      // Poster not found, do nothing, placeholder will be shown
    }
  }

  // EVENTS: load events.txt and inject section + nav link if any
  async function loadEvents() {
    try {
      const response = await fetch('events.txt', { cache: 'no-cache' });
      if (!response.ok) throw new Error('No events file');
      const text = await response.text();
      const events = parseEvents(text);
      if (events.length === 0) return;
      injectEventsSection(events);
      ensureEventsNavLink();
      initScrollSpy(true); // re-init with dynamic link
    } catch (e) {
      // no events or fetch failed: do nothing
    }
  }

  function parseEvents(text) {
    // Format: title | date | location | description | image(optional)
    const now = new Date();
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'))
      .map(l => {
        const [title, dateStr, location, description, image] = l.split('|').map(s => s.trim());
        const date = new Date(dateStr);
        return { title, date, dateStr, location, description, image };
      })
      .filter(e => e.title && e.date && !isNaN(e.date.getTime()) && e.date >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
      .sort((a, b) => a.date - b.date);
  }

  function injectEventsSection(events) {
    const contentBox = document.querySelector('.content-box');
    if (!contentBox) return;

    const section = document.createElement('section');
    section.id = 'events';
    section.className = 'section';

    const list = document.createElement('div');
    list.className = 'events-list';

    section.innerHTML = `<h2 class=\"section__title\"><img class=\"icon icon-title\" src=\"assets/calendar.svg\" alt=\"\" aria-hidden=\"true\">Événements à venir</h2>`;

    const MS_IN_DAY = 24 * 60 * 60 * 1000;
    const now = new Date();

    events.forEach(({ title, date, dateStr, location, description, image }) => {
      const daysLeft = Math.ceil((date - now) / MS_IN_DAY);
      const soon = daysLeft <= 14;
      const card = document.createElement('article');
      card.className = 'event-card';
      const imgSrc = image || 'assets/polaroid-placeholder.png';
      card.innerHTML = `
        <div class="event-card__media">
          <img src="${imgSrc}" alt="${title}" loading="lazy" decoding="async">
        </div>
        <div class="event-card__body">
          <h3 class="event-card__title">${title} ${soon ? '<span class="badge badge--soon">Prochainement</span>' : ''}</h3>
          <p class="event-card__meta"><img class="icon" src="assets/calendar.svg" alt="" aria-hidden="true">${dateStr}${location ? ' • ' + location : ''}</p>
          <p class="event-card__desc">${description || ''}</p>
        </div>
      `;
      list.appendChild(card);
    });

    section.appendChild(list);

    // Insert before contact section to keep nav order logical
    const contactSection = document.getElementById('contact');
    if (contactSection && contactSection.parentElement) {
      contactSection.parentElement.insertBefore(section, contactSection);
    } else {
      contentBox.appendChild(section);
    }
  }

  function ensureEventsNavLink() {
    const nav = document.querySelector('.site-header__nav');
    if (!nav) return;
    if (nav.querySelector('a[href="#events"]')) return; // already exists
    const a = document.createElement('a');
    a.href = '#events';
    a.textContent = 'Événements';
    nav.appendChild(a);
  }

  // Scrollspy for nav active link (init & reinit)
  function initScrollSpy(reinit = false) {
    const navLinks = Array.from(document.querySelectorAll('.site-header__nav a[href^="#"]'));
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      let currentActiveId = '';
      const observer = new IntersectionObserver((entries) => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleSections.length > 0) {
          const id = '#' + visibleSections[0].target.id;
          if (id !== currentActiveId) {
            currentActiveId = id;
            navLinks.forEach(link => {
              const isActive = link.getAttribute('href') === id;
              link.classList.toggle('active', isActive);
              if (isActive) link.setAttribute('aria-current', 'page');
              else link.removeAttribute('aria-current');
            });
          }
        }
      }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.3, 0.5, 0.7] });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  // Header solid on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 16) header.classList.add('site-header--scrolled');
      else header.classList.remove('site-header--scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Initial active link if hash present
  function setInitialActiveFromHash() {
    const hash = window.location.hash;
    if (!hash) return;
    const link = document.querySelector(`.site-header__nav a[href="${hash}"]`);
    if (link) {
      document.querySelectorAll('.site-header__nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  }

  loadMembers();
  checkPoster();
  loadEvents();
  initScrollSpy();
  setInitialActiveFromHash();
});
