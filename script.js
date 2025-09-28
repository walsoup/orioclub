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
            membersList.innerHTML = `<p style="color: red;">Erreur: Impossible de charger les membres. Assurez-vous que le fichier members.txt existe.</p>`;
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

    // Scrollspy for nav active link
    const navLinks = Array.from(document.querySelectorAll('.site-header__nav a[href^="#"]'));
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    let currentActiveId = '';
    
    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0];
        const id = "#" + mostVisible.target.id;
        
        if (id !== currentActiveId) {
          currentActiveId = id;
          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === id;
            link.classList.toggle('active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      }
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.3, 0.5, 0.7] });

    sections.forEach(sec => observer.observe(sec));
  }    loadMembers();
    checkPoster();
});
