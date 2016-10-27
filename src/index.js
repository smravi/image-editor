'use strict';

//> Imports
var defaultsDeep = require('lodash/object/defaultsDeep');
var defaults = require('./defaults.json');
var imageEditorWidgetUtils = require('./imageEditorWidgetUtils');
var $ = require('jquery');

//> stateful widget definition for the image editor
var imageEditorWidget = {

    //> get the associated marko template
    template: require.resolve('./template.marko'),

    //> defines the initial State of the widget
    getInitialState: function(input) {
        var defaultFeatures = defaults.options.features;
        var allClientFeatures = input.options.features; // client
        var clientSpecificFeatures = allClientFeatures.filter(function(val) {
            if (defaultFeatures.indexOf(val) < 0) {
                return val;
            }
        });

        //> validate the existence of a model
        if (!input.model || !input.model.img) {
            throw new Error('imgUrl not found!. It must be provided to the editor component.');
        }

        //> Assigns own and inherited enumerable properties of source objects to the destination object for
        //> all destination properties that resolve to undefined - defaultsDeep(source, destination)
        input = defaultsDeep(input, defaults);

        //> normalize the button configs
        var buttonConfig = input.options.buttonConfig;
        Object.keys(buttonConfig).forEach(function(key) {
            if (typeof buttonConfig[key] === 'string') {
                buttonConfig[key] = {
                    label: buttonConfig[key],
                };
            }
        });
        input.clientSpecificFeatures = clientSpecificFeatures;
        console.log(input.clientSpecificFeatures);
        //> return the normalized input props
        return input;
    },

    //> This function initializes the widget and is called only once - the time when widget is mounted on the DOM
    init: function() {

        //> get the canvas object
        this.canvasObject = this.getEl('canvas-container');

        //> get the rendering context - 2D
        this.ctx = this.canvasObject.getContext('2d');

        this.imageInit();
        //> iterate over the features mentioned in the FeaturesList of the options
        this.state.options.features.forEach(function(feature) {
            //> for every feature mentioned, identify its corresponding handlers
            imageEditorWidgetUtils.handleFeature(this, feature);
        }.bind(this));
    },
    imageInit: function() {
        this.state.edits = {
            centerShiftX: 0.0,
            centerShiftY: 0.0,
            ratio: 0,
        };

        //> render the image into the canvas
        imageEditorWidgetUtils.paintImageIntoCanvas(this);
    },

    //> the changeSrc will help client to change the src of the image loaded in the canvas
    changeSrc: function(src) {
        this.state.model.img = src;
        this.imageInit();
    },
    //> triggered when the widget is destroyed
    onDestroy: function() {

    },

};

//> export the widget
module.exports = require('marko-widgets').defineComponent(imageEditorWidget);
