'use strict';
var zoom = require('../features/zoom');
var rotate = require('../features/rotate');
var brightness = require('../features/brightness');
var contrast = require('../features/contrast');
var reset = require('../features/reset');
var crop = require('../features/crop');

module.exports = {
    featureHandler : {
        zoom: zoom,
        rotateleft: rotate,
        rotateright: rotate,
        brightness: brightness,
        contrast: contrast,
        crop: crop,
        reset: reset
    }
};
