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
  // BACKGROUND_IMAGE,
} from "./constants.js";

export default class Game {
  constructor(context, width, height) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.dino = new Dino(DINO_X, GROUND_LEVEL + 5);
    this.entities = [this.dino];
    this.score = 0;
    this.speed = 5;
    this.bonusText = null;
    this.soundEffectBonus = new Audio("./audios/bonus.wav");
    this.play = true;

    this.spawnObstacle();

    // document.addEventListener("keydown", () => {
    //   this.dino.jump();
    // });

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
    //Coleur du background
    this.context.fillStyle = CANVAS_COLOR;
    this.context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.drawScore();
    //Définie la couleur verte
    this.context.fillStyle = GROUND_COLOR;
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

    if (this.bonusText && this.bonusText.timer > 0) {
      this.context.font = "bold 24px Arial";
      this.context.fillStyle = "#ffff00";
      this.context.fillText("+10", this.bonusText.x, this.bonusText.y);
      this.bonusText.timer--;
    } else if (this.bonusText && this.bonusText.timer <= 0) {
      this.bonusText = null;
    }

    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity === this.dino) continue;

      if (collides(this.dino, entity)) {
        if (entity instanceof Bird) {
          this.score += 10;
          this.bonusText = {
            x: this.dino.x + 10,
            y: this.dino.y - 10,
            timer: 60,
          };
          this.soundEffectBonus.currentTime = 0;
          this.soundEffectBonus.play();
          this.entities.splice(i, 1); //Retire bird de entities
          i--; //Ajuste l'index en conséquence
        } else if (entity instanceof Obstacle) {
          this.play = false;
          clearInterval(this.scoreInterval);
          clearInterval(this.speedInterval);
          break;
        }
      }
    }
  }

  drawScore() {
    this.context.font = "24px Arial";
    this.context.fillStyle = "#ffffff";
    this.context.fillText(`Score: ${this.score}`, 10, 30);
  }
}
