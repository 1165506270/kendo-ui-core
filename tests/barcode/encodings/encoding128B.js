(function() {
    var dataviz = kendo.dataviz,
        encodings = dataviz.encodings,
        encoding,
        characters = {
            "32": [2, 1, 2, 2, 2, 2],
            "35": [1, 2, 1, 2, 2, 3],
            "39": [1, 2, 2, 3, 1, 2],
            "45": [1, 2, 2, 1, 3, 2],
            "48": [1, 2, 3, 1, 2, 2],
            "51": [2, 2, 1, 1, 3, 2],
            "55": [3, 1, 2, 1, 3, 1],
            "60": [3, 2, 2, 1, 1, 2],
            "61": [3, 2, 2, 2, 1, 1],
            "64": [2, 3, 2, 1, 2, 1],
            "65": [1, 1, 1, 3, 2, 3],
            "66": [1, 3, 1, 1, 2, 3],
            "69": [1, 3, 2, 1, 1, 3],
            "72": [2, 3, 1, 1, 1, 3],
            "75": [1, 1, 2, 3, 3, 1],
            "76": [1, 3, 2, 1, 3, 1],
            "81": [2, 1, 1, 3, 3, 1],
            "83": [2, 1, 3, 1, 1, 3],
            "84": [2, 1, 3, 3, 1, 1],
            "88": [3, 3, 1, 1, 2, 1],
            "90": [3, 1, 2, 3, 1, 1],
            "94": [4, 3, 1, 1, 1, 1],
            "95": [1, 1, 1, 2, 2, 4],
            "96": [1, 1, 1, 4, 2, 2],
            "97": [1, 2, 1, 1, 2, 4],
            "99": [1, 4, 1, 1, 2, 2],
            "102": [1, 1, 2, 4, 1, 2],
            "107": [2, 4, 1, 2, 1, 1],
            "122": [2, 1, 4, 1, 2, 1],
            "123": [4, 1, 2, 1, 2, 1],
            "126": [1, 3, 1, 1, 4, 1],
            "127": [1, 1, 4, 1, 1, 3],
            "START": [2, 1, 1, 2, 1, 4],
            "STOP": [2, 3, 3, 1, 1, 1, 2]
        };

    function calculateCheckSum(value){
        var sum = 104;
        for(var i = 0; i< value.length; i++){
            ascii = value.charCodeAt(i);
            sum+= (i+1)*(ascii - 32);
        }
        return sum % 103;
    }

    function generateResult(value, checkValue, options){
        var expectedResult = [];
        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        expectedResult.pushArray(characters.START);

        for( var i = 0; i < value.length; i++){
            expectedResult.pushArray(characters[value.charCodeAt(i)]);
        }

        expectedResult.pushArray(characters[checkValue.charCodeAt(0)]);


        expectedResult.pushArray(characters.STOP);

        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        return expectedResult;
    }

    module("128B", {
        setup: function() {
            encoding = new encodings.code128b();
        },
        teardown: function(){
            encoding = null;
        }
    });

    test("test value TESTB", function() {
        var value = "TESTB",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,"H",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value AEXZ<=0 ", function() {
        var value = "AEXZ<=0",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "'",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value ' a@cz^KL' ", function() {
        var value = " a@cz^KL",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "-",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value (_730(DEL)#') ", function() {
        var value = "_730" + String.fromCharCode(127) + "#'",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "T",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value (0`~k{ ) ", function() {
        var value = "0`~k{ ",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, "Q",
                {quietZoneLength: encoding.options.quietZoneLength });

        ok(comparePatterns(result.pattern, expectedResult));
    });


    test("test invalid character error", function() {
        var thrownError = false;
        try{
            encoding.encode("AASaT*" + String.fromCharCode(31), 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test base unit calculation", function() {
        var width = 200,
            height = 100,
            value = " a@cz^KL" + String.fromCharCode(127),
            quietZoneLength = encoding.options.quietZoneLength,
            result,
            expectedResult = fixed(width / (134 + 2 * quietZoneLength), 2);

            result = encoding.encode(value, width, height).baseUnit;
            equal(fixed(result, 2), expectedResult);
    });

})();
