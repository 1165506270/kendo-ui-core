(function() {
    var encoding,
        dataviz = kendo.dataviz,
        encodings = dataviz.encodings
        START = [1,1,2,2,1],
        GAP = 1,
        characters = {
            "0":[1,1,1,1,2],
            "1":[2,1,1,1,2],
            "2":[1,2,1,1,2],
            "3":[2,2,1,1,1],
            "4":[1,1,2,1,2],
            "5":[2,1,2,1,1],
            "6":[1,2,2,1,1],
            "7":[1,1,1,2,2],
            "8":[2,1,1,2,1],
            "9":[2,1,1,1,1],
            "-":[1,1,2,1,1]
        };

    function generateResult(value, options){
        var expectedResult = [];
        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        expectedResult.push.apply(START);
        expectedResult.push(GAP);
        for( var i = 0; i < value.length; i++){
            expectedResult.push.apply(characters[value.charAt(i)]);
            expectedResult.push(GAP);
        }

        if(options.checkValues){
            for(var i = 0; i< options.checkValues.length; i++){
                expectedResult.push.apply(characters[options.checkValues[i]]);
                expectedResult.push(GAP);
            }
        }

        expectedResult.push.apply(START);

        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        return expectedResult;
    }

    module("code11", {
        setup: function() {
            encoding = new encodings.code11();
        },
        teardown: function(){
            encoding = null;
        }
    });

    test("test value 0", function(){
        var value = "0",
            result = encoding.encode(value, 200, 100),
            expectedResult = generateResult(value, {
                quietZoneLength: encoding.options.quietZoneLength,
                checkValues: ["0"]
            });
        ok(comparePatterns(result.pattern,expectedResult));
    });

    test("test value 123-45", function(){
        var value = "123-45",
            result = encoding.encode(value, 200, 100),
            expectedResult = generateResult(value, {
                quietZoneLength: encoding.options.quietZoneLength,
                checkValues: ["5"]
            });
        ok(comparePatterns(result.pattern,expectedResult));
    });

    test("test value 123-456-78 added K checksum", function(){
        var value = "123-456-78",
            result = encoding.encode(value, 200, 100),
            expectedResult = generateResult(value, {
                quietZoneLength: encoding.options.quietZoneLength,
                checkValues: ["5", "6"]
            });
        ok(comparePatterns(result.pattern,expectedResult));
    });

    test("test value 123-456-789 length over C checksum total", function(){
        var value = "123-456-789",
            result = encoding.encode(value, 200, 100),
            expectedResult = generateResult(value, {
                quietZoneLength: encoding.options.quietZoneLength,
                checkValues: ["5", "9"]
            });
        ok(comparePatterns(result.pattern,expectedResult));
    });

    test("test value 59100000501 check digit dash", function(){
        var value = "59100000501",
            result = encoding.encode(value, 200, 100),
            expectedResult = generateResult(value, {
                quietZoneLength: encoding.options.quietZoneLength,
                checkValues: ["-", "0"]
            });
        ok(comparePatterns(result.pattern,expectedResult));
    });

    test("test invalid character error", function() {
        var thrownError = false;
        try{
            encoding.encode("012-34a12", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test base unit calculation", function(){
        var quietZoneLength = 2 * encoding.options.quietZoneLength,
            precision = 2,
            width = 200,
            height = 100,
            valueNoCheckSum = "123-45",
            valueShortSymbols = "0-9",
            valueLongSymbols = "138",
            valueBothCheckSums = "59100000501",
            expectedResultNoCheckSum = fixed(width / (62 + quietZoneLength), precision),
            expectedResultShortSymbols  = fixed(width / (44 + quietZoneLength), precision),
            expectedResultLongSymbols = fixed(width / (47 + quietZoneLength), precision),
            expectedResultBothCheckSums = fixed(width / (110 + quietZoneLength), precision),
            resultNoCheckSum,
            resultShortSymbols,
            resultLongSymbols,
            resultBothCheckSums;


        encoding.options.addCheckSum = false;
        resultNoCheckSum = encoding.encode(valueNoCheckSum, width, height).baseUnit;
        equal(fixed(resultNoCheckSum, precision), expectedResultNoCheckSum);

        encoding.options.addCheckSum = true;

        resultShortSymbols = encoding.encode(valueShortSymbols, width, height).baseUnit;
        equal(fixed(resultShortSymbols, precision), expectedResultShortSymbols);

        resultLongSymbols = encoding.encode(valueLongSymbols, width, height).baseUnit;
        equal(fixed(resultLongSymbols, precision), expectedResultLongSymbols);

        resultBothCheckSums = encoding.encode(valueBothCheckSums, width, height).baseUnit;
        equal(fixed(resultBothCheckSums, precision), expectedResultBothCheckSums);

    });

})();
