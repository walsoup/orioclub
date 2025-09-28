# Orioclub – Club de l'orientation et opportunités scholaires

Site vitrine du club d'orientation du Lycée Moulay Youssef. La page présente notre mission, les programmes proposés, les opportunités du trimestre, les événements à venir, l'équipe encadrante ainsi qu'un formulaire de contact.

## Structure

- `index.html` – Page organisée façon carnet de voyage : héro polaroid, sections tableau d'affichage et notes scotchées.
- `styles.css` – Palette pastel, effets de papier/tape, typographies manuscrites et animation de fond respectant les préférences de mouvement.
- `script.js` – Navigation mobile, mise à jour du menu actif, contrôle de l'animation et garde-fous performance.
- `assets/` – Images PNG placeholders (polaroid et stickers collage) prêtes à être remplacées par vos visuels.

## Lancer le site

Ouvrez simplement `index.html` dans votre navigateur ou servez le dossier avec un petit serveur local :

```bash
python3 -m http.server
```

Ensuite, rendez-vous sur <http://localhost:8000>.

## Points clés

- **Esthétique carnet** : textures papier, rubans adhésifs et stickers rétro pour une atmosphère scrapbook légère.
- **Typographies manuscrites** : Google Fonts « Just Another Hand », « Shadows Into Light » et « Architects Daughter » avec fallback lisible.
- **Animation légère** : fond pastel animé (CSS uniquement) avec bascule manuelle et respect de `prefers-reduced-motion`.
- **Responsive** : navigation compacte, grilles fluides et contenus lisibles sur mobile comme sur desktop.
- **Accessibilité** : contraste surveillé, navigation clavier, repères ARIA, menu burger et focus visibles.

## Personnalisation rapide

- Remplacez les textes, dates et anecdotes directement dans `index.html`.
- Substituez les PNG du dossier `assets/` par vos photos/illustrations collage tout en conservant les mêmes noms de fichiers pour éviter d'ajuster le HTML.
- Ajustez les couleurs et textures dans `styles.css` via les variables déclarées en tête de fichier.
- Modifiez le comportement de l'animation (durée, désactivation par défaut, libellé du toggle) dans `script.js` si besoin.
