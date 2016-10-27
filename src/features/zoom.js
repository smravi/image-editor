/**
 * Created by smravi on 3/16/2016.
 */
'use strict';

/**
 * Exported object takes in the event and the widgetObj
 * This contains code for zooming into the image & zooming out of the image with origin as center of the image
 */
module.exports = function(event, widgetObj) {
    console.log('Beginning zoomin process...');

    //> get the widget context
    var ctx = widgetObj.ctx;

    //> get the canvas width
    var canvasWidth = widgetObj.canvasObject.width;

    //> get the canvas height
    var canvasHeight = widgetObj.canvasObject.height;

    //> get the zoom element
    var zoomEle = widgetObj.getEl('zoom');

    //> get the current position of the range element
    var scale = zoomEle.value;
    console.log(scale);

    //> set the value in the dataObj of the marko state so that it can be emitted
    widgetObj.state.actions['zoom'] = scale;

    //> clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //> since the zoom is about the center of the canvas over an image corrected with aspect ratio.
    //> save the context to restore it later
    ctx.save();

    //> translate to center of canvas
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    //> scale the canvas by a required step
    ctx.scale(scale, scale);

    //> reset the canvasCoordinates back to 0,0
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    //> draw the image into the canvas in compliance with its aspect ratio
    //> sx=0, sy=0 imgWidth, imgHeight indicate no portion of image is to be clipped
    //> we use the entire image.
    //> x = coordinates to place image on canvas = widgetObj.state.edits.centerShiftX
    //> y = coordinates to place image on canvas = widgetObj.state.edits.centerShiftY
    //> this is the next translation we do for the sake of aspect ratio
    //> width of image to use = widgetObj.img.width * widgetObj.state.edits.ratio
    //> height of image to use = widgetObj.img.height * widgetObj.state.edits.ratio
    //> height and width calculations is done to maintain aspect ratio
    ctx.drawImage(widgetObj.img, 0, 0, widgetObj.img.width, widgetObj.img.height,
        widgetObj.state.edits.centerShiftX, widgetObj.state.edits.centerShiftY,
        widgetObj.img.width * widgetObj.state.edits.ratio, widgetObj.img.height * widgetObj.state.edits.ratio);

    //> translation was done while drawing the image. So, restore the context.
    ctx.restore();
    console.log('zoomin process complete...');
};
