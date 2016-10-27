function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      __markoWidgets = require("marko-widgets"),
      _widgetAttrs = __markoWidgets.attrs,
      __getDynamicClientWidgetPath = require("marko-widgets/taglib/helpers/getDynamicClientWidgetPath"),
      __ = "/src",
      __renderer = __helpers.r,
      ___node_modules_marko_widgets_taglib_widget_tag_js = __renderer(require("marko-widgets/taglib/widget-tag")),
      __tag = __helpers.t,
      attr = __helpers.a,
      attrs = __helpers.as,
      escapeXmlAttr = __helpers.xa,
      escapeXml = __helpers.x,
      forEachWithStatusVar = __helpers.fv;

  function __registerWidget() {
    if (typeof window != "undefined") {
      __markoWidgets.registerWidget(__, require("./"));
    }
  }

  return function render(data, out) {
    if (__registerWidget) {
      __registerWidget();
      __registerWidget = null;
    }
    

    var buttonConfig = data.options.buttonConfig;

    var btnZoom = buttonConfig.zoom;

    var btnContrast = buttonConfig.contrast;

    var btnBright = buttonConfig.brightness;

    var btnRotateL = buttonConfig.rotateleft;

    var btnRotateR = buttonConfig.rotateright;

    var btnReset = buttonConfig.reset;

    var btnCrop = buttonConfig.crop;

    var featureConfig = data.options.featureConfig;

    var fBright = featureConfig.brightness;

    var fContrast = featureConfig.contrast;

    var fZoom = featureConfig.zoom;

    var btnClass = 'btn btn-small';
    __tag(out,
      ___node_modules_marko_widgets_taglib_widget_tag_js,
      {
        "module": __,
        "_cfg": data.widgetConfig,
        "_state": data.widgetState,
        "_props": data.widgetProps,
        "_body": data.widgetBody
      },
      function(out, widget) {
        out.w('<div class="img-editor"' +
          attr("id", widget.elId()) +
          attrs(_widgetAttrs(widget)) +
          '>\n  <div>\n    <canvas width="800" height="800"' +
          attr("id", widget.elId("canvas-container")) +
          '>\n    </canvas>\n    <div id="crop"></div>\n  </div>\n  <div class="feature-footer">\n    <div>\n      <button type="button" class="' +
          escapeXmlAttr(btnClass) +
          ' ' +
          escapeXmlAttr(btnCrop.class) +
          '" name="crop"' +
          attr("data-w-onclick", "crop"+"|"+widget.id) +
          '>' +
          escapeXml(btnCrop.label) +
          '</button>\n      <button type="button" class="' +
          escapeXmlAttr(btnClass) +
          ' ' +
          escapeXmlAttr(btnReset.class) +
          '" name="reset"' +
          attr("data-w-onclick", "reset"+"|"+widget.id) +
          '>' +
          escapeXml(btnReset.label) +
          '</button>\n      <button type="button" class="' +
          escapeXmlAttr(btnClass) +
          ' ' +
          escapeXmlAttr(btnRotateL.class) +
          '" name="rotateLeft"' +
          attr("data-w-onclick", "rotateleft"+"|"+widget.id) +
          '>' +
          escapeXml(btnRotateL.label) +
          '</button>\n      <button type="button" class="' +
          escapeXmlAttr(btnClass) +
          ' ' +
          escapeXmlAttr(btnRotateR.class) +
          '" name="rotateRight"' +
          attr("data-w-onclick", "rotateright"+"|"+widget.id) +
          '>' +
          escapeXml(btnRotateR.label) +
          '</button>\n    </div>\n    <div>\n      ');

        forEachWithStatusVar(data.clientSpecificFeatures, function(feature,loop) {
          out.w('\n        <button type="button" class="' +
            escapeXmlAttr(btnClass) +
            ' ' +
            escapeXmlAttr(btnRotateL.class) +
            '"' +
            attr("name", feature) +
            attr("data-w-onclick", feature+"|"+widget.id) +
            '>' +
            escapeXml(feature) +
            '</button>\n      ');
        });

        out.w('\n    </div>\n    <div>\n      <input type="range"' +
          attr("class", btnZoom.class) +
          attr("min", fZoom.minValue) +
          attr("max", fZoom.maxValue) +
          ' value="1"' +
          attr("step", fZoom.step) +
          ' name="zoom"' +
          attr("id", widget.elId("zoom")) +
          attr("data-w-onchange", "zoom"+"|"+widget.id) +
          '>' +
          escapeXml(btnZoom.label) +
          '\n      <input type="range"' +
          attr("class", btnContrast.class) +
          attr("min", fContrast.minValue) +
          attr("max", fContrast.maxValue) +
          ' value="0"' +
          attr("step", fContrast.step) +
          ' name="contrast"' +
          attr("id", widget.elId("contrast")) +
          attr("data-w-onchange", "contrast"+"|"+widget.id) +
          '>' +
          escapeXml(btnContrast.label) +
          '\n      <input type="range"' +
          attr("class", btnBright.class) +
          attr("min", fBright.minValue) +
          attr("max", fBright.maxValue) +
          ' value="0"' +
          attr("step", fBright.step) +
          ' name="brightness"' +
          attr("id", widget.elId("brightness")) +
          attr("data-w-onchange", "brightness"+"|"+widget.id) +
          '>' +
          escapeXml(btnBright.label) +
          '\n    </div>\n  </div>\n</div>');
      });
  };
}
(module.exports = require("marko").c(__filename)).c(create);