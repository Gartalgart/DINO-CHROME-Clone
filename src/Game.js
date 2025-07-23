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
} from "./constants.js";

export default class Game {
  constructor(context) {
    this.context = context;
    this.dino = new Dino(DINO_X, GROUND_LEVEL + 5);
    this.entities = [this.dino];
    this.score = 0;
    this.speed = 5;
    this.play = true;

    this.spawnObstacle();

    document.addEventListener("keydown", () => {
      this.dino.jump();
    });

    this.scoreInterval = setInterval(() => {
      this.increseScore();
    }, 1000);
    this.speedInterval = setInterval(() => {
      this.increseSpeed();
    }, 1000);
  }

  increseScore() {
    this.score += 1;
  }

  increseSpeed() {
    this.speed += 0.1;
  }

  spawnObstacle() {
    if (Math.random() < 0.5) {
      this.entities.push(new Obstacle(GAME_WIDTH, this.speed));
    } else {
      this.entities.push(new Bird(GAME_WIDTH, this.speed));
    }

    //Plus la partie est rapide, plus les obstacles apparaissent vite
    //Mais jamais moins de 500ms entre deux apparitions
    setTimeout(() => {
      if (this.play) {
        this.spawnObstacle();
      }
    }, Math.max(500, 2000 - this.speed * 5));
  }

  update() {
    //Nettoie l'écran lors de l'appel de update
    this.context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.drawScore();
    //Définie la couleur verte
    this.context.fillStyle = "green";
    //Dessine un rectangle à partir de GROUND_LEVEL de largeur GAME_WITH et de hauteur GAME_height
    this.context.fillRect(
      0,
      GROUND_LEVEL + DINO_SIZE,
      GAME_WIDTH,
      GAME_HEIGHT - (GROUND_LEVEL + DINO_SIZE)
    );

    this.entities.forEach((entity) => {
      entity.update();
      entity.draw(this.context);
    });

    const isCollides = this.entities.some((entity) => {
      if (entity === this.dino) return false;
      return collides(this.dino, entity);
    });

    if (isCollides) {
      this.play = false;
      clearInterval(this.scoreInterval);
      clearInterval(this.speedInterval);
    }
  }

  drawScore() {
    this.context.fontStyle = "20px Arial";
    this.context.fillStyle = "#000000";
    this.context.fillText(`Score: ${this.score}`, 10, 30);
  }
}
