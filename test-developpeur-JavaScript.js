// Cette fonction doit faire clignoter les lignes d'une liste pendant 10 secondes (parce que c'est très joli)
//   - en changeant la classe CSS de "black" à "white" toutes les 2 secondes pour chaque ligne
//   - elle doit aussi remplir le nombre de clignotements passés dans la ligne
// À la fin des 10 secondes, je veux afficher le total de clignotements
// Mais le code ne fonctionne pas complètement, je ne sais pas pourquoi :(

var total = currentId = clignotements = 0;
var currentNode;
var rows = document.getElementsByTagName('li');

while(currentNode = rows.shift()) {
  currentId = currentId + 1;
  clignotements = currentId * 2 * 10;
  total = currentId;
    
  setInterval("currentNode.className = 'black';currentNode.innerHTML = clignotements", 200);
  setInterval("currentNode.className = 'white';currentNode.innerHTML = clignotements", 400);
}

setTimeout("alert('Le total des clignotements est:' + clignotements)", 1000);