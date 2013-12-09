(function() {
    var dataviz = kendo.dataviz,
        browser = kendo.support.browser,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        contentElementStub = {
            render: function() { return "Content"; }
        },
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

    (function() {
        var view;

        module("SVGView", {
            setup: function() {
                view = new dataviz.SVGView();
            }
        });

        test("has default dimensions", function() {
            equal(view.options.width, 600);
            equal(view.options.height, 400);
        });

        test("sets dimensions", function() {
            view = new dataviz.SVGView({ width: "100px", height: "100px" });
            equal(view.options.width, "100px");
            equal(view.options.height, "100px");
        });

        test("createGroup returns SVGGroup", function() {
            var group = view.createGroup();
            ok(group instanceof dataviz.SVGGroup);
        });

        test("createText returns SVGText", function() {
            var text = view.createText();
            ok(text instanceof dataviz.SVGText);
        });

        test("createText sets content", function() {
            var text = view.createText("Text");
            equal(text.content, "Text");
        });

        test("createRect returns SVGLine", function() {
            var rect = view.createRect(new Box2D(10, 20, 110, 120));
            ok(rect instanceof dataviz.SVGLine);
        });

        test("createRect draws rectangle", function() {
            var rect = view.createRect(new Box2D(10, 20, 110, 220));
            deepEqual(
                mapPoints(rect.points),
                [[10, 20], [110, 20], [110, 220], [10, 220]]
            );
        });

        test("createRect sets align default", function() {
            view = new dataviz.SVGView({ align: false });
            var rect = view.createRect(new Box2D(10, 20, 110, 220));
            ok(rect.options.align === false);
        });

        test("createRect overrides align default", function() {
            view = new dataviz.SVGView({ align: false });
            var rect = view.createRect(new Box2D(10, 20, 110, 220), { align: true });
            ok(rect.options.align === true);
        });

        test("createRect sets fill color", function() {
            var rect = view.createRect(
                new Box2D(10, 20, 110, 220), { fill: "#f00" });
            equal(rect.options.fill, "#f00");
        });

        test("createLine returns SVGLine", function() {
            var line = view.createLine();
            ok(line instanceof dataviz.SVGLine);
        });

        test("createLine draws a line", function() {
            var line = view.createLine(10, 20, 100, 200);
            deepEqual(mapPoints(line.points), [ [10, 20], [100, 200] ]);
        });

        test("createLine sets align default", function() {
            view = new dataviz.SVGView({ align: false });
            var line = view.createLine(10, 20, 100, 200);
            ok(line.options.align === false);
        });

        test("createLine overrides align default", function() {
            view = new dataviz.SVGView({ align: false });
            var line = view.createLine(10, 20, 100, 200, { align: true });
            ok(line.options.align === true);
        });

        test("createPolyline returns SVGLine", function() {
            var path = view.createPolyline();
            ok(path instanceof dataviz.SVGLine);
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
            view = new dataviz.SVGView({ align: false });
            var path = view.createPolyline([], false, { dashType: "dot" });
            ok(path.options.align === false);
        });

        test("createPolyline overrides align default", function() {
            view = new dataviz.SVGView({ align: false });
            var path = view.createPolyline([], false, { dashType: "dot" , align: true });
            ok(path.options.align === true);
        });

        test("createCircle returns SVGCircle", function() {
            var circle = view.createCircle();
            ok(circle instanceof dataviz.SVGCircle);
        });

        test("createCircle sets center point", function() {
            var circle = view.createCircle(new Point2D(10, 10));
            deepEqual(circle.c.x, 10);
            deepEqual(circle.c.y, 10);
        });

        test("createCircle sets radius", function() {
            var circle = view.createCircle(new Point2D(10, 10), 10);
            deepEqual(circle.r, 10);
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

        test("createRing returns SVGRing", function() {
            var ring = view.createRing();
            ok(ring instanceof dataviz.SVGRing);
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

        test("createSector returns SVGSector", function() {
            var sector = view.createSector();
            ok(sector instanceof dataviz.SVGSector);
        });

        test("createSector sets fill color", function() {
            var sector = view.createSector({ }, { fill: "#cf0" });

            equal(sector.options.fill, "#cf0");
        });

        test("createSector sets stroke color", function() {
            var sector = view.createSector({ }, { stroke: "#cf0" });

            equal(sector.options.stroke, "#cf0");
        });

        test("createSector sets stroke width", function() {
            var sector = view.createSector({ }, { strokeWidth: 2});

            equal(sector.options.strokeWidth, 2);
        });

        test("renderElement returns element", function() {
            if (browser.msie && browser.version < 9) {
                return;
            }

            element = view.renderElement({
                render: function() {
                    return "<g></g>";
                }
            });

            equal(element.tagName.toLowerCase(), "g");
        });

        test("renderElement updates definitions", function() {
            if (browser.msie && browser.version < 9) {
                return;
            }

            var container = $("<div>").appendTo(document.body);
            view.renderTo(container[0]);

            view.definitions.updated = contentElementStub;
            element = view.renderElement({
                render: function() {
                    return "<g></g>";
                }
            });

            equal(document.getElementById(view.defsId).textContent, "Content");
            container.remove();
        });

        // ------------------------------------------------------------
        module("SVGView / Rendering", {
            setup: function() {
                view = new dataviz.SVGView();
                view.defsId = 'd';
            }
        });

        test("renders svg tag with default size", function() {
            equal(view.render(),
                "<?xml version='1.0' ?>" +
                "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' " +
                "width='600px' height='400px' style='position: relative; display: block;'>" +
                "<defs id='d'></defs></svg>");
        });

        test("renders children", function() {
            view.children.push(contentElementStub);
            equal(view.render(),
                "<?xml version='1.0' ?>" +
                "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' " +
                "width='600px' height='400px' style='position: relative; display: block;'>" +
                "<defs id='d'></defs>Content</svg>");
        });

        test("renders definitions", function() {
            view.definitions.test = contentElementStub;
            equal(view.render(),
                "<?xml version='1.0' ?>" +
                "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' " +
                "width='600px' height='400px' style='position: relative; display: block;'>" +
                "<defs id='d'>Content</defs></svg>");
        });

        test("renderTo returns DOM element", function() {
            if (browser.msie && browser.version < 9) {
                return;
            }

            var container = $("<div />").appendTo(document.body);
            equal(view.renderTo(container[0]), container[0].firstElementChild);
            container.remove();
        });

        test("renders inline", function() {
            view = new dataviz.SVGView({ inline: true });
            ok(view.render().indexOf("display: inline;") > -1);
        });

        // ------------------------------------------------------------
        module("SVGView / Gradient fill", {
            setup: function() {
                view = new dataviz.SVGView();
                dataviz.Gradients.test = linearGradient;
            },
            teardown: function() {
                dataviz.Gradients.test = null;
            }
        });

        test("applies gradient fill", function() {
            var path = view.createRect(new Box2D(), { fill: { gradient: "test" } });
            equal(path.options.fill, "url(#testGradient)");
        });

        test("sets non-existent gradient fill to none", function() {
            var path = view.createRect(new Box2D(), { fill: { gradient: "NA" } });
            equal(path.options.fill, "none");
        });

        test("preserves solid fill", function() {
            var path = view.createRect(new Box2D(), { fill: "#f00" });
            equal(path.options.fill, "#f00");
        });

        test("defines gradient", function() {
            var path = view.createRect(new Box2D(), { fill: { gradient: "test" } });
            ok(view.definitions[linearGradient.id]);
        });

        test("reuses existing gradient definition", function() {
            var path = view.createRect(new Box2D(), { fill: { gradient: "test" } });
            view.definitions[linearGradient.id] = { options: { id: "existingGradient" } };
            path = view.createRect(new Box2D(), { fill: { gradient: "test" } });

            equal(path.options.fill, "url(#existingGradient)");
        });

        // ------------------------------------------------------------
        module("SVG View / Decorators", {
            setup: function() {
                view = new dataviz.SVGView();

                view.decorators.push({
                    decorate: function(element) {
                        ok(true);
                        return element;
                    }
                });
            }
        });

        test("createGroup applies registered decorators", 1, function() {
            view.createGroup();
        });

        test("createText applies registered decorators", 1, function() {
            view.createText();
        });

        test("createRect applies registered decorators", 1, function() {
            view.createRect(new Box2D());
        });

        test("createLine applies registered decorators", 1, function() {
            view.createLine();
        });

        test("createPolyline applies registered decorators", 1, function() {
            view.createPolyline();
        });

        test("createCircle applies registered decorators", 1, function() {
            view.createCircle();
        });

        test("createSector applies registered decorators", 1, function() {
            view.createSector();
        });

    })();

    (function() {
        var group;

        module("SVGGroup", {
            setup: function() {
                group = new dataviz.SVGGroup();
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            group = new dataviz.SVGGroup({ id: "1" });
            ok(group.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders g tag", function() {
            equal(group.render(), "<g></g>");
        });

        test("renders children", function() {
            group.children.push(contentElementStub);
            equal(group.render(), "<g>Content</g>");
        });

        test("renders id", function() {
            group.options.id = "id";
            ok(group.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            group.options.data = { testId: 1 };
            ok(group.render().indexOf("data-test-id='1'") > -1);
        });

    })();

    (function() {
        var text;

        function createText(options) {
            options = $.extend({
                    rotation: 0
                }, options
            );

            text = new dataviz.SVGText(
                "Text",
                options
            );
        }

        module("SVGText", {
            setup: function() {
                createText();
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            createText({ id: "1" });
            ok(text.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders content", function() {
            equal(text.render().replace(/\<text.*?\>/, "<text>"),
                    "<text>Text</text>");
        });

        test("baseline is added to y", function() {
            text.options.y = 5;
            text.options.baseline = 5;
            ok(text.render().indexOf("y='10'") > -1);
        });

        test("sets font", function() {
            text.options.font = "12px sans-serif";
            ok(text.render().indexOf("font: " + text.options.font) > -1);
        });

        test("sets cursor style", function() {
            text.options.cursor.style = "pointer";
            ok(text.render().indexOf("cursor: pointer;") > -1);
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
            ok(text.render().indexOf(
                "transform='translate(0.5,7) rotate(45,13.5,7)'")
                != -1
            );
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
            ok(text.render().indexOf(
                "transform='translate(-6.5,6.5) rotate(90,13.5,7)'")
                != -1
            );
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
            ok(text.render().indexOf(
                "transform='translate(0.5,7) rotate(-45,13.5,7)'")
                != -1
            );
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
            ok(text.render().indexOf(
                "transform='translate(-6.5,6.5) rotate(-90,13.5,7)'")
                != -1
            );
        });

        test("sets color", function() {
            text.options.color = "#cf0";
            ok(text.render().indexOf("fill='" + text.options.color + "'") > -1);
        });

        test("renders id", function() {
            text.options.id = "id";
            ok(text.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            text.options.data = { testId: 1 };
            ok(text.render().indexOf("data-test-id='1'") > -1);
        });

        test("renders fill-opacity", function() {
            text.options.fillOpacity = .4;
            ok(text.render().indexOf("fill-opacity='0.4'") > -1);
        });

        test("clone returns different instance", function() {
            notEqual(text.clone(), text);
        });

        test("clone returns SVGText", function() {
            ok(text.clone() instanceof dataviz.SVGText);
        });

        test("clone copies text", function() {
            equal(text.clone().content, text.content);
        });

        test("clone copies options", function() {
            createText({ id: "1" });
            equal(text.clone().options.id, "1");
        });

        test("refresh updates fill-opacity attribute", function() {
            var domElement = $("<div />");
            text.options.fillOpacity = 0.4;
            text.refresh(domElement);
            equal(domElement.attr("fill-opacity"), "0.4");
        });

    })();

    (function() {
        var path;

        module("SVGPath", {
            setup: function() {
                path = new dataviz.SVGPath();
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            path = new dataviz.SVGPath({ id: "1" });
            ok(path.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders path tag", function() {
            equal(path.render().replace(/\<path.*?\>/, "<path>"),
                "<path></path>");
        });

        test("renders fill color", function() {
            path.options.fill = "#f00";
            ok(path.render().indexOf("fill='#f00'") > -1);
        });

        test("renders display", function() {
            path.options.visible = false;
            ok(path.render().indexOf("display: none") > -1);
        });

        test("renders empty fill when no fill is set", function() {
            path.options.fill = "";
            ok(path.render().indexOf("fill='none") > -1);
        });

        test("renders empty fill when fill is set to 'transparent'", function() {
            path.options.fill = "transparent";
            ok(path.render().indexOf("fill='none") > -1);
        });

        test("renders stroke color", function() {
            path.options.stroke = "#f00";
            ok(path.render().indexOf("stroke='#f00'") > -1);
        });

        test("renders stroke width", function() {
            path.options.strokeWidth = "2";
            ok(path.render().indexOf("stroke-width='2'") > -1);
        });

        test("renders stroke linecap", function() {
            ok(path.render().indexOf("stroke-linecap='square'") > -1);
        });

        test("renders stroke opacity", function() {
            path.options.strokeOpacity = 0.5;
            ok(path.render().indexOf("stroke-opacity='0.5'") > -1);
        });

        test("renders fill opacity", function() {
            path.options.fillOpacity = 0.5;
            ok(path.render().indexOf("fill-opacity='0.5'") > -1);
        });

        test("renders id", function() {
            path.options.id = "id";
            ok(path.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            path.options.data = { testId: 1 };
            ok(path.render().indexOf("data-test-id='1'") > -1);
        });

        test("clone returns different instance", function() {
            notEqual(path.clone(), path);
        });

        test("clone returns SVGPath", function() {
            ok(path.clone() instanceof dataviz.SVGPath);
        });

        test("clone copies options", function() {
            path.options.id = "1";
            equal(path.clone().options.id, "1");
        });

        test("refresh updates fill-opacity attribute", function() {
            var domElement = $("<div />");
            path.options.fillOpacity = 0.4;
            path.refresh(domElement);
            equal(domElement.attr("fill-opacity"), "0.4");
        });

        test("refresh updates stroke-opacity attribute", function() {
            var domElement = $("<div />");
            path.options.strokeOpacity = 0.4;
            path.refresh(domElement);
            equal(domElement.attr("stroke-opacity"), "0.4");
        });

        test("refresh updates display style property", function() {
            var domElement = $("<div />");
            path.options.visible = false;
            path.refresh(domElement);
            equal(domElement.css("display"), "none");
        });

        // ------------------------------------------------------------
        module("SVGPath / Dash", {
            setup: function() {
                path = new dataviz.SVGPath({ strokeWidth: 1 });
            }
        });

        test("defaults to 1 px stroke width", function() {
            path.options.strokeWidth = undefined;
            path.options.dashType = "dot";
            ok(path.render().indexOf("stroke-dasharray='1.5 3.5'") > -1);
        });

        test("renders dot", function() {
            path.options.dashType = "dot";
            ok(path.render().indexOf("stroke-dasharray='1.5 3.5'") > -1);
        });

        test("renders dash", function() {
            path.options.dashType = "dash";
            ok(path.render().indexOf("stroke-dasharray='4 3.5'") > -1);
        });

        test("renders longdash", function() {
            path.options.dashType = "longdash";
            ok(path.render().indexOf("stroke-dasharray='8 3.5'") > -1);
        });

        test("renders dashdot", function() {
            path.options.dashType = "dashdot";
            ok(path.render().indexOf("stroke-dasharray='3.5 3.5 1.5 3.5'") > -1);
        });

        test("renders longdashdot", function() {
            path.options.dashType = "longdashdot";
            ok(path.render().indexOf("stroke-dasharray='8 3.5 1.5 3.5'") > -1);
        });

        test("renders longdashdotdot", function() {
            path.options.dashType = "longdashdotdot";
            ok(path.render().indexOf("stroke-dasharray='8 3.5 1.5 3.5 1.5 3.5'") > -1);
        });

        test("sets stroke linecap to butt", function() {
            path.options.dashType = "dot";
            ok(path.render().indexOf("stroke-linecap='butt'") > -1);
        });

    })();

    (function() {
        var line;

        module("SVGLine", {
            setup: function() {
                line = new dataviz.SVGLine([
                    new Point2D(10, 20),
                    new Point2D(20, 30)
                ], false);
            }
        });

        test("draws line", function() {
            line = new dataviz.SVGLine([
                new Point2D(10, 20),
                new Point2D(20, 30)
            ], false);
            equal(line.renderPoints(), "M10 20 20 30");
        });

        test("draws closed line", function() {
            line = new dataviz.SVGLine([
                new Point2D(10, 20),
                new Point2D(20, 30)
            ], true);
            equal(line.renderPoints(), "M10 20 20 30 z");
        });

        test("clone returns different instance", function() {
            notEqual(line.clone(), line);
        });

        test("clone returns SVGLine", function() {
            ok(line.clone() instanceof dataviz.SVGLine);
        });

        test("clone copies points", function() {
            line.points = [ 1, 2 ];
            deepEqual(line.clone().points, line.points);
        });

        test("clone copies options", function() {
            line.options.id = "1";
            equal(line.clone().options.id, "1");
        });

        test("align=false skips point coordinate rounding", function() {
            line = new dataviz.SVGLine([
                new Point2D(1.503, 2.103),
                new Point2D(2.506, 3.801)
            ], false, { align: false })

            equal(line.renderPoints(), "M1.503 2.103 2.506 3.801");
        });

        test("renders data attributes", function() {
            line.options.data = { testId: 1 };
            ok(line.render().indexOf("data-test-id='1'") > -1);
        });
    })();

    (function() {
        var circle;

        function createCircle(options) {
            circle = new dataviz.SVGCircle(new Point2D(10, 20), 30, options);
        }

        module("SVGCircle", {
            setup: function() {
                createCircle();
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            createCircle({ id: "1" });
            ok(circle.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders circle tag", function() {
            equal(circle.render().replace(/\<circle.*?\>/, "<circle>"),
                "<circle></circle>");
        });

        test("renders center x", function() {
            ok(circle.render().indexOf("cx='10'") > -1);
        });

        test("renders center y", function() {
            ok(circle.render().indexOf("cy='20'") > -1);
        });

        test("renders radius", function() {
            ok(circle.render().indexOf("r='30'") > -1);
        });

        test("renders fill color", function() {
            circle.options.fill = "#f00";
            ok(circle.render().indexOf("fill='#f00'") > -1);
        });

        test("renders empty fill when no fill is set", function() {
            circle.options.fill = "";
            ok(circle.render().indexOf("fill='none") > -1);
        });

        test("renders stroke color", function() {
            circle.options.stroke = "#f00";
            ok(circle.render().indexOf("stroke='#f00'") > -1);
        });

        test("renders stroke width", function() {
            circle.options.strokeWidth = "2";
            ok(circle.render().indexOf("stroke-width='2'") > -1);
        });

        test("renders id", function() {
            circle.options.id = "id";
            ok(circle.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            circle.options.data = { testId: 1 };
            ok(circle.render().indexOf("data-test-id='1'") > -1);
        });

        test("refresh updates r attribute", function() {
            var domElement = $("<div />");
            circle.r = 4;
            circle.refresh(domElement);
            equal(domElement.attr("r"), "4");
        });

        test("refresh updates fill-opacity attribute", function() {
            var domElement = $("<div />");
            circle.options.fillOpacity = 0.4;
            circle.refresh(domElement);
            equal(domElement.attr("fill-opacity"), "0.4");
        });

    })();

    (function() {
        var clipPath;

        module("SVGClipPath", {
            setup: function() {
                clipPath = new dataviz.SVGClipPath();
            }
        });

        test("renders id in IE", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = true;

            clipPath = new dataviz.SVGClipPath({ id: "1" });
            ok(clipPath.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders id in non-IE", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            clipPath = new dataviz.SVGClipPath({ id: "1" });
            ok(clipPath.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders clipPath tag", function() {
            equal(clipPath.render().replace(/\<clipPath.*?\>/, "<clipPath>"),
                "<clipPath></clipPath>");
        });

        test("renders id", function() {
            clipPath.options.id = "id";
            ok(clipPath.render().indexOf("id='id'") > -1);
        });

    })();

    (function() {
        var sector;

        module("SVGSector", {
            setup: function() {
                sector = new dataviz.SVGSector(
                    new dataviz.Sector(
                        new Point2D(135, 135), 135, 90, 20
                    )
                );
            }
        });

        test("renders sector tag", function() {
            equal(sector.render().replace(/\<path.*?\>/, "<path>"),
                "<path></path>");
        });

        test("renders radius", function() {
            ok(sector.render().indexOf("A135 135") > -1);
        });

        test("renders fill color", function() {
            sector.options.fill = "#f00";
            ok(sector.render().indexOf("fill='#f00'") > -1);
        });

        test("renders empty fill when no fill is set", function() {
            sector.options.fill = "";
            ok(sector.render().indexOf("fill='none") > -1);
        });

        test("renders stroke color", function() {
            sector.options.stroke = "#f00";
            ok(sector.render().indexOf("stroke='#f00'") > -1);
        });

        test("renders single pie sector with angle 360", function() {
            sector = new dataviz.SVGSector(
                    new dataviz.Sector(
                        new Point2D(135, 135), 135, 90, 360
                    )
                );

            ok(sector.render().indexOf("d='M 135 0 A135 135 0 1,1 134.882 0 L 135 135 z'") > -1);
        });

        test("renders stroke width", function() {
            sector.options.strokeWidth = "2";
            ok(sector.render().indexOf("stroke-width='2'") > -1);
        });

        test("renders id", function() {
            sector.options.id = "id";
            ok(sector.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            sector.options.data = { testId: 1 };
            ok(sector.render().indexOf("data-test-id='1'") > -1);
        });

        test("renders render curve with angle < 180 degrese", function() {
            ok(sector.render().indexOf("A135 135 0 0,1 181.173 8.141") > -1);
        });

        test("renders render curve with angle > 180 degrese", function() {
            sector = new dataviz.SVGSector(
                new dataviz.Sector(
                    new Point2D(135, 135), 135, 90, 200
                )
            );

            ok(sector.render().indexOf("A135 135 0 1,1 88.827 261.859") > -1);
        });

        test("clone returns different instance", function() {
            notEqual(sector.clone(), sector);
        });

        test("clone returns SVGSector", function() {
            ok(sector.clone() instanceof dataviz.SVGSector);
        });

        test("clone copies circleSector", function() {
            deepEqual(sector.clone().cricleSector, sector.cricleSector);
        });

        test("clone copies options", function() {
            sector.options.id = "1";
            equal(sector.clone().options.id, "1");
        });

    })();

    (function() {
        var ring;

        module("SVGRing", {
            setup: function() {
                var ringConfig = new dataviz.Ring(
                        new Point2D(135, 135), 100, 135, -30, 240
                    );
                ring = new dataviz.SVGRing(ringConfig);
            }
        });

        test("renders path", function() {
            equal(ring.render().replace(/\<path.*?\>/, "<path>"),
                "<path></path>");
        });

        test("renders radius", function() {
            ok(ring.render().indexOf("A135 135") > -1);
        });

        test("renders data attributes", function() {
            ring.options.data = { testId: 1 };
            ok(ring.render().indexOf("data-test-id='1'") > -1);
        });

    })();

    (function() {
        var view,
            rect,
            group,
            overlay,
            decorator,
            ID = "1";

        module("SVGOverlayDecorator", {
            setup: function() {
                view = new dataviz.SVGView();
                rect = new dataviz.SVGPath({
                    id: ID,
                    overlay: {
                        gradient: "glass"
                    }
                });
                decorator = new dataviz.SVGOverlayDecorator(view);
                group = decorator.decorate(rect);
                overlay = group.children[1];
            }
        });

        test("creates overlay group", function() {
            ok(group instanceof dataviz.SVGGroup);
        });

        test("moves id to overlay", function() {
            equal(overlay.options.id, ID);
        });

        test("generates id for decorated element", function() {
            ok(rect.options.id.length > 0);
        });

        test("does not decorate element if no overlay specified", function() {
            var rect = view.createRect(new Box2D());
            ok(rect instanceof dataviz.SVGPath);
        });

    })();

    (function() {
        var gradient;

        // ------------------------------------------------------------
        module("SVGLinearGradient", {
            setup: function() {
                gradient = new dataviz.SVGLinearGradient(linearGradient);
            }
        });

        test("renders id", function() {
            ok(gradient.render().indexOf("id='testGradient'") > -1);
        });

        test("renders rotation", function() {
            ok(gradient.render().indexOf("gradientTransform='rotate(0)'") > -1);
        });

        test("renders stops", function() {
            ok(gradient.render().indexOf(
                "<stop offset='0%' style='stop-color:#f00;stop-opacity:1' />" +
                "<stop offset='100%' style='stop-color:#00f;stop-opacity:1' />") > -1
            );
        });

    })();

    (function() {
        var gradient;

        // ------------------------------------------------------------
        module("SVGRadialGradient", {
            setup: function() {
                gradient = new dataviz.SVGRadialGradient(radialGradient);
            }
        });

        test("renders id", function() {
            ok(gradient.render().indexOf("id='testGradient'") > -1);
        });

        test("renders stops", function() {
            ok(gradient.render().indexOf(
                "<stop offset='0%' style='stop-color:#f00;stop-opacity:1' />" +
                "<stop offset='100%' style='stop-color:#00f;stop-opacity:1' />") > -1
            );
        });

        test("renders cx", function() {
            ok(gradient.render().indexOf("cx='25'") > -1);
        });

        test("renders cy", function() {
            ok(gradient.render().indexOf("cy='50'") > -1);
        });

        test("renders fx", function() {
            ok(gradient.render().indexOf("fx='25'") > -1);
        });

        test("renders fy", function() {
            ok(gradient.render().indexOf("fy='50'") > -1);
        });

        test("renders r", function() {
            ok(gradient.render().indexOf("r='100'") > -1);
        });

    })();

    (function() {
        var view,
            rect,
            decorator;

        function hrefNoHash() {
            var href = window.location.href;
            var hashIndex = href.indexOf("#");

            if (hashIndex !== -1) {
                href = href.substring(0, hashIndex);
            }

            return href;
        }

        module("SVGGradientDecorator", {
            setup: function() {
                view = new dataviz.SVGView();
                rect = new dataviz.SVGPath({
                    fill: {
                        gradient: "glass",
                        id: "fillId"
                    }
                });
                decorator = new dataviz.SVGGradientDecorator(view);
            }
        });

        test("sets fill id", function() {
            decorator.decorate(rect);
            equal(rect.options.fill, "url(#fillId)");
        });

        test("sets absolute url if the page has a base tag (non-IE)", function() {
            var msie = browser.msie;
            browser.msie = false;

            $("head").append($("<base href='http://foo' />"));

            decorator.decorate(rect);

            equal(rect.options.fill, "url(" + hrefNoHash() + "#fillId)");

            $("base").remove();
            browser.msie = msie;
        });

        test("does not set absolute url if the page has a base tag in IE", function() {
            var msie = browser.msie;
            browser.msie = true;

            $("head").append($("<base href='http://foo' />"));

            decorator.decorate(rect);

            equal(rect.options.fill, "url(#fillId)");

            $("base").remove();
            browser.msie = msie;
        });

        test("sets absolute url if the page has a base tag and hash (non-IE)", function() {
            var msie = browser.msie;
            browser.msie = false;

            window.location.hash = "test";
            $("head").append($("<base href='http://foo' />"));

            decorator.decorate(rect);
            equal(rect.options.fill, "url(" + hrefNoHash() + "#fillId)");

            $("base").remove();
            browser.msie = msie;
        });

        test("registers gradient definition", function() {
            decorator.decorate(rect);
            ok(view.definitions.fillId);
        });

        test("sets transparent fill if gradient is invalid", function() {
            var rect = new dataviz.SVGPath({ fill: { gradient: "" } });
            decorator.decorate(rect);
            equal(rect.options.fill, "none");
        });

    })();

    (function() {
        var view,
            rect,
            decorator;

        module("SVGClipAnimationDecorator", {
            setup: function() {
                view = new dataviz.SVGView({ transitions: true });
                rect = new dataviz.SVGPath({
                    animation: {
                        type: "clip"
                    }
                });
                decorator = new dataviz.SVGClipAnimationDecorator(view);
            }
        });

        test("does not decorate when view.options.transitions is false", function() {
            view.options.transitions = false;
            decorator.decorate(rect);
            ok(!rect.options.clipPath);
        });

        test("sets clipPath to unique Id", function() {
            decorator.decorate(rect);
            ok(/url\(#\w+\)/.test(rect.options.clipPath));
        });

        test("registers clip path definition", function() {
            decorator.decorate(rect);
            ok(view.definitions[decorator.clipId]);
        });

        test("clip path is fully expanded", function() {
            decorator.decorate(rect);
            var clipRect = view.definitions[decorator.clipId].children[0];
            deepEqual([clipRect.points[2].x, clipRect.points[2].y], [600, 400]);
        });

        test("registers clip animation", function() {
            decorator.decorate(rect);
            ok(view.animations[0] instanceof dataviz.ExpandAnimation);
        });

    })();
})();
