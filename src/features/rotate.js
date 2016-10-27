/**
 * Created by kuankit on 3/24/2016.
 */

"use strict";

//> function that processes the angle value to be emitted & stored in the state
//> the emitted angle values is always +ve indicating to the subscriber how much was
//> rotated clockwise
function processAngle(updatedAngle){
  //> 0 is the default value.
  var angle = updatedAngle;

  //> do the following processing if its not zero. Else, return
  if(updatedAngle!==0){
    //> its positive and clockwise
    if(updatedAngle > 0){
      if(updatedAngle >= 360){
        updatedAngle = updatedAngle - 360;
      }
    }else{ //> its negative and anti-clockwise
      if(updatedAngle >= -360){
        updatedAngle = updatedAngle + 360;
      }else{
        updatedAngle = 2(360) + updatedAngle;
      }
    }
  }
  return updatedAngle; //> return the updatedAngle
}

/**
 * Exported object takes in the event and the widgetObj
 * This contains code for rotating the image with center of canvas as point of rotation of image
 */
module.exports = function(event, widgetObj) {
    console.log('Beginning rotate ... ');

    //> get the canvas context - canvas origin was restored after drawing image
    var ctx = widgetObj.ctx;

    //> get the canvas width and height
    var canvasWidth = widgetObj.canvasObject.width;
    var canvasHeight = widgetObj.canvasObject.height;

    //> clear the displayed canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //> save the context before translating
    ctx.save();

    //> translate to the center of the canvas
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    //> get the angle to rotate
    var angle = widgetObj.state.options.featureConfig[event.target.name];

    //> update the marko rotate state
    widgetObj.state.rotate = widgetObj.state.rotate + (angle);

    //> set the value in the dataObj of the marko state so that it can be emitted
    //> there is always only 1 value for rotate - nothing specific to rotateleft or rotateright
    //> process the angle before setting it
    widgetObj.state.rotate = processAngle(widgetObj.state.rotate);
    widgetObj.state.actions['rotate'] = widgetObj.state.rotate;

    //> perform the rotate
    ctx.rotate(widgetObj.state.rotate * Math.PI / 180);

    //> translate back to the origin 0,0 after rotating the canvas by its center
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

    //> all work done. But the image is again translated to maintain aspect ration.
    //> undo the translation by restoring the state of the canvas
    ctx.restore();
    console.log('complete rotate..');
};
