(function($, undefined) {
    var kendo = window.kendo,
        scrollTo = window.scrollTo,
        history = kendo.history,
        support = kendo.support,
        roleSelector = kendo.roleSelector,
        attr = kendo.attr,

        OS = support.mobileOS,
        OS_NAME, OS_NAME_CLASS, OS_CSS_CLASS,

        MOBILE_UA = {
            ios: "iPhone OS 4_3",
            android: "Android 2.3.3",
            blackberry: "PlayBook Version/7.2.0.0",
            meego: "MeeGo NokiaBrowser/8.5.0"
        },

        meta = '<meta name="apple-mobile-web-app-capable" content="yes" /> ' +
               '<meta name="apple-mobile-web-app-status-bar-style" content="black" /> ' +
               '<meta content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width" name="viewport" />',

        iconMeta = kendo.template('<link rel="apple-touch-icon' + (support.mobileOS.android ? '-precomposed' : '') + '" # if(data.size) { # sizes="#=data.size#" #}# href="#=data.icon#" />', {usedWithBlock: false}),

        toRoleSelector = function (string) { return string.replace(/(\S+)/g, "[" + attr("role") + "=$1],"); },
        buttonRolesSelector = toRoleSelector("button backbutton detailbutton listview-link"),
        linkRolesSelector = toRoleSelector("tab"),

        ORIENTATIONEVENT = window.orientationchange ? "orientationchange" : "resize",
        HIDEBAR = OS.device == "iphone" || OS.device == "ipod",
        BARCOMPENSATION = 60,

        HREF = "href",
        EXTERNAL = "external",
        DUMMY_HREF = "#!",
        BODY_REGEX = /<body[^>]*>(([\u000a\u000d\u2028\u2029]|.)*)<\/body>/i,

        WINDOW = $(window),
        HEAD = $("head"),
        CAPTURE_EVENTS = ["touchstart", "touchend", "touchmove", "mousedown", "mousemove", "mouseup"],
        BACK = "#:back",
        proxy = $.proxy;

    function appLinkClick(e) {
        var rel = $(e.currentTarget).data(kendo.ns + "rel");

        if(rel != EXTERNAL) {
            e.preventDefault();
        }
    }

    function getOrientationClass() {
        return Math.abs(window.orientation) / 90 ? "km-horizontal" : "km-vertical";
    }

    /**
    * @name kendo.mobile.Application.Description
    * @section
    *
    * <p>The Kendo mobile <strong>Application</strong> provides the necessary tools for building native-looking web based mobile applications.</p>
    *
    * <h3>Getting Started</h3>
    * <p>The simplest mobile <strong>Application</strong> consists of a single mobile <strong>View</strong>. </p>
    *
    * @exampleTitle Hello World mobile Application
    * @example
    * <body>
    *    <div data-role="view">
    *      <div data-role="header">Header</div>
    *      Hello world!
    *      <div data-role="footer">Footer</div>
    *    </div>
    *
    *    <script>
    *    var app = new kendo.mobile.Application(); //document.body is used by default
    *    </script>
    * </body>
    *
    * @section
    * <h3>Mobile Views</h3>
    *
    * <p>The mobile <strong>Application</strong> consists of a single HTML page with one or more mobile Views, linked with navigational widgets (Buttons, TabStrip, etc.).
    * A mobile <strong>View</strong> is considered each child of the application element (<code>&lt;body&gt;</code> by default) that is decorated with <code>data-role="view"</code>.
    *
    * @section
    *
    * <h3>Navigation</h3>
    * <p>When initialized, the mobile <strong>Application</strong> modifies the kendo mobile widgets' behavior so that they navigate between <strong>Views</strong> when pressed.
    * The navigation <strong>Widget</strong>'s <code>href</code> attribute specifies the <strong>View</strong> id to navigate to.</p>
    *
    * @exampleTitle Views linked with mobile Buttons
    * @example
    * <div data-role="view" id="foo">Foo <a href="#bar" data-role="button">Go to Bar</a></div>
    * <div data-role="view" id="bar">Bar <a href="#foo" data-role="button">Go to Foo</a></div>
    *
    * @section
    *
    * <p>By default, all navigational widgets treat the links' hrefs as mobile views. This behavior can be overriden by setting <code>data-rel="external"</code> attribute to the link element.  </p>
    *
    * @exampleTitle External links
    * @example
    * <a href="http://kendoui.com/" data-rel="external">Visit KendoUI</a>
    *
    * @section
    *
    * <h3>View Transitions</h3>
    * <p><strong>View</strong> transitions are defined by setting a <code>data-transition</code> attribute to the <strong>View</strong> DOM element.
    * A default <strong>View</strong> transition may be set using the <code>transition</code> parameter in the options parameter of the <strong>Application</strong> constructor.
    * The following transitions are supported:</p>
    *
    * <h4>slide</h4>
    * <p> This is the default iOS <strong>View</strong> transition. Old <strong>View</strong> content slides to the left and the new <strong>View</strong> content slides in its place.
    * Headers and footers (if present) use the <strong>fade</strong> transition. </p>
    *
    * <h4>zoom</h4>
    * <p>The new <strong>View</strong> (along with its header and footer) content zooms over the previous <strong>View</strong>. The old <strong>View</strong> content fades out. Suitable for displaying dialogs.</p>
    *
    * <h4>fade</h4>
    * <p>The new <strong>View</strong> (along with its header and footer) content fades from the center of the screen, on top of the previous <strong>View</strong> content.</p>
    *
    * <h4>overlay</h4>
    * <p>The new <strong>View</strong> content slides on top of the previous <strong>View</strong>. Unlike the <code>slide</code> transition,
    * the previous <strong>View</strong> stays "under" the new one, and the headers / footers do not transition separately. </p>
    * <p>The transition direction can be specified by using <code>overlay:(direction)</code>.
    * Supported directions are <code>down</code>, <code>left</code>, <code>up</code> and <code>right</code>. By default, the direction is <code>left</code>.</p>
    *
    * @exampleTitle Views with Transitions
    * @example
    * <div data-role="view" id="foo" data-transition="slide">Foo <a href="#bar" data-role="button">Go to Bar</a></div>
    * <div data-role="view" id="bar" data-transition="overlay:up">Bar <a href="#foo" data-role="button">Go to Foo</a></div>
    *
    * @section
    *
    * <p>When a <strong>View</strong> transitions to the <strong>View</strong> displayed before it (foo → bar → foo), this is considered a <strong>back</strong> navigation.
    * In this case, the animation of the current <strong>View</strong> is applied in reverse.
    * For instance, navigating with slide animation from <code>foo</code> to <code>bar</code>, then back to <code>foo</code>
    * would cause the <code>foo</code> <strong>View</strong> to slide from the right side of the screen. </p>
    *
    * @section
    *
    * <h3>Remote Views</h3>
    *
    * <p>The Kendo mobile <strong>Application</strong> can load <strong>Views</strong> remotely by using AJAX. If the navigational widget URL does not start with a hash (#),
    * the application considers the <strong>View</strong> to be remote, and issues an AJAX request to the provided URL.
    * The <strong>View</strong> content (the first element with <code>data-role="view"</code>) are extracted from the AJAX response and appended into the <strong>Application</strong> element.
    * Once the remote <strong>View</strong> is fetched, no additional roundtrips to the server occur when the <strong>View</strong> is displayed. </p>
    *
    * <p>The remote view request will also append (but not initialize) any <strong>additional views</strong> found in the AJAX
    * response. <strong>Inline style</strong> elements, <strong>inline script</strong> elements, and <strong>mobile layout</strong> definitions will also be evaluated and appended to the
    * application. The elements must be available in the root of the response, or nested inside the <strong>body</strong> element.
    * Scripts and styles from the <strong>head</strong> element (if present) will <strong>not</strong> be evaluated.</p>
    *
    * @exampleTitle Remote View
    * @example
    * <!-- foo.html -->
    * <div data-role="view">Foo <a href="bar.html" data-role="button">Go to Bar</a></div>
    *
    * <!-- bar.html -->
    * <div data-role="view">Bar</div>
    *
    * @section
    * <h3> Initial View</h3>
    *
    * <p> The <strong>Application</strong> provides a way to specify the initial view to show. The initial view can be set by
    * passing the view id in the options parameter of the Application's constructor:
    * @exampleTitle Define initial view
    * @example
    * <script>
    *      new kendo.mobile.Application($(document.body), {
    *          initial: "ViewID"
    *      });
    * </script>

    * @section
    *
    * <h3>Web Clip Icons</h3>
    *
    * <p>The mobile devices can create a bookmark with a custom icon, placed on the Home screen. Users can use the shortcut to open that web page later.</p>
    *
    * @exampleTitle Define web clip icon
    * @example
    * <script>
    *      new kendo.mobile.Application($(document.body), {
    *          icon: "URL to a web clip icon"
    *      });
    * </script>
    *
    * @section
    * <p>You can also define web clip icons with different sizes. Check this <a href="https://developer.apple.com/library/ios/#documentation/userexperience/conceptual/mobilehig/IconsImages/IconsImages.html#//apple_ref/doc/uid/TP40006556-CH14-SW11">link</a>
    * for more information.</p>
    *
    * @exampleTitle Define multiple web clip icons
    * @example
    * <script>
    *      new kendo.mobile.Application($(document.body), {
    *          icon: {
    *            "72x72" : "URL to a 72 x 72 pixels web clip icon",
    *            "114x114" : "URL to a 114 x 114 pixels web clip icon"
    *          }
    *      });
    * </script>
    *
    * @section
    * <h3>Force platform styles</h3>
    *
    * <p> The <strong>Application</strong> provides a way to force a specific platform look on your application upon init by
    * passing the OS name in the options parameter of the Application's constructor:
    * @exampleTitle Force iOS look
    * @example
    * <script>
    *      new kendo.mobile.Application($(document.body), {
    *          platform: "ios"
    *      });
    * </script>
    *
    * Additionally, if you want to specify os version, you can pass the entire kendo.support.mobileOS object that is expected by Kendo UI Mobile.
    * This is more complex, but allows fine grained tuning of the application look and behavior. A sample object initialization is like this:
    * @exampleTitle Force iOS 5 look
    * @example
    * <script>
    *      new kendo.mobile.Application($(document.body), {
    *          platform: {
    *                         device: "ipad",       // Mobile device, can be "ipad", "iphone", "ipod", "android" "fire", "blackberry", "meego"
    *                         name: "ios",          // Mobile OS, can be "ios", "android", "blackberry", "meego"
    *                         ios: true,            // Mobile OS name as a flag
    *                         majorVersion: 5,      // Major OS version
    *                         minorVersion: "0.0",  // Minor OS versions
    *                         flatVersion: "500",   // Flat OS version for easier comparison
    *                         appMode: false        // Whether running in browser or in AppMode/PhoneGap/Titanium.
    *                    }
    *      });
    * </script>
    */
    var Application = kendo.Observable.extend(/** @lends kendo.mobile.Application.prototype */{
        /**
         * @constructs
         * @extends kendo.Observable
         * @param {DomElement} element DOM element. By default, the body element is used.
         * @param {Object} options Configuration options.
         * @option {String} [layout] <> The id of the default Application Layout.
         * @option {String} [initial] <> The id of the initial mobilie View to display.
         * _example
         * <script>
         *      new kendo.mobile.Application($(document.body), {
         *          initial: "ViewID"
         *      });
         * </script>
         * @option {String} [loading] <Loading...> The text displayed in the loading popup. Setting this value to false will disable the loading popup.
         * @option {Boolean} [hideAddressBar] <true> Whether to hide the browser address bar.
         * _example
         * <div data-role="view">Bar</div>
         *
         * <div data-role="layout" data-id="foo">
         *   <div data-role="header">Header</div>
         * </div>
         *
         * <script>
         *      new kendo.mobile.Application($(document.body), { layout: "foo" });
         * </script>
         * @option {String} [transition] <> The default View transition.
         * _example
         * <script>
         *      new kendo.mobile.Application($(document.body), { transition: "slide" });
         * </script>
         * @option {String} [platform] <> Which platform look to force on the application. Can be one of "ios", "android", "blackberry".
         * _example
         * <script>
         *      new kendo.mobile.Application($(document.body), {
         *          platform: "android"
         *      });
         * </script>
         */
        init: function(element, options) {
            var that = this;

            that.layouts = {};
            that.options = $.extend({ hideAddressBar: true, transition: "" }, options);
            kendo.Observable.fn.init.call(that, that.options);
            that.element = element ? $(element) : $(document.body);

            $(function(){
                that._setupPlatform();
                that._attachHideBarHandlers();
                that._setupElementClass();
                that._attachMeta();
                that._loader();
                that._setupAppLinks();
                that._setupLayouts(that.element);
                that._startHistory();
                that._attachCapture();
            });
        },

        /**
         * Navigate the local or remote view.
         * @param {String} url The id or url of the view.
         *
         * @exampleTitle Navigate to a remote view
         * @example
         * var app = new kendo.mobile.Application();
         * app.navigate("settings.html");
         *
         * @exampleTitle Navigate to a local view
         * @example
         * <div data-role="view" id="foo"> ... </div>
         *
         * <script>
         * var app = new kendo.mobile.Application();
         * app.navigate("#foo");
         * </script>
         */
        navigate: function(url, transition) {
            var that = this;
            that.transitioning = true;
            history.navigate(url, true);

            if (url === BACK) {
                return;
            }

            that._findView(url, function(view) {
                if (that.view === view) { return; }

                that.view.switchWith(view, transition, function() {
                    that.transitioning = false;
                });

                that.view = view;
            });
        },

        /**
         * Get a reference to the current view's scroller widget instance.
         * @returns {kendo.mobile.ui.Scroller} the scroller widget instance.
         */
        scroller: function() {
            return this.view.content.data("kendoScroller");
        },

        /**
         * Hide the loading animation.
         * @example
         * <script>
         *   var app = new kendo.mobile.Application();
         *   app.hideLoading();
         * </script>
         */
        hideLoading: function() {
            var that = this;
            clearTimeout(that._loading);
            that.loader.hide();
        },

        /**
         * Show the loading animation.
         * @example
         * <script>
         *   var app = new kendo.mobile.Application();
         *   app.showLoading();
         * </script>
         */
        showLoading: function() {
            var that = this;

            clearTimeout(that._loading);

            if (that.options.loading === false) {
                return;
            }

            that._loading = setTimeout(function() {
                that.loader.show();
            }, 100);
        },

        _setupAppLinks: function() {
            var that = this,
                mouseup = $.proxy(that._mouseup, that);

            this.element
                .delegate(linkRolesSelector, support.mousedown, mouseup)
                .delegate(buttonRolesSelector, support.mouseup, mouseup)
                .delegate(linkRolesSelector + buttonRolesSelector, "click", appLinkClick);
        },

        _setupPlatform: function() {
            var that = this,
                platform = that.options.platform,
                isString = typeof platform == "string";

            if (platform) {
                OS = isString ? support.detectOS(MOBILE_UA[platform]) : platform;
                support.mobileOS = OS; // reset mobileOS with custom platform
            }

            OS_NAME = !OS ? "ios" : OS.name;
            OS_NAME_CLASS = "km-" + OS_NAME;
            OS_CSS_CLASS = (OS_NAME_CLASS + (OS ? " " + OS_NAME_CLASS + OS.majorVersion : "") + (OS.appMode ? " km-app" : ""));

            that.os = OS_NAME;
        },

        _setupLayouts: function(element) {
            var that = this,
                platformAttr = kendo.ns + "platform";

            element.find(roleSelector("layout")).each(function() {
                var layout = $(this),
                    platform = layout.data(platformAttr);

                if (platform === undefined || platform === OS_NAME) {
                    that.layouts[layout.data("id")] = kendo.initWidget(layout, {}, kendo.mobile.ui);
                }
            });
        },

        _startHistory: function() {
            var that = this,
                views, historyEvents,
                initial = that.options.initial;

            views = that.element.find(roleSelector("view"));
            that.rootView = views.first();

            historyEvents = {
                change: function(e) {
                    that.navigate(e.string);
                },

                ready: function(e) {
                    var url = e.string,
                        navigateToInitial = !url && initial;

                    if (navigateToInitial) {
                        url = initial;
                    }

                    that._findView(url, function(view) {
                        views.not(view).hide();
                        view.showStart();
                        that.view = view;

                        if (navigateToInitial) {
                            history.navigate(initial, true);
                        }
                    });
                }
            };

            history.start($.extend(that.options, historyEvents));
        },

        _createView: function(element) {
            var that = this,
                layout = element.data(kendo.ns + option) || that.options.layout;

            if (layout) {
                layout = that.layouts[layout];
            }

            var view = kendo.initWidget(element, {application: this, layout: layout}, kendo.mobile.ui);

            return view;
        },

        _createRemoteView: function(url, html) {
            var that = this,
                container = $('<div />'),
                views,
                view;

            if (BODY_REGEX.test(html)) {
                html = RegExp.$1;
            }

            container[0].innerHTML = html;

            views = container.find(roleSelector("view")).hide();
            view = views.first();

            view.hide().attr(attr("url"), url);

            that._setupLayouts(container);

            that.element.append(container.find(roleSelector("layout")))
                        .append(container.find("script, style"))
                        .append(views);

            return that._createView(view);
        },

        _findView: function(url, callback) {
            var that = this,
                view,
                firstChar = url.charAt(0),
                local = firstChar === "#",
                remote = firstChar === "/",
                element;

            if (!url) {
                element = that.rootView;
            } else {
                element = that.element.find("[" + attr("url") + "='" + url + "']");

                if (!element[0] && !remote) {
                    element = that.element.find(local ? url : "#" + url);
                }
            }

            view = element.data("kendoView");

            if (view) {
                callback(view);
            } else if (element[0]) {
                callback(that._createView(element));
            } else {
                if (that._xhr) {
                    that._xhr.abort();
                }

                that.showLoading();
                that._xhr = $.get(url, function(html) {
                                callback(that._createRemoteView(url, html));
                                that.hideLoading();
                            }, 'html')
                            .fail(function() {
                                that.hideLoading();
                            });
            }
        },

        _setupElementClass: function() {
            var that = this,
                osCssClass = that.options.platform ? "km-" + that.options.platform : OS_CSS_CLASS,
                element = that.element;

            element.parent().addClass("km-root");
            element.addClass(osCssClass + " " + getOrientationClass());

            WINDOW.bind(ORIENTATIONEVENT, function(e) {
                element.removeClass("km-horizontal km-vertical")
                    .addClass(getOrientationClass());

                if (that.view) {// On desktop resize is fired rather early
                    that.view.scroller.reset();
                }
            });
        },

        _attachMeta: function() {
            var icon = this.options.icon, size;

            HEAD.prepend(meta);

            if (icon) {
                if (typeof icon === "string") {
                    icon = { "" : icon };
                }

                for(size in icon) {
                    HEAD.prepend(iconMeta({ icon: icon[size], size: size }));
                }
            }
        },

        _attachHideBarHandlers: function() {
            var that = this;

            if (OS.appMode || !that.options.hideAddressBar) {
                return;
            }

            that._initialHeight = {};
            that._lastOrientation = -1;

            if (HIDEBAR) {
                WINDOW.bind("load " + ORIENTATIONEVENT, proxy(that._hideBar, that));
            }
        },

        _hideBar: function() {
            var that = this,
                element = that.element,
                orientation = window.orientation + "",
                initialHeight = that._initialHeight,
                lastOrientation = that._lastOrientation,
                newHeight;

            if (lastOrientation === orientation) {
                return;
            }

            that._lastOrientation = orientation;

            if (!initialHeight[orientation]) {
                initialHeight[orientation] = WINDOW.height();
            }

            newHeight = initialHeight[orientation] + BARCOMPENSATION;

            if (newHeight != element.height()) {
                element.height(newHeight);
                setTimeout(window.scrollTo, 0, 0, 1);
            }
        },

        _attachCapture: function() {
            var that = this;
            that.transitioning = false;

            function capture(e) {
                if (that.transitioning) {
                    e.stopPropagation();
                }
            }

            for (var i = 0; i < CAPTURE_EVENTS.length; i ++) {
                that.element[0].addEventListener(CAPTURE_EVENTS[i], capture, true);
            }
        },

        _mouseup: function(e) {
            if (e.which > 1 || e.isDefaultPrevented()) {
                return;
            }

            var link = $(e.currentTarget),
                transition = link.data(kendo.ns + "transition"),
                rel = link.data(kendo.ns + "rel"),
                href = link.attr(HREF);


            if (rel === EXTERNAL) {
                return;
            }

            if (href && href != DUMMY_HREF) {
                // Prevent iOS address bar progress display for in app navigation
                link.attr(HREF, DUMMY_HREF);
                setTimeout(function() { link.attr(HREF, href); });

                if (rel === "actionsheet") {
                    $(href).data("kendoMobileActionSheet").openFor(link);
                } else {
                    this.navigate(href, transition);
                }
            }

        e.preventDefault();
        },

        _loader: function() {
            var that = this,
                text = that.options.loading;

            if (text === undefined) {
                text = "<h1>Loading...</h1>";
            }

            that.loader = $('<div class="km-loader"><span class="km-loading km-spin"></span>' + text + "</div>")
                            .hide()
                            .appendTo(that.element);
        }
    });

    kendo.mobile.Application = Application;
})(jQuery);
