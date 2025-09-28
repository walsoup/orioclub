# Orioclub – Club de l'orientation et opportunités scholaires

Site vitrine épuré du club d'orientation du Lycée Moulay Youssef. La page se concentre sur l'essentiel : notre mission, les membres actifs et les moyens de contact.

## Structure

- `index.html` – Mise en page minimaliste avec l'icône du club, les trois sections principales et le bouton de bascule de l'animation dans le pied de page.
- `styles.css` – Styles sobres avec ambiance lumineuse animée (désactivable) et cartes responsives.
- `script.js` – Bascule d'animation, chargement dynamique des membres depuis `members.txt`, mise à jour automatique de l'année.
- `members.txt` – Liste des membres (format `Nom | Rôle | Description`) facilement extensible.
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
Nom Prénom | Rôle court | Description plus détaillée
```

- Les lignes commençant par `#` sont ignorées (commentaires).
- Ajoutez autant de lignes que nécessaire pour enrichir la section « Membres ».
- Enregistrez le fichier, actualisez la page, la liste se mettra à jour automatiquement.

## Animation et accessibilité

- L'arrière-plan animé est conservé mais peut être coupé via le bouton en bas de page. La préférence est mémorisée dans le navigateur.
- Le site respecte `prefers-reduced-motion` : si l'utilisateur préfère moins d'animations, l'effet est coupé par défaut.
- Mise en page responsive : le contenu reste lisible sur mobile comme sur desktop.

## Personnalisation rapide

- Adaptez les textes des sections directement dans `index.html`.
- Remplacez `assets/Icon.png` par votre logo (même nom de fichier pour éviter de modifier le HTML).
- Ajustez les couleurs/ombres dans `styles.css` via les variables `:root`.
- Pour modifier les messages de contact ou les liens, mise à jour rapide dans la section correspondante de `index.html`.
