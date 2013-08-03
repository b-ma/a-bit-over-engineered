// Cette fonction doit faire clignoter les lignes d'une liste pendant 10 secondes (parce que c'est très joli)
//   - en changeant la classe CSS de "black" à "white" toutes les 2 secondes pour chaque ligne
//   - elle doit aussi remplir le nombre de clignotements passés dans la ligne
// À la fin des 10 secondes, je veux afficher le total de clignotements
// Mais le code ne fonctionne pas complètement, je ne sais pas pourquoi :(

// aBitOverIngineered
(function(document, undefined) {
    'use strict';

    var app = window.app = window.app || {};

    app.events = (function() {
        var cache = {};

        return {
            emit: function(channel, args) {
                if (!cache[channel]) { return; }

                cache[channel].forEach(function(func) {
                    func.apply(undefined, args);
                });
            },

            listen: function(channel, func) {
                if (!cache[channel]) {
                    cache[channel] = [];
                }

                cache[channel].push(func);
            }
        }
    }());

    // pulsar
    (function() {

        var delay = 2 * 1000;

        var pulse = function(elms) {
            var counter = 0,
                totalTime = 10 * 1000;

            (function pulse(counter) {
                if (!totalTime) {
                    app.events.emit('pulse:end', [counter]);
                    return;
                }

                counter += 1;
                totalTime -= delay;

                app.events.emit('pulse', [counter]);
                setTimeout(pulse, delay, counter);
            }(counter));
        };

        app.events.listen('pulse:start', pulse);

    }());

    // scene
    (function() {
        var rows = document.getElementsByTagName('li'),
            rowsLength = rows.length,
            classes = ['white', 'black'],
            waitingMessage = rows[0].innerHTML;

        var updateList = function(classname, text) {
            for (var i = 0; i < rowsLength; i += 1) {
                rows[i].className = classname;
                if (text) {
                    rows[i].innerHTML = text;
                }
            }
        }

        var onPulse = function(counter) {
            updateList(classes[counter % 2], counter);
        }

        var onEnd = function(counter) {
            alert(counter);
            updateList(classes[0], waitingMessage);
        }

        app.events.listen('pulse', onPulse);
        app.events.listen('pulse:end', onEnd);

    }());

    // control
    (function() {

        var btn = document.getElementById('launch');

        var launch = function(e) {
            e.preventDefault();
            app.events.emit('pulse:start');
        }

        var started = function() {
            btn.innerHTML = 'blinking...';
            btn.removeEventListener('click', launch);
        }

        var ended = function() {
            btn.innerHTML = 'start';
            btn.addEventListener('click', launch);
        }

        btn.addEventListener('click', launch, false);

        app.events.listen('pulse:start', started);
        app.events.listen('pulse:end', ended);

    }());

}(document));

/*
@TODO :
    - controller : button
    - popup with button to close
    - create a communication object (pubsub or something)
*/





























