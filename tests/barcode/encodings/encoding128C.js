(function() {
    var dataviz = kendo.dataviz,
    encodings = dataviz.encodings,
    encoding,
        characters = {
            "13": [1, 2, 2, 1, 3, 2],
            "16": [1, 2, 3, 1, 2, 2],
            "19": [2, 2, 1, 1, 3, 2],
            "23": [3, 1, 2, 1, 3, 1],
            "28": [3, 2, 2, 1, 1, 2],
            "29": [3, 2, 2, 2, 1, 1],
            "32": [2, 3, 2, 1, 2, 1],
            "33": [1, 1, 1, 3, 2, 3],
            "34": [1, 3, 1, 1, 2, 3],
            "35": [1, 3, 1, 3, 2, 1],
            "36": [1, 1, 2, 3, 1, 3],
            "37": [1, 3, 2, 1, 1, 3],
            "40": [2, 3, 1, 1, 1, 3],
            "43": [1, 1, 2, 3, 3, 1],
            "44": [1, 3, 2, 1, 3, 1],
            "45": [1, 1, 3, 1, 2, 3],
            "49": [2, 1, 1, 3, 3, 1],
            "51": [2, 1, 3, 1, 1, 3],
            "52": [2, 1, 3, 3, 1, 1],
            "56": [3, 3, 1, 1, 2, 1],
            "58": [3, 1, 2, 3, 1, 1],
            "62": [4, 3, 1, 1, 1, 1],
            "63": [1, 1, 1, 2, 2, 4],
            "64": [1, 1, 1, 4, 2, 2],
            "65": [1, 2, 1, 1, 2, 4],
            "66": [1, 2, 1, 4, 2, 1],
            "67": [1, 4, 1, 1, 2, 2],
            "70": [1, 1, 2, 4, 1, 2],
            "74": [1, 4, 2, 2, 1, 1],
            "75": [2, 4, 1, 2, 1, 1],
            "81": [1, 2, 1, 1, 4, 2],
            "84": [1, 2, 4, 1, 1, 2],
            "85": [1, 2, 4, 2, 1, 1],
            "86": [4, 1, 1, 2, 1, 2],
            "90": [2, 1, 4, 1, 2, 1],
            "91": [4, 1, 2, 1, 2, 1],
            "94": [1, 3, 1, 1, 4, 1],
            "95": [1, 1, 4, 1, 1, 3],
            "98": [4, 1, 1, 3, 1, 1],
            "99": [1, 1, 3, 1, 4, 1],
            "09": [2, 2, 1, 2, 1, 3],
            "08": [1, 3, 2, 2, 1, 2],
            "07": [1, 2, 2, 3, 1, 2],
            "03": [1, 2, 1, 2, 2, 3],
            "02": [2, 2, 2, 2, 2, 1],
            "00": [2, 1, 2, 2, 2, 2],
            "START": [2, 1, 1, 2, 3, 2],
            "STOP": [2, 3, 3, 1, 1, 1, 2]
        };

    function calculateCheckSum(value){
        var sum = 105;

        for(var i = 0; i< value.length; i+=2){
            sum += (i/2+1) * parseInt(value.substring(i, i + 2));
        }
        return sum % 103;
    }

    function generateResult(value, checkValue, options){
        var expectedResult = [];
        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        expectedResult.pushArray(characters.START);

        for( var i = 0; i < value.length; i+=2){
            expectedResult.pushArray(characters[value.substring(i, i + 2)]);
        }

        expectedResult.pushArray(characters[checkValue]);


        expectedResult.pushArray(characters.STOP);

        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        return expectedResult;
    }

    module("128C", {
        setup: function() {
            encoding = new encodings.code128c();
        },
        teardown: function(){
            encoding = null;
        }
    });

    test("test value 5237515233", function() {
        var value = "5237515233",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,"36",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value 34375658282916 ", function() {
        var value = "34375658282916",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "09",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value 0064327491624344 ", function() {
        var value = "0064327491624344",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "45",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value 63231916810307 ", function() {
        var value = "63231916810307",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "86",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value 99009598030807 ", function() {
        var value = "99009598030807",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "66",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value 00 ", function() {
        var value = "00",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "02",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });
    test("test invalid character error", function() {
        var thrownError = false;
        try{
            encoding.encode("00a11", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test invalid character error odd count", function() {
        var thrownError = false;
        try{
            encoding.encode("001", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test base unit calculation", function() {
        var width = 200,
            height = 100,
            value = "63231916810307",
            quietZoneLength = encoding.options.quietZoneLength,
            result,
            expectedResult = fixed(width / (112 + 2 * quietZoneLength), 2);

            result = encoding.encode(value, width, height).baseUnit;
            equal(fixed(result, 2), expectedResult);
    });

})();
