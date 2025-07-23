import Entity from "./Entity.js";
import { BIRD_SIZE, BIRD_IMAGE, DINO_SIZE, GROUND_LEVEL } from "./constants.js";

export default class Bird extends Entity {
  constructor(x, speed) {
    super(x, GROUND_LEVEL - DINO_SIZE, BIRD_SIZE, BIRD_SIZE, BIRD_IMAGE);
    this.speed = speed;
    this.time = 0;
  }

  update() {
    this.x -= this.speed;
    this.y += Math.sin(this.time) * 2;
    /* 
    Le y change de manière sinusoïdale :

    - Math.sin(this.time) retourne une valeur entre -1 et 1.
    - En le multipliant par 2, on obtien une oscillation entre -2 et +2.
    - Cela fait monter et descendre l’objet doucement : un mouvement
     ondulatoire.
    */
    this.time += 0.1;
    /*
    On incrémente le temps (this.time) pour que Math.sin(this.time)
    évolue à chaque appel. Sans ça, le sinus resterait bloqué sur
    une valeur fixe.
    */
  }
}
