(function(){
    var dataviz = kendo.dataviz,
        Gauge = dataviz.ui.Gauge,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D,
        LinearPointer = dataviz.LinearPointer,
        LinearScale,
        pointer,
        gaugeBox = new Box2D(0, 0, 300, 300),
        TOLERANCE = 1.5,
        view;

    LinearScale = dataviz.LinearScale.extend({
        options: {
            labels: {
                // Tests expect particular font size
                font: "16px Verdana, sans-serif"
            }
        }
    });

    function stubScale(min, max) {
        var scale = new LinearScale({
            min: min,
            max: max
        });

        scale.reflow(gaugeBox);

        return scale;
    }

    (function() {

        function createPointer(scale, options) {
            pointer = new LinearPointer(scale || stubScale(), options || {});
            pointer.reflow(gaugeBox);
            pointer.getViewElements(new dataviz.SVGView());
        }

        module("Linear Pointer", {
            setup: function() {
                createPointer();
                this.font = dataviz.Text.fn.options.font;
                dataviz.Text.fn.options.font = "16px Verdana, sans-serif";
            },
            teardown: function() {
                destroyMeasureBox();
                dataviz.Text.fn.options.font = this.font;
            }
        });

        test("value() updates value", function() {
            pointer.value(10);

            equal(pointer.options.value, 10);
        });

        test("value() returns value", function() {
            pointer.options.value = 15;

            equal(pointer.value(), 15);
        });

        test("value() calls repaint()", function() {
            var called = false;

            pointer.repaint = function() {
                called = true;
            };

            pointer.value(15);

            ok(called);
        });

        test("value() takes scale.min into account", function() {
            pointer.scale.options.min = -20;

            pointer.value(-21);

            equal(pointer.value(), -20);
        });

        test("value() takes scale.min into account", function() {
            pointer.scale.options.max = 20;

            pointer.value(21);

            equal(pointer.value(), 20);
        });

        test("initial pointer value is constrained within scale range", function() {
            createPointer(stubScale(-1, 11), {
                value: -2
            });

            equal(pointer.value(), -1);

            createPointer(stubScale(0, 11), {
                value: 12
            });

            equal(pointer.value(), 11);
        });

        test("value() takes scale.min into account", function() {
            pointer.scale.options.max = 20;

            pointer.value(21);

            equal(pointer.value(), 20);
        });

        test("value() takes scale.min into account", function() {
            createPointer(stubScale(-10, 50), { });

            equal(pointer.value(), -10);
        });
    })();


    (function() {
        var view,
            track;

        function createPointer(scaleOptions, options) {
            var scale = new LinearScale(scaleOptions || {});
            scale.reflow(gaugeBox);

            pointer = new LinearPointer(scale, options || {});
            pointer.reflow(gaugeBox);
            view = new ViewStub();
            pointer.getViewElements(view);
        }

        module("Linear Pointer / Shapes / Vertical", {
            setup: function() {
                this.font = dataviz.Text.fn.options.font;
                dataviz.Text.fn.options.font = "16px Verdana, sans-serif";
            },
            teardown: function() {
                destroyMeasureBox();
                dataviz.Text.fn.options.font = this.font;
            }
        });

        test("renders arrow shape", function() {
            createPointer({ vertical: true }, { shape: "arrow" });
            var points = view.log.path[0].points,
                result = [];
            for (var i = 0, length = points.length; i < length; i++) {
                var point = points[i];
                result.push([point.x, point.y]);
            }
            arrayClose(result, [ [46.5, 284.5], [37.5, 289], [46.5, 293.5] ], TOLERANCE);
        });

        test("renders bar indicator shape", function() {
            createPointer({ vertical: true });
            var shape = view.log.rect[0];
            arrayClose(
                [shape.x1, shape.y1, shape.x2, shape.y2],
                [46.5, 289, 51.5, 289], TOLERANCE
            );
        });

        module("Linear Pointer / Shapes / Horizontal", {
            setup: function() {
                this.font = dataviz.Text.fn.options.font;
                dataviz.Text.fn.options.font = "16px Verdana, sans-serif";
            },
            teardown: function() {
                destroyMeasureBox();
                dataviz.Text.fn.options.font = this.font;
            }
        });

        test("renders arrow shape", function() {
            createPointer({ vertical: false }, { shape: "arrow" });
            var points = view.log.path[0].points,
                result = [];
            for (var i = 0, length = points.length; i < length; i++) {
                var point = points[i];
                result.push([point.x, point.y]);
            }
            arrayClose(result, [ [2.5, -2.5], [7, 6.5], [11.5, -2.5] ], TOLERANCE);
        });

        test("renders bar indicator shape", function() {
            createPointer({ vertical: false });
            var shape = view.log.rect[0];
            arrayClose(
                [shape.x1, shape.y1, shape.x2, shape.y2],
                [7, -7.5, 7, -2.5], TOLERANCE
            );
        });

        module("Linear Pointer / track", {
            setup: function() {
                this.font = dataviz.Text.fn.options.font;
                dataviz.Text.fn.options.font = "16px Verdana, sans-serif";
                createPointer({}, {
                    track: {
                        color: "red",
                        border: {
                            width: 1,
                            color: "blue",
                            dashType: "dot",
                        },
                        opacity: 0.33,
                        visible: true
                    }
                });

                track = view.log.rect[1];
            },
            teardown: function() {
                destroyMeasureBox();
                dataviz.Text.fn.options.font = this.font;
            }
        });

        test("renders background color", function() {
            ok(track.style.fill == "red");
        });

        test("renders opacity", function() {
            ok(track.style.fillOpacity == 0.33);
        });

        test("renders border", function() {
            ok(track.style.stroke == "blue");
            ok(track.style.strokeWidth == 1);
            ok(track.style.dashType == "dot");
        });

    })();
}());
