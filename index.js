import Game from "./src/Game.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./src/constants.js";

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
