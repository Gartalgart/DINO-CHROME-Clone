import Game from "./src/Game.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./src/constants.js";

const canvas = document.querySelector("canvas");
//console.log({ canvas });

let context = canvas.getContext("2d");

const restartbtn = document.getElementById("btn");

let game = new Game(context);
let animationId = null;

document.addEventListener("keydown", () => {
  if (game && game.dino && game.play) {
    game.dino.jump();
  }
});

const frame = () => {
  if (game.play) {
    game.update(); // Nettois le canvas
    animationId = requestAnimationFrame(frame); //Re-demande une frame
  } else {
    context.font = "bold 64px Arial";
    context.fillStyle = "#ff0000";
    context.fillText("GAME OVER !", GAME_WIDTH / 4, GAME_HEIGHT / 2);
  }
};

restartbtn.addEventListener("click", () => {
  //console.log("click");
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  game = new Game(context);
  frame();
  restartbtn.blur();
});

frame();
