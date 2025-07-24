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
    context.font = "bold 64px Arial";
    context.fillStyle = "#ff0000";
    context.fillText("GAME OVER !", GAME_WIDTH / 4, GAME_HEIGHT / 2);
  }
};

requestAnimationFrame(frame);

// BACKGROUND_IMAGE.onload = () => {
//   requestAnimationFrame(frame);
// };

// BACKGROUND_IMAGE.onerror = () => {
//   console.error("Background image failed to load.");
//   requestAnimationFrame(frame); // Optionally start without background
// };
