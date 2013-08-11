// Cette fonction doit faire clignoter les lignes d'une liste pendant 10 secondes (parce que c'est très joli)
//   - en changeant la classe CSS de "black" à "white" toutes les 2 secondes pour chaque ligne
//   - elle doit aussi remplir le nombre de clignotements passés dans la ligne
// À la fin des 10 secondes, je veux afficher le total de clignotements
// Mais le code ne fonctionne pas complètement, je ne sais pas pourquoi :(

// @TODO (eventually) :
//      - String.prototype.format (to diplay result)
//      - nodeList.prototype.forEach

// aBitOverIngineered
(function(window, document, undefined) {
    'use strict';

    var app = window.app = window.app || {};

    // events
    app.events = (function() {
        var cache = {};

        return {
            emit: function(channel, args) {
                if (!cache[channel]) { return; }

                cache[channel].forEach(function(func) {
                    func.apply(window, args);
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

        var period = 2 * 1000,
            counter, totalTime, divider;

        var setDivider = function(nbrRows) {
            divider = nbrRows;
        }

        var pulse = function(fx) {
            counter = 0;
            totalTime = 10 * 1000;

            (function pulse(counter) {
                if (!totalTime) {
                    app.events.emit('pulsar:end', [counter]);
                    return;
                }
                var delay = fx ? period / divider : period;
                totalTime -= delay;
                counter += 1;

                app.events.emit('pulsar:pulse', [counter, fx]);
                setTimeout(pulse, delay, counter);
            }(counter));
        };

        app.events.listen('pulsar:start', pulse);
        app.events.listen('rows:length', setDivider);
    }());

    // scene
    (function() {
        var rows = document.getElementsByTagName('li'),
            rowsLength = rows.length,
            classes = ['white', 'black'],
            waitingMessage = rows[0].innerHTML;

        app.events.emit('rows:length', [rowsLength]);

        var showResult = function(counter) {
            var modal = document.createElement('div');
            var firstNode = document.body.firstChild;

            modal.id = 'result';
            modal.innerHTML = 'Result : ' + counter;

            document.body.insertBefore(modal, firstNode);

            setTimeout(function() {
                modal.parentNode.removeChild(modal);
            }, 3000);
        }

        var updateList = function(counter, text) {
            for (var i = 0; i < rowsLength; i += 1) {
                updateRow(i, counter, text, classes[counter % 2]);
            }
        }

        var updateRow = function(index, counter, text, classname) {
            rows[index].className = classname;
            if (text) {
                rows[index].innerHTML = text;
            }
        }

        var onPulse = function(counter, fx) {
            if (fx) {
                var fxClasses = classes.map(function(classname) { return classname + ' anim' }),
                    index = (counter - 1) % rowsLength,
                    classIndex = (parseInt((counter - 1) / rowsLength, 10) + 1) % 2;

                updateRow(index, counter, counter + '', fxClasses[classIndex]);
            } else {
                updateList(counter, counter);
            }
        }

        var onEnd = function(counter) {
            showResult(counter);
            updateList(0, waitingMessage);
        }

        app.events.listen('pulsar:pulse', onPulse);
        app.events.listen('pulsar:end', onEnd);

    }());

    // control
    (function() {

        var btn = document.getElementById('launch');
        var fx  = document.getElementById('fx');

        var launch = function(e) {
            e.preventDefault();

            var isFx = fx.checked;
            app.events.emit('pulsar:start', [isFx]);
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

        app.events.listen('pulsar:start', started);
        app.events.listen('pulsar:end', ended);

    }());

}(window, document));

