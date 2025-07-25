import Game from "./src/Game.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./src/constants.js";

// Sélectionne le canvas HTML où sera affiché le jeu
const canvas = document.querySelector("canvas");

// Fonction pour redimensionner dynamiquement le canvas en fonction de la taille de l'écran
const resizeCanvas = () => {
  // Limite la largeur à 800px max et la hauteur à 400px max
  let width = Math.min(window.innerWidth, 800);
  let height = Math.min(window.innerHeight, 400);

  // Si l’écran est en mode portrait, on inverse largeur/hauteur pour forcer un format paysage
  if (height > width) {
    [width, height] = [height, width];
  }

  // Applique les dimensions calculées au canvas
  canvas.width = width;
  canvas.height = height;
};

// Met à jour le canvas et recrée une instance du jeu à chaque redimensionnement de fenêtre
window.addEventListener("resize", () => {
  resizeCanvas();
  game = new Game(context, canvas.width, canvas.height);
});

// Récupère le contexte de dessin 2D (permet de dessiner sur le canvas)
let context = canvas.getContext("2d");

// Sélectionne les boutons HTML pour redémarrer le jeu et passer en plein écran
const restartbtn = document.getElementById("btn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const gameWrapper = document.getElementById("container"); // élément englobant le canvas

// Gestion du bouton plein écran, compatible avec différents navigateurs
fullscreenBtn.addEventListener("click", () => {
  if (gameWrapper.requestFullscreen) {
    gameWrapper.requestFullscreen();
  } else if (gameWrapper.webkitRequestFullscreen) {
    gameWrapper.webkitRequestFullscreen(); // Safari
  } else if (gameWrapper.msRequestFullscreen) {
    gameWrapper.msRequestFullscreen(); // IE
  }
});

// Crée une instance du jeu avec le contexte 2D et les dimensions actuelles du canvas
let game = new Game(context, canvas.width, canvas.height);

// Charge un effet sonore à jouer lors du game over
let gameOverSoundEffect = new Audio("./audios/game_over.wav");

// Stocke l’identifiant de l’animation en cours (pour pouvoir l’annuler)
let animationId = null;

// Écoute les touches clavier : quand une touche est pressée, le dino saute
document.addEventListener("keydown", () => {
  if (game && game.dino && game.play) {
    game.dino.jump();
  }
});

// Permet au joueur de sauter en appuyant sur l’écran (support mobile)
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Empêche le zoom ou scroll par défaut
  if (game && game.dino && game.play) {
    game.dino.jump();
  }
});

// Boucle d’animation principale appelée à chaque frame (~60 fois par seconde)
const frame = () => {
  if (game.play) {
    game.update(); // Efface et redessine la scène (mise à jour du jeu)
    animationId = requestAnimationFrame(frame); // Demande la frame suivante
  } else {
    // Si le jeu est terminé : affiche "GAME OVER" et joue le son
    gameOverSoundEffect.play();
    context.font = "bold 64px Arial";
    context.fillStyle = "#ff0000";
    context.fillText("GAME OVER !", GAME_WIDTH / 4, GAME_HEIGHT / 2);
  }
};

// Quand on clique sur le bouton Restart :
restartbtn.addEventListener("click", () => {
  if (animationId) {
    cancelAnimationFrame(animationId); // Stoppe la boucle précédente
  }
  // Recrée une instance du jeu (réinitialisation)
  game = new Game(context, canvas.width, canvas.height);

  // Redémarre la boucle d’animation
  frame();

  // Enlève le focus visuel du bouton (évite déclenchements clavier non voulus)
  restartbtn.blur();
});

// Lance la boucle d’animation initiale au chargement de la page
frame();
