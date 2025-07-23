# JEU DYNO

Un jeu de navigateur JavaScript inspiré du célèbre jeu Dino de Chrome.  
Sautez par-dessus les obstacles et les oiseaux pour marquer des points et survivre le plus longtemps possible !

## Fonctionnalités

- Personnage Dino avec mécanique de saut
- Obstacles aléatoires et oiseaux volants
- Vitesse et score qui augmentent avec le temps
- Écran de fin de jeu
- Structure de code modulaire (ES Modules)

## Structure du projet

```
DYNO GAME/
├── index.html
├── index.js
└── src/
    ├── Bird.js
    ├── collides.js
    ├── constants.js
    ├── Dino.js
    ├── Entity.js
    ├── Game.js
    ├── Obstacle.js
    └── assets/
        ├── dino.png
        ├── bird.png
        └── obstacle.png
```

## Comment jouer

1. Clonez ou téléchargez le dépôt.
2. Placez vos images (`dino.png`, `bird.png`, `obstacle.png`) dans le dossier `src/assets/`.
3. Ouvrez `index.html` dans votre navigateur.
4. Assurez-vous que la balise `<script>` dans `index.html` utilise `type="module"` :
   ```html
   <script type="module" src="index.js"></script>
   ```
5. Jouez !

## Contrôles

- **Barre d’espace / Toute touche** : Sauter
