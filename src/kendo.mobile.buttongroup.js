(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.mobile.ui,
        Widget = ui.Widget,
        ACTIVE = "km-state-active",
        SELECT = "select",
        SELECTOR = "li:not(." + ACTIVE +")",
        data = kendo.data,
        MOUSEDOWN = kendo.support.touch ? "touchstart" : "mousedown";

    var ButtonGroup = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            that.element.addClass("km-buttongroup")
                .delegate(SELECTOR, MOUSEDOWN, $.proxy(that._mousedown, that))
                .find("li").each(that._button);

            that.select(that.options.index);
        },

        events: [
            SELECT
        ],

        options: {
            name: "ButtonGroup",
            index: -1
        },

        current: function() {
            return this.element.find("." + ACTIVE);
        },

        select: function (li) {
            var that = this,
                index = -1;

            if (li === undefined || li === -1) {
                return;
            }

            that.current().removeClass(ACTIVE);

            if (typeof li === "number") {
                index = li;
                li = $(that.element[0].children[li]);
            } else if (li.nodeType) {
                li = $(li);
                index = li.index();
            }

            li.addClass(ACTIVE);
            that.selectedIndex = index;
        },

        _button: function() {
            var button = $(this).addClass("km-button"),
                icon = data(button, "icon"),
                span = button.children("span"),
                image = button.find("img").addClass("km-image");

            if (!span[0]) {
                span = button.wrapInner("<span/>").children("span");
            }

            span.addClass("km-text");

            if (!image[0] && icon) {
                button.prepend($('<span class="km-icon km-' + icon + '"/>'));
            }
        },

        _mousedown: function(e) {
            if (e.which > 1) {
                return;
            }

            var that = this;
            that.select(e.currentTarget);
            that.trigger(SELECT);
        }
    });

    ui.plugin(ButtonGroup);
})(jQuery);
