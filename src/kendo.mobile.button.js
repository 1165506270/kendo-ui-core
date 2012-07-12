(function($, undefined) {
    var kendo = window.kendo,
        mobile = kendo.mobile,
        ui = mobile.ui,
        Widget = ui.Widget,
        support = kendo.support,
        os = support.mobileOS,
        ANDROID3UP = os.android && os.flatVersion >= 300,
        MOUSECANCEL = support.mousecancel,
        MOUSEDOWN = support.mousedown,
        MOUSEMOVE = support.mousemove,
        MOUSEUP = support.mouseup,
        CLICK = "click",
        removeActiveID = 0,
        proxy = $.proxy;

    var Button = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that._wrap();
            that._style();

            that._releaseProxy = proxy(that._release, that);
            that._removeProxy = proxy(that._removeActive, that);

            that.element.bind(MOUSEUP, that._releaseProxy);
            that.element.bind(MOUSEDOWN + " " + MOUSECANCEL + " " + MOUSEUP, that._removeProxy);

            if (ANDROID3UP) {
                that.element.bind(MOUSEMOVE, function (e) {
                    if (!removeActiveID) {
                        removeActiveID = setTimeout(that._removeProxy, 500 , e);
                    }
                });
            }
        },

        events: [
        CLICK
        ],

        options: {
            name: "Button",
            icon: "",
            style: ""
        },

        _removeActive: function (e) {
            $(e.target).closest(".km-button,.km-detail").toggleClass("km-state-active", e.type == MOUSEDOWN);

            if (ANDROID3UP) {
                clearTimeout(removeActiveID);
                removeActiveID = 0;
            }
        },

        _release: function(e) {
            var that = this;
            if (e.which > 1) {
                return;
            }

            if (that.trigger(CLICK, {target: $(e.target), button: that.element})) {
                e.preventDefault();
            }
        },

        _style: function () {
            var style = this.options.style,
                element = this.element,
                styles;

            if (style) {
                styles = style.split(" ");
                $.each(styles, function () {
                    element.addClass("km-" + this);
                });
            }
        },

        _wrap: function() {
            var that = this,
                icon = that.options.icon,
                iconSpan = '<span class="km-icon km-' + icon,
                element = that.element.addClass("km-button"),
                span = element.children("span:not(.km-icon)").addClass("km-text"),
                image = element.find("img").addClass("km-image");

            if (!span[0] && element.html()) {
                span = element.wrapInner('<span class="km-text" />').children("span.km-text");
            }

            if (!image[0] && icon) {
                if (!span[0]) {
                    iconSpan += " km-notext";
                }
                element.prepend($(iconSpan + '" />'));
            }
        }
    });

    var BackButton = Button.extend({
        options: {
            name: "BackButton",
            style: "back"
        },

        init: function(element, options) {
            var that = this;
            Button.fn.init.call(that, element, options);

            if (typeof that.element.attr("href") === "undefined") {
                that.element.attr("href", "#:back");
            }
        }
    });

    var DetailButton = Button.extend({
        options: {
            name: "DetailButton",
            style: ""
        },

        init: function(element, options) {
            Button.fn.init.call(this, element, options);
        },

        _style: function () {
            var style = this.options.style + " detail",
                element = this.element;

            if (style) {
                var styles = style.split(" ");
                $.each(styles, function () {
                    element.addClass("km-" + this);
                });
            }
        },

        _wrap: function() {
            var that = this,
                icon = that.options.icon,
                iconSpan = '<span class="km-icon km-' + icon,
                element = that.element,
                span = element.children("span"),
                image = element.find("img").addClass("km-image");

            if (!image[0] && icon) {
                if (!span[0]) {
                    iconSpan += " km-notext";
                }
                element.prepend($(iconSpan + '" />'));
            }
        }

    });

    ui.plugin(Button);
    ui.plugin(BackButton);
    ui.plugin(DetailButton);
})(jQuery);
