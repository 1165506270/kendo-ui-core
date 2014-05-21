(function() {
    var dataviz = kendo.dataviz,

        g = dataviz.geometry,
        Point = g.Point,
        Matrix = g.Matrix,

        d = dataviz.drawing,
        Circle = d.Circle,
        Group = d.Group,
        MultiPath = d.MultiPath,
        Path = d.Path,
        Text = d.Text,
        TextSpan = d.TextSpan,

        svg = d.svg,
        Node = svg.Node,
        ArcNode = svg.ArcNode,
        CircleNode = svg.CircleNode,
        GroupNode = svg.GroupNode,
        PathNode = svg.PathNode,
        MultiPathNode = svg.MultiPathNode,
        Surface = svg.Surface,
        TextNode = svg.TextNode,
        TextSpanNode = svg.TextSpanNode;

    // ------------------------------------------------------------
    var container,
        surface;

    module("Surface", {
        setup: function() {
            container = QUnit.fixture[0];
            surface = new Surface(container);
        }
    });

    test("sets initial options", function() {
        surface = new Surface(container, { foo: true });
        ok(surface.options.foo);
    });

    test("appends svg element to container", function() {
        equal(QUnit.fixture.find("svg").length, 1);
    });

    test("draw attaches element to root node", function() {
        var group = new Group();
        surface.draw(group);

        deepEqual(surface._root.childNodes[0].srcElement, group);
    });

    test("clear removes element from root node", function() {
        var group = new Group();
        surface.draw(group);
        surface.clear();

        equal(surface._root.childNodes.length, 0);
    });

    test("svg returns current markup", function() {
        surface.draw(new Group());

        var svg = surface.svg();
        ok(svg.indexOf("<?xml") === 0);
        ok(svg.indexOf("<g>") !== -1);
    });

    test("getSize returns element dimensions", function() {
        surface.setSize({ width: 1000, height: 1000 });

        deepEqual(surface.getSize(), {
            width: 1000,
            height: 1000
        });
    });

    test("setSize sets element dimensions", function() {
        deepEqual(surface.setSize({
            width: 100,
            height: 100
        }));

        deepEqual(surface.getSize(), {
            width: 100,
            height: 100
        });
    });

    test("setSize updates translate", function() {
        surface.translate({ x: 10, y: 10 });
        surface.setSize({ width: 100, height: 100 });

        equal(surface.element.getAttribute("viewBox"), "10 10 100 100");
    });

    // ------------------------------------------------------------
    module("Surface / Events", {
        setup: function() {
            container = QUnit.fixture[0];
            surface = new Surface(container);
        }
    });

    test("binds initial handlers", function() {
        surface = new Surface(container, {
            click: function() { ok(true); }
        });

        surface.trigger("click");
    });

    test("clicking a node triggers click", function() {
        surface.draw(new Group());
        surface.bind("click", function() { ok(true); });

        $(surface._root.childNodes[0].element).trigger("click");
    });

    test("click has reference to shape", function() {
        var group = new Group();
        surface.draw(group);
        surface.bind("click", function(e) { deepEqual(e.shape, group); });

        $(surface._root.childNodes[0].element)
            .trigger("click", { toElement: surface._root.childNodes[0].element });
    });

    // ------------------------------------------------------------
    var node;

    module("Node", {
        setup: function() {
            node = new Node();
        }
    });

    test("load appends GroupNode", function() {
        node.append = function(child) {
            ok(child instanceof GroupNode);
        };

        node.load([new Group()]);
    });

    test("load appends PathNode", function() {
        node.append = function(child) {
            ok(child instanceof PathNode);
        };

        node.load([new Path()]);
    });

    test("load appends MultiPathNode", function() {
        node.append = function(child) {
            ok(child instanceof MultiPathNode);
        };

        node.load([new MultiPath()]);
    });

    test("load appends child nodes", function() {
        var parentGroup = new Group()
        var childGroup = new Group();
        parentGroup.append(childGroup);

        node.load([parentGroup]);

        ok(node.childNodes[0].childNodes[0] instanceof GroupNode);
    });

    test("attachTo renders children", 2, function() {
        var ChildNode = Node.extend({});

        var child = new ChildNode();
        node.append(child);

        var grandChild = new ChildNode();
        child.append(grandChild);

        ChildNode.fn.render = function() {
            ok(true);
            return Node.fn.render.call(this);
        };

        node.attachTo(document.createElement("div"));
    });

    // ------------------------------------------------------------
    function nodeTests(TShape, TNode, name) {
        var shape,
            node,
            container;

        module("Base Node tests / " + name, {
            setup: function() {
                container = document.createElement("div");

                shape = new TShape();
                node = new TNode(shape);
                node.attachTo(container);
            }
        });

        test("renders visibility", function() {
            shape.visible(false);
            ok(node.render().indexOf("display='none'") !== -1);
        });

        test("does not render visibility if not set", function() {
            ok(node.render().indexOf("display") === -1);
        });

        test("does not render visibility if set to true", function() {
            shape.visible(true);
            ok(node.render().indexOf("display") === -1);
        });

        test("optionsChange sets visibility to hidden", function() {
            node.attr = function(name, value) {
                equal(name, "display");
                equal(value, "none");
            };

            shape.visible(false);
        });

        test("optionsChange sets visibility to visible", function() {
            node.attr = function(name, value) {
                equal(name, "display");
                equal(value, "");
            };

            shape.visible(true);
        });
    }

    // ------------------------------------------------------------
    module("RootNode");

    test("attachTo directly sets element", function() {
        var rootNode = new svg.RootNode();
        var container = document.createElement("div");
        rootNode.attachTo(container);

        deepEqual(rootNode.element, container);
    });

    // ------------------------------------------------------------
    var group;
    var groupNode,
        group;

    nodeTests(Group, GroupNode, "GroupNode");

    module("GroupNode", {
        setup: function() {
            group = new Group();
            groupNode = new GroupNode(group);
        }
    });

    test("attachTo sets element", function() {
        groupNode.attachTo(document.createElement("div"));

        ok(groupNode.element);
    });

    test("attachTo sets element for child nodes", function() {
        groupNode.append(new GroupNode(new Group()));
        groupNode.attachTo(document.createElement("div"));

        ok(groupNode.childNodes[0].element);
    });

    test("attachTo sets element for grandchild nodes", function() {
        var child = new GroupNode(new Group());
        var grandChild = new GroupNode(new Group());

        child.append(grandChild);
        groupNode.append(child);

        groupNode.attachTo(document.createElement("div"));

        ok(grandChild.element);
    });

    test("attachTo sets _kendoNode expando", function() {
        groupNode.attachTo(document.createElement("div"));

        deepEqual(groupNode.element._kendoNode, groupNode);
    });

    test("attachTo sets _kendoNode expando on child elements", function() {
        var childGroup = new GroupNode(new Group());
        groupNode.append(childGroup);
        groupNode.attachTo(document.createElement("div"));

        deepEqual(childGroup.element._kendoNode, childGroup);
    });

    test("attachTo sets _kendoNode expando for grandchild nodes", function() {
        var child = new GroupNode(new Group());
        var grandChild = new GroupNode(new Group());

        child.append(grandChild);
        groupNode.append(child);

        groupNode.attachTo(document.createElement("div"));

        deepEqual(grandChild.element._kendoNode, grandChild);
    });

    test("clear removes element", function() {
        groupNode.attachTo(document.createElement("div"));
        groupNode.clear();

        ok(!groupNode.element);
    });

    test("clear removes _kendoNode expando from element", function() {
        var container = document.createElement("div");
        groupNode.attachTo(container);
        groupNode.clear();

        ok(!container._kendoNode);
    });

    test("load attaches node", function() {
        groupNode.attachTo(document.createElement("div"));

        var group = new Group();
        groupNode.load([group]);

        ok(groupNode.childNodes[0].element);
    });

    test("renders group tag", function() {
        equal(groupNode.render(), "<g></g>");
    });

    test("renders group transform", function() {
        groupNode = new GroupNode(new Group({transform: new Matrix(1,1,1,1,1,1)}));
        equal(groupNode.render(), "<g transform='matrix(1,1,1,1,1,1)' ></g>");
    });

    test("does not render transform if not set", function() {
        ok(groupNode.render().indexOf("transform") === -1);
    });

    test("options change renders transform", function() {
        groupNode.attr = function(key, value) {
            equal(key, "transform");
            equal(value, "matrix(1,0,0,1,0,0)");
        };
        group.transform(Matrix.unit());

    });

    test("clearing transform removes transform attribute", function() {
        groupNode.removeAttr = function(key) {
            equal(key, "transform");
        };
        group.transform(null);
    });

    // ------------------------------------------------------------
    var path,
        pathNode,
        container;

    nodeTests(Path, PathNode, "PathNode");

    module("PathNode", {
        setup: function() {
            container = document.createElement("div");

            path = new Path();
            pathNode = new PathNode(path);
            pathNode.attachTo(container);
        }
    });

    test("renders straight segments", function() {
        path.moveTo(0, 0).lineTo(10, 20);

        ok(pathNode.render().indexOf("d='M0 0 L 10 20'") !== -1);
    });

    test("renders closed paths", function() {
        path.moveTo(0, 0).lineTo(10, 20).close();

        ok(pathNode.render().indexOf("d='M0 0 L 10 20Z'") !== -1);
    });

    test("renders curve", function() {
        path.moveTo(0, 0).curveTo(Point.create(10, 10), Point.create(20, 10), Point.create(30, 0));

        ok(pathNode.render().indexOf("d='M0 0 C 10 10 20 10 30 0'") !== -1);
    });

    test("switches between line and curve", function() {
        path.moveTo(0, 0).lineTo(5, 5).curveTo(Point.create(10, 10), Point.create(20, 10), Point.create(30, 0));

        ok(pathNode.render().indexOf("d='M0 0 L 5 5 C 10 10 20 10 30 0'") !== -1);
    });

    test("switches between curve and line", function() {
        path.moveTo(0, 0).curveTo(Point.create(10, 10), Point.create(20, 10), Point.create(30, 0)).lineTo(40, 10);

        ok(pathNode.render().indexOf("d='M0 0 C 10 10 20 10 30 0 L 40 10'") !== -1);
    });

    test("does not render segments for empty path", function() {
        equal(pathNode.render().indexOf("d="), -1);
    });

    test("renders stroke", function() {
        path.options.set("stroke.color", "red");

        ok(pathNode.render().indexOf("stroke='red'") !== -1);
    });

    test("renders stroke width", function() {
        path.options.set("stroke.width", 2);

        ok(pathNode.render().indexOf("stroke-width='2'") !== -1);
    });

    test("renders stroke opacity", function() {
        path.options.set("stroke.opacity", 0.5);

        ok(pathNode.render().indexOf("stroke-opacity='0.5'") !== -1);
    });

    test("does not render stroke opacity if not set", function() {
        equal(pathNode.render().indexOf("stroke-opacity="), -1);
    });

    test("renders stroke dashType", function() {
        path.options.set("stroke.dashType", "dot");

        ok(pathNode.render().indexOf("stroke-dasharray='1.5 3.5'") !== -1);
    });

    test("does not render stroke dashType if not set", function() {
        equal(pathNode.render().indexOf("stroke-dasharray="), -1);
    });

    test("renders stroke linecap", function() {
        path.options.set("stroke.lineCap", "butt");

        ok(pathNode.render().indexOf("stroke-linecap='butt'") !== -1);
    });

    test("overrides stroke linecap when dashType is set", function() {
        path.options.set("stroke.dashType", "dot");
        path.options.set("stroke.lineCap", "foo");

        ok(pathNode.render().indexOf("stroke-linecap='butt'") !== -1);
    });

    test("renders stroke linecap when dashType is set to solid", function() {
        path.options.set("stroke.dashType", "solid");
        path.options.set("stroke.lineCap", "foo");

        ok(pathNode.render().indexOf("stroke-linecap='foo'") !== -1);
    });

    test("renders default stroke linecap", function() {
        path.options.set("stroke", {});

        ok(pathNode.render().indexOf("stroke-linecap='square'") !== -1);
    });

    test("renders fill", function() {
        path.options.set("fill", { color: "red", opacity: 0.5 });
        var svg = pathNode.render();

        ok(svg.indexOf("fill='red'") !== -1);
        ok(svg.indexOf("fill-opacity='0.5'") !== -1);
    });

    test("does not render fill if not set", function() {
        ok(pathNode.render().indexOf("fill") === -1);
    });

    test("renders empty fill if set to transparent", function() {
        path.options.set("fill.color", "transparent");
        ok(pathNode.render().indexOf("fill='none'") !== -1);
    });

    test("renders empty fill if set to null", function() {
        path.options.set("fill", null);
        ok(pathNode.render().indexOf("fill='none'") !== -1);
    });

    test("renders cursor", function() {
        path.options.set("cursor", "hand");
        ok(pathNode.render().indexOf("cursor:hand;") !== -1);
    });

    test("does not render cursor if not set", function() {
        ok(pathNode.render().indexOf("cursor") === -1);
    });

    test("does not render style if not set", function() {
        ok(pathNode.render().indexOf("style") === -1);
    });

    test("renders transform if set", function() {
        path.transform(new Matrix(1,1,1,1,1,1));
        ok(pathNode.render().indexOf("transform='matrix(1,1,1,1,1,1)'") !== -1);
    });

    test("does not render transform if not set", function() {
        ok(pathNode.render().indexOf("transform") === -1);
    });

    test("geometryChange sets path", function() {
        path.moveTo(0, 0);
        pathNode.attr = function(name, value) {
            equal(name, "d");
            ok(value);
        };

        path.lineTo(10, 10);
    });

    test("optionsChange sets fill color", function() {
        pathNode.attr = function(name, value) {
            equal(name, "fill");
            equal(value, "red");
        };

        path.options.set("fill.color", "red");
    });

    test("optionsChange sets fill opacity", function() {
        pathNode.attr = function(name, value) {
            equal(name, "fill-opacity");
            equal(value, 0.4);
        };

        path.options.set("fill.opacity", 0.4);
    });

    test("optionsChange sets fill color to none for transparent", function() {
        pathNode.attr = function(name, value) {
            equal(name, "fill");
            equal(value, "none");
        };

        path.options.set("fill.color", "transparent");
    });

    test("optionsChange sets fill", 2, function() {
        pathNode.attr = function(name, value) {
            if (name === "fill") {
                equal(value, "red");
            } else if (name === "fill-opacity") {
                equal(value, 0.4);
            } else {
                ok(false);
            }
        };

        path.options.set("fill", { color: "red", opacity: 0.4 });
    });

    test("optionsChange sets stroke color", function() {
        pathNode.attr = function(name, value) {
            equal(name, "stroke");
            equal(value, "red");
        };

        path.options.set("stroke.color", "red");
    });

    test("optionsChange sets stroke width", function() {
        pathNode.attr = function(name, value) {
            equal(name, "stroke-width");
            equal(value, 4);
        };

        path.options.set("stroke.width", 4);
    });

    test("optionsChange sets stroke opacity", function() {
        pathNode.attr = function(name, value) {
            equal(name, "stroke-opacity");
            equal(value, 0.4);
        };

        path.options.set("stroke.opacity", 0.4);
    });

    test("optionsChange sets stroke", 3, function() {
        pathNode.attr = function(name, value) {
            if (name === "stroke") {
                equal(value, "red");
            } else if (name === "stroke-opacity") {
                equal(value, 0.4);
            } else if (name === "stroke-width") {
                equal(value, 4);
            }
        };

        path.options.set("stroke", { color: "red", opacity: 0.4, width: 4 });
    });

    test("options change renders transform", function() {
        pathNode.attr = function(key, value) {
            equal(key, "transform");
            equal(value, "matrix(1,0,0,1,0,0)");
        };
        path.transform(Matrix.unit());
    });

    test("clearing transform removes transform attribute", function() {
        pathNode.removeAttr = function(key) {
            equal(key, "transform");
        };
        path.transform(null);
    });

    // ------------------------------------------------------------
    var multiPath,
        multiPathNode;

    nodeTests(MultiPath, MultiPathNode, "MultiPathNode");

    module("MultiPathNode", {
        setup: function() {
            multiPath = new MultiPath();
            multiPathNode = new MultiPathNode(multiPath);
        }
    });

    test("renders composite paths", function() {
        multiPath
            .moveTo(0, 0).lineTo(10, 20)
            .moveTo(10, 10).lineTo(10, 20);

        ok(multiPathNode.render().indexOf("d='M0 0 L 10 20 M10 10 L 10 20'") !== -1);
    });

    // ------------------------------------------------------------
    var circle,
        circleNode;

    nodeTests(Circle, CircleNode, "CircleNode");

    module("CircleNode", {
        setup: function() {
            var geometry = new g.Circle(new Point(10, 20), 30);
            circle = new Circle(geometry);
            circleNode = new CircleNode(circle);
        }
    });

    test("renders center", function() {
        ok(circleNode.render().indexOf("cx='10' cy='20'") !== -1);
    });

    test("renders radius", function() {
        ok(circleNode.render().indexOf("r='30'") !== -1);
    });

    test("geometryChange sets center", 2, function() {
        circleNode.attr = function(name, value) {
            if (name === "cx") {
                equal(value, 20);
            } else if (name === "cy") {
                equal(value, 40);
            }
        };

        circle.geometry.center.multiply(2);
    });

    test("geometryChange sets radius", 1, function() {
        circleNode.attr = function(name, value) {
            if (name === "r") {
                equal(value, 60);
            }
        };

        circle.geometry.set("radius", 60);
    });

    // ------------------------------------------------------------
    var text;
    var textNode;

    nodeTests(Text, TextNode, "TextNode");

    module("TextNode", {
        setup: function() {
            text = new d.Text("Foo", new Point(10, 20), { font: "arial" });
            textNode = new svg.TextNode(text);
        }
    });

    test("renders origin", function() {
        ok(textNode.render().indexOf("x='10' y='20'") > -1);
    });

    test("renders font", function() {
        ok(textNode.render().indexOf("font:arial;") > -1);
    });

    test("geometryChange sets origin", 2, function() {
        textNode.attr = function(name, value) {
            if (name === "x") {
                equal(value, 20);
            } else if (name === "y") {
                equal(value, 40);
            }
        };

        text.origin.multiply(2);
    });

    test("optionsChange sets font", function() {
        textNode.attr = function(name, value) {
            equal(name, "style");
            equal(value, "font:foo;");
        };

        text.options.set("font", "foo");
    });

    // ------------------------------------------------------------
    var textSpan;
    var textSpanNode;

    nodeTests(TextSpan, TextSpanNode, "TextNode");

    module("TextSpanNode", {
        setup: function() {
            textSpan = new d.TextSpan("Foo", { font: "arial" });
            textSpanNode = new svg.TextSpanNode(textSpan);
        }
    });

    test("renders content", function() {
        ok(textSpanNode.render().indexOf("Foo") > -1);
    });

    test("renders font", function() {
        ok(textSpanNode.render().indexOf("font:arial;") > -1);
    });

    test("contentChange sets content", function() {
        textSpanNode.content = function(value) {
            equal(value, "Bar");
        };

        textSpan.content("Bar");
    });

    test("optionsChange sets font", function() {
        textSpanNode.attr = function(name, value) {
            equal(name, "style");
            equal(value, "font:foo;");
        };

        textSpan.options.set("font", "foo");
    });
})();
