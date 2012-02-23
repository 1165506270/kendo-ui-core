
test("select event fires upon file selection", function() {
    var selectFired = false;
    uploadInstance = createUpload({ "select" : (function() { selectFired = true; }) });

    simulateFileSelect();

    ok(selectFired);
});

test("select event contains information for single file", function() {
    var files = null;
    uploadInstance = createUpload({ "select" : (function(e) { files = e.files; }) });

    simulateFileSelect()

    assertSelectedFile(files);
});

test("select event contains information for multiple files", function() {
    var files = null;
    uploadInstance = createUpload({ "select" : (function(e) {
        files = e.files;
    }) });

    simulateMultipleFileSelect();

    assertMultipleSelectedFiles(files);
});

test("cancelling select event prevents file selection", function() {
    uploadInstance = createUpload({ "select" : (function(e) { e.preventDefault(); }) });

    simulateFileSelect()
    equal($(".k-upload-files li.k-file", uploadInstance.wrapper).length, 0);
});

test("cancelling select event clears active input", function() {
    uploadInstance = createUpload({ "select" : (function(e) { e.preventDefault(); }) });

    simulateFileSelect()
    equal($("#uploadInstance").val(), "");
});

test("cancelling select event removes input", function() {
    uploadInstance = createUpload({ "select" : (function(e) { e.preventDefault(); }) });

    simulateFileSelect()
    equal($("input", uploadInstance.wrapper).length, 1);
});

