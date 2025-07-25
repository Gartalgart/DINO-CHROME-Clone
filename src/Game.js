import Dino from "./Dino.js";
import Bird from "./Bird.js";
import Obstacle from "./Obstacle.js";
import collides from "./collides.js";

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  DINO_X,
  DINO_SIZE,
  GROUND_LEVEL,
  CANVAS_COLOR,
  GROUND_COLOR,
} from "./constants.js";

export default class Game {
  constructor(context, width, height) {
    this.context = context; // Contexte de dessin du canvas
    this.width = width; // Largeur du canvas
    this.height = height; // Hauteur du canvas
    this.dino = new Dino(DINO_X, GROUND_LEVEL + 5); // Crée le dino à la bonne position

    this.entities = [this.dino]; // Tableau contenant tous les objets visibles du jeu
    this.score = 0; // Score du joueur
    this.speed = 5; // Vitesse du jeu (augmente progressivement)
    this.bonusText = null; // Texte affiché quand un bonus est obtenu
    this.soundEffectBonus = new Audio("./audios/bonus.wav"); // Son joué lors du bonus
    this.play = true; // Booléen pour savoir si le jeu est en cours

    this.spawnObstacle(); // Lance l'apparition initiale d'obstacles

    // Incrémente automatiquement le score toutes les secondes
    this.scoreInterval = setInterval(() => {
      this.increseScore();
    }, 1000);

    // Augmente progressivement la vitesse du jeu toutes les secondes
    this.speedInterval = setInterval(() => {
      this.increseSpeed();
    }, 1000);
  }

  // Méthode appelée pour augmenter le score
  increseScore() {
    this.score += 1;
  }

  // Méthode appelée pour augmenter la vitesse
  increseSpeed() {
    this.speed += 0.1;
  }

  // Fait apparaître un obstacle ou un oiseau de façon aléatoire
  spawnObstacle() {
    if (Math.random() < 0.5) {
      this.entities.push(new Obstacle(GAME_WIDTH, this.speed));
    } else {
      this.entities.push(new Bird(GAME_WIDTH, this.speed));
    }

    // Répète l’apparition de manière dynamique selon la vitesse
    setTimeout(() => {
      if (this.play) {
        this.spawnObstacle();
      }
    }, Math.max(300, 2000 - this.speed * 5)); // Jamais moins de 300ms entre deux apparitions
  }

  // Méthode principale qui met à jour l’état du jeu à chaque frame
  update() {
    // Efface complètement le canvas
    this.context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Colore le fond du canvas
    this.context.fillStyle = CANVAS_COLOR;
    this.context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Affiche le score actuel
    this.drawScore();

    // Dessine le sol en bas de l’écran
    this.context.fillStyle = GROUND_COLOR;
    this.context.fillRect(
      0,
      GROUND_LEVEL + DINO_SIZE,
      GAME_WIDTH,
      GAME_HEIGHT - (GROUND_LEVEL + DINO_SIZE)
    );

    // Met à jour et dessine chaque entité du jeu (dino, oiseaux, obstacles…)
    this.entities.forEach((entity) => {
      entity.update(); // Position/mouvement
      entity.draw(this.context); // Affichage
    });

    // Si un texte bonus est en cours d'affichage, le dessiner
    if (this.bonusText && this.bonusText.timer > 0) {
      this.context.font = "bold 24px Arial";
      this.context.fillStyle = "#ffff00";
      this.context.fillText("+10", this.bonusText.x, this.bonusText.y);
      this.bonusText.timer--; // Réduit la durée d'affichage du texte
    } else if (this.bonusText && this.bonusText.timer <= 0) {
      this.bonusText = null; // Supprime le texte une fois le temps écoulé
    }

    // Boucle de détection de collision
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity === this.dino) continue; // Ne pas tester la collision du dino avec lui-même

      if (collides(this.dino, entity)) {
        // Si le dino touche un oiseau
        if (entity instanceof Bird) {
          this.score += 10;

          // Affiche un texte bonus +10 à côté du dino
          this.bonusText = {
            x: this.dino.x + 10,
            y: this.dino.y - 10,
            timer: 60, // durée du texte (en frames)
          };
          // Joue le son bonus
          this.soundEffectBonus.currentTime = 0;
          this.soundEffectBonus.play();

          // Supprime l'oiseau des entités
          this.entities.splice(i, 1);
          i--; // Corrige l’index suite à la suppression
        }

        // Si le dino touche un obstacle : game over
        else if (entity instanceof Obstacle) {
          this.play = false; // Stoppe le jeu
          clearInterval(this.scoreInterval); // Arrête le compteur de score
          clearInterval(this.speedInterval); // Arrête l’accélération
          break; // Sort de la boucle
        }
      }
    }
  }

  // Affiche le score en haut à gauche de l’écran
  drawScore() {
    this.context.font = "24px Arial";
    this.context.fillStyle = "#ffffff";
    this.context.fillText(`Score: ${this.score}`, 10, 30);
  }
}
