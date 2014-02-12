(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D,
        view = new ViewElementStub(),
        contentElementStub = {
            render: function() { return "Content"; }
        },
        linearGradient = {
            id: "gradient",
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
            id: "gradient",
            type: "radial",
            cx: 100,
            cy: 100,
            r: 100,
            bbox: new Box2D(0, 0, 200, 100),
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

        module("VMLView", {
            setup: function() {
                view = new dataviz.VMLView();
            }
        });

        test("has default dimensions", function() {
            equal(view.options.width, 600);
            equal(view.options.height, 400);
        });

        test("sets dimensions", function() {
            view = new dataviz.VMLView({ width: "100px", height: "100px" });
            equal(view.options.width, "100px");
            equal(view.options.height, "100px");
        });

        test("createGroup returns VMLGroup", function() {
            var group = view.createGroup();
            ok(group instanceof dataviz.VMLGroup);
        });

        test("createGroup sets inline default", function() {
            view = new dataviz.VMLView({ inline: true });
            var group = view.createGroup();
            ok(group.options.inline);
        });

        test("createGroup overrides inline default", function() {
            view = new dataviz.VMLView({ inline: true });
            var group = view.createGroup({ inline: false });
            ok(!group.options.inline);
        });

        test("createGroup does not set inline default", function() {
            var group = view.createGroup();
            ok(!group.options.inline);
        });

        test("createText returns VMLText", function() {
            var text = view.createText("");
            ok(text instanceof dataviz.VMLText);
        });

        test("createText sets content", function() {
            var text = view.createText("Text");
            equal(text.content, "Text");
        });

        test("createText with rotation returns VMLRotatedText", function() {
            var text = view.createText("", { rotation: 45 });
            ok(text instanceof dataviz.VMLRotatedText);
        });

        test("createText with rotation angle sets content", function() {
            var text = view.createText("Text", { rotation: 45 });
            equal(text.content, "Text");
        });

        test("createRect returns VMLLine", function() {
            var rect = view.createRect(new Box2D(10, 20, 110, 220));
            ok(rect instanceof dataviz.VMLLine);
        });

        test("createRect draws rectangle", function() {
            var rect = view.createRect(new Box2D(10, 20, 110, 220));
            deepEqual(
                mapPoints(rect.points),
                [[10, 20], [110, 20], [110, 220], [10, 220]]
            );
        });

        test("createRect sets fill color", function() {
            var rect = view.createRect(
                new Box2D(10, 20, 110, 220), { fill: "#f00" });
            equal(rect.options.fill, "#f00");
        });

        test("createRect sets align default", function() {
            view = new dataviz.VMLView({ align: false });
            var rect = view.createRect(new Box2D(10, 20, 110, 220));
            ok(rect.options.align === false);
        });

        test("createRect overrides align default", function() {
            view = new dataviz.VMLView({ align: false });
            var rect = view.createRect(new Box2D(10, 20, 110, 220), { align: true });
            ok(rect.options.align === true);
        });

        test("createLine returns VMLLine", function() {
            var line = view.createLine();
            ok(line instanceof dataviz.VMLLine);
        });

        test("createLine draws a line", function() {
            var line = view.createLine(10, 20, 100, 200);
            deepEqual(mapPoints(line.points), [ [10, 20], [100, 200] ]);
        });

        test("createLine sets align default", function() {
            view = new dataviz.VMLView({ align: false });
            var line = view.createLine(10, 20, 100, 200);
            ok(line.options.align === false);
        });

        test("createLine overrides align default", function() {
            view = new dataviz.VMLView({ align: false });
            var line = view.createLine(10, 20, 100, 200, { align: true });
            ok(line.options.align === true);
        });

        test("createPolyline returns VMLLine", function() {
            var path = view.createPolyline();
            ok(path instanceof dataviz.VMLPath);
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

        test("createPolyline sets stroke width", function() {
            var path = view.createPolyline([], false, { dashType: "dot" });

            equal(path.options.dashType, "dot");
        });

        test("createPolyline sets align default", function() {
            view = new dataviz.VMLView({ align: false });
            var path = view.createPolyline([], false, { dashType: "dot" });
            ok(path.options.align === false);
        });

        test("createPolyline overrides align default", function() {
            view = new dataviz.VMLView({ align: false });
            var path = view.createPolyline([], false, { dashType: "dot" , align: true });
            ok(path.options.align === true);
        });

        test("createCircle returns VMLCircle", function() {
            var circle = view.createCircle();
            ok(circle instanceof dataviz.VMLCircle);
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
            var circle = view.createCircle(new Point2D(), 10, { strokeWidth: 2});

            equal(circle.options.strokeWidth, 2);
        });

        test("createSector returns VMLSector", function() {
            var sector = view.createSector();
            ok(sector instanceof dataviz.VMLSector);
        });

        test("createSector sets fill color", function() {
            var sector = view.createSector({}, { fill: "#cf0" });

            equal(sector.options.fill, "#cf0");
        });

        test("createSector sets stroke color", function() {
            var sector = view.createSector({}, { stroke: "#cf0" });

            equal(sector.options.stroke, "#cf0");
        });

        test("createSector sets stroke width", function() {
            var sector = view.createSector({}, { strokeWidth: 2});

            equal(sector.options.strokeWidth, 2);
        });

        test("createRing returns VMLRing", function() {
            var ring = view.createRing();
            ok(ring instanceof dataviz.VMLRing);
        });

        test("createRing sets fill color", function() {
            var ring = view.createRing({}, { fill: "#cf0" });

            equal(ring.options.fill, "#cf0");
        });

        test("createRing sets stroke color", function() {
            var ring = view.createRing({}, { stroke: "#cf0" });

            equal(ring.options.stroke, "#cf0");
        });

        test("createRing sets stroke width", function() {
            var ring = view.createRing({}, { strokeWidth: 2});

            equal(ring.options.strokeWidth, 2);
        });

        test("createRing sets align default", function() {
            view = new dataviz.VMLView({ align: false });
            var ring = view.createRing({}, { strokeWidth: 2});
            ok(ring.options.align === false);
        });

        test("createRing overrides align default", function() {
            view = new dataviz.VMLView({ align: false });
            var ring = view.createRing({}, { strokeWidth: 2, align: true });
            ok(ring.options.align === true);
        });

        test("renderTo returns DOM element", function() {
            var container = $("<div />").appendTo(document.body);
            equal(view.renderTo(container[0]), container[0].firstChild);
            container.remove();
        });

        test("renderElement returns element", function() {
            element = view.renderElement({
                render: function() {
                    return "<h1></h1>";
                }
            });

            equal(element.tagName.toLowerCase(), "h1");
        });

        // ------------------------------------------------------------
        module("VML View / Decorators", {
            setup: function() {
                view = new dataviz.VMLView();

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
        var view;

        module("VMLView", {
            setup: function() {
                view = new dataviz.VMLView();
            }
        });

        test("renders div tag with default size", function() {
            equal(view.render(),
            "<div style='width:600px; height:400px; position: relative;'></div>");
        });

        test("renders span tag when marked as inline", function() {
            view = new dataviz.VMLView({ inline: true });
            ok(view.render().match(
                /\<span.*\>.*\<\/span\>/
            ));
        });

        test("renders children", function() {
            view.children.push(contentElementStub);
            equal(view.render(),
            "<div style='width:600px; height:400px; position: relative;'>Content</div>");
        });
    })();

    (function() {
        var text;

        function createText(options) {
            text = new dataviz.VMLText("Text", options);
        }

        module("VMLText", {
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
            text.content = "Text";
            ok(text.render().indexOf(">Text</kvml:textbox>") != -1);
        });

        test("sets position on text", function() {
            ok(text.render().indexOf("position: absolute; left: 0px; top: 0px;") > -1);
        });

        test("sets font", function() {
            text.options.font = "12px sans-serif";
            ok(text.render().indexOf("font: " + text.options.font) > -1);
        });

        test("sets cursor style", function() {
            text.options.cursor.style = "pointer";
            ok(text.render().indexOf("cursor: " + text.options.cursor.style) > -1);
        });

        test("sets color", function() {
            text.options.color = "#cf0";
            ok(text.render().indexOf("color: " + text.options.color) > -1);
        });

        test("renders white-space: nowrap", function() {
            ok(text.render().indexOf("white-space: nowrap;") > -1);
        });

        test("renders id", function() {
            text.options.id = "id";
            ok(text.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            text.options.data = { testId: 1 };
            ok(text.render().indexOf("data-test-id='1'") > -1);
        });

        test("hides text when fillOpacity is 0", function() {
            text.options.fillOpacity = 0;
            ok(text.render().indexOf("visibility: hidden") > -1);
        });

        test("shows text when fillOpacity is greater than 0", function() {
            text.options.fillOpacity = 0.1;
            ok(text.render().indexOf("visibility: visible") > -1);
        });

        test("clone returns VMLText", function() {
            ok(text.clone() instanceof dataviz.VMLText);
        });

        test("clone copies content", function() {
            equal(text.clone().content, text.content);
        });

        test("clone copies options", function() {
            text.options.id = "id";
            equal(text.clone().options.id, text.options.id);
        });

        test("refresh updates visibility attribute", function() {
            var domElement = $("<div />")[0];
            text.refresh(domElement);
            equal(domElement.style.visibility, "visible");
        });

    })();

    (function() {
        var text;

        function createRotatedText(options) {
            options = $.extend({
                    rotation: 0
                }, options
            );

            text = new dataviz.VMLRotatedText(
                "test",
                options
            );
        }

        module("VMLRotatedText", {
            setup: function() {
                createRotatedText({ rotation: 45 });
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            createRotatedText({ id: "1" });
            ok(text.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders shape with textpath", function() {
            ok(text.render().indexOf("<kvml:shape") != -1);
            ok(text.render().indexOf("<kvml:textpath") != -1);
        });

        test("renders path", function() {
            ok(text.render().indexOf("<kvml:path textpathok='true'") != -1);
        });

        test("renders path for 45 degrees rotation", function() {
            createRotatedText({
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
                "<kvml:path textpathok='true' v='m 4,4 l 24,24' />")
                != -1
            );
        });

        test("renders path for 90 degrees rotation", function() {
            createRotatedText({
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
                "<kvml:path textpathok='true' v='m 7,7 l 7,21' />")
                != -1
            );
        });

        test("renders path for -45 degrees rotation", function() {
            createRotatedText({
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
                "<kvml:path textpathok='true' v='m 4,24 l 24,4' />")
                != -1
            );
        });

        test("renders path for -90 degrees rotation", function() {
            createRotatedText({
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
                "<kvml:path textpathok='true' v='m 7,21 l 7,7' />")
                != -1
            );
        });

        test("renders content", function() {
            ok(text.render().indexOf("string='test'") != -1);
        });

        test("sets position on the shape of the text", function() {
            ok(text.render().indexOf(
                "position: absolute; top: 0px; left: 0px; width: 1px; height: 1px;") > -1);
        });

        test("sets font", function() {
            text.options.font = "12px sans-serif";
            ok(text.render().indexOf("font: " + text.options.font) > -1);
        });

        test("sets color", function() {
            text.options.color = "#cf0";
            ok(text.render().indexOf("color='" + text.options.color) > -1);
        });

        test("renders id", function() {
            text.options.id = "id";
            ok(text.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            text.options.data = { testId: 1 };
            ok(text.render().indexOf("data-test-id='1'") > -1);
        });

    })();

    (function() {
        var path,
            domElement;

        function createPath(options) {
            path = new dataviz.VMLPath(options);
        }

        module("VMLPath", {
            setup: function() {
                createPath();
                domElement = $("<div><path /><fill /><stroke /></div>")
                             .appendTo($("<div />"));
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            createPath({ id: "1" });
            ok(path.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders path tag", function() {
            equal(path.render()
                    .replace(/\<kvml:shape.*?\>/, "<kvml:shape>")
                    .replace(/\<kvml:path.*?\/\>/, "<kvml:path\/>")
                    .replace(/\<kvml:stroke.*?\/\>/, "")
                    .replace(/\<kvml:fill.*?\/\>/, ""),
            "<kvml:shape>" +
                "<kvml:path/>" +
            "</kvml:shape>");
        });

        test("positions shape", function() {
            ok(path.render().indexOf("position:absolute; width:1px; height:1px;") > -1);
        });

        test("sets coordorigin", function() {
            ok(path.render().indexOf("coordorigin='0 0'") > -1);
        });

        test("sets coordsize", function() {
            ok(path.render().indexOf("coordsize='1 1'") > -1);
        });

        test("sets display", function() {
            createPath({ visible: false });
            ok(path.render().indexOf("display:none;") > -1);
        });

        test("creates stroke", function() {
            ok(path.stroke instanceof dataviz.VMLStroke);
        });

        test("sets stroke color", function() {
            var options = { stroke: "#cf0" };

            createPath(options);
            deepEqual(path.stroke.options.stroke, "#cf0");
        });

        test("sets stroke width", function() {
            var options = { strokeWidth: 2 };

            createPath(options);
            deepEqual(path.stroke.options.strokeWidth, 2);
        });

        test("does not override stroke width if set in combination with crispEdges", function() {
            var options = { strokeWidth: 2, crispEdges: true };

            createPath(options);
            deepEqual(path.stroke.options.strokeWidth, 2);
        });

        test("sets stroke dash type", function() {
            var options = { dashType: "dot" };

            createPath(options);
            deepEqual(path.stroke.options.dashType, "dot");
        });

        test("sets stroke opacity", function() {
            var options = { opacity: 0.5 };

            createPath(options);
            deepEqual(path.stroke.options.opacity, 0.5);
        });

        test("renders stroke", function() {
            ok(path.render().indexOf("<kvml:stroke") > -1);
        });

        test("creates fill", function() {
            ok(path.fill instanceof dataviz.VMLFill);
        });

        test("sets fill color", function() {
            var options = { fill: "#cf0" };

            createPath(options);
            deepEqual(path.fill.options.fill, "#cf0");
        });

        test("sets fill opacity", function() {
            var options = { opacity: 0.5 };

            createPath(options);
            deepEqual(path.fill.options.opacity, 0.5);
        });

        test("renders fill", function() {
            ok(path.render().indexOf("<kvml:fill") > -1);
        });

        test("renders id", function() {
            path.options.id = "id";
            ok(path.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            path.options.data = { testId: 1 };
            ok(path.render().indexOf("data-test-id='1'") > -1);
        });

        test("refresh updates path fill opacity", function() {
            path.options.fillOpacity = 0.5;
            path.refresh(domElement);
            equal(domElement.find("fill")[0].opacity, "0.5");
        });

        test("refresh updates path stroke opacity", function() {
            path.options.strokeOpacity = 0.5;
            path.refresh(domElement);
            equal(domElement.find("stroke")[0].opacity, "0.5");
        });

        test("fill opacity is updated before rendering", function() {
            path.options.fillOpacity = 0.5;
            ok(path.render().indexOf("opacity='0.5'") > -1);
        });

        test("stroke opacity is updated before rendering", function() {
            path.options.strokeOpacity = 0.5;
            ok(path.render().indexOf("opacity='0.5'") > -1);
        });

        test("refresh updates path display", function() {
            path.options.visible = true;
            path.refresh(domElement);
            equal(domElement.css("display"), "block");
        });
    })();

    (function() {
        var line,
            domElement;

        module("VMLLine", {
            setup: function() {
                line = new dataviz.VMLLine([
                    new Point2D(10, 20),
                    new Point2D(20, 30)
                ], false);

                domElement = $("<div><path /><fill /><stroke /></div>")
                             .appendTo($("<div />"));
            }
        });

        test("draws line", function() {
            line.closed = false;
            equal(line.renderPoints(), "m 10,20 l 20,30");
        });

        test("draws closed line", function() {
            line.closed = true;
            equal(line.renderPoints(), "m 10,20 l 20,30 x");
        });

        test("refresh updates path v attribute", function() {
            line.refresh(domElement);
            ok(domElement.find("path")[0].v.length > 0);
        });

        test("renders data attributes", function() {
            line.options.data = { testId: 1 };
            ok(line.render().indexOf("data-test-id='1'") > -1);
        });

    })();

    (function() {
        var stroke;

        module("VMLStroke", {
            setup: function() {
                stroke = new dataviz.VMLStroke();
            }
        });

        test("renders stroke tag", function() {
            equal(stroke.render().replace(/\<kvml:stroke.*?\/\>/, "<kvml:stroke/>"),
            "<kvml:stroke/>");
        });

        test("sets on attribute when stroke color and width are set", function() {
            stroke.options.stroke = "#f00";
            stroke.options.strokeWidth = 1;
            ok(stroke.render().indexOf("on='true'") > -1);
        });

        test("sets on attribute when stroke width is not set", function() {
            stroke.options.stroke = "#f00";
            ok(stroke.render().indexOf("on='false'") > -1);
        });

        test("sets on attribute when stroke color is not set", function() {
            stroke.options.stroke = "";
            ok(stroke.render().indexOf("on='false'") > -1);
        });

        test("renders color", function() {
            stroke.options.stroke = "#f00";
            ok(stroke.render().indexOf("color='#f00'") > -1);
        });

        test("renders width", function() {
            stroke.options.strokeWidth = "2";
            ok(stroke.render().indexOf("weight='2px'") > -1);
        });

        test("renders empty width", function() {
            ok(stroke.render().indexOf("weight='0px'") > -1);
        });

        test("renders opacity", function() {
            stroke.options.strokeOpacity = "0.5";
            ok(stroke.render().indexOf("opacity='0.5'") > -1);
        });

        test("renders dash type", function() {
            stroke.options.dashType = "dot";
            ok(stroke.render().indexOf("dashstyle='dot'") > -1);
        });

        test("refresh updates stroke opacity", function() {
            var domElement = $("<div />");
            stroke.options.strokeOpacity = 0.4;
            stroke.refresh(domElement[0]);
            equal(domElement[0].opacity, "0.4");
        });

    })();

    (function() {
        var fill;

        module("VMLFill", {
            setup: function() {
                fill = new dataviz.VMLFill();
            }
        });

        test("renders fill tag", function() {
            equal(fill.render().replace(/\<kvml:fill.*?\/\>/, "<kvml:fill/>"),
            "<kvml:fill/>");
        });

        test("sets on attribute when fill color is set", function() {
            fill.options.fill = "#f00";
            ok(fill.render().indexOf("on='true'") > -1);
        });

        test("sets on attribute when fill color is not set", function() {
            fill.options.fill = "";
            ok(fill.render().indexOf("on='false'") > -1);
        });

        test("sets on attribute when fill color is set to transparent", function() {
            fill.options.fill = "transparent";
            ok(fill.render().indexOf("on='false'") > -1);
        });

        test("renders color", function() {
            fill.options.fill = "#f00";
            ok(fill.render().indexOf("color='#f00'") > -1);
        });

        test("renders opacity", function() {
            fill.options.fillOpacity = "0.5";
            ok(fill.render().indexOf("opacity='0.5'") > -1);
        });

        test("renders opacity(0)", function() {
            fill.options.fillOpacity = 0;
            ok(fill.render().indexOf("opacity='0'") > -1);
        });

        test("refresh updates fill opacity", function() {
            var domElement = $("<div />");
            fill.options.fillOpacity = 0.4;
            fill.refresh(domElement[0]);
            equal(domElement[0].opacity, "0.4");
        });

    })();

    (function() {
        var group;

        module("VMLGroup", {
            setup: function() {
                group = new dataviz.VMLGroup();
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            var group = new dataviz.VMLGroup({ id: 1 });
            ok(group.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders div", function() {
            equal(group.render(),
                "<div style='position: absolute; white-space: nowrap;'></div>");
        });

        test("renders span when the marked as inline", function() {
            group = new dataviz.VMLGroup({ inline: true });
            ok(group.render().match(
                /\<span.*\>.*\<\/span\>/
            ));
        });

        test("renders children", function() {
            group.children.push(contentElementStub);
            equal(group.render(),
                "<div style='position: absolute; white-space: nowrap;'>Content</div>");
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
        var circle;

        function createCircle(options) {
            circle = new dataviz.VMLCircle(new Point2D(10, 20), 10, options);
        }

        module("VMLCircle", {
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

        test("renders oval tag", function() {
            ok(circle.render().match(
                /\<kvml:oval.*\>.*\<\/kvml:oval\>/
            ));
        });

        test("renders center top", function() {
            ok(circle.render().indexOf("top:10px;") > -1);
        });

        test("renders center left", function() {
            ok(circle.render().indexOf("left:0px;") > -1);
        });

        test("renders width", function() {
            ok(circle.render().indexOf("width:20px") > -1);
        });

        test("renders height", function() {
            ok(circle.render().indexOf("height:20px") > -1);
        });

        test("creates fill", function() {
            ok(circle.fill instanceof dataviz.VMLFill);
        });

        test("sets fill color", function() {
            createCircle({ fill: "#f00" });
            equal(circle.fill.options.fill, "#f00");
        });

        test("sets fill opacity", function() {
            createCircle({ opacity: 0.5 });
            equal(circle.fill.options.opacity, 0.5);
        });

        test("renders fill", function() {
            ok(circle.render().indexOf("<kvml:fill") > -1);
        });

        test("creates stroke", function() {
            ok(circle.stroke instanceof dataviz.VMLStroke);
        });

        test("sets stroke color", function() {
            createCircle({ stroke: "#cf0" });
            deepEqual(circle.stroke.options.stroke, "#cf0");
        });

        test("sets stroke width", function() {
            createCircle({ strokeWidth: 2 });
            deepEqual(circle.stroke.options.strokeWidth, 2);
        });

        test("sets stroke dash type", function() {
            createCircle({ dashType: "dot" });
            deepEqual(circle.stroke.options.dashType, "dot");
        });

        test("sets stroke opacity", function() {
            createCircle({ opacity: 0.5 });
            deepEqual(circle.stroke.options.opacity, 0.5);
        });

        test("renders stroke", function() {
            ok(circle.render().indexOf("<kvml:stroke") > -1);
        });

        test("renders id", function() {
            circle.options.id = "id";
            ok(circle.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            circle.options.data = { testId: 1 };
            ok(circle.render().indexOf("data-test-id='1'") > -1);
        });

        test("refresh updates size", function() {
            var domElement = $("<div />");
            circle.r = 4;
            circle.c = new Point2D(10, 20);
            circle.refresh(domElement);
            equal(domElement.css("width"), "8px");
            equal(domElement.css("height"), "8px");
            equal(domElement.css("left"), "6px");
            equal(domElement.css("top"), "16px");
        });

        test("refresh updates fill opacity", function() {
            var domElement = $("<div><fill /></div>");
            circle.options.fillOpacity = 0.4;
            circle.refresh(domElement);
            equal(domElement.find("fill")[0].opacity, "0.4");
        });

    })();

    (function() {
        var clipRect;

        function createClipRect(options) {
            clipRect = new dataviz.VMLClipRect(
                new Box2D(10, 20, 110, 220),
                options
            );
        }

        module("VMLClipRect", {
            setup: function() {
                createClipRect();
            }
        });

        test("renders id", function() {
            var msie = kendo.support.browser.msie;
            kendo.support.browser.msie = false;

            createClipRect({ id: 1 });
            ok(clipRect.render().indexOf(" id='1'") > -1);

            kendo.support.browser.msie = msie;
        });

        test("renders div tag", function() {
            ok(clipRect.render().match(
                /\<div.*\>.*\<\/div\>/
            ));
        });

        test("renders span tag when marked as inline", function() {
            createClipRect({ inline: true });
            ok(clipRect.render().match(
                /\<span.*\>.*\<\/span\>/
            ));
        });

        test("renders top", function() {
            ok(clipRect.render().indexOf("top:0px;") > -1);
        });

        test("renders left", function() {
            ok(clipRect.render().indexOf("left:0px;") > -1);
        });

        test("renders width", function() {
            ok(clipRect.render().indexOf("width:100px") > -1);
        });

        test("renders height", function() {
            ok(clipRect.render().indexOf("height:220px") > -1);
        });

        test("renders clip", function() {
            ok(clipRect.render().indexOf("clip:rect(20px 110px 220px 10px)") > -1);
        });

        test("renders id", function() {
            clipRect.options.id = "id";
            ok(clipRect.render().indexOf("id='id'") > -1);
        });

        test("clone returns VMLClipRect", function() {
            ok(clipRect.clone() instanceof dataviz.VMLClipRect);
        });

        test("clone copies box", function() {
            equal(clipRect.clone().box, clipRect.box);
        });

        test("clone copies options", function() {
            clipRect.options.id = "id";
            equal(clipRect.clone().options.id, clipRect.options.id);
        });

        test("refresh updates clip attribute", function() {
            var domElement = $("<div />")[0];
            clipRect.refresh(domElement);
            equal(domElement.style.clip.replace(/,/g, " ").replace(/\s+/g," "),
                   "rect(20px 110px 220px 10px)");
        });

    })();

    (function() {
        var ring;

        module("VMLRing", {
            setup: function() {
                var ringConfig = new dataviz.Ring(new Point2D(135, 135), 100, 130, -30, 240);
                ring = new dataviz.VMLRing(ringConfig);
            }
        });

        test("renders outer arc", function() {
            ok(ring.render().indexOf("WA 5,5 265,265 22,200 248,200") > -1);
        });

        test("renders line", function() {
            ok(ring.render().indexOf("L 222,185") > -1);
        });

        test("renders inner arc", function() {
            ok(ring.render().indexOf("AT 35,35 235,235 222,185 48,185") > -1);
        });

        test("renders id", function() {
            ring.options.id = "id";
            ok(ring.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            ring.options.data = { testId: 1 };
            ok(ring.render().indexOf("data-test-id='1'") > -1);
        });

    })();

    (function() {
        var sector;

        function createSector(options) {
            sector = new dataviz.VMLSector(
                new dataviz.Sector(
                    new Point2D(0, 0), 150, 90, 20
                )
            , options);
        }

        module("VMLSector", {
            setup: function() {
                createSector();
            }
        });

        test("renders shape tag", function() {
            ok(sector.render().match(
                /\<kvml:shape.*\>.*\<\/kvml:shape\>/
            ));
        });

        test("creates fill", function() {
            ok(sector.fill instanceof dataviz.VMLFill);
        });

        test("sets fill color", function() {
            createSector({ fill: "#f00" });
            equal(sector.fill.options.fill, "#f00");
        });

        test("sets fill opacity", function() {
            createSector({ opacity: 0.5 });
            equal(sector.fill.options.opacity, 0.5);
        });

        test("renders fill", function() {
            ok(sector.render().indexOf("<kvml:fill") > -1);
        });

        test("creates stroke", function() {
            ok(sector.stroke instanceof dataviz.VMLStroke);
        });

        test("sets stroke color", function() {
            createSector({ stroke: "#cf0" });
            deepEqual(sector.stroke.options.stroke, "#cf0");
        });

        test("sets stroke width", function() {
            createSector({ strokeWidth: 2 });
            deepEqual(sector.stroke.options.strokeWidth, 2);
        });

        test("sets stroke dash type", function() {
            createSector({ dashType: "dot" });
            deepEqual(sector.stroke.options.dashType, "dot");
        });

        test("sets stroke opacity", function() {
            createSector({ opacity: 0.5 });
            deepEqual(sector.stroke.options.opacity, 0.5);
        });

        test("renders stroke", function() {
            ok(sector.render().indexOf("<kvml:stroke") > -1);
        });

        test("renders id", function() {
            sector.options.id = "id";
            ok(sector.render().indexOf("id='id'") > -1);
        });

        test("renders data attributes", function() {
            sector.options.data = { testId: 1 };
            ok(sector.render().indexOf("data-test-id='1'") > -1);
        });

    })();

    (function() {
        var gradient;

        // ------------------------------------------------------------
        module("VMLLinearGradient", {
            setup: function() {
                gradient = new dataviz.VMLLinearGradient(linearGradient);
            }
        });

        test("renders fill tag", function() {
            equal(gradient.render().replace(/\<kvml:fill.*?\/\>/, "<kvml:fill/>"),
            "<kvml:fill/>");
        });

        test("renders type", function() {
            ok(gradient.render().indexOf("type='gradient'") > -1);
        });

        test("renders angle", function() {
            ok(gradient.render().indexOf("angle='270'") > -1);
        });

        test("renders colors", function() {
            ok(gradient.render().indexOf("colors='0% #f00,100% #00f'") > -1);
        });

        test("renders opacity", function() {
            gradient.options.opacity = 0.5;
            ok(gradient.render().indexOf("opacity='0.5'") > -1);
        });

    })();

    (function() {
        var gradient;

        // ------------------------------------------------------------
        module("VMLRadialGradient", {
            setup: function() {
                gradient = new dataviz.VMLRadialGradient(radialGradient);
            }
        });

        test("renders fill tag", function() {
            equal(gradient.render().replace(/\<kvml:fill.*?\/\>/, "<kvml:fill/>"),
            "<kvml:fill/>");
        });

        test("renders type", function() {
            ok(gradient.render().indexOf("type='gradienttitle'") > -1);
        });

        test("renders colors", function() {
            ok(gradient.render().indexOf("colors='0% #f00,100% #00f'") > -1);
        });

        test("renders opacity", function() {
            gradient.options.opacity = 0.5;
            ok(gradient.render().indexOf("opacity='0.5'") > -1);
        });

        test("renders focus", function() {
            ok(gradient.render().indexOf("focus='100%'") > -1);
        });

        test("caps focus position to 1", function() {
            ok(gradient.render().indexOf("focusposition='0.5 1'") > -1);
        });

        test("caps focus position to 0", function() {
            var gradientCopy = new dataviz.VMLRadialGradient(radialGradient);
            gradientCopy.options.bbox = new Box2D(150, 0, 200, 100);

            ok(gradientCopy.render().indexOf("focusposition='0 1'") > -1);
        });

        test("renders first color", function() {
            ok(gradient.render().indexOf("color='#f00'") > -1);
        });

        test("renders last color", function() {
            ok(gradient.render().indexOf("color2='#00f'") > -1);
        });

    })();

    (function() {
        var view,
            decorator;

        // ------------------------------------------------------------
        module("VMLGradientDecorator", {
            setup: function() {
                view = new dataviz.VMLView();
                dataviz.Gradients.test = linearGradient;
            },
            teardown: function() {
                dataviz.Gradients.test = null;
            }
        });

        test("applies linear gradient fill from definition", function() {
            var path = view.createRect(new Box2D(), { fill: linearGradient });
            ok(path.fill instanceof dataviz.VMLLinearGradient);
        });

        test("applies radial gradient fill from definition", function() {
            var path = view.createRect(new Box2D(), { fill: radialGradient });
            ok(path.fill instanceof dataviz.VMLRadialGradient);
        });

        test("does not apply radial gradient fill if it lacks cx, cy and bbox", function() {
            var gradient = $.extend(true, {}, radialGradient);
            gradient.cx = gradient.cy = gradient.bbox = undefined;

            var path = view.createRect(new Box2D(), { fill: gradient });
            equal(path.fill, "#000");
        });

        test("applies gradient fill by name", function() {
            var path = view.createRect(new Box2D(), { fill: { gradient: "test" } });
            equal(path.fill.options.stops.length, 2);
        });

        test("preserves solid fill", function() {
            var path = view.createRect(new Box2D(), { fill: "#f00" });
            equal(path.options.fill, "#f00");
        });

    })();

    (function() {
        var view,
            rect,
            glassyRect,
            decorator;

        module("VMLOverlayDecorator", {
            setup: function() {
                view = new dataviz.VMLView();
                rect = new dataviz.VMLPath({
                    fill: "#fff",
                    fillOpacity: 0.5,
                    overlay: {
                        gradient: "glass",
                        rotation: 90
                    }
                });
                decorator = new dataviz.VMLOverlayDecorator(view);
                glassyRect = decorator.decorate(rect);
            }
        });

        test("sets rotation to fill gradient", function() {
            equal(glassyRect.options.fill.rotation, 90);
        });

        test("sets opacity to fill gradient", function() {
            equal(glassyRect.options.fill.opacity, 0.5);
        });

        test("does not decorate element if no overlay specified", function() {
            var rect = view.createRect(new Box2D());
            equal(rect.options.fill, "");
        });

        test("adds fill color to make overlay definition unique", function() {
            equal(rect.options.fill._overlayFill, "#fff");
        });

        test("adds bounding box has to make overlay definition unique", function() {
            dataviz.Gradients.test = radialGradient;
            rect = new dataviz.VMLPath({
                fill: "#fff",
                fillOpacity: 0.5,
                overlay: { gradient: "test", bbox: new Box2D(0, 0, 1, 1) }
            });

            decorator.decorate(rect);
            equal(rect.options.fill._bboxHash, "0,0,1,1");

            dataviz.Gradients.test = null;
        });

    })();

    (function() {
        var view,
            rect,
            decorator;

        module("VMLClipAnimationDecorator", {
            setup: function() {
                view = new dataviz.VMLView({ transitions: true, width: 100, height: 50 });
                rect = new dataviz.VMLPath({
                    animation: {
                        type: "clip"
                    }
                });
                decorator = new dataviz.VMLClipAnimationDecorator(view);
            }
        });

        test("does not decorate when view.options.transitions is false", function() {
            view.options.transitions = false;
            decorator.decorate(rect);
            equal(decorator.decorate(rect), rect);
        });

        test("wraps element in VMLClipRect", function() {
            ok(decorator.decorate(rect) instanceof dataviz.VMLClipRect);
        });

        test("registers clip animation", function() {
            decorator.decorate(rect);
            ok(view.animations[0] instanceof dataviz.ExpandAnimation);
        });

        test("sets clip rect width", function() {
            equal(decorator.decorate(rect).box.width(), 100);
        });

        test("sets clip rect height", function() {
            equal(decorator.decorate(rect).box.height(), 50);
        });

        test("sets inline option", function() {
            view.options.inline = true;
            ok(decorator.decorate(rect).options.inline);
        });

        test("does not set inline option", function() {
            ok(!decorator.decorate(rect).options.inline);
        });
    })();
})();
