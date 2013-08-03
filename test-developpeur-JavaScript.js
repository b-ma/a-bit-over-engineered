// Cette fonction doit faire clignoter les lignes d'une liste pendant 10 secondes (parce que c'est très joli)
//   - en changeant la classe CSS de "black" à "white" toutes les 2 secondes pour chaque ligne
//   - elle doit aussi remplir le nombre de clignotements passés dans la ligne
// À la fin des 10 secondes, je veux afficher le total de clignotements
// Mais le code ne fonctionne pas complètement, je ne sais pas pourquoi :(

(function(document, undefined) {
    'use strict';

    var app = window.app = window.app || {};

    var totalTime = 10 * 1000,
        delay = 2 * 1000,
        classes = ['white', 'black'];

    app.pulse = function(elms) {
        var elmsLength = elms.length;
        var counter = 0;

        (function pulse(counter) {
            // extends Array.prototype
            for (var i = 0; i < elmsLength; i += 1) {
                elms[i].className = classes[counter % 2];
                elms[i].innerHTML = counter;
            }

            if (!totalTime) {
                alert(counter);
            } else {
                totalTime -= delay;
                setTimeout(pulse, delay, counter += 1);
            }
        }(counter));
    }
    // */

}(document));

(function(document, undefined) {
    'use strict';
    // configure totalTime, delay, classes...
    var elms = document.getElementsByTagName('li');
    app.pulse(elms);

}(document));
/*
@TODO :
    - controller : button
    - popup with button to close
    - create a communication object (pubsub or something)
*/





























