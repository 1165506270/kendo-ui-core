(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        DEG_TO_RAD = Math.PI / 180,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        linearGradient = {
            id: "testGradient",
            type: "linear",
            rotation: 0,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        },
        radialGradient = {
            id: "testGradient",
            type: "radial",
            cx: 25,
            cy: 50,
            r: 100,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        };

    var view;

    module("CanvasView", {
        setup: function() {
            view = new dataviz.CanvasView();
        }
    });

    test("has default dimensions", function() {
        equal(view.options.width, 600);
        equal(view.options.height, 400);
    });

    test("sets dimensions", function() {
        view = new dataviz.CanvasView({ width: "100px", height: "100px" });
        equal(view.options.width, "100px");
        equal(view.options.height, "100px");
    });

    test("createGroup returns CanvasGroup", function() {
        var group = view.createGroup();
        ok(group instanceof dataviz.CanvasGroup);
    });

    test("createText returns CanvasText", function() {
        var text = view.createText();
        ok(text instanceof dataviz.CanvasText);
    });

    test("createText sets content", function() {
        var text = view.createText("Text");
        equal(text.content, "Text");
    });

    test("createRect returns CanvasLine", function() {
        var rect = view.createRect(new Box2D(10, 20, 110, 120));
        ok(rect instanceof dataviz.CanvasLine);
    });

    test("createRect draws rectangle", function() {
        var rect = view.createRect(new Box2D(10, 20, 110, 220));
        deepEqual(
            mapPoints(rect.points),
            [[10, 20], [110, 20], [110, 220], [10, 220]]
        );
    });

    test("createRect sets align default", function() {
        view = new dataviz.CanvasView({ align: false });
        var rect = view.createRect(new Box2D(10, 20, 110, 220));
        ok(rect.options.align === false);
    });

    test("createRect overrides align default", function() {
        view = new dataviz.CanvasView({ align: false });
        var rect = view.createRect(new Box2D(10, 20, 110, 220), { align: true });
        ok(rect.options.align === true);
    });

    test("createRect sets fill color", function() {
        var rect = view.createRect(
            new Box2D(10, 20, 110, 220), { fill: "#f00" });
        equal(rect.options.fill, "#f00");
    });

    test("createLine returns CanvasLine", function() {
        var line = view.createLine();
        ok(line instanceof dataviz.CanvasLine);
    });

    test("createLine draws a line", function() {
        var line = view.createLine(10, 20, 100, 200);
        deepEqual(mapPoints(line.points), [ [10, 20], [100, 200] ]);
    });

    test("createLine sets align default", function() {
        view = new dataviz.CanvasView({ align: false });
        var line = view.createLine(10, 20, 100, 200);
        ok(line.options.align === false);
    });

    test("createLine overrides align default", function() {
        view = new dataviz.CanvasView({ align: false });
        var line = view.createLine(10, 20, 100, 200, { align: true });
        ok(line.options.align === true);
    });

    test("createPolyline returns CanvasLine", function() {
        var path = view.createPolyline();
        ok(path instanceof dataviz.CanvasLine);
    });

    test("createPolyline sets closed option", function() {
        var path = view.createPolyline([], true);
        ok(path.closed);
    });

    test("createPolyline sets fill color", function() {
        var path = view.createPolyline([], false, { fill: "#cf0" });

        equal(path.options.fill, "#cf0");
    });

    test("createPolyline sets stroke color", function() {
        var path = view.createPolyline([], false, { stroke: "#cf0" });

        equal(path.options.stroke, "#cf0");
    });

    test("createPolyline sets stroke width", function() {
        var path = view.createPolyline([], false, { strokeWidth: 2});

        equal(path.options.strokeWidth, 2);
    });

    test("createPolyline sets dashType", function() {
        var path = view.createPolyline([], false, { dashType: "dot" });

        equal(path.options.dashType, "dot");
    });

    test("createPolyline sets align default", function() {
        view = new dataviz.CanvasView({ align: false });
        var path = view.createPolyline([], false, { dashType: "dot" });
        ok(path.options.align === false);
    });

    test("createPolyline overrides align default", function() {
        view = new dataviz.CanvasView({ align: false });
        var path = view.createPolyline([], false, { dashType: "dot" , align: true });
        ok(path.options.align === true);
    });

    test("createCircle returns CanvasCircle", function() {
        var circle = view.createCircle();
        ok(circle instanceof dataviz.CanvasCircle);
    });

    test("createCircle sets center point", function() {
        var circle = view.createCircle(new Point2D(10, 10));
        deepEqual(circle.config.c.x, 10);
        deepEqual(circle.config.c.y, 10);
    });

    test("createCircle sets radius", function() {
        var circle = view.createCircle(new Point2D(10, 10), 10);
        deepEqual(circle.config.r, 10);
    });

    test("createCircle sets fill color", function() {
        var circle = view.createCircle(new Point2D(), 10, { fill: "#cf0" });

        equal(circle.options.fill, "#cf0");
    });

    test("createCircle sets stroke color", function() {
        var circle = view.createCircle(new Point2D(), 10, { stroke: "#cf0" });

        equal(circle.options.stroke, "#cf0");
    });

    test("createCircle sets stroke width", function() {
        var circle = view.createCircle(new Point2D(), 10, { strokeWidth: 2 });

        equal(circle.options.strokeWidth, 2);
    });

    test("createRing returns CanvasRing", function() {
        var ring = view.createRing();
        ok(ring instanceof dataviz.CanvasRing);
    });

    test("createRing sets fill color", function() {
        var ring = view.createRing({ }, { fill: "#cf0" });

        equal(ring.options.fill, "#cf0");
    });

    test("createRing sets stroke color", function() {
        var ring = view.createRing({ }, { stroke: "#cf0" });

        equal(ring.options.stroke, "#cf0");
    });

    test("createRing sets stroke width", function() {
        var ring = view.createRing({ }, { strokeWidth: 2});

        equal(ring.options.strokeWidth, 2);
    });

    test("createSector returns CanvasRing", function() {
        var sector = view.createSector();
        ok(sector instanceof dataviz.CanvasRing);
    });

    // ------------------------------------------------------------
    var element,
        stage;

    module("CanvasView / Rendering", {
        setup: function() {
            element = $("<div />").appendTo(document.body)[0];
            view = new dataviz.CanvasView();
            stage = view.renderTo(element);
        },
        teardown: function() {
            $(element).remove();
        }
    });

    test("renderTo renders canvas", function() {
        equal(stage.tagName.toLowerCase(), "canvas");
    });

    test("renderTo sets default size", function() {
        equal(parseInt(stage.getAttribute("width"), 10), 600);
        equal(parseInt(stage.getAttribute("height"), 10), 400);
    });

    test("renderTo reuses canvas", function() {
        var newStage = view.renderTo(element);
        equal(stage, newStage);
    });

    test("renderTo resets stage width", function() {
        stage.width = 100;
        stage = view.renderTo(element);
        equal(stage.width, 600);
    });

    test("renderTo resets stage height", function() {
        stage.height = 100;
        stage = view.renderTo(element);
        equal(stage.height, 400);
    });

    test("renderTo cleans container on reuse", function() {
        $("<div id='foo' />").appendTo(element);
        view.renderTo(element);
        equal($("#foo", element).length, 0);
    });

    test("renderTo renders inline stage", function() {
        var inlineElement = $("<span />").appendTo(document.body)[0];
        view = new dataviz.CanvasView({ inline: true });
        stage = view.renderTo(inlineElement);
        equal($(stage).css("display"), "inline");
        $(inlineElement).remove();
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        group;

    module("CanvasGroup", {
        setup: function() {
            group = new dataviz.CanvasGroup();
        }
    });

    test("calls render with context on children", function() {
        var ctx = {};
        group.children.push({
            render: function(context) {
                equal(context, ctx);
            }
        });

        group.render(ctx);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        DEG_TO_RAD = Math.PI / 180,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        linearGradient = {
            id: "testGradient",
            type: "linear",
            rotation: 0,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        },
        radialGradient = {
            id: "testGradient",
            type: "radial",
            cx: 25,
            cy: 50,
            r: 100,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        };

    var text,
        ctx;

    var GradientStub = makeStub([
        ["addColorStop", ["offset", "color"]]
    ]);

    var ContextStub = makeStub([
        ["arc", ["x", "y", "r", "startAngle", "endAngle", "anticlockwise"]],
        ["beginPath"],
        ["closePath"],
        ["fill"],
        ["fillText", ["content", "x", "y"]],
        ["lineTo", ["x", "y"]],
        ["moveTo", ["x", "y"]],
        ["restore"],
        ["rotate", ["angle"]],
        ["save"],
        ["stroke"],
        ["translate", ["x", "y"]]
    ]);

    ContextStub.prototype.createRadialGradient = function(cx1, cy1, ir, cx2, cy2, r) {
        var stub = new GradientStub();
        var log = this.log.createRadialGradient = this.log.createRadialGradient || [];

        log.push({
            cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2,
            ir: ir, r: r,
            stub: stub
        });

        return stub;
    };

    ContextStub.prototype.createLinearGradient = function(x1, y1, x2, y2) {
        var stub = new GradientStub();
        var log = this.log.createLinearGradient = this.log.createLinearGradient || [];

        log.push({
            x1: x1, y1: y1, x2: x2, y2: y2,
            stub: stub
        });

        return stub;
    };

    function createText(options) {
        options = $.extend({
                rotation: 0
            }, options
        );

        text = new dataviz.CanvasText(
            "Text",
            options
        );
    }

    module("CanvasText", {
        setup: function() {
            createText();
            ctx = new ContextStub();
        }
    });

    test("renders content", function() {
        text.render(ctx);
        equal(ctx.log.fillText[0].content, "Text");
    });

    test("baseline is added to y", function() {
        text.options.y = 5;
        text.options.baseline = 5;
        text.render(ctx);
        equal(ctx.log.fillText[0].y, 10);
    });

    test("sets font", function() {
        text.options.font = "12px sans-serif";
        text.render(ctx);
        equal(ctx.font, text.options.font);
    });

    test("sets rotation transform for 45 degrees", function() {
        createText({
            rotation: 45,
            size: {
                baseline: 12,
                height: 28,
                normalHeight: 14,
                normalWidth: 27,
                width: 28
            }
        });
        text.render(ctx);

        equal(ctx.log.translate[0].x, 0.5);
        equal(ctx.log.translate[0].y, 7);
        equal(ctx.log.rotate[0].angle, 45 * DEG_TO_RAD);
    });

    test("sets rotation transform for 90 degrees", function() {
        createText({
            rotation: 90,
            size: {
                baseline: 12,
                height: 27,
                normalHeight: 14,
                normalWidth: 27,
                width: 14
            }
        });
        text.render(ctx);

        equal(ctx.log.translate[0].x, -6.5);
        equal(ctx.log.translate[0].y, 6.5);
        equal(ctx.log.rotate[0].angle, 90 * DEG_TO_RAD);
    });

    test("sets rotation transform for -45 degrees", function() {
        createText({
            rotation: -45,
            size: {
                baseline: 12,
                height: 28,
                normalHeight: 14,
                normalWidth: 27,
                width: 28
            }
        });
        text.render(ctx);

        equal(ctx.log.translate[0].x, 0.5);
        equal(ctx.log.translate[0].y, 7);
        equal(ctx.log.rotate[0].angle, -45 * DEG_TO_RAD);
    });

    test("sets rotation transform for -90 degrees", function() {
        createText({
            rotation: -90,
            size: {
                baseline: 12,
                height: 27,
                normalHeight: 14,
                normalWidth: 27,
                width: 14
            }
        });
        text.render(ctx);

        equal(ctx.log.translate[0].x, -6.5);
        equal(ctx.log.translate[0].y, 6.5);
        equal(ctx.log.rotate[0].angle, -90 * DEG_TO_RAD);
    });

    test("sets color", function() {
        text.options.color = "#cf0";
        text.render(ctx);

        equal(ctx.fillStyle, text.options.color);
    });

    test("renders fill-opacity", function() {
        text.options.fillOpacity = .4;
        text.render(ctx);

        equal(ctx.globalAlpha, text.options.fillOpacity);
    });

    test("saves/restores style stack", function() {
        text.render(ctx);
        equal(ctx.log.save.length, 1);
        equal(ctx.log.restore.length, 1);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        DEG_TO_RAD = Math.PI / 180,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        linearGradient = {
            id: "testGradient",
            type: "linear",
            rotation: 0,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        },
        radialGradient = {
            id: "testGradient",
            type: "radial",
            cx: 25,
            cy: 50,
            r: 100,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        };

    var path,
        ctx;

    var GradientStub = makeStub([
        ["addColorStop", ["offset", "color"]]
    ]);

    var ContextStub = makeStub([
        ["arc", ["x", "y", "r", "startAngle", "endAngle", "anticlockwise"]],
        ["beginPath"],
        ["closePath"],
        ["fill"],
        ["fillText", ["content", "x", "y"]],
        ["lineTo", ["x", "y"]],
        ["moveTo", ["x", "y"]],
        ["restore"],
        ["rotate", ["angle"]],
        ["save"],
        ["stroke"],
        ["translate", ["x", "y"]]
    ]);

    ContextStub.prototype.createRadialGradient = function(cx1, cy1, ir, cx2, cy2, r) {
        var stub = new GradientStub();
        var log = this.log.createRadialGradient = this.log.createRadialGradient || [];

        log.push({
            cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2,
            ir: ir, r: r,
            stub: stub
        });

        return stub;
    };

    ContextStub.prototype.createLinearGradient = function(x1, y1, x2, y2) {
        var stub = new GradientStub();
        var log = this.log.createLinearGradient = this.log.createLinearGradient || [];

        log.push({
            x1: x1, y1: y1, x2: x2, y2: y2,
            stub: stub
        });

        return stub;
    };

    module("CanvasPath", {
        setup: function() {
            path = new dataviz.CanvasPath();
            ctx = new ContextStub();
        }
    });

    test("renders fill color", function() {
        path.options.fill = "#f00";
        path.render(ctx);

        equal(ctx.fillStyle, path.options.fill);
    });

    test("does not render fill when no set", function() {
        path.options.fill = "";
        path.render(ctx);
        ok(!ctx.fillStyle);
    });

    test("renders stroke color", function() {
        path.options.stroke = "#f00";
        path.options.strokeWidth = 1;
        path.render(ctx);

        equal(ctx.strokeStyle, path.options.stroke);
    });

    test("renders stroke width", function() {
        path.options.stroke = "#f00";
        path.options.strokeWidth = 2;
        path.render(ctx);

        equal(ctx.lineWidth, path.options.strokeWidth);
    });

    test("renders stroke linecap", function() {
        path.options.stroke = "#f00";
        path.options.strokeWidth = 2;
        path.render(ctx);

        equal(ctx.lineCap, "square");
    });

    test("renders stroke opacity", function() {
        path.options.strokeOpacity = 0.5;
        path.options.stroke = "#f00";
        path.options.strokeWidth = 2;
        path.render(ctx);

        equal(ctx.globalAlpha, 0.5);
    });

    test("renders fill opacity", function() {
        path.options.fill = "#f00";
        path.options.fillOpacity = 0.5;
        path.render(ctx);

        equal(ctx.globalAlpha, 0.5);
    });

    test("saves/restores style stack", function() {
        path.render(ctx);
        equal(ctx.log.save.length, 1);
        equal(ctx.log.restore.length, 1);
    });

    // ------------------------------------------------------------
    module("CanvasPath / Dash", {
        setup: function() {
            path = new dataviz.CanvasPath({
                strokeWidth: 1,
                dashType: "dot"
            });
            ctx = new ContextStub();
        }
    });

    test("sets stroke linecap to butt", function() {
        path.render(ctx);
        equal(ctx.lineCap, "butt");
    });

    test("calls setLineDash if available", function() {
        ctx.setLineDash = function(dashArray) {
            deepEqual(dashArray, dataviz.DASH_ARRAYS.dot);
        }
        path.render(ctx);
    });

    test("sets mozDash if setLineDash is not available", function() {
        path.render(ctx);
        deepEqual(ctx.mozDash, dataviz.DASH_ARRAYS.dot);
    });

    test("sets webkitLineDash if setLineDash is not available", function() {
        path.render(ctx);
        deepEqual(ctx.mozDash, dataviz.DASH_ARRAYS.dot);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        DEG_TO_RAD = Math.PI / 180,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        linearGradient = {
            id: "testGradient",
            type: "linear",
            rotation: 0,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        },
        radialGradient = {
            id: "testGradient",
            type: "radial",
            cx: 25,
            cy: 50,
            r: 100,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        };

    var line,
        ctx;

    var GradientStub = makeStub([
        ["addColorStop", ["offset", "color"]]
    ]);

    var ContextStub = makeStub([
        ["arc", ["x", "y", "r", "startAngle", "endAngle", "anticlockwise"]],
        ["beginPath"],
        ["closePath"],
        ["fill"],
        ["fillText", ["content", "x", "y"]],
        ["lineTo", ["x", "y"]],
        ["moveTo", ["x", "y"]],
        ["restore"],
        ["rotate", ["angle"]],
        ["save"],
        ["stroke"],
        ["translate", ["x", "y"]]
    ]);

    ContextStub.prototype.createRadialGradient = function(cx1, cy1, ir, cx2, cy2, r) {
        var stub = new GradientStub();
        var log = this.log.createRadialGradient = this.log.createRadialGradient || [];

        log.push({
            cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2,
            ir: ir, r: r,
            stub: stub
        });

        return stub;
    };

    ContextStub.prototype.createLinearGradient = function(x1, y1, x2, y2) {
        var stub = new GradientStub();
        var log = this.log.createLinearGradient = this.log.createLinearGradient || [];

        log.push({
            x1: x1, y1: y1, x2: x2, y2: y2,
            stub: stub
        });

        return stub;
    };

    module("CanvasLine", {
        setup: function() {
            line = new dataviz.CanvasLine([
                    new Point2D(10, 20),
                    new Point2D(20, 30)
                ], false, { stroke: "black" }
            );
            ctx = new ContextStub();
        }
    });

    test("moves to start point", function() {
        line.render(ctx);
        deepEqual(ctx.log.moveTo[0], { x: 10, y: 20 });
    });

    test("line to end point", function() {
        line.render(ctx);
        deepEqual(ctx.log.lineTo[0], { x: 20, y: 30 });
    });

    test("closes path", function() {
        line.closed = true;
        line.render(ctx);
        equal(ctx.log.closePath.length, 1);
    });

    test("'align: false' skips point coordinate rounding", function() {
        line = new dataviz.CanvasLine([
            new Point2D(1.503, 2.103),
            new Point2D(2.506, 3.801)
        ], false, { align: false, stroke: "black" })

        line.render(ctx);

        deepEqual(ctx.log.moveTo[0], { x: 1.503, y: 2.103 });
        deepEqual(ctx.log.lineTo[0], { x: 2.506, y: 3.801 });
    });

    test("sets rotation", function() {
        line = new dataviz.CanvasLine([
            new Point2D(1, 2),
            new Point2D(2, 3)
        ], false, { stroke: "black", rotation: [45, 10, 20] })
        line.render(ctx);

        equal(ctx.log.translate[0].x, 10);
        equal(ctx.log.translate[0].y, 20);
        equal(ctx.log.rotate[0].angle, 45 * DEG_TO_RAD);
    });

    test("saves/restores style stack", function() {
        line.render(ctx);
        equal(ctx.log.save.length, 1);
        equal(ctx.log.restore.length, 1);
    });

    // ------------------------------------------------------------
    module("CanvasLine / Linear Gradient", {
        setup: function() {
            dataviz.Gradients.test = deepExtend({}, linearGradient);

            line = new dataviz.CanvasLine([
                    new Point2D(10, 20),
                    new Point2D(20, 30)
                ], false, {
                    overlay: {
                        gradient: "test"
                    }
                }
            );

            ctx = new ContextStub();
        }
    });

    test("default rotation is 0 degrees", function() {
        line.render(ctx);
        equal(ctx.log.createLinearGradient[0].x2, 20);
        equal(ctx.log.createLinearGradient[0].y2, 20);
    });

    test("rotates gradient by 90 degrees", function() {
        line.options.overlay.rotation = 90;
        line.render(ctx);
        equal(ctx.log.createLinearGradient[0].x2, 10);
        equal(ctx.log.createLinearGradient[0].y2, 30);
    });

    test("renders stops", function() {
        line.render(ctx);
        var stub = ctx.log.createLinearGradient[0].stub;
        deepEqual(stub.log.addColorStop, [{
            offset: 0,
            color: "rgba(255,0,0,1)"
        }, {
            offset: 1,
            color: "rgba(0,0,255,1)"
        }]);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        DEG_TO_RAD = Math.PI / 180,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        linearGradient = {
            id: "testGradient",
            type: "linear",
            rotation: 0,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        },
        radialGradient = {
            id: "testGradient",
            type: "radial",
            cx: 25,
            cy: 50,
            r: 100,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        };

    var circle,
        ctx;

    var GradientStub = makeStub([
        ["addColorStop", ["offset", "color"]]
    ]);

    var ContextStub = makeStub([
        ["arc", ["x", "y", "r", "startAngle", "endAngle", "anticlockwise"]],
        ["beginPath"],
        ["closePath"],
        ["fill"],
        ["fillText", ["content", "x", "y"]],
        ["lineTo", ["x", "y"]],
        ["moveTo", ["x", "y"]],
        ["restore"],
        ["rotate", ["angle"]],
        ["save"],
        ["stroke"],
        ["translate", ["x", "y"]]
    ]);

    ContextStub.prototype.createRadialGradient = function(cx1, cy1, ir, cx2, cy2, r) {
        var stub = new GradientStub();
        var log = this.log.createRadialGradient = this.log.createRadialGradient || [];

        log.push({
            cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2,
            ir: ir, r: r,
            stub: stub
        });

        return stub;
    };

    ContextStub.prototype.createLinearGradient = function(x1, y1, x2, y2) {
        var stub = new GradientStub();
        var log = this.log.createLinearGradient = this.log.createLinearGradient || [];

        log.push({
            x1: x1, y1: y1, x2: x2, y2: y2,
            stub: stub
        });

        return stub;
    };

    function createCircle(options) {
        circle = new dataviz.CanvasCircle(new Point2D(10, 20), 30, options);
    }

    module("CanvasCircle", {
        setup: function() {
            createCircle();
            ctx = new ContextStub();
        }
    });

    test("renders circle", function() {
        circle.render(ctx);
        deepEqual(ctx.log.arc[0], {
            x: 10, y: 20,
            r: 30,
            startAngle: 0,
            endAngle: Math.PI * 2,
            anticlockwise: false
        });
    });

    test("renders fill color", function() {
        circle.options.fill = "#f00";
        circle.render(ctx);
        equal(ctx.fillStyle, "#f00");
    });

    test("renders stroke color", function() {
        circle.options.stroke = "#f00";
        circle.options.strokeWidth = 1;
        circle.render(ctx);
        equal(ctx.strokeStyle, "#f00");
    });

    test("renders stroke width", function() {
        circle.options.stroke = "#f00";
        circle.options.strokeWidth = 2;
        circle.render(ctx);
        equal(ctx.lineWidth, 2);
    });

    test("saves/restores style stack", function() {
        circle.render(ctx);
        equal(ctx.log.save.length, 1);
        equal(ctx.log.restore.length, 1);
    });

    // ------------------------------------------------------------
    module("CanvasCircle / Radial Gradient", {
        setup: function() {
            dataviz.Gradients.test = deepExtend({}, radialGradient);

            createCircle({
                overlay: {
                    gradient: "test"
                }
            });

            ctx = new ContextStub();

            circle.render(ctx);
        }
    });

    test("sets center", function() {
        var gradient = ctx.log.createRadialGradient[0];
        equal(gradient.cx1, 10);
        equal(gradient.cy1, 20);
        equal(gradient.cx2, 10);
        equal(gradient.cy2, 20);
    });

    test("sets inner radius", function() {
        equal(ctx.log.createRadialGradient[0].ir, 0);
    });

    test("sets radius", function() {
        equal(ctx.log.createRadialGradient[0].r, 30);
    });

    test("renders stops", function() {
        var stub = ctx.log.createRadialGradient[0].stub;
        deepEqual(stub.log.addColorStop, [{
            offset: 0,
            color: "rgba(255,0,0,1)"
        }, {
            offset: 1,
            color: "rgba(0,0,255,1)"
        }]);
    });


})();

(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        DEG_TO_RAD = Math.PI / 180,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        linearGradient = {
            id: "testGradient",
            type: "linear",
            rotation: 0,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        },
        radialGradient = {
            id: "testGradient",
            type: "radial",
            cx: 25,
            cy: 50,
            r: 100,
            stops: [{
                offset: 0,
                color: "#f00",
                opacity: 1
            }, {
                offset: 1,
                color: "#00f",
                opacity: 1
            }]
        };

    var ring,
        ctx;

    var GradientStub = makeStub([
        ["addColorStop", ["offset", "color"]]
    ]);

    var ContextStub = makeStub([
        ["arc", ["x", "y", "r", "startAngle", "endAngle", "anticlockwise"]],
        ["beginPath"],
        ["closePath"],
        ["fill"],
        ["fillText", ["content", "x", "y"]],
        ["lineTo", ["x", "y"]],
        ["moveTo", ["x", "y"]],
        ["restore"],
        ["rotate", ["angle"]],
        ["save"],
        ["stroke"],
        ["translate", ["x", "y"]]
    ]);

    ContextStub.prototype.createRadialGradient = function(cx1, cy1, ir, cx2, cy2, r) {
        var stub = new GradientStub();
        var log = this.log.createRadialGradient = this.log.createRadialGradient || [];

        log.push({
            cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2,
            ir: ir, r: r,
            stub: stub
        });

        return stub;
    };

    ContextStub.prototype.createLinearGradient = function(x1, y1, x2, y2) {
        var stub = new GradientStub();
        var log = this.log.createLinearGradient = this.log.createLinearGradient || [];

        log.push({
            x1: x1, y1: y1, x2: x2, y2: y2,
            stub: stub
        });

        return stub;
    };

    module("CanvasRing", {
        setup: function() {
            ring = new dataviz.CanvasRing(
                new dataviz.Ring(
                    new Point2D(135, 135), 10, 135, 90, 20
                )
            );
            ctx = new ContextStub();
        }
    });

    test("renders inner arc", function() {
        ring.render(ctx);

        deepEqual(ctx.log.arc[1], {
            x: 135, y: 135,
            r: 10,
            startAngle: 290 * DEG_TO_RAD,
            endAngle: 270 * DEG_TO_RAD,
            anticlockwise: true
        });
    });

    test("renders connector to outer arc", function() {
        ring.render(ctx);

        deepEqual(ctx.log.lineTo[0], {
            x: 138.42, y: 125.603
        });
    });

    test("renders outer arc", function() {
        ring.render(ctx);

        var arc = ctx.log.arc[0];
        delete arc.anticlockwise;

        deepEqual(arc, {
            x: 135, y: 135,
            r: 135,
            startAngle: 270 * DEG_TO_RAD,
            endAngle: 290 * DEG_TO_RAD
        });
    });

    test("does not render inner arc if inner radius is 0", function() {
        ring.config.ir = 0;
        ring.render(ctx);

        equal(ctx.log.arc.length, 1);
    });

    test("renders connector to center if inner radius is 0", function() {
        ring.config.ir = 0;
        ring.render(ctx);

        deepEqual(ctx.log.lineTo[0], {
            x: 135, y: 135
        });
    });

    test("renders fill color", function() {
        ring.options.fill = "#f00";
        ring.render(ctx);

        equal(ctx.fillStyle, "#f00");
    });

    test("renders stroke color", function() {
        ring.options.strokeWidth = 1;
        ring.options.stroke = "#f00";
        ring.render(ctx);

        equal(ctx.strokeStyle, "#f00");
    });

    test("renders stroke width", function() {
        ring.options.strokeWidth = 2;
        ring.options.stroke = "#f00";
        ring.render(ctx);

        equal(ctx.lineWidth, 2);
    });

    test("renders arc from 0 to 2*PI if angle is 360", function() {
        ring = new dataviz.CanvasRing(
            new dataviz.Ring(
                new Point2D(135, 135), 0, 135, 90, 360
            )
        );
        ring.render(ctx);

        var arc = ctx.log.arc[0];
        delete arc.anticlockwise;

        deepEqual(arc, {
            x: 135, y: 135,
            r: 135,
            startAngle: 0,
            endAngle: Math.PI * 2
        });
    });

    test("saves/restores style stack", function() {
        ring.render(ctx);
        equal(ctx.log.save.length, 1);
        equal(ctx.log.restore.length, 1);
    });

    // ------------------------------------------------------------
    module("CanvasRing / Radial Gradient", {
        setup: function() {
            dataviz.Gradients.test = deepExtend({}, radialGradient);

            ring = new dataviz.CanvasRing(
                new dataviz.Ring(
                    new Point2D(135, 135), 10, 135, 90, 20
                ), {
                    overlay: {
                        gradient: "test"
                    }
                }
            );

            ctx = new ContextStub();

            ring.render(ctx);
        }
    });

    test("sets center", function() {
        var gradient = ctx.log.createRadialGradient[0];
        equal(gradient.cx1, 135);
        equal(gradient.cy1, 135);
        equal(gradient.cx2, 135);
        equal(gradient.cy2, 135);
    });

    test("sets inner radius", function() {
        equal(ctx.log.createRadialGradient[0].ir, 10);
    });

    test("sets radius", function() {
        equal(ctx.log.createRadialGradient[0].r, 135);
    });

    test("renders stops", function() {
        var stub = ctx.log.createRadialGradient[0].stub;
        deepEqual(stub.log.addColorStop, [{
            offset: 0,
            color: "rgba(255,0,0,1)"
        }, {
            offset: 1,
            color: "rgba(0,0,255,1)"
        }]);
    });

})();
