﻿///<reference path="qunit-1.12.0.js" />
///<reference path="common.js" />

var diagram = window.kendo.dataviz.diagram;

/*-----------Marker tests------------------------------------*/
QUnit.module("Marker tests", {
    setup: function() {
        QUnit.fixture.html('<div id=canvas />');
    }
});

test("Add/Remove/Clear Marker", function () {
    var root = GetRoot();
    var canvas = new diagram.Canvas(root);
    AddCircle(canvas, new diagram.Point(100, 120));
    var marker = new diagram.Marker({
        path:{
            data: "m"
        },
        id: "ArrowHead",
        width: 44,
        height: 21,
        viewBox: new diagram.Rect(10, 20, 33, 55),
        orientation: "auto"
    });
    canvas.addMarker(marker);
    var found = document.getElementById("ArrowHead");
    ok(found != null, "Marker element should be there.");
    ok(found.attributes["viewBox"] != null, "The viewBox should be there");
    ok(found.attributes["orient"] != null && found.attributes["orient"].value == "auto", "The orientation should be there");
    equal(marker.domElement.firstChild.tagName.toLowerCase(), "path", "path should be there");

    var line = new diagram.Line({
        id: "Line1",
        endCap: marker.domElement.id
    });
    canvas.append(line);
    found = document.getElementById("Line1");
    ok(found.attributes["marker-end"] != null);
    equal(found.attributes["marker-end"].value.replace(/"/g, ""), "url(#ArrowHead)", "The end marker should be present.");
    var returnedMarkerId = line.domElement.getAttribute("marker-end");
    ok(returnedMarkerId.indexOf("ArrowHead") > -1, "Not the correct Id.");
    canvas.clearMarkers();
    var defs = document.getElementsByTagName("defs");
    ok(defs != null && defs.length == 1, "Defs tag should still be there.");
    ok(defs[0].childNodes.length == 0, "All markers should be gone now.");
    canvas.clear();
});

/*-----------Rectangle tests------------------------------------*/
QUnit.module("Rectangle tests", {
    setup: function() {
        QUnit.fixture.html('<div id=canvas />');
    }
});

test("Add Rectangle", function () {
    var root = GetRoot();
    var canvas = new diagram.Canvas(root);
    var rec = new diagram.Rectangle({
        id: "MyRectangle",
        width: 150,
        height: 88
    });
    rec.position(new diagram.Point(100, 121));
    rec.background("Red");
    canvas.append(rec);

    var found = document.getElementById("MyRectangle");
    ok(found != null, "A SVG rectangle with name 'MyRectangle' should be in the HTML tree.");
    ok(found.attributes["width"].value == 150, "The width should be 150.");
    ok(found.attributes["height"].value == 88, "The height should be 287.");
    ok(found.attributes["fill"].value == "#ff0000");
});

/*-----------Circle tests------------------------------------*/
QUnit.module("Circle tests", {
    setup: function() {
        QUnit.fixture.html('<div id=canvas />');
    }
});

test("Add Circle", function () {
    var root = GetRoot();
    var canvas = new diagram.Canvas(root);
    var circ = new diagram.Circle({
        id: "MyCirc",
        x: 200, y: 121,
        width: 150,
        height: 150,
        background: "#345656"
    });
    canvas.append(circ);
    var found = document.getElementById("MyCirc");
    ok(found != null, "A SVG circle with name 'MyCirc' should be in the HTML tree.");
    equal(parseInt(found.attributes["rx"].value), 75, "The radius should be 75.");
    equal(parseInt(found.attributes["cx"].value), 275, "The center X value should be 200+75.");
    ok(found.attributes["fill"].value == "#345656");
});

/*-----------Text tests------------------------------------*/
QUnit.module("Text tests", {
    setup: function() {
        QUnit.fixture.html('<div id=canvas />');
    }
});

test("Add Text", function () {
    var root = GetRoot();
    var canvas = new diagram.Canvas(root);
    var text = new diagram.TextBlock({
        id: "MyText",
        x: 100, y: 121,
        text: "<<|Telerik|>>"
    });

    canvas.append(text);
    var found = document.getElementById("MyText");
    ok(found != null, "A SVG text with name 'MyText' should be in the HTML tree.");
    ok(found.textContent == "<<|Telerik|>>", "The text should be '<< | Telerik | >>'.");
    equalTranslate(found, new diagram.Point(100, 121), "text block should be positioned");

    text.content("changed");
    equal(found.textContent, "changed", "Text has changed.");
});

/*-----------Group tests------------------------------------*/
QUnit.module("Group tests", {
    setup: function() {
        QUnit.fixture.html('<div id=canvas />');
    }
});

test("Add group", function () {
    var root = GetRoot();
    var canvas = new diagram.Canvas(root);
    var g = new diagram.Group({
        id: "G1",
        x: 100,
        y: 100
    });
    canvas.append(g);
    var found = document.getElementById("G1");
    ok(found != null, "A SVG group with name 'G1' should be in the HTML tree.");
    var rec = new diagram.Rectangle({
        id: "MyRectangle",
        width: 50,
        height: 50,
        background: "red"
    });
    g.append(rec);
});

/*-----------Canvas tests------------------------------------*/
QUnit.module("Canvas tests", {
    setup: function() {
        QUnit.fixture.html('<div id=canvas />');
    }
});

test("Add Canvas", function () {
    var root = GetRoot();
    var canvas = new diagram.Canvas(root);
    var found = document.getElementById('SVGRoot');
    ok(found != null, "The Canvas should add an <SVG/> element with name 'SVGRoot'.");
    root = GetRoot();

    canvas = new diagram.Canvas(root, {
        width: 865,
        height: 287,
        background: "#121217"
    });
    found = document.getElementById('SVGRoot');
    ok(parseFloat(found.style.width) == 865, "The width should be 865.");
    ok(parseFloat(found.style.height) == 287, "The height should be 287.");
    ok(found.style.backgroundColor == "rgb(18, 18, 23)");
});

QUnit.module("Transformations");
test("scale toString", function() {
	var scale = new diagram.Scale(2, 2);

	equal(scale.toString(), "scale(2,2)");
});

test("scale matrix", function() {
	var expectedMatrix = new diagram.Matrix(2, 0, 0, 2, 0, 0);
	var scale = new diagram.Scale(2, 2);

	deepEqual(scale.toMatrix(), expectedMatrix);
});

test("translate toString", function() {
	var translate = new diagram.Translation(1, 2);

	equal(translate.toString(), "translate(1,2)");
});

test("translate toMatrix", function() {
	var expectedMatrix = new diagram.Matrix(1, 0, 0, 1, 1, 2);
	var translate = new diagram.Translation(1, 2);

	deepEqual(translate.toMatrix(), expectedMatrix);
});

test("translate toMatrixVector", function() {
	var expectedVector = new diagram.MatrixVector(0, 0, 0, 0, 1, 2);
	var translate = new diagram.Translation(1, 2);

	deepEqual(translate.toMatrixVector(), expectedVector);
});

test("translate plus delta", function() {
	var translate = new diagram.Translation(1, 3);
	var delta = new diagram.Point(3, 2);

	translate.plus(delta);

	deepEqual(translate, new diagram.Translation(4, 5));
});

test("translate multiplication", function() {
	var translate = new diagram.Translation(1, 2);

	translate.times(2);

	deepEqual(translate, new diagram.Translation(2, 4));
});

test("translate length in coordinates", function() {
	var translate = new diagram.Translation(3, 4);

	var length = translate.length();

	equal(length, 5, "vector length is sqrt(3*3 + 4*4) = 5");
});

test("translate normalize", function() {
	var translate = new diagram.Translation(2, 3);

	translate.normalize();

	equal(translate.length(), 1, "normal vectors have length of 1");
});

test("rotate toString around origin", function() {
	var rotate = new diagram.Rotation(45);

	equal(rotate.toString(), "rotate(45)");
});

test("rotate toString around arbitrary point", function() {
	var rotate = new diagram.Rotation(45, 3, 4);

	equal(rotate.toString(), "rotate(45,3,4)");
});

test("rotate toMatrix around origin", function() {
	var rotate = new diagram.Rotation(90);

	var expectedMatrix = new diagram.Matrix(0, 1, -1, 0, 0, 0);
	matrixEqual(rotate.toMatrix(), expectedMatrix);
});

test("rotate toMatrix around arbitrary point", function() {
	var rotate = new diagram.Rotation(90, 3, 4);

	var expectedMatrix = new diagram.Matrix(0, 1, -1, 0, 7, 1);
	matrixEqual(rotate.toMatrix(), expectedMatrix);
});


test("composite transform toString - single translate", function() {
    var transform = new diagram.CompositeTransform(2, 3);

    equal(transform.toString(), "translate(2,3)");
});

test("composite transform toString - translate and scale", function() {
    var transform = new diagram.CompositeTransform(2, 3, 3, 4);

    equal(transform.toString(), "translate(2,3)scale(3,4)");
});

test("composite transform toString - all", function() {
    var transform = new diagram.CompositeTransform(2, 3, 3, 4, 45, new diagram.Point(3, 2));

    equal(transform.toString(), "translate(2,3)rotate(45,3,2)scale(3,4)");
});

test("composite transform toString - all without rotation center", function() {
    var transform = new diagram.CompositeTransform(2, 3, 3, 4, 45);

    equal(transform.toString(), "translate(2,3)rotate(45)scale(3,4)");
});

test("composite transform updates SVG node transformation", function() {
    var rect = new diagram.Rectangle();
    var transform = new diagram.CompositeTransform(2, 3);

    transform.render(rect.domElement);

    //equal(rect.domElement.getAttribute("transform"), transform.toString(), "SVG node should be transformed"); // not working in IE - it removes the commas (,)
    ok(rect.domElement.getAttribute("transform"), "SVG node should be transformed");

});

test("invert translation", function() {
    var transform  = new diagram.Translation(100, 100);
    var invert = transform.invert();

    equal(invert.toString(), "translate(-100,-100)", "x and y should be inverted");
});
test("invert scale", function() {
    var transform  = new diagram.Scale(2, 2);
    var invert = transform.invert();

    equal(invert.toString(), "scale(0.5,0.5)", "zoom in should is inverted with zoom out");
});
test("invert rotation without center", function() {
    var transform  = new diagram.Rotation(30);
    var invert = transform.invert();

    equal(invert.toString(), "rotate(330)", "invert of rotation is done by rotating to the rest until a full circle angle");
});
test("invert rotation with center", function() {
    var transform  = new diagram.Rotation(30, 100, 100);
    var invert = transform.invert();

    equal(invert.toString(), "rotate(330,100,100)", "reverting rotation is done over the same center and with rest to full circle angle");
});
test("invert composite transform with rotation without center", function() {
    var transform = new diagram.CompositeTransform(100, 100, 2, 2, 90);
    var point = new diagram.Point(100, 100);

    var transformedPoint = transform.toMatrix().apply(point);
    var invertedPoint = transform.invert().toMatrix().apply(transformedPoint);

    roughlyEqualPoint(point, invertedPoint, "the inverted point should be the same as the original point");
});
test("invert composite transform with rotation with center", function() {
    var transform = new diagram.CompositeTransform(100, 100, 2, 2, 90, 30, 30);
    var point = new diagram.Point(100, 100);

    var transformedPoint = transform.toMatrix().apply(point);
    var invertedPoint = transform.invert().toMatrix().apply(transformedPoint);

    roughlyEqualPoint(point, invertedPoint, "the inverted point should be the same as the original point");
});

/*-----------SVG tests------------------------------------*/
module("SVG rendering");

test("visualBase should render stroke", function() {
    var element = new diagram.VisualBase(
        document.createElementNS("http://www.w3.org/2000/svg", "path"), {
            stroke: {
                color: "red",
                width: 20,
                dashType: "dot"
            }
        });

    equal(element.domElement.getAttribute("stroke"), "red");
    equal(element.domElement.getAttribute("stroke-width"), 20);
    equal(element.domElement.getAttribute("stroke-dasharray"), "30 70");
});

/*-----------------------------------------------*/
var image;

module("Image / redraw", {
    setup: function() {
        image = new diagram.Image({ });
    },
    teardown: function() {
        $(image.domElement).remove();
        delete image;
    }
});

test("should set correct width", function() {
    var width = 20;

    image.redraw({
        width: width
    });

    equal(image.domElement.getAttribute("width"), width);
});

test("should set correct height", function() {
    var height = 20;

    image.redraw({
        height: height
    });

    equal(image.domElement.getAttribute("height"), height);
});

test("should set correct x", function() {
    var x = 1;

    image.redraw({
        x: x
    });

    equal(image.domElement.getAttribute("x"), x);
});

test("should set correct y", function() {
    var y = 1;

    image.redraw({
        y: y
    });

    equal(image.domElement.getAttribute("y"), y);
});
