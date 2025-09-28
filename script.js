document.addEventListener("DOMContentLoaded", () => {
    const membersList = document.getElementById("members-list");
    const yearSpan = document.querySelector("[data-year]");
    const posterContainer = document.querySelector(".hero__poster");

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
        membersList.innerHTML = '';
        if (members.length === 0) {
            membersList.innerHTML = '<p>Aucun membre à afficher.</p>';
            return;
        }

        members.forEach(({ name, role, description, avatar }) => {
            const card = document.createElement('div');
            card.className = 'members-card';

            const avatarSrc = avatar || 'assets/polaroid-placeholder.png';

            card.innerHTML = `
                <img src="${avatarSrc}" alt="Avatar de ${name}" class="members-card__avatar" onerror="this.onerror=null;this.src='assets/polaroid-placeholder.png';">
                <h3 class="members-card__name">${name}</h3>
                <p class="members-card__role">${role || 'Membre'}</p>
                <p class="members-card__description">${description || 'Aucune description.'}</p>
            `;
            membersList.appendChild(card);
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
                posterContainer.innerHTML = ''; // Clear placeholder
                posterContainer.appendChild(img);
            }
        } catch (error) {
            // Poster not found, do nothing, placeholder will be shown
        }
    }

    loadMembers();
    checkPoster();
});
