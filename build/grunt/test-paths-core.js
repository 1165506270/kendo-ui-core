exports.beforeTestFiles = [
    { pattern: 'styles/**/*.*', watched: true, included: false },
    { pattern: 'tests/router/sandbox.html', watched: true, included: false },
    { pattern: 'tests/window/blank.html', watched: true, included: false },
    { pattern: 'tests/**/*-fixture.html' }
];

exports.afterTestFiles = [
    'src/kendo.timezones.js',
    'src/cultures/kendo.culture.de-DE.js',
    'src/cultures/kendo.culture.bg-BG.js',
    'src/cultures/kendo.culture.en-ZA.js',
    "src/cultures/kendo.culture.es-ES.js",
    'tests/kendo-test-helpers.js',
    'tests/**/test-helper.js',
    'build/less-js/dist/less-1.6.0.min.js'
];

exports.compiledStyleSheets = [
    'dist/styles/web/kendo.common.core.min.css',
    'dist/styles/mobile/kendo.mobile.all.min.css',
    'dist/styles/web/kendo.rtl.css'
];

exports.ciFiles = [ 'dist/js/kendo.ui.core.min.js' ];
