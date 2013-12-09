(function() {
    var dataviz = kendo.dataviz,
        encodings = dataviz.encodings,
        encoding,
        quietZoneLength = encodings["gs1-128"].fn.options.quietZoneLength;

    module("GS1-128", {
        setup: function() {
            encoding = new encodings["gs1-128"]();
        },
        teardown: function(){
            encoding = null;
        }
    });

    test("test fixed application identifier", function() {
        var value = "11001010",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 3, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test multiple fixed application identifiers", function() {
        var value = "1100101013000101",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 3, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test multiple fixed application identifiers with separators and spaces", function() {
        var value = "(11)001010(13)000101",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 3, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test variable length application identifier on first position without separators", function() {
        var value = "10abc1234",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 4, 1, 3, 1, 1, 2, 1, 1, 2, 4, 1, 2, 1, 4, 2, 1, 1, 4, 1, 1, 2, 2, 1, 1, 3, 1, 4, 1, 1, 1, 2, 2, 3, 2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 3, 1, 3, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test variable length application identifier on first position with separators", function() {
        var value = "(10)abc1234",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 4, 1, 3, 1, 1, 2, 1, 1, 2, 4, 1, 2, 1, 4, 2, 1, 1, 4, 1, 1, 2, 2, 1, 1, 3, 1, 4, 1, 1, 1, 2, 2, 3, 2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 3, 1, 3, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test variable length application identifier on first position with separators and spaces", function() {
        var value = "(10) abc1234",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 4, 1, 3, 1, 1, 2, 1, 1, 2, 4, 1, 2, 1, 4, 2, 1, 1, 4, 1, 1, 2, 2, 1, 1, 3, 1, 4, 1, 1, 1, 2, 2, 3, 2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 3, 1, 3, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test fixed length after variable length application identifier with separators", function() {
        var value = "10abc1234(11)000101",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength,2,1,1,2,3,2,4,1,1,1,3,1,2,2,1,3,1,2,1,1,4,1,3,1,1,2,1,1,2,4,1,2,1,4,2,1,1,4,1,1,2,2,1,1,3,1,4,1,1,1,2,2,3,2,1,3,1,1,2,3,4,1,1,1,3,1,2,3,1,2,1,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,1,4,2,2,1,1,2,3,3,1,1,1,2,quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test variable length after fixed length application identifier", function() {
        var value = "1100010110abc1234",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 3, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 3, 1, 2, 1, 1, 4, 1, 3, 1, 1, 2, 1, 1, 2, 4, 1, 2, 1, 4, 2, 1, 1, 4, 1, 1, 2, 2, 1, 1, 3, 1, 4, 1, 1, 1, 2, 2, 3, 2, 1, 3, 1, 1, 2, 3, 3, 2, 2, 1, 1, 2, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test move to state C in second application identifier", function() {
        var value = "10abc(11)000101",
            result = encoding.encode(value, 300, 100),
            expectedResult = [quietZoneLength, 2, 1, 1, 2, 3, 2, 4, 1, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 4, 1, 3, 1, 1, 2, 1, 1, 2, 4, 1, 2, 1, 4, 2, 1, 1, 4, 1, 1, 2, 2, 1, 1, 3, 1, 4, 1, 4, 1, 1, 1, 3, 1, 2, 3, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 3, 1, 4, 1, 1, 1, 2, 3, 3, 1, 1, 1, 2, quietZoneLength];

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test invalid character error", function() {
        var thrownError = false;
        try{
            encoding.encode("101^", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test invalid appllication identifier error", function() {
        var thrownError = false;
        try{
            encoding.encode("16101010", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test invalid character for appllication identifier error", function() {
        var thrownError = false;
        try{
            encoding.encode("121010a0", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test invalid length for appllication identifier error", function() {
        var thrownError = false;
        try{
            encoding.encode("1210100", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test no separators after variable length appllication identifier error", function() {
        var thrownError = false;
        try{
            encoding.encode("10aaaaaaaaaaaaa11000101", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test base unit calculation", function() {
        var width = 200,
            height = 100,
            value = "11001010",
            result,
            expectedResult = fixed(width / (90 + 2 * quietZoneLength), 2);

            result = encoding.encode(value, width, height).baseUnit;
            equal(fixed(result, 2), expectedResult);
    });

})();
