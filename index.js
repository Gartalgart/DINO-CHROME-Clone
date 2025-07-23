const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_LEVEL = 300;

const OBSTACLE_SIZE = 40;
const BIRD_SIZE = 40;
const DINO_SIZE = 80;
const DINO_X = 50;

const DINO_IMAGE = new Image();
DINO_IMAGE.src = "dino.png";

const BIRD_IMAGE = new Image();
BIRD_IMAGE.src = "bird.png";

const OBSTACLE_IMAGE = new Image();
OBSTACLE_IMAGE.src = "obstacle.png";

class Entity {
  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  draw(context) {
    //drawImage() est une méthode qui permet de dessiner dans le canvas.
    context.drawImage(this.image, this.x, this.y, this.width, this.height);

    //Dessiner la hitbox autour de l'entité
    context.strokeStyle = "#ff000050";
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Dino extends Entity {
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

class Bird extends Entity {
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

class Obstacle extends Entity {
  constructor(x, speed) {
    super(
      x,
      GROUND_LEVEL + OBSTACLE_SIZE + 5,
      OBSTACLE_SIZE,
      OBSTACLE_SIZE,
      OBSTACLE_IMAGE
    );
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }
}

const collides = (entity1, entity2) => {
  return (
    //Le bord gauche de entity1 est à gauche du bord droit de entity2.
    entity1.x < entity2.x + entity2.width &&
    //Le bord droit de entity1 est à droite du bord gauche de entity2.
    entity1.x + entity1.width > entity2.x && // Ces 2 première condition vérifie le chevauchement horizontale.
    //Le haut de entity1 est au-dessus du bas de entity2.
    entity1.y < entity2.y + entity2.height &&
    //Le bas de entity1 est en dessous du haut de entity2.
    entity1.y + entity1.height > entity2.y // Les 2 condition suivante vérifie le chevauchement verticale.

    /*
    Si les quatre conditions sont remplies :
    - Les deux rectangles se superposent partiellement 
    ou complètement → il y a collision → la fonction retourne true.
     */
  );
};

class Game {
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

const canvas = document.querySelector("canvas");
//console.log({ canvas });

const context = canvas.getContext("2d");

const game = new Game(context);

const frame = () => {
  if (game.play) {
    game.update(); // Nettois le canvas
    requestAnimationFrame(frame); //Re-demande une frame
  } else {
    context.font = "64px Arial bold";
    context.fillStyle = "#ff0000";
    context.fillText("GAME OVER !", GAME_WIDTH / 4, GAME_HEIGHT / 2);
  }
};

/*La méthode requestAnimationFrame() sert à créer une boucle d’animation
fluide et optimisée dans un navigateur, en synchronisant l'exécution
d'une fonction avec le taux de rafraîchissement de l'écran (généralement
60 images par seconde). */
requestAnimationFrame(frame);
