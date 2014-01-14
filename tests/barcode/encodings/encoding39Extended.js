(function() {
    var dataviz = kendo.dataviz,
    encodings = dataviz.encodings,
    encoding,
    characters = {
            "0": function (ratio){return [1, 1,1, ratio,1,  ratio,1, ratio,1, 1,ratio, ratio,1, 1,1,  1,1, 1,ratio];},
            "1": function (ratio){return [1, ratio,1, ratio,1,  ratio,1, 1,1, 1,ratio, 1,1, 1,1,  ratio,1, 1,ratio];},
            "32": function (ratio){return [1, ratio,ratio, 1,1,  1,ratio, 1,1];},
            "33": function (ratio){return [1, ratio,1, ratio,1,  1,1, ratio,1, 1,ratio, 1,1, 1,1,  ratio,1, 1,ratio];},
            "36": function (ratio){return [1, ratio,1, ratio,1,  1,1, ratio,1, 1,1, 1,1, 1,ratio,  ratio,1, 1,ratio];},
            "37": function (ratio){return [1, ratio,1, ratio,1,  1,1, ratio,1, 1,ratio, 1,1, 1,ratio,  ratio,1, 1,1];},
            "43": function (ratio){return [1, ratio,1, ratio,1,  1,1, ratio,1, 1,ratio, 1,1, 1,1,  1,1, ratio,ratio];},
            "45": function (ratio){return [1, ratio,1, 1,1,  1,ratio, 1,ratio];},
            "46": function (ratio){return [ratio, ratio,1, 1,1,  1,ratio, 1,1];},
            "47": function (ratio){return [1, ratio,1, ratio,1,  1,1, ratio,1, 1,ratio, 1,1, 1,ratio,  1,1, ratio,1];},
            "48": function (ratio){return [1, 1,1, ratio,ratio,  1,ratio, 1,1];},
            "49": function (ratio){return [ratio, 1,1, ratio,1,  1,1, 1,ratio];},
            "50": function (ratio){return [1, 1,ratio, ratio,1,  1,1, 1,ratio];},
            "51": function (ratio){return [ratio, 1,ratio, ratio,1,  1,1, 1,1];},
            "52": function (ratio){return [1, 1,1, ratio,ratio,  1,1, 1,ratio];},
            "53": function (ratio){return [ratio, 1,1, ratio,ratio,  1,1, 1,1];},
            "54": function (ratio){return [1, 1,ratio, ratio,ratio,  1,1, 1,1];},
            "55": function (ratio){return [1, 1,1, ratio,1,  1,ratio, 1,ratio];},
            "56": function (ratio){return [ratio, 1,1, ratio,1,  1,ratio, 1,1];},
            "64": function (ratio){return [1, 1,1, ratio,1,  ratio,1, ratio,1, 1,1, ratio,ratio, 1,1,  1,1, 1,ratio];},
            "65": function (ratio){return [ratio, 1,1, 1,1,  ratio,1, 1,ratio];},
            "66": function (ratio){return [1, 1,ratio, 1,1,  ratio,1, 1,ratio];},
            "67": function (ratio){return [ratio, 1,ratio, 1,1,  ratio,1, 1,1];},
            "68": function (ratio){return [1, 1,1, 1,ratio,  ratio,1, 1,ratio];},
            "69": function (ratio){return [ratio, 1,1, 1,ratio,  ratio,1, 1,1];},
            "70": function (ratio){return [1, 1,ratio, 1,ratio,  ratio,1, 1,1];},
            "72": function (ratio){return [ratio, 1,1, 1,1,  ratio,ratio, 1,1];},
            "73": function (ratio){return [1, 1,ratio, 1,1,  ratio,ratio, 1,1];},
            "75": function (ratio){return [ratio, 1,1, 1,1,  1,1, ratio,ratio];},
            "79": function (ratio){return [ratio, 1,1, 1,ratio,  1,1, ratio,1];},
            "80": function (ratio){return [1, 1,ratio, 1,ratio,  1,1, ratio,1];},
            "83": function (ratio){return [1, 1,ratio, 1,1,  1,ratio, ratio,1];},
            "84": function (ratio){return [1, 1,1, 1,ratio,  1,ratio, ratio,1];},
            "85": function (ratio){return [ratio, ratio,1, 1,1,  1,1, 1,ratio];},
            "86": function (ratio){return [1, ratio,ratio, 1,1,  1,1, 1,ratio];},
            "87": function (ratio){return [ratio, ratio,ratio, 1,1,  1,1, 1,1];},
            "88": function (ratio){return [1, ratio,1, 1,ratio,  1,1, 1,ratio];},
            "89": function (ratio){return [ratio, ratio,1, 1,ratio,  1,1, 1,1];},
            "90": function (ratio){return [1, ratio,ratio, 1,ratio,  1,1, 1,1];},
            "98": function (ratio){return [1, ratio,1, 1,1,  ratio,1, ratio,1, 1,1, 1,ratio, 1,1,  ratio,1, 1,ratio];},
            "127": function (ratio){return [1, 1,1, ratio,1,  ratio,1, ratio,1, 1,1, 1,1, 1,ratio,  1,ratio, ratio,1, 1,1, 1,1, ratio,1,  ratio,1, ratio,1, 1,1, ratio,1, 1,ratio,  1,1, 1,ratio, 1,1, 1,1, ratio,1,  ratio,1, ratio,1, 1,ratio, ratio,1, 1,ratio,  1,1, 1,1, 1,1, 1,1, ratio,1,  ratio,1, ratio,1, 1,1, ratio,ratio, 1,ratio,  1,1, 1,1];},
            "START": function(ratio){ return [1, ratio,1, 1,ratio,  1,ratio, 1,1];},
            "GAP": 1
        };

    function generateResult(value, ratio, options){
        var expectedResult = [];
        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        expectedResult.push.apply(expectedResult, characters.START(ratio));
        expectedResult.push(characters.GAP);

        for( var i = 0; i < value.length; i++){
            expectedResult.push.apply(expectedResult, characters[value.charCodeAt(i)](ratio));
            expectedResult.push(characters.GAP);
        }

        expectedResult.push.apply(expectedResult, characters.START(encoding.ratio));

        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        return expectedResult;
    }

    function calculateBaseUnit(width, length, ratio, quietZoneLength, checkLength, gapWidth){
        var characterLength = 3 * (ratio + 2);
        return width /
            ( 2 * quietZoneLength + (length + 2 + checkLength) * characterLength + gapWidth * (length + checkLength + 1));
    }


    module("code39Extended", {
        setup: function() {
            encoding = new encodings.code39extended();
        },
        teardown: function(){
            encoding = null;
        }
    });


   test("test value TEST8052 is correctly encoded", function() {
        var value = "TEST8052",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, encoding.ratio,
                {quietZoneLength: encoding.options.quietZoneLength});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value ' 0.1-2$3/4+%' is correctly encoded", function() {
        var value = " 0.1-2$3/4+%",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, encoding.ratio,
                {quietZoneLength:  encoding.options.quietZoneLength});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value ' (NUL)A6bU(SOH)' is correctly encoded", function() {
        var value = " " + String.fromCharCode(0) + "A6bU" + String.fromCharCode(1),
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, encoding.ratio,
                {quietZoneLength: encoding.options.quietZoneLength});

        ok(comparePatterns(result.pattern, expectedResult));
    });


    test("test value '@$(DEL)!3/4+%' is correctly encoded", function() {
        var value = "@$" + String.fromCharCode(127) + "!3/4+%",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value, encoding.ratio,
                {quietZoneLength: encoding.options.quietZoneLength});

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
        var width = 300,
            height = 100,
            value = "@$" + String.fromCharCode(127)+ "!3/4+%",
            length = 22,
            quietZoneLength = encoding.options.quietZoneLength,
            result,
            expectedResult;

            result = encoding.encode(value, width, height).baseUnit;
            expectedResult = calculateBaseUnit(width, length, encoding.ratio, quietZoneLength, 0, encoding.gapWidth);
            equal(result, expectedResult);
    });

    test("test ratio calculation", function() {
        var result1,
            result2,
            result3,
            value = "A@!",
            width1 = 92,
            width2 = 87.3,
            width3 = 84.5,
            expectedResult1 = 3,
            expectedResult2 = 2.7,
            expectedResult3 = 2.5;

            encoding.encode(value, width1, 100);
            result1 = parseFloat(encoding.ratio.toFixed(1));
            equal(result1, expectedResult1);

            encoding.encode(value, width2, 100);
            result2 = parseFloat(encoding.ratio.toFixed(1));
            equal(result2, expectedResult2);

            encoding.encode(value, width3, 100);
            result3 = parseFloat(encoding.ratio.toFixed(1));
            equal(result3, expectedResult3);
    });

})();
