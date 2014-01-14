(function() {
    var dataviz = kendo.dataviz,
        encodings = dataviz.encodings,
        encoding,
        characters = {
            "0": [1, 3, 1, 1, 1, 2],
            "1": [1, 1, 1, 2, 1, 3],
            "2": [1, 1, 1, 3, 1, 2],
            "3": [1, 1, 1, 4, 1, 1],
            "4": [1, 2, 1, 1, 1, 3],
            "5": [1, 2, 1, 2, 1, 2],
            "6": [1, 2, 1, 3, 1, 1],
            "7": [1, 1, 1, 1, 1, 4],
            "8": [1, 3, 1, 2, 1, 1],
            "9": [1, 4, 1, 1, 1, 1],
            "TERMINATION_BAR": 1,
            "START": [1, 1, 1, 1, 4, 1],
            "A": [2, 1, 1, 1, 1, 3],
            "B": [2, 1, 1, 2, 1, 2],
            "E": [2, 2, 1, 2, 1, 1],
            "G": [1, 1, 2, 1, 1, 3],
            "H": [1, 1, 2, 2, 1, 2],
            "I": [1, 1, 2, 3, 1, 1],
            "L": [1, 1, 1, 1, 2, 3],
            "M": [1, 1, 1, 2, 2, 2],
            "P": [1, 3, 1, 1, 2, 1],
            "Q": [2, 1, 2, 1, 1, 2],
            "S": [2, 1, 1, 1, 2, 2],
            "T": [2, 1, 1, 2, 2, 1],
            "V": [2, 2, 2, 1, 1, 1],
            "-": [1, 2, 1, 1, 3, 1],
            ".": [3, 1, 1, 1, 1, 2],
            " ": [3, 1, 1, 2, 1, 1],
            "$": [3, 2, 1, 1, 1, 1],
            "/": [1, 1, 2, 1, 3, 1],
            "+": [1, 1, 3, 1, 2, 1],
            "%": [2, 1, 1, 1, 3, 1],
            "SHIFT0": [1, 2, 2, 2, 1, 1],
            "SHIFT1": [1, 2, 2, 2, 1, 1]
        };

    function generateResult(value, options){
        var expectedResult = [];
        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        expectedResult.push.array(characters.START);

        for( var i = 0; i < value.length; i++){
            expectedResult.push.array(characters[value.charAt(i)]);
        }

        for( var i = 0; i < options.checkCharacters.length; i++){
            expectedResult.push.array(characters[options.checkCharacters[i]]);
        }

        expectedResult.push.array(characters.START);
        expectedResult.push(characters.TERMINATION_BAR);

        if(options.quietZoneLength){
            expectedResult.push(options.quietZoneLength);
        }

        return expectedResult;
    }

    module("code93", {
        setup: function() {
            encoding = new encodings.code93();
        },
        teardown: function(){
            encoding = null;
        }
    });

    test("test value TEST93 is correctly encoded", function() {
        encoding.options.addCheckSum = true;
        encoding.options.addQuietZone = true;
        var value = "TEST93",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["+","6"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value HI345678 is correctly encoded", function() {
        encoding.options.addCheckSum = true;
        encoding.options.addQuietZone = true;
        var value = "HI345678",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["V","-"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test value ' 0.1-2$3/4+%' is correctly encoded", function() {
        encoding.options.addCheckSum = true;
        encoding.options.addQuietZone = true;

        var value = " 0.1-2$3/4+%",
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: [".", "S"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test checkSum length over K total", function() {
        encoding.options.addCheckSum = true;
        encoding.options.addQuietZone = true;

        var value = new Array(16).join("2"),
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["5", "A"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test checkSum length over C total", function() {
        encoding.options.addCheckSum = true;
        encoding.options.addQuietZone = true;

        var value = new Array(22).join("2"),
            result = encoding.encode(value, 300, 100),
            expectedResult = generateResult(value,
                {quietZoneLength:  encoding.options.quietZoneLength, checkCharacters: ["SHIFT0", "B"]});

        ok(comparePatterns(result.pattern, expectedResult));
    });

    test("test invalid character error", function() {
        var thrownError = false;
        try{
            encoding.encode("aAAST*", 300, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });


    test("test insufficied width error", function() {
        var value = "00000000",
            width = 84,
            thrownError = false;

        try{
            encoding.encode(value, width, 100);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    test("test insufficied height error", function() {
        var value = "00000",
            width = 84,
            height = 20,
            thrownError = false;

        try{
            encoding.encode(value, width, height);
        }
        catch (ex){
            thrownError = true;
        }
        ok(thrownError);
    });

    function fixed(value, length){
        return parseFloat(value.toFixed(length));
    }

    test("test base unit calculation", function() {
        var width = 200,
            height = 100,
            value = "HI345678",
            quietZoneLength = encoding.options.quietZoneLength,
            result,
            expectedResult = 1.6;

            result = encoding.encode(value, width, height).baseUnit;
            equal(fixed(result, 1), expectedResult);
    });
})();
