'use strict';

//> List of imports
var constants = require('./helpers/handlers');
var defaults = require('./defaults.json');

//> List of utility methods exposed for the image Editor
module.exports = {

    //> method that paints the image into the canvas
    paintImageIntoCanvas: function(widgetProps) {
        var _this = this;

        //> check if canvas is supported
        if (widgetProps.canvasObject.getContext) {
            //> create an empty image object
            var img = new Image();
            //> add the image source from the model
            img.src = widgetProps.state.model.img;
            //> define an onload handler for the image that triggers once the image is loaded
            img.onload = function(event) {
                _this.imageLoader(widgetProps, img);
            }.bind(widgetProps);
        }
    },

    //> executes on load of the image
    imageLoader: function(widgetObject, img) {
        var _t = this;
        var aspects = {};

        //> builds the temp canvas used for calculations
        _t.buildTempCanvas(widgetObject);

        //> get the calculateAspectRatio of the current image
        aspects = _t.calculateAspectRatio(widgetObject, img);

        //> save the shifts into the state object of the widget
        widgetObject.state.edits = aspects;

        //> save the initial context - before any change in context
        widgetObject.ctx.save();

        //> draws the image after correcting the aspect ratio
        _t.drawImage(widgetObject, aspects, img);

        //> restore the canvas origin back.
        widgetObject.ctx.restore();

        //> Builds the marko widget state variables
        _t.markoStateVarsBuilder(widgetObject);

        //> render the image
        widgetObject.img = img;
    },

    //> builds the marko widget state variables
    markoStateVarsBuilder: function(widgetObject) {
        //> actions stored in the state - initially its an empty object
        //> set once when the inits happens and canvas is drawn for the 1st time
        widgetObject.state.actions = {};

        //> set the base64 data of the image from the canvasObject
        widgetObject.state.base64 = widgetObject.canvasObject.toDataURL();

        //> in-memory rotate state
        //> For other features, the currentvalue is got directly from the range element
        //> so, there isn't a need to store it in the state
        widgetObject.state.rotate = 0;
    },

    //> draws the image corrected with proper aspect ratio into the canvas
    drawImage: function(widgetObject, aspects, img){

      //> clear the canvas - even if its fresh draw - might want to re-initialize the canvas to load New image
      //> in cases of features like previous Next
      widgetObject.ctx.clearRect(0, 0, widgetObject.canvasObject.width, widgetObject.canvasObject.height);

      //> save the state of the canvasObject
      widgetObject.ctx.save();

      //> draw the image img, startOfImgX, startofImgY, endOfImgX, endOfImgY, startOfCanvasX, startOfCanvasY, endOfCanvasX, endOfCanvasY
      //> the origin of the canvas will be changed here.
      widgetObject.ctx.drawImage(img, 0, 0, img.width, img.height, aspects.centerShiftX, aspects.centerShiftY, img.width * aspects.ratio, img.height * aspects.ratio);

      //> save the state of the canvasObject
      widgetObject.ctx.restore();
    },

    //> computes the aspect ration for the images
    calculateAspectRatio: function(widgetObject, img) {
        //>variables defined for use
        var wRatio;
        var hRatio;
        var ratio;
        var centerShiftX;
        var centerShiftY;

        //> get the image width
        widgetObject.imgWidth = img.width;

        //> get the image height
        widgetObject.imgHeight = img.height;

        //> get the width ratio of canvas / image
        wRatio = widgetObject.canvasObject.width / img.width;

        //> get the height ration of canvas / image
        hRatio = widgetObject.canvasObject.height / img.height;

        //> get the minimum of the two ratios - lesser the ratio means smaller the multiplying factor
        //> small multiplying factor indicates which side the image has to be squeezed more (height or width)
        ratio = Math.min(hRatio, wRatio); // to maintain the aspect ratio

        //> get the position of centerShiftX - which indicates position on x-axis of canvas where the image must be
        // painted
        centerShiftX = (widgetObject.canvasObject.width - img.width * ratio) / 2;

        //> get the position of centerShiftY - which indicates position on y-axis of canvas where the image must be
        // painted
        centerShiftY = (widgetObject.canvasObject.height - img.height * ratio) / 2;

        //> return the required data to draw the image with correct aspect ratio
        return {
            centerShiftX: centerShiftX,
            centerShiftY: centerShiftY,
            ratio: ratio
        }
    },

    //> builds a temp Canvas that will be used for certain operations
    buildTempCanvas: function(widgetObject) {
        //> new canvas creation
        widgetObject.tempCanvas = document.createElement('canvas');
        widgetObject.cropDiv = document.getElementById('crop');
        widgetObject.tempCanvas.width = widgetObject.canvasObject.width;
        widgetObject.tempCanvas.height = widgetObject.canvasObject.height;
        widgetObject.tempCanvasContext = widgetObject.tempCanvas.getContext('2d');
        widgetObject.tempCanvasWidth = widgetObject.tempCanvas.width;
        widgetObject.tempCanvasHeight = widgetObject.tempCanvas.height;
    },

    //> determines if the feature requested is in the list of default features done by the image Editor
    hasFeature: function(feature) {
        //> get the features list here from the defaults
        var featureArr = defaults.options.features;
        return featureArr.indexOf(feature);
    },

    //> is a handler to map every feature to its corresponding handlers.'this' refers to imageEditorWidgetUtils
    //> in case a handler is not found, it will emit the custom feature with the data object
    handleFeature: function(widgetObject, feature) {
        //> holds the context of the current object - imageEditorWidgetUtils
        var _this = this;

        //> first check if the feature exists in our feature map

        //> get the corresponding handler for the feature
        var featureHandler = constants.featureHandler[feature];

        //> attach the feature event to the image editor widget
        widgetObject[feature] = function(event) {
            if (_this.hasFeature(feature) !== -1) {
                //> this deals with event handlers wired specifically for crop
                if (feature === 'crop') {
                    widgetObject.canvasObject.onmousemove = function(event) {
                        featureHandler.mouseMove(event, widgetObject);
                    };
                    widgetObject.canvasObject.onmousedown = function(event) {
                        featureHandler.mouseDown(event, widgetObject);
                    };
                    document.body.onmouseup = function(event) {
                        featureHandler.mouseUp(event, widgetObject);
                        //> mouseUp executed, indicates CROP completed, emit the corresponding feature event
                        widgetObject.emit(feature, _this.buildDataObject(feature, widgetObject));
                    };
                } else { //> for all other features
                    //> invoke the event handler bound to the element on click of it
                    featureHandler(event, widgetObject);
                    //> after the feature handler for the feature is executed, emit the corresponding feature event
                    widgetObject.emit(feature, _this.buildDataObject(feature, widgetObject));
                }
            }
            else {
                //> emit the custom feature event incase if it isn't there
                widgetObject.emit(feature, _this.buildDataObject(feature, widgetObject));
            }
        }.bind(widgetObject);
    },

    //> this updates the data object so that it can be emitted with latest details
    buildDataObject: function(feature, widgetObject) {
        //> create an empty data object
        var _dataObj = {};
        //> contains the original image source as base64 data
        _dataObj.src = widgetObject.state.base64;
        //> last performed action
        _dataObj.type = feature;
        //> action data retrieved from features
        _dataObj.actions = widgetObject.state.actions;
        //> return the data object
        return _dataObj;
    }
};
