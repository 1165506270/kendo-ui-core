(function() {
    var dataviz = kendo.dataviz,
        encodings = dataviz.encodings,
        encoding,
        characters = {
            "0": [3, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1],
            "1": [1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 3],
            "31": [3, 1, 2, 1, 1, 1, 2, 2, 1, 2, 1, 1],
            "32": [3, 1, 1, 2, 1, 1],
            "33": [3, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 3],
            "36": [3, 1, 1, 1, 2, 1, 2, 2, 1, 1, 1, 2],
            "37": [3, 1, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1],
            "39": [3, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3],
            "43": [3, 1, 1, 1, 2, 1, 1, 3, 2, 1, 1, 1],
            "45": [1, 2, 1, 1, 3, 1],
            "46": [3, 1, 1, 1, 1, 2],
            "47": [3, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 2],
            "48": [1, 3, 1, 1, 1, 2],
            "49": [1, 1, 1, 2, 1, 3],
            "50": [1, 1, 1, 3, 1, 2],
            "51": [1, 1, 1, 4, 1, 1],
            "52": [1, 2, 1, 1, 1, 3],
            "53": [1, 2, 1, 2, 1, 2],
            "54": [1, 2, 1, 3, 1, 1],
            "55": [1, 1, 1, 1, 1, 4],
            "56": [1, 3, 1, 2, 1, 1],
            "57": [1, 4, 1, 1, 1, 1],
            "61": [3, 1, 2, 1, 1, 1, 1, 1, 2, 2, 1, 2],
            "64": [3, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1],
            "65": [2, 1, 1, 1, 1, 3],
            "66": [2, 1, 1, 2, 1, 2],
            "68": [2, 2, 1, 1, 1, 2],
            "69": [2, 2, 1, 2, 1, 1],
            "71": [1, 1, 2, 1, 1, 3],
            "72": [1, 1, 2, 2, 1, 2],
            "73": [1, 1, 2, 3, 1, 1],
            "74": [1, 2, 2, 1, 1, 2],
            "75": [1, 3, 2, 1, 1, 1],
            "76": [1, 1, 1, 1, 2, 3],
            "77": [1, 1, 1, 2, 2, 2],
            "79": [1, 2, 1, 1, 2, 2],
            "80": [1, 3, 1, 1, 2, 1],
            "81": [2, 1, 2, 1, 1, 2],
            "83": [2, 1, 1, 1, 2, 2],
            "84": [2, 1, 1, 2, 2, 1],
            "85": [2, 2, 1, 1, 2, 1],
            "86": [2, 2, 2, 1, 1, 1],
            "87": [1, 1, 2, 1, 2, 2],
            "88": [1, 1, 2, 2, 2, 1],
            "89": [1, 2, 2, 1, 2, 1],
            "90": [1, 2, 3, 1, 1, 1],
            "98": [1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2],
            "127": [3, 1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 3, 1, 2, 1, 1, 1, 1, 2, 2, 1, 2, 1, 3, 1, 2, 1, 1, 1, 1, 2, 3, 1, 1, 1],
            "TERMINATION_BAR": 1,
            "START": [1, 1, 1, 1, 4, 1],
            "SHIFT0": [1, 2, 2, 2, 1, 1],
            "SHIFT1": [3, 1, 1, 1, 2, 1],
            "SHIFT2": [1, 2, 1, 2, 2, 1],
            "SHIFT3": [3, 1, 2, 1, 1, 1]
        };

    function generateResult(value, options){
        var expectedResult = [];
        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        expectedResult.push.apply(expectedResult, characters.START);

        for( var i = 0; i < value.length; i++){
            expectedResult.push.apply(expectedResult, characters[value.charCodeAt(i)]);
        }

        for( var i = 0; i < options.checkCharacters.length; i++){
            if(options.checkCharacters[i].length > 1){
                expectedResult.push.apply(expectedResult, characters[options.checkCharacters[i]]);
            }
            else{
                expectedResult.push.apply(expectedResult, characters[options.checkCharacters[i].charCodeAt(0)]);
            }
        }


        expectedResult.push.apply(expectedResult, characters.START);
        expectedResult.push(characters.TERMINATION_BAR);

        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        return expectedResult;
    }

    module("code93extended", {
        setup: function() {
            encoding = new encodings.code93extended();
        },
        teardown: function(){
            encoding = null;
        }
    });

    test("test value TEST93 is correctly encoded", function() {
        var value = "TEST93",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["+","6"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value HI345678 is correctly encoded", function() {
        var value = "HI345678",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["V","-"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value ' 0.1-2$3/4+%' is correctly encoded", function() {
        var value = " 0.1-2$3/4+%",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["SHIFT0", "Z"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value ' (NUL)A6bU(SOH)' is correctly encoded", function() {
        var value = " " + String.fromCharCode(0) + "A6bU" + String.fromCharCode(1),
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["V", "1"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value '@$(DEL)!3/4+%' is correctly encoded", function() {
        var value = "@$" + String.fromCharCode(127) + "!3/4+%",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["B", "/"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test invalid character error", function() {
        var thrownError = false;
        try{
            encoding.encode("aAAST*" + String.fromCharCode(128), 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test base unit calculation", function() {
        var width = 200,
            height = 100,
            value = "H3%4" + String.fromCharCode(127),
            quietZoneLength = encoding.options.quietZoneLength,
            result,
            expectedResult = 1.15;

            result = encoding.encode(value, width, height).baseUnit;
            equal(fixed(result, 2), expectedResult);
    });

    test("test base unit calculation with special check character", function() {
        var width = 200,
            height = 100,
            value = "V C",
            quietZoneLength = encoding.options.quietZoneLength,
            result,
            expectedResult = 2.15;

        result = encoding.encode(value, width, height).baseUnit;
        equal(fixed(result, 2), expectedResult);
    });

})();
