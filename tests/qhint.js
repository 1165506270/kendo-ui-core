(function() {
    function qHint(name, sourceFile, options) {
        if (sourceFile === undefined || typeof(sourceFile) == "object") {
            // jsHintTest('file.js', [options])
            options = sourceFile;
            sourceFile = name;
        }

        options = $.extend({
            curly: true,
            trailing: true,
            undef: true,
            latedef: true,
            browser: true,
            jquery: true,
            unused: true
        }, options);

        function validateFile(source) {
            var i, len, err,
                result = JSHINT(source, options),
                unvar;

            ok(result);

            if (result) {
                return;
            }

            for (i = 0, len = JSHINT.errors.length; i < len; i++) {
                err = JSHINT.errors[i];
                if (!err) {
                    continue;
                }

                ok(false, err.reason + " on line " + err.line + ", character " + err.character);
            }

        }

        if (typeof JSHINT == "undefined") {
            return test(name, function() {
                ok(false, "JSHINT is not loaded. Include JSHINT in the page before using qHint.");
            });
        }

        return asyncTest(name, function() {
            qHint.sendRequest(sourceFile, function(source) {
                start();

                var sourceText = source.responseText;
                if (sourceText.indexOf("kendo_module") !== -1) {
                    sourceText = "/*global kendo_module:true */\n" + sourceText;
                }
                validateFile(sourceText);
            });
        });
    }

    // modified version of XHR script by PPK, http://www.quirksmode.org/js/xmlhttp.html
    // attached to qHint to allow substitution / mocking
    qHint.sendRequest = function (url, callback) {
        if (!/\?/.test(url))
            url += "?cacheBuster=" + new Date().getTime();
        var req = createXMLHTTPObject();
        if (!req) return;
        var method = "GET";
        req.open(method,url,true);
        req.setRequestHeader("X-QHint", "true");
        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 200 && req.status != 304) {
                ok(false, "QHint: HTTP error " + req.status + " occured.");
                return;
            }
            callback(req);
        };

        if (req.readyState == 4) return;
        req.send();
    };

    var XMLHttpFactories = [
        function () { return new XMLHttpRequest(); },
        function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
        function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
        function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
    ];

    function createXMLHTTPObject() {
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                return XMLHttpFactories[i]();
            } catch (e) {}
        }
        return false;
    }

    window.jsHintTest = window.qHint = qHint;
})();
