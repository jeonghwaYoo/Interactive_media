function convertStyle(styleObj) {
    var style = '';

    for (var prop in styleObj) {
        if (styleObj.hasOwnProperty(prop)) {
            style += (prop + ':' + styleObj[prop] + ';');
        }
    }

    return style;
}

var Effect = {

    // Effect duration
    duration: 5000,

    // Effect delay (check for scroll before showing effect)
    delay: 50,

    show: function(element, x, y, velocity) {

        element = element || this;
        var x = typeof x !== 'undefined' ?  x : 0;
        var y = typeof y !== 'undefined' ?  y : 0;

        // Create ripple
        var ripple = document.createElement('div');
        ripple.className = 'waves-ripple waves-rippling';
        element.appendChild(ripple);

        // Get click coordinate and element width
        var relativeY = x;
        var relativeX = y;

        var scale     = 'scale(' + ((element.clientWidth / 100) * 3) + ')';
        var translate = 'translate(0,0)';

        if (velocity) {
            translate = 'translate(' + (velocity.x) + 'px, ' + (velocity.y) + 'px)';
        }

        // Attach data to element
        ripple.setAttribute('data-hold', Date.now());
        ripple.setAttribute('data-x', relativeX);
        ripple.setAttribute('data-y', relativeY);
        ripple.setAttribute('data-scale', scale);
        ripple.setAttribute('data-translate', translate);
        // Set ripple position
        var rippleStyle = {
            top: relativeY + 'px',
            left: relativeX + 'px'
        };

        ripple.classList.add('waves-notransition');
        ripple.setAttribute('style', convertStyle(rippleStyle));
        ripple.classList.remove('waves-notransition');
        // Scale the ripple
        rippleStyle['-webkit-transform'] = scale + ' ' + translate;
        rippleStyle['-moz-transform'] = scale + ' ' + translate;
        rippleStyle['-ms-transform'] = scale + ' ' + translate;
        rippleStyle['-o-transform'] = scale + ' ' + translate;
        rippleStyle.transform = scale + ' ' + translate;
        rippleStyle.opacity = '1';

        var duration = Effect.duration;
        rippleStyle['-webkit-transition-duration'] = duration + 'ms';
        rippleStyle['-moz-transition-duration']    = duration + 'ms';
        rippleStyle['-o-transition-duration']      = duration + 'ms';
        rippleStyle['transition-duration']         = duration + 'ms';

        ripple.setAttribute('style', convertStyle(rippleStyle));
    },

    hide: function(element) {
        element = element || this;
        var ripples = element.getElementsByClassName('waves-rippling');

        for (var i = 0, len = ripples.length; i < len; i++) {
            removeRipple(element, ripples[i]);
        }
    }
};

/**
 * Hide the effect and remove the ripple. Must be
 * a separate function to pass the JSLint...
 */
function removeRipple(el, ripple) {

    // Check if the ripple still exist
    if (!ripple) {
        return;
    }

    ripple.classList.remove('waves-rippling');

    var relativeX = ripple.getAttribute('data-x');
    var relativeY = ripple.getAttribute('data-y');
    var scale     = ripple.getAttribute('data-scale');
    var translate = ripple.getAttribute('data-translate');

    // Get delay beetween mousedown and mouse leave
    var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
    var delay = 350 - diff;

    if (delay < 0) {
        delay = 0;
    }

    // Fade out ripple after delay
    var duration = Effect.duration;

    setTimeout(function() {

        var style = {
            top: relativeY + 'px',
            left: relativeX + 'px',
            opacity: '0',

            // Duration
            '-webkit-transition-duration': duration + 'ms',
            '-moz-transition-duration': duration + 'ms',
            '-o-transition-duration': duration + 'ms',
            'transition-duration': duration + 'ms',
            '-webkit-transform': scale + ' ' + translate,
            '-moz-transform': scale + ' ' + translate,
            '-ms-transform': scale + ' ' + translate,
            '-o-transform': scale + ' ' + translate,
            'transform': scale + ' ' + translate
        };

        ripple.setAttribute('style', convertStyle(style));

        setTimeout(function() {
            try {
                el.removeChild(ripple);
            } catch (e) {
                return false;
            }
        }, duration);

    }, delay);
}

function getWavesEffectElement(e) {

    var element = null;
    var target = e;

    while (target.parentElement) {
        if (target.classList.contains('waves-effect')) {
            element = target;
            break;
        }
        target = target.parentElement;
    }

    return element;
}

function showEffect(e) {

    var element = getWavesEffectElement(e);

    if (element !== null) {
      Effect.show(element);
      Effect.hide(element);
    }
}
