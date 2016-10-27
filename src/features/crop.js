/**
 * Created by smravi on 4/11/2016.
 */

//> this variable detects if mouse button is down
var isMouseDown = false;

//> coordinates for mousedown
var mousedown = {};

//> this object holds the cropDiv coordinates & will be emitted
var cropRectangle = {};

//> variable to detect if cropDiv is being dragged
var dragging = false;

//> current widgetObject
var widgetObject;

//> move the cropDiv to that position - so set the style values
var movecropDiv = function() {
    widgetObject.cropDiv.style.top = cropRectangle.top + 'px';
    widgetObject.cropDiv.style.left = cropRectangle.left + 'px';
};

//> set the new height and width
var resizecropDiv = function() {
    widgetObject.cropDiv.style.width = cropRectangle.width + 'px';
    widgetObject.cropDiv.style.height = cropRectangle.height + 'px';
};

//> show the cropDiv
var showcropDiv = function() {
    widgetObject.cropDiv.style.display = 'inline';
};

//> hide the cropDiv
var hidecropDiv = function() {
    widgetObject.cropDiv.style.display = 'none';
};

//> once the operation is done. Reset the cropRectangle
var resetcropRectangle = function() {
    cropRectangle = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    };
};

//> post Crop complete, it resets the cropDiv
var resetCropDiv = function(){
  widgetObject.cropDiv.style.width = 0;
  widgetObject.cropDiv.style.height = 0;
  widgetObject.cropDiv.style.top = 0;
  widgetObject.cropDiv.style.left = 0;
}

//> operations list to do after crop is completed
var postCropOps = function(){

  //> set the value in the dataObj of the marko state so that it can be emitted - crop coordinates
  widgetObject.state.actions['crop'] = cropRectangle;

  //> reset the crop rectangle object
  resetcropRectangle();

  //> reset the height and width & position of the cropDiv
  resetCropDiv();

  //> hide the rubber band div again
  hidecropDiv();

  //> end of dragging
  dragging = false;
}

//> function is executed on mouse down
//> This is used to set the position of the cropDiv
var cropStart = function(x, y) {

    //> (x,y) contains the coordinates at which the canvas was clicked
    //> this will eventually be the starting point for the cropDiv
    //> setting the mousedown object from the event mouseDown object
    mousedown.x = x;
    mousedown.y = y;

    //> setting the cropRectangle object - which will be used for further computation
    cropRectangle.left = mousedown.x;
    cropRectangle.top = mousedown.y;

    //> move the cropDiv to that point
    movecropDiv();

    //> show the cropDiv
    showcropDiv();
};

//> this is executed on mousemove of the canvas
//> The function actually builds the cropDiv as the user drags it
var cropStretch = function(x, y) {
    //> get the bounding rectangle of the canvasObject
    var canvasCoordinates = widgetObject.canvasObject.getBoundingClientRect();

    //> we are trying to set the left point again - because the user could always drag the opposite way
    //> if mousedrag X is less that the point where mouse down was done, choose the mousedrag X, else choose mousedown x
    //> set it on the cropRectangle object.
    cropRectangle.left = (x < mousedown.x) ? x : mousedown.x;
    cropRectangle.top = (y < mousedown.y) ? y : mousedown.y;

    //> set the width and height in the cropRectangle object
    cropRectangle.width = Math.abs(x - mousedown.x),
    cropRectangle.height = Math.abs(y - mousedown.y);

    //> prevent the cropDiv to go outside the canvas
    var isXinRange = cropRectangle.left > canvasCoordinates.left && x < canvasCoordinates.right;
    var isYinRange = cropRectangle.top > canvasCoordinates.top && y < canvasCoordinates.bottom;
    if (isXinRange && isYinRange) {
        movecropDiv();
        resizecropDiv();
    }
};

//> computation of aspect ratio for the cropped region of the canvas
var calculateAspectRatio = function (widgetObject, cropRectangle){
  //> get the width ratio of tempCanvas / image
  var wRatio = widgetObject.tempCanvasWidth / cropRectangle.width;

  //> get the height ratio of tempCanvas / image
  var hRatio = widgetObject.tempCanvasHeight / cropRectangle.height;

  //> get the minimum of the two ratios - lesser the ratio means smaller the multiplying factor
  //> small multiplying factor indicates which side the image has to be squeezed more (height or width)
  var ratio = Math.min(hRatio, wRatio); // to maintain the aspect ratio

  //> get the position of centerShiftX - which indicates position on x-axis of canvas where the image must be painted
  var centerShiftX = (widgetObject.tempCanvasWidth - cropRectangle.width * ratio) / 2;

  //> get the position of centerShiftY - which indicates position on y-axis of canvas where the image must be painted
  var centerShiftY = (widgetObject.tempCanvasHeight - cropRectangle.height * ratio) / 2;

  //> return the calculated aspect ratio
  return {
    centerShiftY: centerShiftY,
    centerShiftX: centerShiftX,
    ratio: ratio
  }
};

//> This is executed on mouseup - denotes end of mousedown + drag
//> This will end the width and height applied to the cropDiv
//> This denotes end of selection - cropDiv contains the crop area of the canvas
var cropEnd = function() {

    //> this is to check if dragging was enabled
    if (dragging) {

        //> get the bounding rectangle
        var bbox = widgetObject.canvasObject.getBoundingClientRect();

        try {

            //> clear the tempCanvas
            widgetObject.tempCanvasContext.clearRect(0, 0, widgetObject.tempCanvas.width, widgetObject.tempCanvas.height);

            //> save the tempCanvas
            widgetObject.tempCanvasContext.save();

            //> calculate aspect ratio for the newly cropped piece of the image
            //var aspects = calculateAspectRatio(widgetObject, cropRectangle);

            //> draw the canvasObject into the tempCanvas - but select only the portion of the canvasObject that corresponds
            //> to our cropRectangle coordinates - preserve the newly calculated aspect ratio
            widgetObject.tempCanvasContext.drawImage(widgetObject.canvasObject,
                cropRectangle.left - bbox.left,
                cropRectangle.top - bbox.top,
                cropRectangle.width,
                cropRectangle.height,
                widgetObject.state.edits.centerShiftX,
                widgetObject.state.edits.centerShiftY,
                cropRectangle.width * widgetObject.state.edits.ratio,
                cropRectangle.height * widgetObject.state.edits.ratio);
                /*aspects.centerShiftX,
                aspects.centerShiftY,
                cropRectangle.width * aspects.ratio,
                cropRectangle.height * aspects.ratio);*/

            //> restore the tempCanvas
            widgetObject.tempCanvasContext.restore();

            //> get the imageData from the tempCanvas
            var imageData = widgetObject.tempCanvasContext.getImageData(0, 0, widgetObject.tempCanvas.width, widgetObject.tempCanvas.height);

            //> clear the displayed canvas
            widgetObject.ctx.clearRect(0, 0, widgetObject.canvasObject.width, widgetObject.canvasObject.height);

            //> save the context of the primary displayed canvas
            widgetObject.ctx.save();

            //> put the imageData back into the displayed canvasObject
            widgetObject.ctx.putImageData(imageData, 0, 0);

            //> save the context of the primary displayed canvas
            widgetObject.ctx.restore();

            //> clear the tempCanvas
            widgetObject.tempCanvasContext.clearRect(0, 0, widgetObject.tempCanvas.width, widgetObject.tempCanvas.height);
        }
        catch (e) {
            console.log(e);
        }

        //> post crop operations
        postCropOps();
    }
};

//> crop functionalities exported by the module
module.exports = {
    //> denotes the mouseDown event handler
    //> crop functionality wired on canvas begins here
    mouseDown: function(e, widgetObj) {
        widgetObject = widgetObj;
        isMouseDown = true;
        var x = e.clientX,
            y = e.clientY;

        e.preventDefault();
        cropStart(x, y);
    },
    //> denotes the mouseMove Handler
    //> crop functionality wired on canvas provides the drag effect and area is being selected
    mouseMove: function(e, widgetObj) {
        //> check if mouse is down while its moving
        widgetObject = widgetObj;
        if (isMouseDown) {
            dragging = true;
            var x = e.clientX,
                y = e.clientY;

            e.preventDefault();
            if (dragging) {
                cropStretch(x, y);
            }
        }
    },
    //> denotes the mouseUp handler
    //> crop functionality wired on canvas provides the end of crop area selection
    mouseUp: function(e, widgetObj) {
        //> wherever on the page the mouse is release, it has to be upated
        //> this is why this is wired on the body
        isMouseDown = false;
        var canvasContainer = widgetObj.getEl('canvas-container');
        //> only if the events target is the canvas-container, go ahead and process
        if(e.target.id === canvasContainer.id){
          widgetObject = widgetObj;
          e.preventDefault();
          cropEnd();
        }
    }
};
