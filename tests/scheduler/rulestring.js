(function() {
    module("RRule Serialize");

    var parse = kendo.recurrence.rule.parse,
        serialize = kendo.recurrence.rule.serialize;

    test("Serialize method returns string with freq", function() {
        var rule = parse("FREQ=daily");

        equal(serialize(rule), "FREQ=DAILY;WKST=SU");
    });

    test("Serialize method returns string with freq and interval", function() {
        var rule = parse("FREQ=daily;Interval=2");

        equal(serialize(rule), "FREQ=DAILY;INTERVAL=2;WKST=SU");
    });

    test("Serialize method returns string with freq and count", function() {
        var rule = parse("FREQ=daily;COUNT=1");

        equal(serialize(rule), "FREQ=DAILY;COUNT=1;WKST=SU");
    });

    test("Serialize method returns string with freq and until", function() {
        var rule = parse("FREQ=daily;UNTIL=19730429T070000Z");

        equal(serialize(rule), "FREQ=DAILY;UNTIL=19730429T070000Z;WKST=SU");
    });

    test("Serialize method honours timezone", function() {
        var rule = parse("FREQ=daily;UNTIL=19730429T070000Z", "America/New_York");

        equal(serialize(rule, "America/New_York"), "FREQ=DAILY;UNTIL=19730429T070000Z;WKST=SU");
    });

    test("Serialize method returns string with freq and one BYMONTH value", function() {
        var rule = parse("FREQ=daily;bymonth=1");

        equal(serialize(rule), "FREQ=DAILY;BYMONTH=1;WKST=SU");
    });

    test("Serialize method returns string with freq and multiple BYMONTH values", function() {
        var rule = parse("FREQ=daily;bymonth=1, 10, 11");

        equal(serialize(rule), "FREQ=DAILY;BYMONTH=1,10,11;WKST=SU");
    });

    test("Serialize method returns string with freq and multiple BYWEEKNO values", function() {
        var rule = parse("FREQ=yearly;byweekno=1, 10, 40");

        equal(serialize(rule), "FREQ=YEARLY;BYWEEKNO=1,10,40;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYYEARDAY values", function() {
        var rule = parse("FREQ=yearly;byyearday=1, 10, 100");

        equal(serialize(rule), "FREQ=YEARLY;BYYEARDAY=1,10,100;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYMONTHDAY values", function() {
        var rule = parse("FREQ=yearly;bymonthday=1, 10");

        equal(serialize(rule), "FREQ=YEARLY;BYMONTHDAY=1,10;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYDAY values", function() {
        var rule = parse("FREQ=yearly;byday=5FR, -3TU, WE");

        equal(serialize(rule), "FREQ=YEARLY;BYDAY=-3TU,WE,5FR;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYHOUR values", function() {
        var rule = parse("FREQ=yearly;byhour=1, 10");

        equal(serialize(rule), "FREQ=YEARLY;BYHOUR=1,10;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYMINUTE values", function() {
        var rule = parse("FREQ=yearly;BYMINUTE=1, 10");

        equal(serialize(rule), "FREQ=YEARLY;BYMINUTE=1,10;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYSECOND values", function() {
        var rule = parse("FREQ=yearly;BYSECOND=1, 10");

        equal(serialize(rule), "FREQ=YEARLY;BYSECOND=1,10;WKST=SU");
    });

    test("Serialize method returns string with freq and several BYSETPOS values", function() {
        var rule = parse("FREQ=yearly;BYDAY=TU;BYSETPOS=1, 10");

        equal(serialize(rule), "FREQ=YEARLY;BYDAY=TU;BYSETPOS=1,10;WKST=SU");
    });

    test("Serialize method returns string with freq and WKST", function() {
        var rule = parse("FREQ=yearly;WKST=TU");

        equal(serialize(rule), "FREQ=YEARLY;WKST=TU");
    });

    test("Serialize method returns string of complex rule", function() {
        var rule = parse("FREQ=yearly; BYMONTH=1,6; BYWEEKNO=10, 20; BYYEARDAY=100, 200; BYMONTHDAY=10, 20; BYDAY=TU,WE,FR; BYHOUR=10, 20; BYMINUTE= 20; BYSECOND=33; BYSETPOS=20; WKST=TU");

        equal(serialize(rule), "FREQ=YEARLY;BYMONTH=1,6;BYWEEKNO=10,20;BYYEARDAY=100,200;BYMONTHDAY=10,20;BYDAY=TU,WE,FR;BYHOUR=10,20;BYMINUTE=20;BYSECOND=33;BYSETPOS=20;WKST=TU");
    });

    test("Serialize method serializes DTSTART", function() {
        var rule = parse("DTSTART:19730429T070000Z RRULE:FREQ=daily");

        equal(serialize(rule), "DTSTART:19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

    test("Serialize method serializes DTSTART with TZID", function() {
        var rule = parse("DTSTART;TZID=America/New_York:19730429T070000Z RRULE:FREQ=daily");

        equal(serialize(rule), "DTSTART;TZID=America/New_York:19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

    test("Serialize method serializes DTEND", function() {
        var rule = parse("DTEND:19730429T070000Z RRULE:FREQ=daily");

        equal(serialize(rule), "DTEND:19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

    test("Serialize method serializes DTEND with TZID", function() {
        var rule = parse("DTEND;TZID=America/New_York:19730429T070000Z RRULE:FREQ=daily");

        equal(serialize(rule), "DTEND;TZID=America/New_York:19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

    test("Serialize method serializes DTSTART with TZID plus DTEND with TZID", function() {
        var rule = parse("DTSTART;TZID=America/New_York:19730429T070000Z DTEND;TZID=America/New_York:19730429T070000Z RRULE:FREQ=daily");

        equal(serialize(rule), "DTSTART;TZID=America/New_York:19730429T070000Z DTEND;TZID=America/New_York:19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

    test("Serialize method serializes EXDATE", function() {
        var rule = parse("EXDATE:19730429T070000Z\nRRULE:FREQ=DAILY");

        equal(serialize(rule), "EXDATE:19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

    test("Serialize method serializes EXDATE with multiple exceptions", function() {
        var rule = parse("EXDATE:19730429T070000Z,19730429T070000Z,19730429T070000Z\nRRULE:FREQ=DAILY");

        equal(serialize(rule), "EXDATE:19730429T070000Z,19730429T070000Z,19730429T070000Z RRULE:FREQ=DAILY;WKST=SU");
    });

})();
