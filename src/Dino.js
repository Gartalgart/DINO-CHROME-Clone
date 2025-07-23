import Entity from "./Entity.js";
import { DINO_SIZE, DINO_IMAGE, GROUND_LEVEL } from "./constants.js";

export default class Dino extends Entity {
  // extends créé une class enfant à partir d'une class parent.
  constructor(x, y) {
    super(x, y, DINO_SIZE, DINO_SIZE, DINO_IMAGE); //Super appelle le constructeur du parent (obligatoire en premier avant this)
    this.jumpVelocity = 0;
    this.trail = [];
  }

  update() {
    this.y += this.jumpVelocity; // Si jumpVelocity négatif dino monte, si positif dino descent.
    this.jumpVelocity += 1; // À chaque frame la vitesse augmente de 1. Cela ralentit la monté et accélaire la descente.

    if (this.y > GROUND_LEVEL + 5) {
      this.y = GROUND_LEVEL + 5;
      this.jumpVelocity = 0;

      /*
      Si le dino dépasse le sol (GROUND_LEVEL + 5) :
      - Il est remis pile au sol.
      - Sa vitesse verticale est réinitialisée à 0.
      - Il est prêt pour un nouveau saut.
      */
    }

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 20) {
      this.trail.shift();
    }
  }

  draw(context) {
    context.fillStyle = "#aaaaaa";
    this.trail.forEach((t) => {
      t.x -= 5;
    });
    this.trail.forEach((pos) => {
      context.fillRect(pos.x + this.width / 2, pos.y + this.height / 2, 5, 5);
    });
    super.draw(context);
  }

  jump() {
    if (this.y === GROUND_LEVEL + 5) {
      this.jumpVelocity = -18;
    }
    /*
    Si le dino est au niveau du sol alors on lui applique
    une impulsion vers le haut.
    */
  }
}
