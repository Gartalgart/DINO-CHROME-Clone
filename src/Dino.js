import Entity from "./Entity.js";

import { DINO_SIZE, DINO_IMAGE, GROUND_LEVEL } from "./constants.js";

export default class Dino extends Entity {
  // Le mot-clé "extends" signifie que Dino hérite des propriétés/méthodes de Entity

  constructor(x, y) {
    // Appelle le constructeur de la classe parente (Entity) avec les bons paramètres :
    // position x/y, largeur, hauteur, image à afficher
    super(x, y, DINO_SIZE, DINO_SIZE, DINO_IMAGE);

    this.jumpVelocity = 0; // Vitesse verticale du saut
    this.trail = []; // Tableau pour stocker les positions du dino pour l'effet visuel de traînée
  }

  // Méthode appelée à chaque frame pour mettre à jour la position du dino
  update() {
    // Applique la vitesse verticale à la position verticale
    this.y += this.jumpVelocity;

    // Simule la gravité en augmentant progressivement la vitesse verticale
    this.jumpVelocity += 1;

    // Vérifie si le dino retombe au sol
    if (this.y > GROUND_LEVEL + 5) {
      this.y = GROUND_LEVEL + 5; // Le remet pile au niveau du sol
      this.jumpVelocity = 0; // Réinitialise la vitesse verticale
    }

    // Ajoute la position actuelle dans la "trail" pour afficher la traînée
    this.trail.push({ x: this.x, y: this.y });

    // Limite la taille de la traînée à 20 éléments (efface les plus vieux)
    if (this.trail.length > 20) {
      this.trail.shift();
    }
  }

  // Méthode pour dessiner le dino (et sa traînée) sur le canvas
  draw(context) {
    // Couleur gris clair pour les carrés de traînée
    context.fillStyle = "#aaaaaa";

    // Décale chaque point de la traînée vers la gauche (simule le mouvement)
    this.trail.forEach((t) => {
      t.x -= 5;
    });

    // Dessine un petit carré pour chaque point de la traînée
    this.trail.forEach((pos) => {
      context.fillRect(
        pos.x + this.width / 2, // Centre horizontal du dino
        pos.y + this.height / 2, // Centre vertical du dino
        5, // largeur du carré
        5 // hauteur du carré
      );
    });

    // Dessine le dino lui-même (image) via la méthode héritée de Entity
    super.draw(context);
  }

  // Méthode appelée quand on souhaite faire sauter le dino
  jump() {
    // Si le dino est au sol, il peut sauter
    if (this.y === GROUND_LEVEL + 5) {
      this.jumpVelocity = -18; // Impulsion vers le haut (valeur négative = montée)
    }

    /*
    Résumé :
    - On ne peut sauter que si le dino est au sol (empêche les doubles sauts)
    - La vitesse est négative pour initier un saut vers le haut
    */
  }
}
