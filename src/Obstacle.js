import Entity from "./Entity.js";
import { OBSTACLE_SIZE, OBSTACLE_IMAGE, GROUND_LEVEL } from "./constants.js";

export default class Obstacle extends Entity {
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
