# Orioclub – Club de l'orientation et opportunités scholaires

Site vitrine à l’esthétique "travel poster" pour le club d'orientation du Lycée Moulay Youssef. L’interface propose un héros illustré, une mission en cartes et des profils membres alimentés depuis un fichier texte.

## Structure

- `index.html` – Structure principale : héro poster rétro, cartes mission, grille des membres et bloc contact.
- `styles.css` – Palette nocturne avec gradients animés, textures grainées et composants inspirés d'affiches vintage.
- `script.js` – Bascule d'animation, chargement dynamique des membres (texte + avatar optionnel), mise à jour automatique de l'année.
- `members.txt` – Liste des membres (format `Nom | Rôle | Description | Image (optionnel)`).
- `assets/Icon.png` – Icône officielle utilisée pour le header et le favicon.

## Démarrer le site

Ouvrez `index.html` dans votre navigateur ou servez le dossier avec un petit serveur local :

```bash
python3 -m http.server
```

Puis visitez <http://localhost:8000>.

## Gérer la liste des membres

Le fichier `members.txt` est lu côté client. Chaque ligne active suit ce format :

```
Nom Prénom | Rôle court | Description plus détaillée | Chemin image ou URL
```

- Les lignes commençant par `#` sont ignorées (commentaires).
- Le champ image est optionnel : laissez-le vide pour utiliser le placeholder `assets/polaroid-placeholder.png`.
- Ajoutez autant de lignes que nécessaire et actualisez la page pour voir les cartes se mettre à jour.

## Animation et accessibilité

- L'arrière-plan animé est conservé mais peut être coupé via le bouton en bas de page. La préférence est mémorisée dans le navigateur.
- Le site respecte `prefers-reduced-motion` : si l'utilisateur préfère moins d'animations, l'effet est coupé par défaut.
- Mise en page responsive : le contenu reste lisible sur mobile comme sur desktop.

## Personnalisation rapide

- Modifiez les textes des sections directement dans `index.html`.
- Remplacez `assets/Icon.png` ou ajoutez vos propres visuels dans `assets/` pour les membres.
- Ajustez les couleurs/ombres dans `styles.css` via les variables `:root` (background animé, accents, textures).
- Mettez à jour les coordonnées, liens et CTA dans la section contact de `index.html`.
