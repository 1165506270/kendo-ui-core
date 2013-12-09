(function(){

var dataviz = kendo.dataviz,
    gaugeElement,
    gauge;

function createGauge(options) {
    gaugeElement = $("<div>").kendoRadialGauge(kendo.deepExtend({
        pointer: {
            value: 50
        },

        scale: {
            min: 0,
            max: 100
        }
    }, options));

    gauge = gaugeElement.data("kendoRadialGauge");
}

module("Radial Gauge / API", {
    setup: function() {
        createGauge();
    },
    teardown: function() {
        kendo.destroy(gaugeElement);
    }
});

test("value() method calls pointer.value()", function() {
    var calls = 0,
        usedValue;

    gauge._view.renderElement = function() { };
    gauge._pointers[0].value = function(value) {
        calls++;
        usedValue = value;
    };

    gauge.value(10);

    equal(calls, 1);
    equal(usedValue, 10);
});

test("value(x) does not fail with transitions disabled", function() {
    createGauge({ transitions: false });
    gauge.value(10);
    ok(true);
});

test("value() with no args returns pointer value", function() {
    gauge.value(11);

    equal(gauge.value(), 11);
});

test("value(x) updates value in options", function() {
    gauge.value(11);

    equal(gauge.options.pointer.value, 11);
});

test("value(x) calls redraw if view does not support updates", function() {
    gauge._view.renderElement = undefined;
    gauge.redraw = function() { ok(true); };
    gauge.value(11);
});

var SVGView,
    CanvasView,
    supportsCanvas;

module("Radial Gauge / API / Export", {
    setup: function() {
        createGauge();

        SVGView = dataviz.SVGView;
        CanvasView = dataviz.CanvasView;
        supportsCanvas = dataviz.supportsCanvas;
    },
    teardown: function() {
        kendo.destroy(gaugeElement);
        dataviz.SVGView = SVGView;
        dataviz.CanvasView = CanvasView;
        dataviz.supportsCanvas = supportsCanvas;
    }
});

test("svg() exports SVG", function() {
    ok(gauge.svg().match(/<svg.*<\/svg>/));
});

test("svg() throws error if SVGView is not loaded", function() {
    dataviz.SVGView = undefined;

    throws(function() { gauge.svg() },
           "Unable to create SVGView. Check that kendo.dataviz.svg.js is loaded.");
});

test("svg() does not replace model", function() {
    var oldModel = gauge._model;
    gauge.svg();
    ok(oldModel === gauge._model);
});

test("svg() does not replace view", function() {
    var oldView = gauge._view;
    gauge.svg();
    ok(oldView === gauge._view);
});

test("imageDataURL() exports image/png", function() {
    ok(gauge.imageDataURL().match(/image\/png/));
});

test("imageDataURL() throws error if CanvasView is not loaded", function() {
    dataviz.CanvasView = undefined;

    throws(function() { gauge.imageDataURL() },
           "Unable to create CanvasView. Check that kendo.dataviz.canvas.js is loaded.");
});

test("imageDataURL() returns null if Canvas is not supported", function() {
    dataviz.supportsCanvas = function() { return false; }

    equal(gauge.imageDataURL(), null);
});

asyncTest("imageDataURL logs warning if Canvas is not supported", function() {
    dataviz.supportsCanvas = function() { return false; }

    stubMethod(kendo, "logToConsole", function(message) {
        ok(message.indexOf("Warning: Unable to generate image.") > -1);
        start();
    }, function() {
        gauge.imageDataURL();
    });
});

test("imageDataURL() does not replace model", function() {
    var oldModel = gauge._model;
    gauge.imageDataURL();
    ok(oldModel === gauge._model);
});

test("imageDataURL() does not replace view", function() {
    var oldView = gauge._view;
    gauge.imageDataURL();
    ok(oldView === gauge._view);
});

function createLinearGauge(options) {
    gaugeElement = $("<div />").kendoRadialGauge(kendo.deepExtend({
        pointer: {
            value: 50
        },

        scale: {
            min: 0,
            max: 100
        }
    }, options));

    gauge = gaugeElement.data("kendoRadialGauge");
}

module("Linear Gauge / API", {
    setup: function() {
        gaugeElement = $("<div />").kendoLinearGauge({
            pointer: {
                value: 50
            }
        });

        gauge = gaugeElement.data("kendoLinearGauge");
    },
    teardown: function() {
        kendo.destroy(gaugeElement);
    }
});

test("value() method calls pointer.value()", function() {
    var calls = 0,
        usedValue;

    gauge._view.renderElement = function() { };
    gauge._pointers[0].value = function(value) {
        calls++;
        usedValue = value;
    };

    gauge.value(10);

    equal(calls, 1);
    equal(usedValue, 10);
});

test("value(x) does not fail with transitions disabled", function() {
    createLinearGauge({ transitions: false });
    gauge.value(10);
    ok(true);
});

test("value() with no args returns pointer value", function() {
    gauge.value(11);

    equal(gauge.value(), 11);
});

test("value(x) updates value in options", function() {
    gauge.value(11);

    equal(gauge.options.pointer.value, 11);
});

test("value(x) calls redraw if view does not support updates", function() {
    gauge._view.renderElement = undefined;
    gauge.redraw = function() { ok(true); };
    gauge.value(11);
});

}());
