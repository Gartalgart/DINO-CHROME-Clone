export default class Entity {
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
