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

  // Squiggle dash length setup and width matching
  const squiggle = document.getElementById('squiggle-path');
  const heroTitle = document.querySelector('.hero__title');
  const squiggleSvg = document.querySelector('.hero__squiggle');
  
  function updateSquiggle() {
    if (!squiggle || !heroTitle || !squiggleSvg) return;
    
    try {
      // Match squiggle width to title width
      const titleWidth = heroTitle.offsetWidth;
      squiggleSvg.style.width = `${titleWidth}px`;
      
      // Update dash length after width change
      const len = Math.ceil(squiggle.getTotalLength());
      squiggle.style.setProperty('--squiggle-length', `${len}`);
      squiggle.style.strokeDasharray = `${len}`;
      squiggle.style.strokeDashoffset = `${len}`;
    } catch (e) {
      // ignore if SVG not ready
    }
  }
  
  updateSquiggle();
  
  // Re-calculate on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSquiggle, 100);
  }, { passive: true });

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
  loadContent();
  initScrollSpy();
  setInitialActiveFromHash();
});

// Load content from content.txt
async function loadContent() {
  try {
    const response = await fetch('content.txt', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Content file not found');
    
    const text = await response.text();
    const content = parseContent(text);
    
    // Update hero title
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && content['hero-title']) {
      heroTitle.textContent = content['hero-title'];
    }
    
    // Update hero subtitle
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle && content['hero-subtitle']) {
      heroSubtitle.textContent = content['hero-subtitle'];
    }
    
    // Update about content
    const aboutContent = document.getElementById('about-content');
    if (aboutContent && content['about']) {
      aboutContent.textContent = content['about'];
    }
    
    // Apply title font if specified
    if (heroTitle && content['title-font']) {
      const font = content['title-font'].trim();
      
      // Don't reload if already using Fredoka One (default)
      if (font !== 'Fredoka One') {
        // Convert font name to Google Fonts URL format
        // e.g., "Lemon Milk" -> "Lemon+Milk"
        const fontUrl = font.replace(/\s+/g, '+');
        
        // Load from Google Fonts
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        // Apply the font
        heroTitle.style.fontFamily = `"${font}", "Fredoka One", cursive`;
        
        // Wait a bit for font to load, then update squiggle
        setTimeout(() => updateSquiggle(), 200);
      }
    }
    
    // Apply title outline setting
    if (heroTitle && content['title-outline']) {
      const outline = content['title-outline'].trim().toLowerCase();
      if (outline === 'no' || outline === 'false') {
        // Boring black text, no outline
        heroTitle.style.color = '#2d3436';
        heroTitle.style.webkitTextStroke = '0';
        heroTitle.style.paintOrder = 'normal';
      } else {
        // Cool amber outline (default)
        heroTitle.style.color = '#fffbf0';
        heroTitle.style.webkitTextStroke = '4px rgba(213, 118, 36, 0.6)';
        heroTitle.style.paintOrder = 'stroke fill';
      }
    }
    
    // Apply squiggle style
    const squigglePath = document.getElementById('squiggle-path');
    const squiggleSvg = document.querySelector('.hero__squiggle');
    if (squigglePath && content['squiggle-style']) {
      const style = content['squiggle-style'].trim().toLowerCase();
      
      // Show squiggle by default
      if (squiggleSvg) squiggleSvg.style.display = 'block';
      
      switch(style) {
        case 'none':
          // Hide the squiggle completely
          if (squiggleSvg) squiggleSvg.style.display = 'none';
          break;
        case 'thick':
          squigglePath.style.strokeWidth = '8';
          squigglePath.style.strokeDasharray = '';
          squigglePath.style.filter = '';
          squigglePath.setAttribute('d', 'M2 14 C 50 2, 100 26, 150 14 S 250 2, 300 14 350 26, 400 14 450 2, 500 14 550 26, 598 14');
          break;
        case 'dotted':
          squigglePath.style.strokeWidth = '5';
          squigglePath.style.strokeDasharray = '0 15';
          squigglePath.style.strokeLinecap = 'round';
          squigglePath.style.filter = '';
          squigglePath.setAttribute('d', 'M2 14 C 50 2, 100 26, 150 14 S 250 2, 300 14 350 26, 400 14 450 2, 500 14 550 26, 598 14');
          break;
        case 'double':
          squigglePath.style.strokeWidth = '3';
          squigglePath.style.strokeDasharray = '';
          squigglePath.style.filter = 'drop-shadow(0 4px 0 var(--accent))';
          squigglePath.setAttribute('d', 'M2 14 C 50 2, 100 26, 150 14 S 250 2, 300 14 350 26, 400 14 450 2, 500 14 550 26, 598 14');
          break;
        case 'wavy':
          squigglePath.style.strokeWidth = '5';
          squigglePath.style.strokeDasharray = '';
          squigglePath.style.filter = '';
          squigglePath.setAttribute('d', 'M2 14 Q 30 2, 60 14 T 120 14 T 180 14 T 240 14 T 300 14 T 360 14 T 420 14 T 480 14 T 540 14 T 598 14');
          break;
        default:
          // Keep default style
          squigglePath.style.strokeWidth = '5';
          squigglePath.style.strokeDasharray = '';
          squigglePath.style.filter = '';
          squigglePath.setAttribute('d', 'M2 14 C 50 2, 100 26, 150 14 S 250 2, 300 14 350 26, 400 14 450 2, 500 14 550 26, 598 14');
      }
    }
    
    // Re-update squiggle after title changes
    updateSquiggle();
  } catch (e) {
    console.error('Failed to load content:', e);
    // Use fallback content from HTML if file not found
  }
}

function parseContent(text) {
  const content = {};
  text.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .forEach(line => {
      const [key, value] = line.split('|').map(s => s.trim());
      if (key && value) {
        content[key] = value;
      }
    });
  return content;
}


