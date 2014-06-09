(function() {
    var dataviz = kendo.dataviz,
        IDPool = dataviz.IDPool,
        Box2D = dataviz.Box2D,
        getElement = dataviz.getElement,
        chartBox = new Box2D(5, 5, 1000, 1000),
        uniqueId = dataviz.uniqueId,
        view,
        TOLERANCE = 2;

    function ChartElementStub(viewElement) {
        viewElement = viewElement || new ViewElementStub();
        this.getView = function() {
            return viewElement;
        },

        this.getViewElements = function() {
            return [viewElement];
        },

        this.reflow = function() { }
    }

    function moduleSetup() {
        view = new ViewStub();
    }

    function moduleTeardown() {
    }


    (function() {
        var chartElement;

        // ------------------------------------------------------------
        module("ChartElement", {
            setup: function() {
                moduleSetup();

                chartElement = new dataviz.ChartElement();
            }
        });

        test("box wraps children", function() {
            var childStub = {
                reflow: function() { },
                box: new dataviz.Box2D(10, 10, 100, 100)
            };

            chartElement.children.push(childStub);
            chartElement.reflow();

            sameBox(chartElement.box, childStub.box);
        });

        test("parent set to appended children", function() {
            var child = new dataviz.ChartElement();
            chartElement.append(child);
            ok(child.parent === chartElement);
        });

        test("getRoot returns root for first level children", function() {
            var child = new dataviz.ChartElement();

            chartElement.getRoot = function() { return this; }

            chartElement.append(child);
            ok(child.getRoot() === chartElement);
        });

        test("getRoot returns root for second level children", function() {
            var child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            chartElement.getRoot = function() { return this; }

            child1.append(child2);
            chartElement.append(child1);

            ok(child2.getRoot() === chartElement);
        });

        test("enableDiscovery assigns unique model id", function() {
            chartElement.enableDiscovery();
            ok(chartElement.modelId.length > 0);
        });

        test("getViewElements registers model id in root", function() {
            var root = new dataviz.RootElement();

            root.append(chartElement);
            chartElement.enableDiscovery();
            chartElement.getViewElements(view);

            ok(root.modelMap[chartElement.modelId]);
        });

        test("getViewElements associates children with discoverable elements", function() {
            var child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            child1.append(child2);
            chartElement.append(child1);

            chartElement.enableDiscovery();
            chartElement.getViewElements(view);

            equal(chartElement.modelId, child1.modelId);
            equal(chartElement.modelId, child2.modelId);
        });

        test("getViewElements does not register associated elements", function() {
            var root = new dataviz.RootElement(),
                child = new dataviz.ChartElement();

            chartElement.append(child);
            root.append(chartElement);

            chartElement.enableDiscovery();
            chartElement.getViewElements(view);
            child.getViewElements(view);

            ok(root.modelMap[child.modelId] == chartElement);
        });

        test("getViewElements does not associate already discoverable children", function() {
            var child1 = new dataviz.ChartElement();

            child1.enableDiscovery();

            chartElement.enableDiscovery();
            chartElement.append(child1);

            chartElement.getViewElements(view);

            notEqual(chartElement.modelId, child1.modelId);
        });

        // ------------------------------------------------------------
        var pool,
            originalPool;

        module("ChartElement / destroy", {
            setup: function() {
                chartElement = new dataviz.ChartElement();

                originalPool = IDPool.current;
                pool = IDPool.current = new IDPool(10, "", 1);
            },
            teardown: function() {
                IDPool.current = originalPool;
            }
        });

        test("unregisters modelId from root", function() {
            var root = new dataviz.RootElement();

            root.append(chartElement);
            chartElement.enableDiscovery();
            chartElement.getViewElements(view);
            chartElement.destroy();

            ok(!root.modelMap[chartElement.modelId]);
        });

        test("unregisters modelId from IDPool", function() {
            chartElement.enableDiscovery();
            chartElement.destroy();

            equal(pool._pool.length, 1);
        });

        test("unregisters id from IDPool", function() {
            chartElement.id = uniqueId();
            chartElement.destroy();

            equal(pool._pool.length, 1);
        });

        test("destroys children", function() {
            var root = new dataviz.RootElement(),
                child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            child2.enableDiscovery();

            root.append(chartElement);
            chartElement.append(child1);
            child1.append(child2);

            chartElement.enableDiscovery();
            chartElement.getViewElements(view);
            chartElement.destroy();

            ok(!root.modelMap[child2.modelId]);
        });
    })();

    (function() {
        var rootElement,
            rootRect,
            MARGIN = 10;

        function createRoot(options) {
            rootElement = new dataviz.RootElement(options);

            rootElement.reflow();
        }

        function renderRoot() {
            rootElement.getViewElements(view);
            rootRect = view.log.rect[0];
        }

        // ------------------------------------------------------------
        module("RootElement", {
            setup: function() {
                moduleSetup();

                createRoot();
            }
        });

        test("creates view elements for child elements", function() {
            var group = new ViewElementStub(),
                text = new ViewElementStub();

            rootElement.children.push(new ChartElementStub(group));
            rootElement.children.push(new ChartElementStub(text));

            var viewElements = rootElement.getViewElements(view);
            viewElements.shift(); // Remove the rect
            deepEqual(viewElements, [ group, text ]);
        });

        test("reflow is called for all children", 2, function() {
            var childStub = {
                reflow: function() { ok(true); },
                box: new dataviz.Box2D()
            };

            rootElement.children.push(childStub, childStub);

            rootElement.reflow();
        });

        test("sets border to rootElement", function() {
            createRoot({
                border: {
                    width: 1,
                    color: "red",
                    dashType: "dot"
                }
            });
            renderRoot();

            sameBox(rootRect, new Box2D(1, 1, 599, 399));
            equal(rootRect.style.strokeWidth, 1);
            equal(rootRect.style.stroke, "red");
            equal(rootRect.style.dashType, "dot");
        });

        test("sets background to rootElement", function() {
            createRoot({
                background: "red"
            });
            renderRoot();

            equal(rootRect.style.fill, "red");
        });

        test("sets background opacity to rootElement", function() {
            createRoot({
                opacity: 0.1
            });
            renderRoot();

            equal(rootRect.style.fillOpacity, 0.1);
        });

        test("applies top margin", function() {
            createRoot({
                margin: {
                    top: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.y1, rootRect.y1 + MARGIN);
        });

        test("applies right margin", function() {
            createRoot({
                margin: {
                    right: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.x2, rootRect.x2 - MARGIN);
        });

        test("applies bottom margin", function() {
            createRoot({
                margin: {
                    bottom: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.y2, rootRect.y2 - MARGIN);
        });

        test("applies left margin", function() {
            createRoot({
                margin: {
                    left: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.x1, rootRect.x1 + MARGIN);
        });

        test("getRoot returns self", function() {
            ok(rootElement.getRoot() === rootElement);
        });

    })();

    (function() {
        var MARGIN = 3,
            PADDING = 2,
            BORDER = 1,
            WIDTH = 10,
            HEIGHT = 20,
            targetBox = new Box2D(100, 100, 200, 200),
            childBoxes,
            childrenBox = new Box2D(0, 0, 20, 20),
            boxElement,
            childElements;

        // ------------------------------------------------------------
        module("BoxElement", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement({
                    width: WIDTH,
                    height: HEIGHT
                });
            }
        });

        test("sets width", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
        });

        test("sets height", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.height(), HEIGHT);
        });

        test("applies top margin", function() {
            boxElement.options.margin.top = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.y1, boxElement.box.y2],
                 [targetBox.y1, targetBox.y1 + HEIGHT + MARGIN]);
        });

        test("applies right margin", function() {
            boxElement.options.margin.right = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.x1, boxElement.box.x2],
                 [targetBox.x1, targetBox.x1 + WIDTH + MARGIN]);
        });

        test("applies bottom margin", function() {
            boxElement.options.margin.bottom = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.y1, boxElement.box.y2],
                 [targetBox.y1, targetBox.y1 + HEIGHT + MARGIN]);
        });

        test("applies left margin", function() {
            boxElement.options.margin.left = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.x1, boxElement.box.x2],
                 [targetBox.x1, targetBox.x1 + WIDTH + MARGIN]);
        });

        test("applies margins", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.x1, boxElement.box.y1,
                  boxElement.box.x2, boxElement.box.y2],
                 [targetBox.x1, targetBox.y1,
                  targetBox.x1 + WIDTH + 2 * MARGIN,
                  targetBox.y1 + HEIGHT + 2 * MARGIN]);
        });

        test("padding is added to outer box", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH + 2 * PADDING);
            equal(boxElement.box.height(), HEIGHT + 2 * PADDING);
        });

        test("padding is added to paddingBox", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH + 2 * PADDING);
            equal(boxElement.paddingBox.height(), HEIGHT + 2 * PADDING);
        });

        test("border is added to outer box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH + 2 * BORDER);
            equal(boxElement.box.height(), HEIGHT + 2 * BORDER);
        });

        test("border is not added to padding box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH);
            equal(boxElement.paddingBox.height(), HEIGHT);
        });

        test("margin is added to outer box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH + 2 * MARGIN);
            equal(boxElement.box.height(), HEIGHT + 2 * MARGIN);
        });

        test("margin is not added to padding box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH);
            equal(boxElement.paddingBox.height(), HEIGHT);
        });

        test("content box has no padding, border or margin", function() {
            boxElement.options.padding = PADDING;
            boxElement.options.border.width = BORDER;
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.contentBox.width(), WIDTH);
            equal(boxElement.contentBox.height(), HEIGHT);
        });

        // ------------------------------------------------------------
        module("BoxElement / Shrink to fit", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement({
                    shrinkToFit: true,
                    width: WIDTH,
                    height: HEIGHT
                });
            }
        });

        test("padding is not added to outer box", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
            equal(boxElement.box.height(), HEIGHT);
        });

        test("padding is added to padding box", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH);
            equal(boxElement.paddingBox.height(), HEIGHT);
        });

        test("border is not added to outer box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
            equal(boxElement.box.height(), HEIGHT);
        });

        test("border is subtracted from padding box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH - 2 * BORDER);
            equal(boxElement.paddingBox.height(), HEIGHT - 2 * BORDER);
        });

        test("margin is not added to outer box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
            equal(boxElement.box.height(), HEIGHT);
        });

        test("margin is subtracted from padding box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH - 2 * MARGIN);
            equal(boxElement.paddingBox.height(), HEIGHT - 2 * MARGIN);
        });

        test("content box has padding, border and margin", function() {
            boxElement.options.padding = PADDING;
            boxElement.options.border.width = BORDER;
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            var nonContent = 2 * PADDING + 2 * BORDER + 2 * MARGIN;

            equal(boxElement.contentBox.width(), WIDTH - nonContent);
            equal(boxElement.contentBox.height(), HEIGHT - nonContent);
        });

        // ------------------------------------------------------------
        module("BoxElement / Alignment", {
            setup: function() {
                moduleSetup();
                boxElement = new dataviz.BoxElement({
                    width: WIDTH,
                    height: HEIGHT,
                    margin: MARGIN,
                    padding: PADDING,
                    border: { width: BORDER }
                });
            }
        });

        test("top alignment", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.y1, targetBox.y1);
        });

        test("bottom alignment", function() {
            boxElement.options.vAlign = "bottom";
            boxElement.reflow(targetBox);

            equal(boxElement.box.y2, targetBox.y2);
        });

        test("vertical center alignment", function() {
            boxElement.options.vAlign = "center";
            boxElement.reflow(targetBox);

            equal(boxElement.box.y1,
                  targetBox.y1 + (targetBox.height() - boxElement.box.height()) / 2);
        });

        test("left alignment", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.x1, targetBox.x1);
        });

        test("right alignment", function() {
            boxElement.options.align = "right";
            boxElement.reflow(targetBox);

            equal(boxElement.box.x2, targetBox.x2);
        });

        test("horizontal center alignment", function() {
            boxElement.options.align = "center";
            boxElement.reflow(targetBox);

            equal(boxElement.box.x1,
                  targetBox.x1 + (targetBox.width() - boxElement.box.width()) / 2);
        });

        // ------------------------------------------------------------
        module("BoxElement / With children", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement();
                childElements = [
                    new ChartElementStub(),
                    new ChartElementStub()
                ];

                childBoxes = [
                    new Box2D(0, 0, 10, 10),
                    new Box2D(0, 0, 20, 20)
                ];

                childElements[0].box = childBoxes[0];
                childElements[1].box = childBoxes[1];
                [].push.apply(boxElement.children, childElements);
            }
        });

        test("children set width", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), childrenBox.width());
        });

        test("children set height", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.height(), childrenBox.height());
        });

        test("moves children from margins", function() {
            boxElement.options.margin = {
                left: 1,
                top: 2
            };
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                deepEqual([this.box.x1, this.box.y1],
                     [targetBox.x1 + 1, targetBox.y1 + 2]);
            });
        });

        test("moves children from padding", function() {
            boxElement.options.padding = {
                left: 1,
                top: 2
            };
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                deepEqual([this.box.x1, this.box.y1],
                     [targetBox.x1 + 1, targetBox.y1 + 2]);
            });
        });

        test("children moved after top alignment", function() {
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                equal(this.box.y1, targetBox.y1);
            });
        });

        test("children moved after bottom alignment", function() {
            boxElement.options.vAlign = "bottom";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.y2, 190);
            equal(childElements[1].box.y2, 200);
        });

        test("children moved after vertical center alignment", function() {
            boxElement.options.vAlign = "center";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.y1, 140);
            equal(childElements[1].box.y1, 140);
        });

        test("children moved after left alignment", function() {
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                equal(this.box.x1, targetBox.x1);
            });
        });

        test("children moved after right alignment", function() {
            boxElement.options.align = "right";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.x2, 190);
            equal(childElements[1].box.x2, 200);
        });

        test("children moved after horizontal center alignment", function() {
            boxElement.options.align = "center";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.x1, 140);
            equal(childElements[1].box.x1, 140);
        });

        // ------------------------------------------------------------
        module("BoxElement / Rendering", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement({
                    width: WIDTH,
                    height: HEIGHT,
                    border: { width: 1 },
                    background: "#f00"
                });
            }
        });

        test("does not render rectangle when no border and background are set", function() {
            boxElement = new dataviz.BoxElement();
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);
            equal(view.log.rect.length, 0);
        });

        test("renders border width", function() {
            boxElement.options.border.width = 1;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.strokeWidth, 1);
        });

        test("renders border color", function() {
            boxElement.options.border.color = "#f00";
            boxElement.options.border.width = 1;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.stroke, "#f00");
        });

        test("renders border dash type", function() {
            boxElement.options.border.width = 1;
            boxElement.options.border.dashType = "dot";
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.dashType, "dot");
        });

        test("renders opacity as strokeOpacity", function() {
            boxElement.options.opacity = 0.5;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.strokeOpacity, 0.5);
        });

        test("does not render border color when no width is set", function() {
            boxElement.options.border.width = 0;
            boxElement.options.border.color = "#f00";
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.stroke, "");
        });

        test("renders fill color", function() {
            boxElement.options.background = "#f00";
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.fill, "#f00");
        });

        test("renders opacity as fillOpacity", function() {
            boxElement.options.opacity = 0.5;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.fillOpacity, 0.5);
        });

        test("content box includes padding", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            var rect = view.log.rect[0];
            equal(rect.x2 - rect.x1, WIDTH + 2 * PADDING);
            equal(rect.y2 - rect.y1, HEIGHT + 2 * PADDING);
        });

        test("padding box does not include border", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            var rect = view.log.rect[0];
            equal(rect.x2 - rect.x1, WIDTH);
            equal(rect.y2 - rect.y1, HEIGHT);
        });

        test("padding box does not include margin", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            var rect = view.log.rect[0];
            equal(rect.x2 - rect.x1, WIDTH);
            equal(rect.y2 - rect.y1, HEIGHT);
        });

        test("does not render when visible is false", function() {
            boxElement.options.visible = false;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect.length, 0);
        });

        test("renders id", function() {
            boxElement.id = "id";
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.id, "id");
        });

        test("renders model id as data", function() {
            boxElement.modelId = "id";
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.data.modelId, "id");
        });

        test("renders zIndex", function() {
            boxElement.options.zIndex = 100;
            boxElement.reflow(targetBox);
            boxElement.getViewElements(view);

            equal(view.log.rect[0].style.zIndex, 100);
        });

    })();

    (function() {
        var title,
            titleTextBox,
            titleText,
            Title = dataviz.Title,
            TITLE_TEXT_HEIGHT = 18,
            TITLE_TEXT_WIDTH = 29,
            MARGIN = 10,
            PADDING = 5;

        function createTitle(options) {
            title = new Title($.extend({
                text: "Title",
                font: SANS16,
                margin: MARGIN,
                padding: PADDING }, options));
            title.reflow(chartBox);
            titleTextBox = title.children[0],
            titleText = titleTextBox.children[0].children[0];
        }

        module("Title", {
            setup: function() {
                moduleSetup();

                createTitle();
            },
            teardown: moduleTeardown
        });

        test("text is created", function() {
            ok(titleText != null);

        });

        test("text element has set content", function() {
            equal(titleText.content, "Title");
        });

        test("text element has set font", function() {
            createTitle({
                font: "10px sans-serif"
            });
            equal(titleText.options.font, title.options.font);
        });

        test("text element has set color", function() {
            createTitle({
                color: "#cf0"
            });
            equal(titleText.options.color, title.options.color);
        });

        test("text box has set vAlign", function() {
            createTitle({
                position: "bottom"
            });

            equal(titleTextBox.options.vAlign, "bottom");
        });

        test("text box has set align", function() {
            createTitle({
                align: "right"
            });

            equal(titleTextBox.options.align, "right");
        });

        test("text box has set background", function() {
            createTitle({
                background: "#f00"
            });

            equal(titleTextBox.options.background, "#f00");
        });

        test("text is positioned at top", function() {
            equal(titleText.box.y1 - MARGIN - PADDING, chartBox.y1);
            close(titleText.box.y2 - MARGIN - PADDING,
                   chartBox.y1 + TITLE_TEXT_HEIGHT, TOLERANCE);
        });

        test("text is positioned at bottom", function() {
            createTitle({
                position: "bottom"
            });

            title.reflow(chartBox);
            close(titleText.box.y1 + MARGIN + PADDING,
                   chartBox.y2 - TITLE_TEXT_HEIGHT, TOLERANCE);
            equal(titleText.box.y2 + MARGIN + PADDING, chartBox.y2);
        });

        test("text is aligned at center", function() {
            close(titleText.box.x1,
                   chartBox.x1 + (chartBox.width() - TITLE_TEXT_WIDTH) / 2, TOLERANCE);
        });

        test("box width is equal to container width", function() {
            equal(title.box.width(), chartBox.width());
        });

        test("box height is equal to text height", function() {
            close(title.box.height() - MARGIN * 2 - PADDING * 2,
                   TITLE_TEXT_HEIGHT, TOLERANCE);
        });

        test("getViewElements returns text element", 1, function() {
            title.children[0] = {
                getViewElements: function() { return [ 42 ]; }
            };

            deepEqual(title.getViewElements(), [ 42 ]);
        });

        test("positions title at top with margin 20", function() {
            title = new Title({
                text: "Title",
                margin: MARGIN * 2
            });
            title.reflow(chartBox);

            title1 = new Title({
                text: "Title"
            });

            title1.reflow(chartBox);

            equal(title.box.height(),
                  title1.box.height() + MARGIN * 2 + PADDING * 2);
        });

        test("positions title at bottom with margin 20", function() {
            title = new Title({
                text: "Title",
                position: "bottom",
                margin: MARGIN * 2
            });

            title.reflow(chartBox);

            title1 = new Title({
                text: "Title",
                position: "bottom"
            });

            title1.reflow(chartBox);

            equal(title.box.height(),
                  title1.box.height() + MARGIN * 2 + PADDING * 2);
        });

        // ------------------------------------------------------------
        var parent;

        module("Title / buildTitle", {
            setup: function() {
                parent = new dataviz.ChartElement();
            },
            teardown: moduleTeardown
        });

        test("creates a title from string", function() {
            title = Title.buildTitle("Title", parent);
            equal(title.options.text, "Title");
        });

        test("creates a title from options with text", function() {
            title = Title.buildTitle({ text: "Title" }, parent);
            equal(title.options.text, "Title");
        });

        test("does not create title when not visible", function() {
            title = Title.buildTitle({ text: "Title", visible: false }, parent);
            equal(title, undefined);
        });

        test("does not create title without text", function() {
            title = Title.buildTitle({ text: "" }, parent);
            equal(title, undefined);
        });

        test("applies default options", function() {
            title = Title.buildTitle("Title", parent, { flag: true });
            equal(title.options.flag, true);
        });

    })();

    (function() {
        var text;

        module("Text", {
            setup: function() {
                moduleSetup();

                text = new dataviz.Text("&nbsp;", { font: SANS12 });
            },
            teardown: moduleTeardown
        });

        test("creates text view element", function() {
            var view = {
                createText: function() {
                    return 42;
                }
            };

            deepEqual(text.getViewElements(view), [ 42 ]);
        });

        test("sets content on view element", 1, function() {
            var view = {
                createText: function(content) {
                    equal(content, "Content");
                }
            };

            text.content = "Content";
            text.getViewElements(view)
        });

        test("sets position on view element", 2, function() {
            var view = {
                createText: function(content, options) {
                    equal(options.x, 100);
                    equal(options.y, 110);
                }
            };

            text.reflow(new Box2D(100, 110, 200, 200));
            text.getViewElements(view)
        });

        test("sets font", 1, function() {
            var view = {
                createText: function(content, options) {
                    equal(options.font, text.options.font);
                }
            };

            text.reflow(new Box2D());
            text.getViewElements(view)
        });

        test("sets color", 1, function() {
            var view = {
                createText: function(content, options) {
                    equal(options.color, text.options.color);
                }
            };

            text.reflow(new Box2D());
            text.getViewElements(view)
        });

        test("renders id", function() {
            text.id = "id";
            text.reflow(new Box2D());
            text.getViewElements(view);

            equal(view.log.text[0].style.id, "id");
        });

        test("renders model id as data", function() {
            text.modelId = "id";
            text.reflow(new Box2D());
            text.getViewElements(view);

            equal(view.log.text[0].style.data.modelId, "id");
        });

        test("renders zIndex", function() {
            text.options.zIndex = 100;
            text.reflow(new Box2D());
            text.getViewElements(view);

            equal(view.log.text[0].style.zIndex, 100);
        });

        test("renders baseline", function() {
            text.reflow(new Box2D());
            text.getViewElements(view);

            close(view.log.text[0].style.baseline, 13, TOLERANCE);
        });

    })();

    (function() {
        var textBox,
            TEXT = "text";

        function createTextBox(options) {
            textBox = new dataviz.TextBox(TEXT, options);
            textBox.reflow(new Box2D());
            textBox.getViewElements(view);
        }

        // ------------------------------------------------------------
        module("TextBox", {
            setup: function() {
                moduleSetup();
                createTextBox();
            }
        });

        test("sets unique id on text", function() {
            notEqual(textBox.children[0].id, "");
        });

        test("retains id", function() {
            createTextBox({ id: "1" });
            equal(textBox.id, "1");
        });

        test("moves id to box when background or border are set", function() {
            createTextBox({ id: "1", border: { width: 1 }});
            equal(view.log.rect[0].style.id, "1");
        });

        test("assigns unique id to text when background or border is set", function() {
            createTextBox({ id: "1", border: { width: 1 }});

            var id = textBox.children[0].id;
            notEqual(id, "1");
            notEqual(id, "");
        });

    })();

    (function() {
        var legend,
            MARKER_MARGIN = MARKER_SIZE = 7,
            MARGIN = 10;

        function createLegend(options) {
            legend = new dataviz.Legend($.extend(true,{
                items: [ { text: "Series 1" } ],
                labels: {
                    font: SANS12
                }
            }, options));

            legend.reflow(chartBox);
        }

        // ------------------------------------------------------------
        module("Legend", {
            setup: function() {
                moduleSetup();

                createLegend();
            },
            teardown: moduleTeardown
        });

        test("renders legend in a group", function() {
            legend.getViewElements(view);
            equal(view.log.group.length, 1);
        });

        test("sets zIndex on group", function() {
            createLegend({
                zIndex: 10
            });

            legend.getViewElements(view);
            equal(view.log.group[0].options.zIndex, 10);
        });

        test("default zIndex is 1", function() {
            equal(legend.options.zIndex, 1);
        });

        test("creates labels for series", 1, function() {
            legend.getViewElements(view);
            equal(view.log.text[0].content, "Series 1");
        });

        test("second label is below the first", function() {
            createLegend({
                items: [
                    { text: "Series 1" },
                    { text: "Series 2" }
                ]
            });

            var label1 = legend.children[0],
                label2 = legend.children[1];

            equal(label2.box.y1, label1.box.y2);
        });

        test("labels have set font", function() {
            createLegend({
                labels: {
                    font: "10px sans-serif"
                }
            });

            equal(legend.children[0].options.font, legend.options.labels.font);
        });

        test("labels have set color", function() {
            createLegend({
                labels: {
                    color: "#cf0"
                }
            });

            equal(legend.children[0].options.color, legend.options.labels.color);
        });

        test("positions legend to absolute vertical center (relative to y=0)", function() {
            legend = new dataviz.Legend({
                items: [ { text: "Series 1" } ]
            });

            var legendBox = chartBox.clone().translate(100, 100);
            legend.reflow(legendBox);

            var label = legend.children[0];
            equal(label.box.y1,
                 (legendBox.y2 - label.box.height()) / 2);
        });

        test("legend fills available height", function() {
            deepEqual([legend.box.y1, legend.box.y2], [chartBox.y1, chartBox.y2]);
        });

        // ------------------------------------------------------------
        var baseWidth,
            baseHeight;

        module("Legend position", {
            setup: function() {
                moduleSetup();

                createLegend({ margin: 0 });
                baseWidth = legend.box.width();

                createLegend({ margin: 0, position: "top" });
                baseHeight = legend.box.height();
            },
            teardown: moduleTeardown
        });

        test("positions legend to the right", function() {
            createLegend({
                position: "right",
                margin: 0
            });

            equal(legend.box.x1, chartBox.x2 - legend.box.width());
        });

        test("positions legend to the left", function() {
            createLegend({
                position: "left"
            });

            equal(legend.box.x1, chartBox.x1);
            equal(legend.box.x2, chartBox.x1 + legend.box.width());
        });

        test("positions legend to the top", function() {
            createLegend({
                position: "top"
            });

            equal(legend.box.y1, chartBox.y1);
        });

        test("positions legend to the bottom should have correct box", function() {
            createLegend({
                position: "bottom"
            });

            var legendBox = legend.children[0].box;

            sameBox(legendBox, new Box2D(485, 975, 531.75, 990), TOLERANCE);
        });

        test("positions legend to the top should have correct box", function() {
            createLegend({
                position: "top"
            });

            var legendBox = legend.children[0].box;

            sameBox(legendBox, new Box2D(485.75, 15, 532.75, 30), TOLERANCE);
        });

        test("positions legend to the bottom", function() {
            createLegend({
                position: "bottom"
            });

            close(legend.box.y1, chartBox.y2 - legend.box.height(), TOLERANCE);
        });

        test("applies left and right margin when positioned to the right", function() {
            createLegend({
                position: "right",
                margin: MARGIN
            });

            equal(legend.box.x1, chartBox.x2 - baseWidth - 2 * MARGIN);
        });

        test("applies left and right margin when positioned to the left", function() {
            createLegend({
                position: "left",
                margin: MARGIN
            });

            equal(legend.box.x2, chartBox.x1 + baseWidth + 2 * MARGIN);
        });

        test("applies top and bottom margin when positioned to the top", function() {
            createLegend({
                position: "top",
                margin: MARGIN
            });

            equal(legend.box.y2, chartBox.y1 + baseHeight + 2 * MARGIN);
        });

        test("applies top and bottom margin when positioned to the bottom", function() {
            createLegend({
                position: "bottom",
                margin: MARGIN
            });
            equal(legend.box.y1, chartBox.y2 - baseHeight - 2 * MARGIN);
        });


        //--------------------------------------------------------------
        var marker, label;
        module("Legend / Markers", {
            setup: function() {
                moduleSetup();

                legend = new dataviz.Legend({
                    items: [ { text: "Series 1", markerColor: "#f00", labelColor: "#f00" } ],
                    labels: {
                        font: SANS12
                    }
                });

                legend.reflow(chartBox);
                legend.getViewElements(view);

                marker = view.log.rect[0];
                label = view.log.text[0];
            },
            teardown: moduleTeardown
        });

        test("creates markers for series", function() {
            equal(view.log.rect.length, 2);
        });

        test("sets marker color", function() {
            equal(marker.style.fill, "#f00");
        });

        test("markers have margin on the left", function() {
            close(marker.x1, legend.box.x1 + MARGIN, TOLERANCE);
        });

        test("markers have set width", function() {
            close(marker.x2 - marker.x1, MARKER_SIZE, TOLERANCE);
        });

        test("markers have margin on the right", function() {
            close(marker.x2, label.style.x - MARKER_MARGIN, TOLERANCE);
        });

        test("markers are aligned to text center", function() {
            close(marker.y1, label.style.y + MARKER_SIZE / 2, TOLERANCE);
        });

        test("markers are 1/2 of label size", function() {
            equal(marker.y2 - marker.y1, legend.children[0].box.height() / 2);
        });

        // ------------------------------------------------------------
        var legendBox,
            BORDER_WIDTH = 2,
            BORDER_COLOR = "#f00",
            BORDER_DASH_TYPE = "dot",
            BACKGROUND = "#0f0",
            PADDING = 10;

        module("Legend / Box", {
            setup: function() {
                moduleSetup();

                legend = new dataviz.Legend({
                    items: [ { text: "Series 1", color: "#f00" } ],
                    labels: {
                        font: SANS12
                    },
                    border: {
                        color: BORDER_COLOR,
                        width: BORDER_WIDTH,
                        dashType: BORDER_DASH_TYPE
                    },
                    background: BACKGROUND,
                    padding: PADDING
                });

                legend.reflow(chartBox);
                legend.getViewElements(view);

                legendBox = view.log.rect[1];
            },
            teardown: moduleTeardown
        });

        test("renders box with padding", function() {
            sameBox(legendBox, new Box2D(919, 482, 1000, 517), TOLERANCE);
        });

        test("renders border width", function() {
            deepEqual(legendBox.style.strokeWidth, BORDER_WIDTH);
        });

        test("renders border color", function() {
            deepEqual(legendBox.style.stroke, BORDER_COLOR);
        });

        test("renders border dashType", function() {
            deepEqual(legendBox.style.dashType, BORDER_DASH_TYPE);
        });

        test("renders background color", function() {
            deepEqual(legendBox.style.fill, BACKGROUND);
        });

        var chart,s
            label,
            legend;

        function legendItemClick(clickHandler, options) {
            chart = createChart($.extend(true, {
                series: [{
                    type: "line",
                    data: [1,2,3],
                    name: "test",
                    color: "color"
                }],
                legendItemClick: clickHandler
            }, options));

            legend = chart._model.children[0];
            label = legend.children[0];
            clickChart(chart, getElement(label.id));
        }

        // ------------------------------------------------------------
        module("Legend / Events / legendItemClick", {
            teardown: destroyChart
        });

        test("fires when clicking axis labels", 1, function() {
            legendItemClick(function() { ok(true); });
        });

        test("event arguments contain DOM element", 1, function() {
            legendItemClick(function(e) {
                equal(e.element.length, 1);
            });
        });

        test("event arguments contain series name as text", 1, function() {
            legendItemClick(function(e) {
                equal(e.text, "test");
            });
        });

        test("event arguments contain series", 1, function() {
            legendItemClick(function(e) {
                equal(e.series.type, "line");
            });
        });

    })();

    (function() {
        // ------------------------------------------------------------
        var viewElement,
            pool,
            originalPool;

        module("ViewElement / destroy", {
            setup: function() {
                viewElement = new dataviz.ViewElement();

                originalPool = IDPool.current;
                pool = IDPool.current = new IDPool(10, "", 1);
            },
            teardown: function() {
                IDPool.current = originalPool;
            }
        });

        test("unregisters id from IDPool", function() {
            viewElement.options.id = uniqueId();
            viewElement.destroy();

            equal(pool._pool.length, 1);
        });

        test("destroys children", function() {
            var root = new dataviz.ViewElement(),
                child = new dataviz.ViewElement(),
                grandchild = new dataviz.ViewElement();

            root.children.push(child);
            child.children.push(grandchild);

            grandchild.destroy = function() { ok(true); };

            root.destroy();
        });
    })();

    (function() {
        // ------------------------------------------------------------
        var view;

        module("ViewBase", {
            setup: function() {
                view = new dataviz.ViewBase();
            }
        });

        test("playAnimations plays animation in order", function() {
            var order;
            view.animations = [
                { play: function() { order = "1"; } },
                { play: function() { order += "2"; } }
            ];

            view.playAnimations();
            equal(order, "12");
        });

        test("destroy clears animations", function() {
            var order;
            view.animations = [
                { destroy: function() { } }
            ];

            view.destroy();
            equal(view.animations.length, 0);
        });

        test("decorate applies decorators in order", function() {
            var order;
            view.decorators = [
                { decorate: function(element) { order = "1"; return element; } },
                { decorate: function(element) { order += "2"; return element; } }
            ];

            view.decorate({ children: [] });
            equal(order, "12");
        });

        test("decorate processes elements recursively", function() {
            var order = "";
            view.decorators = [
                { decorate: function(element) { order += element.id; return element; } }
            ];

            view.decorate({
                id: "1",
                children: [{
                    id: "2",
                    children: [{
                        id: "3",
                        children: []
                    }]
                }]
            });

            equal(order, "321");
        });

        // ------------------------------------------------------------
        module("ViewBase / buildGradient", {
            setup: function() {
                view = new dataviz.ViewBase();
            }
        });

        test("builds gradient from name", function() {
            equal(view.buildGradient({ gradient: "glass" }).type, "linear");
        });

        test("returns undefined when no gradient exists", function() {
            equal(typeof view.buildGradient("x"), "undefined");
        });

        test("applies options", function() {
            equal(view.buildGradient({ gradient: "glass", rotation: 90 }).rotation, 90);
        });

        test("returns same gradient for same options", function() {
            equal(view.buildGradient({ gradient: "glass", rotation: 90 }).id,
                   view.buildGradient({ gradient: "glass", rotation: 90 }).id);
        });

    })();

    (function() {
        var ring,
            ringBox;

        function createRing(startAngle, angle, innerRadius) {
            ring = new dataviz.Ring(
                new dataviz.Point2D(100, 100), innerRadius || 0, 100,
                startAngle, angle - startAngle);
            var box = ring.getBBox();
            ringBox = [box.x1, box.y1, box.x2, box.y2]
        }

        // ------------------------------------------------------------
        module("Ring with zero inner radius");

        test("get box with startAngle 10 and endAngle 190", function() {
            createRing(10, 190);
            arrayClose(ringBox, [1, 0, 200, 117], TOLERANCE);
        });

        test("get box with startAngle 10 and endAngle 30", function() {
            createRing(10, 30);
            arrayClose(ringBox, [1, 50, 100, 100], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 90", function() {
            createRing(0, 90);
            arrayClose(ringBox, [0, 0, 100, 100], TOLERANCE);
        });

        test("get box with startAngle 30 and endAngle 170", function() {
            createRing(30, 170);
            arrayClose(ringBox, [13, 0, 198, 100], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 360", function() {
            createRing(0, 360);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 280", function() {
            createRing(0, 280);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 90 and endAngle 90 (full circle)", function() {
            createRing(90, 90);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 180 and endAngle 0", function() {
            createRing(180, 0);
            arrayClose(ringBox, [0, 100, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 180.1 and endAngle 0", function() {
            createRing(180.1, 0);
            arrayClose(ringBox, [0, 100, 200, 200], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Ring with inner radius");

        test("get box with startAngle 10 and endAngle 190", function() {
            createRing(10, 190, 50);
            arrayClose(ringBox, [1, 0, 200, 117], TOLERANCE);
        });

        test("get box with startAngle 10 and endAngle 30", function() {
            createRing(10, 30, 50);
            arrayClose(ringBox, [1, 50, 13, 83], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 90", function() {
            createRing(0, 90, 50);
            arrayClose(ringBox, [0, 0, 100, 100], TOLERANCE);
        });

        test("get box with startAngle 30 and endAngle 170", function() {
            createRing(30, 170, 50);
            arrayClose(ringBox, [13, 0, 198, 83], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 360", function() {
            createRing(0, 360, 50);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 280", function() {
            createRing(0, 280, 50);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 90 and endAngle 450", function() {
            createRing(90, 450, 50);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 410 and endAngle 450", function() {
            createRing(410, 450, 50);
            arrayClose(ringBox, [35, 0, 100, 23], TOLERANCE);
        });

    })();

    (function() {
        var Pane = dataviz.Pane,
            pane, rect, paneTitle;

        function createPaneRect(options) {
            pane = new Pane(options);
            pane.renderGridLines = function() {};
            pane.reflow(chartBox);

            view = new ViewStub();
            pane.getViewElements(view);
            rect = view.log.rect[0];
        }

        // ------------------------------------------------------------
        module("Pane");

        test("Sets unique id", function() {
            pane = new Pane();
            ok(pane.id);
        });

        test("Sets background color", function() {
            createPaneRect({ background: "color", width: 600, height: 400 });
            equal(rect.style.fill, "color");
        });

        test("Sets border", function() {
            createPaneRect({ border: { color: "color", width: 1, dashType: "dashType" }, width: 600, height: 400 });
            equal(rect.style.stroke, "color");
            equal(rect.style.strokeWidth, 1);
            equal(rect.style.dashType, "dashType");
        });

        // ------------------------------------------------------------

        function createPaneWithTitle(options) {
            pane = new Pane($.extend(true, { title: {
                text: "Title"
            }, width: 600, height: 400 }, options));
            pane.reflow(chartBox);
            paneTitle = pane.title;
        }

        module("Pane / Title");

        test("positions title to the top", function() {
            createPaneWithTitle();

            equal(paneTitle.options.position, "top");
        });

        test("Title shrinks content box", function() {
            createPaneWithTitle();

            equal(pane.contentBox.height(), 365);
        });

        test("aligns Title to the left", function() {
            createPaneWithTitle();
            equal(paneTitle.options.align, "left");
        });

        test("aligns Title to the center", function() {
            createPaneWithTitle({
                title: {
                    position: "center"
                }
            });

            equal(paneTitle.options.align, "center");
        });

        test("aligns Title to the right", function() {
            createPaneWithTitle({
                title: {
                    position: "right"
                }
            });

            equal(paneTitle.options.align, "right");
        });

    })();

    (function() {
        var ShapeElement = dataviz.ShapeElement,
            SIZE = 5,
            BORDER = 2,
            BORDER_COLOR = "#cf0",
            BACKGROUND = "#f00",
            shape,
            box,
            view;

        function createShape(options) {
            shape = new ShapeElement(
                $.extend({
                    width: SIZE,
                    height: SIZE,
                    border: { width: BORDER },
                    background: "#f00"
                }, options)
            );

            box = new Box2D(0, 0, SIZE, SIZE);
            shape.reflow(box);

            view = new ViewStub();
            shape.getViewElements(view);
        }

        // ------------------------------------------------------------
        module("ShapeElement", {
            setup: function() {
                createShape({ type: "square" });
            }
        });

        test("renders square", function() {
            var path = view.log.path[0];
            arrayClose(mapPoints(path.points), [
                [ 0, 0 ], [ SIZE, 0 ],
                [ SIZE, SIZE ], [ 0, SIZE ]
            ], 1);
        });

        test("renders rotated square", function() {
            createShape({ type: "square", rotation: 45 });
            var path = view.log.path[0];
            arrayClose(mapPoints(path.points), [
                [ -1.036, SIZE / 2 ], [ SIZE / 2, -1.036 ],
                [ 6.036, SIZE / 2 ], [ SIZE / 2, 6.036 ]
            ], 1);
            ok(path.closed);
        });

        test("renders triangle", function() {
            createShape({ type: "triangle" });
            var path = view.log.path[0];
            deepEqual(mapPoints(path.points), [
                [SIZE / 2, 0], [0, SIZE], [SIZE, SIZE]
            ]);
            ok(path.closed);
        });

        test("renders rotated triangle", function() {
            createShape({ type: "triangle", rotation: 180 });
            var path = view.log.path[0];
            deepEqual(mapPoints(path.points), [
                [SIZE / 2, SIZE], [SIZE, 0], [0, 0]
            ]);
            ok(path.closed);
        });

        test("renders circle", function() {
            createShape({ type: "circle" });
            var circle = view.log.circle[0];
            deepEqual(circle.c.x, SIZE / 2);
            deepEqual(circle.c.y, SIZE / 2);
            deepEqual(circle.r, SIZE / 2);
        });

        test("renders id", function() {
            createShape({ id: "id" });
            equal(view.log.circle[0].style.id, "id");
        });

        test("does not render element when hidden", function() {
            createShape({ visible: false });
            equal(view.log.rect.length, 0);
        });

        test("does not render element when hidden (triangle)", function() {
            createShape({ visible: false,  type: "triangle"});
            equal(view.log.path.length, 0);
        });

        test("does not render element when hidden (circle)", function() {
            createShape({ visible: false,  type: "circle"});
            equal(view.log.circle.length, 0);
        });

    })();
})();
