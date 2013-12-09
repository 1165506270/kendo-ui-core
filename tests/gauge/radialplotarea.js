(function(){

var dataviz = kendo.dataviz,
    GaugePlotArea = dataviz.RadialGaugePlotArea,
    Box2D = dataviz.Box2D,
    Point2D = dataviz.Point2D,
    RadialScale = dataviz.RadialScale,
    Pointer = dataviz.Pointepr,
    gaugeBox = new Box2D(0, 0, 200, 200),
    box,
    TOLERANCE = 1.5;

(function() {
    function createPlotArea(options) {
        plotArea = new GaugePlotArea(options);
        plotArea.reflow(gaugeBox);
        box = plotArea.box;

        destroyMeasureBox();
    }

    module("PlotArea / Reflow", {
        setup: function() {
            createPlotArea();
        }
    });

    test("fit plot area box in gauge with 0:90", function() {
        createPlotArea({ scale: { startAngle: 0, endAngle: 90 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 0, 1.5, 200, 198.5 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 0:45", function() {
        createPlotArea({ scale: { startAngle: 0, endAngle: 45 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 28, 200, 172 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 45:90", function() {
        createPlotArea({ scale: { startAngle: 45, endAngle: 90 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 27, 1, 173, 200], TOLERANCE);
    });

    test("fit plot area box in gauge with 90:180", function() {
        createPlotArea({ scale: { startAngle: 90, endAngle: 180 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 1, 200, 200], TOLERANCE);
    });

    test("fit plot area box in gauge with 90:135", function() {
        createPlotArea({ scale: { startAngle: 90, endAngle: 135 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 29, 1, 172, 200], TOLERANCE);
    });

    test("fit plot area box in gauge with 135:180", function() {
        createPlotArea({ scale: { startAngle: 135, endAngle: 180 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 28, 200, 172], TOLERANCE);
    });

    test("fit plot area box in gauge with 180:270", function() {
        createPlotArea({ scale: { startAngle: 180, endAngle: 270 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 0, 1.5, 200, 198.5 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 180:225", function() {
        createPlotArea({ scale: { startAngle: 180, endAngle: 225 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 29, 200, 172 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 225:270", function() {
        createPlotArea({ scale: { startAngle: 225, endAngle: 270 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 27, 1, 173, 200 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 270:360", function() {
        createPlotArea({ scale: { startAngle: 270, endAngle: 360 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 1, 200, 200 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 270:315", function() {
        createPlotArea({ scale: { startAngle: 270, endAngle: 315 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 29, 1, 172, 200 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 315:360", function() {
        createPlotArea({ scale: { startAngle: 315, endAngle: 360 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 29, 200, 172 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 0:180", function() {
        createPlotArea({ scale: { startAngle: 0, endAngle: 180 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 0, 45, 200, 155 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 90:270", function() {
        createPlotArea({ scale: { startAngle: 315, endAngle: 360 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 29, 200, 172 ], TOLERANCE);
    });

    test("fit plot area box in gauge with 180:360", function() {
        createPlotArea({ scale: { startAngle: 315, endAngle: 360 }});

        arrayClose([ box.x1, box.y1, box.x2, box.y2 ], [ 1, 29, 200, 172 ], TOLERANCE);
    });
})();

(function() {
    var ring,
        radius = 100;

    function reflowScale(scaleOptions) {
        plotArea = new GaugePlotArea();
        plotArea.scale = new RadialScale(
            $.extend({
                labels: { visible: false }
            }, scaleOptions));
        plotArea.pointer = {
            reflow: function () {},
            box: new Box2D(100, 100, 100, 100)
        };

        plotArea.reflow(gaugeBox);

        ring = plotArea.scale.ring;

        destroyMeasureBox();
    }

    module("PlotArea / Reflow / Without pointer");

    test("calculates scale ring center for 0:360 gauge", function() {
        reflowScale({ startAngle: 0, endAngle: 360 });

        equal(ring.c.x, 100);
        equal(ring.c.y, 100);
    });

    test("calculates scale ring center for 90:270 gauge", function() {
        reflowScale({ startAngle: 90, endAngle: 270 });

        equal(ring.c.x, 50);
        equal(ring.c.y, 100);
    });

    test("calculates scale ring center for -30:210 gauge", function() {
        reflowScale({ startAngle: -30, endAngle: 210 });

        equal(ring.c.x, 100);
        equal(ring.c.y, 125);
    });

    test("calculates scale ring center for 0:180 gauge", function() {
        reflowScale({ startAngle: 0, endAngle: 180 });

        equal(ring.c.x, 100);
        equal(ring.c.y, 150);
    });
})();
}());
