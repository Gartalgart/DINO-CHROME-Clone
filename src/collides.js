export default function collides(entity1, entity2) {
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
}
