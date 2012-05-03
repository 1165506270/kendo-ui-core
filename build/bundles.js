// Imports ====================================================================
var fs = require("fs"),
    sys = require("sys"),
    path = require("path"),
    themes = require("./themes"),
    kendoBuild = require("./kendo-build"),
    kendoScripts = require("./kendo-scripts"),
    Changelog = require("./changelog"),
    GitHubApi = require("build/github-api"),
    copyDir = kendoBuild.copyDirSyncRecursive,
    processFiles = kendoBuild.processFilesRecursive,
    mkdir = kendoBuild.mkdir,
    readText = kendoBuild.readText,
    template = kendoBuild.template,
    writeText = kendoBuild.writeText,
    zip = kendoBuild.zip;

var commercialLicense = {name: "commercial", source: true};
var openSourceLicense = {name: "open-source", source: true};
var trialLicense = {name: "trial", source: false};
var betaLicense = {name: "beta", source: true};

var productionLicenses = [
    commercialLicense,
    trialLicense
];

var SUITE_STYLES = {
    "web": "web",
    "dataviz": "dataviz",
    "mobile": "mobile",
    "winjs": "web"
}

// Configuration ==============================================================
var cdnBundle = {
    name: "kendoui.cdn",
    suites: ["web", "dataviz", "mobile"],
    combinedScript: "all",
    sourceLicense: "src-license-complete.txt",
    licenses: [commercialLicense],
    eula: "eula"
};

var winjsBundle = {
    name: "kendoui.winjs",
    suites: ["winjs", "dataviz"],
    combinedScript: "winjs",
    sourceLicense: "src-license-none.txt",
    licenses: [commercialLicense],
    skipExamples: true,
    eula: "eula"
};

var bundles = [{
    name: "kendoui.complete",
    suites: ["web", "dataviz", "mobile"],
    combinedScript: "all",
    sourceLicense: "src-license-complete.txt",
    licenses: productionLicenses,
    eula: "eula",
}, {
    name: "kendoui.web",
    suites: ["web"],
    sourceLicense: "src-license-web.txt",
    licenses: productionLicenses.concat(openSourceLicense),
    eula: "eula",
}, {
    name: "kendoui.dataviz",
    suites: ["dataviz"],
    sourceLicense: "src-license-dataviz.txt",
    licenses: productionLicenses,
    eula: "eula"
}, {
    name: "kendoui.mobile",
    suites: ["mobile"],
    sourceLicense: "src-license-mobile.txt",
    licenses: productionLicenses,
    eula: "eula"
}];

var thirdPartyScripts = [
    "jquery.min.js"
];

var LATEST = "latest",
    INDEX = "index.html",
    SCRIPTS_ROOT = "src",
    STYLES_ROOT = "styles",
    DEMOS_ROOT = path.join("demos", "mvc"),
    TEMPLATES_ROOT = path.join("build", "templates"),
    SUITE_INDEX = path.join(TEMPLATES_ROOT, "suite-index.html"),
    BUNDLE_INDEX = path.join(TEMPLATES_ROOT, "bundle-index.html"),
    CONTENT_ROOT = "content",
    VIEWS_ROOT = "Views",
    LEGAL_ROOT = path.join("resources", "legal"),
    THIRD_PARTY_ROOT = "third-party",
    DROP_LOCATION = "release",
    DEPLOY_ROOT = "deploy",
    DEPLOY_SOURCE = "source",
    DEPLOY_SCRIPTS = "js",
    DEPLOY_STYLES = "styles",
    DEPLOY_CULTURES = path.join(DEPLOY_SCRIPTS, "cultures"),
    DEPLOY_EXAMPLES = "examples",
    DEPLOY_LEGAL_ROOT = "LicenseAgreements",
    DEPLOY_THIRD_PARTY_ROOT = "ThirdParty",
    DEPLOY_ONLINEEXAMPLES = "online-examples",
    ONLINE_EXAMPLES_PACKAGE = "kendoui-online-examples.zip";

    var startDate = new Date();

// Implementation ==============================================================
function clean() {
    kendoBuild.rmdirSyncRecursive(DEPLOY_ROOT);

    mkdir(DEPLOY_ROOT);
    mkdir(DROP_LOCATION);
}

function deployScripts(root, bundle, license, hasSource) {
    var scriptsDest = path.join(root, DEPLOY_SCRIPTS),
        culturesDest = path.join(root, DEPLOY_CULTURES),
        sourceRoot = path.join(root, DEPLOY_SOURCE),
        sourceDest = path.join(sourceRoot, DEPLOY_SCRIPTS),
        culturesSourceDest = path.join(sourceRoot, DEPLOY_CULTURES);

    mkdir(scriptsDest);
    mkdir(culturesDest);

    if (hasSource) {
        mkdir(sourceRoot);
        mkdir(sourceDest);
        mkdir(culturesSourceDest);
    }

    bundle.suites.forEach(function(suite) {
        var buildSuitScripts = function(dest, compress) {
            kendoScripts.buildSuiteScripts(suite, dest, license, compress);

            if (bundle.combinedScript) {
                kendoScripts.buildCombinedScript(
                    bundle.combinedScript, bundle.suites,
                    dest, license, compress);
            }
        };

        buildSuitScripts(scriptsDest, true);

        if (hasSource) {
            buildSuitScripts(sourceDest, false);
        }
    });

    kendoScripts.buildCultures(scriptsDest, license, true);

    if (hasSource) {
        kendoScripts.buildCultures(sourceDest, license, false);
    }
}

function deployStyles(root, bundle, license, copySource) {
    var stylesDest = path.join(root, DEPLOY_STYLES),
        sourceRoot = path.join(root, DEPLOY_SOURCE),
        sourceDest = path.join(sourceRoot, DEPLOY_STYLES);

    if (copySource) {
        mkdir(sourceRoot);
        mkdir(sourceDest);
    }

    bundle.suites.forEach(function(suite) {
        var suiteStyles = path.join(STYLES_ROOT, SUITE_STYLES[suite]);
        if (path.existsSync(suiteStyles)) {
            kendoBuild.deployStyles(suiteStyles, stylesDest, license, true);

            if (copySource) {
                kendoBuild.deployStyles(suiteStyles, sourceDest, license, false);
            }
        }
    });
}

function deployLicenses(root, bundle) {
    var deployLegalRoot = path.join(root, DEPLOY_LEGAL_ROOT),
        deployThirdPartyRoot = path.join(root, DEPLOY_LEGAL_ROOT, DEPLOY_THIRD_PARTY_ROOT);

    kendoBuild.mkdir(deployLegalRoot);
    kendoBuild.mkdir(deployThirdPartyRoot);

    copyDir(
        path.join(LEGAL_ROOT, bundle.eula),
        deployLegalRoot
    );

    copyDir(
        path.join(LEGAL_ROOT, THIRD_PARTY_ROOT),
        deployThirdPartyRoot
    );
}

function deployExamples(root, bundle) {
    var examplesRoot = path.join(root, DEPLOY_EXAMPLES),
        viewsRoot = path.join(DEMOS_ROOT, VIEWS_ROOT),
        suiteIndexTemplate = template(readText(SUITE_INDEX)),
        bundleIndexTemplate = template(readText(BUNDLE_INDEX)),
        bundleIndex = bundleIndexTemplate(bundle);

    kendoBuild.mkdir(examplesRoot);

    writeText(path.join(examplesRoot, INDEX), bundleIndex)

    copyDir(
        path.join(DEMOS_ROOT, CONTENT_ROOT),
        path.join(examplesRoot, CONTENT_ROOT)
    );

    function shouldSkip(widget) {
        var offline = widget.offline || {};
        return offline.skipAlways || offline.skipHtml;
    }

    bundle.suites.forEach(function(suite) {
        var navigationFile = path.join(DEMOS_ROOT, "App_Data", suite + ".nav.json"),
            exampleTemplate = template(readText(path.join(TEMPLATES_ROOT, suite + "-example.html"))),
            navigationData = readText(navigationFile),
            navigation = JSON.parse(navigationData),
            suiteDest = path.join(examplesRoot, suite),
            suiteIndex = suiteIndexTemplate(navigation);

        kendoBuild.mkdir(suiteDest);
        writeText(path.join(suiteDest, INDEX), suiteIndex)

        for (var category in navigation) {
            for (var widgetIx = 0, widgets = navigation[category]; widgetIx < widgets.length; widgetIx++) {
                if (shouldSkip(widgets[widgetIx])) {
                    continue;
                }

                for (var exampleIx = 0, examples = widgets[widgetIx].items; exampleIx < examples.length; exampleIx++) {
                    var example = examples[exampleIx],
                    viewName = example.url.replace(".html", ".cshtml"),
                    fileName = path.join(viewsRoot, suite, viewName),
                    outputName = path.join(suiteDest, example.url),
                    exampleBody = readText(fileName);

                    if (shouldSkip(example)) {
                        continue;
                    }

                    exampleBody = exampleBody
                        .replace(/@section \w+ {(.|\n|\r)+?}/gi, "")
                        .replace(/@{(.|\n|\r)+?}/gi, "")
                        .replace(/@@/gi, "");

                    kendoBuild.mkdir(path.dirname(outputName));
                    writeText(outputName, exampleTemplate({
                        body: exampleBody,
                        title: example.text
                    }));
                }
            }
        }
    });
}

function deployThirdPartyScripts(outputRoot) {
    thirdPartyScripts.forEach(function(scriptName) {
        kendoBuild.copyFileSync(
            path.join(SCRIPTS_ROOT, scriptName),
            path.join(outputRoot, DEPLOY_SCRIPTS, scriptName)
        );
    });
}

var changelog = new Changelog();

function fetchChangelog(callback) {
    if (changelog.fetched) {
        callback();
        return;
    }

    var github = new GitHubApi({
        version: "3.0.0"
    });

    github.authenticate({
        type: "oauth",
        token: "5dd646a3d9d8d5fb69fe59c163fc84b76fc67fcb"
    });

    github.issues.getAllMilestones({
        user: "telerik",
        repo: "kendo"
    }, function(err, res) {
        var ver = JSON.parse(kendoBuild.readText("VERSION"));

        var milestones = changelog.filterMilestones(res, ver);

        function processMilestone(callback) {
            if (milestones.length == 0) {
                changelog.fetched = true;
                callback();
            } else {
                var milestone = milestones.pop();

                function queryIssues(page) {
                    github.issues.repoIssues({
                        user: "telerik",
                        repo: "kendo",
                        state: "closed",
                        milestone: milestone.number,
                        per_page: 100,
                        page: page
                    }, function(err, res) {
                        changelog.groupIssues(res);

                        if (res.length == 100) {
                            queryIssues(page + 1);
                        } else {
                            processMilestone(callback);
                        }
                    });
                }

                queryIssues(1);
            }
        }

        processMilestone(callback);
    });
}

function deployChangelog(root, bundle, version) {
    var changelogTemplate = kendoBuild.readText(path.join("build", "templates", "changelog.html")),
        outputFile = path.join(root, "changelog.html");

    changelogTemplate = kendoBuild.template(changelogTemplate);

    kendoBuild.writeText(outputFile, changelogTemplate({
        version: version,
        issues: changelog.groupedIssues,
        suites: bundle.suites
    }));
}

function buildBundle(bundle, version, success) {
    fetchChangelog(function() {
        var name = bundle.name,
            zips = 0,
            licenseTemplate = template(readText(path.join(LEGAL_ROOT, bundle.sourceLicense)));

        bundle.licenses.forEach(function(license) {
            var licenseName = license.name,
                hasSource = license.source,
                deployName = name + "." + version + "." + licenseName,
                root = path.join(DEPLOY_ROOT, name + "." + licenseName),
                packageName = path.join(DROP_LOCATION, deployName + ".zip"),
                srcLicense = licenseTemplate({ version: version, year: startDate.getFullYear() }),
                packageNameLatest = packageName.replace(version, LATEST);

            console.log("Building " + deployName);
            mkdir(root);

            console.log("Deploying scripts");
            deployScripts(root, bundle, srcLicense, hasSource);
            deployThirdPartyScripts(root);

            console.log("Deploying styles");
            deployStyles(root, bundle, srcLicense, hasSource);

            console.log("Deploying licenses");
            deployLicenses(root, bundle);

            if (!bundle.skipExamples) {
                console.log("Deploying examples");
                deployExamples(root, bundle);
            }

            console.log("Deploying changelog");
            deployChangelog(root, bundle, version);

            zip(packageName, root, function() {
                kendoBuild.copyFileSync(packageName, packageNameLatest);

                if (success && ++zips === bundle.licenses.length) {
                    success();
                }
            });
        });
    });
}

function buildAllBundles(version, success, bundleIx) {
    bundleIx = bundleIx || 0;

    if (bundleIx < bundles.length) {
        buildBundle(bundles[bundleIx], version, function() {
            buildAllBundles(version, success, ++bundleIx);
        });
    } else {
        if (success) {
            success();
        }
    }
}

// Exports =====================================================================
exports.buildBundle = buildBundle;
exports.buildAllBundles = buildAllBundles;
exports.cdnBundle = cdnBundle;
exports.winjsBundle = winjsBundle;
exports.clean = clean;
