# Orioclub – Club de l'orientation et opportunités scholaires

Site vitrine du club d'orientation du Lycée Moulay Youssef. La page présente notre mission, les programmes proposés, les opportunités du trimestre, les événements à venir, l'équipe encadrante ainsi qu'un formulaire de contact.

## Structure

- `index.html` – Contenu principal et sections du site.
- `styles.css` – Styles globaux, mise en page responsive et animation d'arrière-plan optimisée.
- `script.js` – Navigation mobile, mise à jour du menu actif, contrôle de l'animation et ajustements d'accessibilité.

## Lancer le site

Ouvrez simplement `index.html` dans votre navigateur ou servez le dossier avec un petit serveur local :

```bash
python3 -m http.server
```

Ensuite, rendez-vous sur <http://localhost:8000>.

## Points clés

- **Animation légère** : fond animé via gradients flottants (CSS uniquement), avec bascule manuelle et respect de `prefers-reduced-motion`.
- **Responsive** : navigation compacte, grilles fluides et contenus lisibles sur mobile comme sur desktop.
- **Accessibilité** : contraste renforcé, navigation clavier, repères ARIA, menu burger et focus visibles.
- **Contenus réutilisables** : sections modulaires (mission, programmes, opportunités, événements, impact, équipe, contact).

## Personnalisation rapide

- Mettez à jour les textes/événements directement dans `index.html`.
- Ajoutez des couleurs ou logos propres au club dans `styles.css` (variables en haut du fichier).
- Pour modifier le comportement de l'animation, ajustez les classes `ambient__gradient` ou la logique de bascule dans `script.js`.
