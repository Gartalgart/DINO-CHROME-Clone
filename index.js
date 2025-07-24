import Game from "./src/Game.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./src/constants.js";

const canvas = document.querySelector("canvas");

const resizeCanvas = () => {
  let width = Math.min(window.innerWidth, 800);
  let height = Math.min(window.innerHeight, 400);

  if (height > width) {
    [width, height] = [height, width];
  }

  canvas.width = width;
  canvas.height = height;
};

window.addEventListener("resize", () => {
  resizeCanvas();
  game = new Game(context, canvas.width, canvas.height);
});

let context = canvas.getContext("2d");

const restartbtn = document.getElementById("btn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const gameWrapper = document.getElementById("container");

fullscreenBtn.addEventListener("click", () => {
  if (gameWrapper.requestFullscreen) {
    gameWrapper.requestFullscreen();
  } else if (gameWrapper.webkitRequestFullscreen) {
    gameWrapper.webkitRequestFullscreen();
  } else if (gameWrapper.msRequestFullscreen) {
    gameWrapper.msRequestFullscreen();
  }
});

let game = new Game(context, canvas.width, canvas.height);
let gameOverSoundEffect = new Audio("./audios/game_over.wav");
let animationId = null;

document.addEventListener("keydown", () => {
  if (game && game.dino && game.play) {
    game.dino.jump();
  }
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (game && game.dino && game.play) {
    game.dino.jump();
  }
});

const frame = () => {
  if (game.play) {
    game.update(); // Nettois le canvas
    animationId = requestAnimationFrame(frame); //Re-demande une frame
  } else {
    gameOverSoundEffect.play();
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
  game = new Game(context, canvas.width, canvas.height);
  frame();
  restartbtn.blur(); //Cela signifie que le bouton Restart perd le focus immédiatement après avoir été cliqué.
});

frame();
