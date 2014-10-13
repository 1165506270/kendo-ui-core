(function(f, define){
    define([
        "./dataviz/util",
        "./dataviz/geometry",
        "./dataviz/drawing/core",
        "./dataviz/drawing/mixins",
        "./dataviz/drawing/shapes",
        "./dataviz/drawing/parser",
        "./dataviz/drawing/svg",
        "./dataviz/drawing/canvas",
        "./dataviz/drawing/vml",
        "./dataviz/drawing/pdf",
        "./dataviz/drawing/html"
    ], f);
})(function(){

    var __meta__ = {
        id: "drawing",
        name: "Drawing API",
        category: "dataviz",
        description: "The Kendo DataViz low-level drawing API",
        depends: [ "core" ]
    };

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
