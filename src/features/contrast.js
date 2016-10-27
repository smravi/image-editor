/**
 * Created by smravi on 4/6/2016.
 */
"use strict";

/**
 * Exported object takes in the event and the widgetObj
 * This contains code for increasing brightness of the image
 */
module.exports = function(event, widgetObj) {
    //> get the current position of the range element = currentvalue
    var delta = parseInt(event.srcElement.value);

    //> set the value in the dataObj of the marko state so that it can be emitted
    widgetObj.state.actions['contrast'] = delta;

    //> Get the tempCanvasContext
    var tempCanvasContext = widgetObj.tempCanvasContext;

    //> Get the tempCanvas- this is not a part of the DOM
    var tempCanvas = widgetObj.tempCanvas;

    //> Clear the tempCanvas
    tempCanvasContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    //> Save the tempCanvas context
    tempCanvasContext.save();

    //> Draw the original image into the tempCanvas - complying with aspect ratio
    //> Since aspect ratio compliance is checked, the tempCanvas is translated
    tempCanvasContext.drawImage(widgetObj.img, 0, 0, widgetObj.img.width, widgetObj.img.height,
        widgetObj.state.edits.centerShiftX, widgetObj.state.edits.centerShiftY,
        widgetObj.img.width * widgetObj.state.edits.ratio, widgetObj.img.height * widgetObj.state.edits.ratio);

    //> Restore the tempCanvasContext
    tempCanvasContext.restore();

    //> Get the imageData from the tempCanvas
    var pixels = tempCanvasContext.getImageData(0, 0, widgetObj.tempCanvasWidth, widgetObj.tempCanvasHeight);

    //> Get the pixelDataArray
    var pixelDataArray = pixels.data;

    //> begin: processing pixels
    console.log('Beginning increaseContrast...');
    delta = Math.floor(255 * (delta / 100));
    for (var i = 0; i < pixelDataArray.length; i += 4) {
        var brightness = (pixelDataArray[i]+pixelDataArray[i+1]+pixelDataArray[i+2])/3; //get the brightness
        pixelDataArray[i] += (brightness > 127) ? delta : -delta; // red
        pixelDataArray[i + 1] += (brightness > 127) ? delta : -delta; // green
        pixelDataArray[i + 2] += (brightness > 127) ? delta : -delta; // blue
    }
    //> end: processing pixels

    //> clear the primary displayed canvas
    widgetObj.ctx.clearRect(0, 0, widgetObj.canvasObject.width, widgetObj.canvasObject.height);

    //> save the current context of the primary canvasObject
    widgetObj.ctx.save();

    //> put the imageData extracted from tempCanvas into the primary canvas
    widgetObj.ctx.putImageData(pixels, 0, 0);

    //> restore the current context of the primary canvasObject
    widgetObj.ctx.restore();
    console.log('complete increaseContrast...');
};
