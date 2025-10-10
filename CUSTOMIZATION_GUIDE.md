# 📘 Guide de Personnalisation ORIOCLUB

Ce guide vous aidera à personnaliser facilement votre site web ORIOCLUB sans toucher au code.

## 🎨 Personnaliser le Contenu Principal

### Fichier : `content.txt`

#### 1. Titre Principal (Hero)
```
hero-title | Votre Titre Ici
```
Apparaît en grand sur la page d'accueil.

#### 2. Sous-titre
```
hero-subtitle | Votre sous-titre ou slogan ici
```
Description courte sous le titre principal.

#### 3. Section "À Propos"
```
about | Description complète de votre club et de sa mission.
```
Peut contenir plusieurs phrases.

### 🔤 Personnaliser la Police du Titre

#### Option 1 : Google Fonts (Recommandé)
```
title-font | Nom de la Police
```

**Polices populaires** :
- `Pacifico` - Style décontracté et amical
- `Bebas Neue` - Moderne et audacieux
- `Righteous` - Géométrique et fun
- `Fredoka One` - Arrondi et chaleureux (par défaut)
- `Dancing Script` - Élégant et cursif
- `Permanent Marker` - Style marqueur
- `Bangers` - Comique et énergique

#### Option 2 : Police Personnalisée
1. Placez vos fichiers de police dans `assets/fonts/`
2. Ajoutez le code dans `styles.css` :
```css
@font-face {
  font-family: 'MaPolice';
  src: url('assets/fonts/MaPolice.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}
```
3. Dans `content.txt` :
```
title-font | custom:MaPolice
```

#### Appliquer la Police à Tous les Titres
```
title-font-scope | all-headers
```
Ou juste au titre principal :
```
title-font-scope | hero-only
```

### 🎨 Styles Visuels

#### Contour du Titre
```
title-outline | yes    # Avec effet de contour (recommandé)
title-outline | no     # Texte simple sans contour
```

#### Style du Soulignement Décoratif
```
squiggle-style | default   # Ligne simple et élégante
squiggle-style | thick     # Ligne épaisse
squiggle-style | dotted    # Points espacés
squiggle-style | double    # Double ligne avec ombre
squiggle-style | none      # Pas de soulignement
```

## 👥 Gérer les Membres

### Fichier : `members.txt`

**Format** :
```
Nom | Rôle | Description | Chemin/Image
```

**Exemple** :
```
Sophie Martin | Présidente | Coordonne les activités et représente le club. | assets/sophie.jpg
Lucas Dubois | Trésorier | Gère les finances du club.
```

**Notes** :
- L'image est optionnelle
- Si pas d'image, un placeholder s'affiche
- Une ligne = un membre
- Les lignes commençant par `#` sont ignorées (commentaires)

### Ajouter des Photos de Membres

1. **Formats recommandés** : JPG, PNG, WEBP
2. **Taille recommandée** : 300x300px minimum (carré de préférence)
3. **Placez les images dans** : `assets/`
4. **Référencez dans members.txt** : `assets/nom-image.jpg`

## 📅 Gérer les Événements

### Fichier : `events.txt`

**Format** :
```
Titre | Date (AAAA-MM-JJ) | Lieu | Description | Image
```

**Exemple** :
```
Atelier Parcoursup | 2025-11-15 | Salle 204 | Session de préparation pour Parcoursup. | assets/parcoursup.jpg
Conférence Orientation | 2025-12-03 | Amphithéâtre | Découverte des filières d'études.
```

**Fonctionnalités automatiques** :
- ✅ Les événements passés sont masqués
- ✅ Badge "Prochainement" si moins de 14 jours
- ✅ Tri automatique par date
- ✅ L'image est optionnelle

## 🖼️ Gérer les Images

### Image d'Affiche (Poster)

Placez `poster.jpg` dans le dossier `assets/`
- **Format** : JPG ou PNG
- **Ratio recommandé** : 3:4 (portrait)
- **Taille** : 800x1066px recommandé

Si le fichier existe, il remplace automatiquement le placeholder.

### Icône du Site

Remplacez `assets/Icon.png` par votre logo
- **Format** : PNG avec transparence
- **Taille** : 512x512px minimum

## 🎨 Personnaliser les Couleurs (Avancé)

Pour changer les couleurs, éditez `styles.css` et modifiez les variables dans `:root` :

```css
:root {
  --accent: #c86428;           /* Couleur principale */
  --accent-warm: #d89161;      /* Couleur secondaire */
  --text-primary: #3a3226;     /* Texte principal */
  --paper-bg: #f9f6f0;         /* Fond de page */
}
```

## ♿ Accessibilité

### Bouton de Désactivation des Animations

Un bouton en bas de page permet aux visiteurs de désactiver toutes les animations si elles causent de l'inconfort.

### Textes Alternatifs

Pensez à ajouter des descriptions pour toutes vos images :
- Photos de membres : "Photo de [Nom]"
- Images d'événements : Description de l'événement

## 📱 Informations de Contact

Modifiez dans `index.html` (section Contact) :

```html
<li>📧 Email : <a href="mailto:votre@email.com">votre@email.com</a></li>
<li>📱 Instagram : <a href="https://instagram.com/votre_compte">@votre_compte</a></li>
```

## 🔧 Dépannage

### Le contenu ne se charge pas
- Vérifiez que les fichiers `.txt` sont bien au format UTF-8
- Assurez-vous qu'il n'y a pas de caractères spéciaux non encodés

### Les images ne s'affichent pas
- Vérifiez le chemin : `assets/nom-image.jpg`
- Vérifiez que le fichier existe
- Vérifiez l'extension (jpg, png, etc.)

### Les animations sont saccadées
- Utilisez le bouton "Désactiver les animations"
- Sur mobile, les animations sont automatiquement réduites

## 📞 Support

Pour toute question :
- Consultez le `README.md` principal
- Vérifiez les commentaires dans les fichiers `.txt`
- Contactez l'équipe technique du club

---

**Bon personnalisation ! 🎉**
