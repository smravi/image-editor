/**
 * Created by smravi on 4/11/2016.
 */
'use strict';

module.exports = function(event, widgetObj) {
    console.log('Resetting the image.. Beginning');

    //> clear the canvas
    widgetObj.ctx.clearRect(0, 0, widgetObj.canvasObject.width, widgetObj.canvasObject.height);

    //> save the current context
    widgetObj.ctx.save();

    //> draw the image into the canvas in compliance with its aspect ratio
    //> sx=0, sy=0 imgWidth, imgHeight indicate no portion of image is to be clipped
    //> we use the entire image.
    //> x = coordinates to place image on canvas = widgetObj.state.edits.centerShiftX
    //> y = coordinates to place image on canvas = widgetObj.state.edits.centerShiftY
    //> this is a translation we do for the sake of aspect ratio
    //> width of image to use = widgetObj.img.width * widgetObj.state.edits.ratio
    //> height of image to use = widgetObj.img.height * widgetObj.state.edits.ratio
    //> height and width calculations is done to maintain aspect ratio
    widgetObj.ctx.drawImage(widgetObj.img, 0, 0, widgetObj.img.width, widgetObj.img.height,
        widgetObj.state.edits.centerShiftX, widgetObj.state.edits.centerShiftY,
        widgetObj.img.width * widgetObj.state.edits.ratio, widgetObj.img.height * widgetObj.state.edits.ratio);

    //> the context is translated. This must be restored
    widgetObj.ctx.restore();

    //> reset the values in the dataObj of the marko state so that it can be emitted
    //> there is no separate entry in the actions object for reset. the feature name is reset
    widgetObj.state.actions = {};

    //> post reset, all the range elements must be brought to default values
    //> reset zoom ranger
    var zoomEle = widgetObj.getEl('zoom');
    zoomEle.value = 1; //> default zoom scale

    //> reset brightness ranger
    var brightnessEle = widgetObj.getEl('brightness');
    brightnessEle.value = 0;

    //> reset contrast ranger
    var contrastEle = widgetObj.getEl('contrast');
    contrastEle.value = 0;

    //> reset the widget state for any rotates
    widgetObj.state.rotate = 0;

    console.log('Resetting the image.. completed');
};
