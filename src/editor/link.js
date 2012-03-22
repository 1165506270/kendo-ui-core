(function($, undefined) {

var kendo = window.kendo,
    Class = kendo.Class,
    extend = $.extend,
    Editor = kendo.ui.editor,
    dom = Editor.Dom,
    RangeUtils = Editor.RangeUtils,
    EditorUtils = Editor.EditorUtils,
    Command = Editor.Command,
    Tool = Editor.Tool,
    ToolTemplate = Editor.ToolTemplate,
    InlineFormatter = Editor.InlineFormatter,
    InlineFormatFinder = Editor.InlineFormatFinder,
    textNodes = RangeUtils.textNodes,
    registerTool = Editor.EditorUtils.registerTool;

var LinkFormatFinder = Class.extend({
    findSuitable: function (sourceNode) {
        return dom.parentOfType(sourceNode, ['a']);
    }
});

var LinkFormatter = Class.extend({
    init: function() {
        this.finder = new LinkFormatFinder();
    },

    apply: function (range, attributes) {
        var nodes = textNodes(range);
        if (attributes.innerHTML != undefined) {
            var markers = RangeUtils.getMarkers(range);
            var document = RangeUtils.documentFromRange(range);
            range.deleteContents();
            var a = dom.create(document, 'a', attributes);
            range.insertNode(a);

            if (markers.length > 1) {
                dom.insertAfter(markers[markers.length - 1], a);
                dom.insertAfter(markers[1], a);
                dom[nodes.length > 0 ? 'insertBefore' : 'insertAfter'](markers[0], a);
            }
        } else {
            var formatter = new InlineFormatter([{ tags: ['a']}], attributes);
            formatter.finder = this.finder;
            formatter.apply(nodes);
        }
    }
});

var UnlinkCommand = Command.extend({
    init: function(options) {
        options.formatter = /** @ignore */ {
            toggle : function(range) {
                new InlineFormatter([{ tags: ['a']}]).remove(textNodes(range));
            }
        };
        this.options = options;
        Command.fn.init.call(this, options);
    }
});

var LinkCommand = Command.extend({
    init: function(options) {
        var cmd = this;
        cmd.options = options;
        Command.fn.init.call(cmd, options);
        cmd.attributes = null;
        cmd.async = true;
        cmd.formatter = new LinkFormatter();
    },

    exec: function () {
        var range = this.getRange();

        var collapsed = range.collapsed;

        range = this.lockRange(true);

        var nodes = textNodes(range);

        var initialText = null;

        var self = this;

        function apply(e) {
            var href = $('#k-editor-link-url', dialog.element).val();

            if (href && href != 'http://') {
                self.attributes = { href: href };

                var title = $('#k-editor-link-title', dialog.element).val();
                if (title)
                    self.attributes.title = title;

                var text = $('#k-editor-link-text', dialog.element).val();
                if (text !== initialText)
                    self.attributes.innerHTML = text || href;

                var target = $('#k-editor-link-target', dialog.element).is(':checked');
                if (target)
                    self.attributes.target = '_blank';

                self.formatter.apply(range, self.attributes);
            }
            close(e);
            if (self.change)
                self.change();
        }

        function close(e) {
            e.preventDefault();
            dialog.destroy();

            dom.windowFromDocument(RangeUtils.documentFromRange(range)).focus();

            self.releaseRange(range);
        }

        var a = nodes.length ? self.formatter.finder.findSuitable(nodes[0]) : null;

        var shouldShowText = nodes.length <= 1 || (nodes.length == 2 && collapsed);

        var windowContent =
            '<div class="k-editor-dialog">' +
                '<ol>' +
                    '<li class="k-form-text-row"><label for="k-editor-link-url">Web address</label><input type="text" class="k-input" id="k-editor-link-url"/></li>' +
                    (shouldShowText ? '<li class="k-form-text-row"><label for="k-editor-link-text">Text</label><input type="text" class="k-input" id="k-editor-link-text"/></li>' : '') +
                    '<li class="k-form-text-row"><label for="k-editor-link-title">Tooltip</label><input type="text" class="k-input" id="k-editor-link-title"/></li>' +
                    '<li class="k-form-checkbox-row"><input type="checkbox" id="k-editor-link-target"/><label for="k-editor-link-target">Open link in new window</label></li>' +
                '</ol>' +
                '<div class="k-button-wrapper">' +
                    '<button class="k-dialog-insert k-button">Insert</button>' +
                    '&nbsp;or&nbsp;' +
                    '<a href="#" class="k-dialog-close k-link">Close</a>' +
                '</div>' +
            '</div>';

        var dialog = $(windowContent).appendTo(document.body).kendoWindow($.extend({}, this.editor.options.dialogOptions, {
            title: "Insert link",
            close: close
        }))
            .hide()
            .find('.k-dialog-insert').click(apply).end()
            .find('.k-dialog-close').click(close).end()
            .find('.k-form-text-row input').keydown(function (e) {
                if (e.keyCode == 13)
                    apply(e);
                else if (e.keyCode == 27)
                    close(e);
            }).end()
            // IE < 8 returns absolute url if getAttribute is not used
            .find('#k-editor-link-url').val(a ? a.getAttribute('href', 2) : 'http://').end()
            .find('#k-editor-link-text').val(nodes.length > 0 ? (nodes.length == 1 ? nodes[0].nodeValue : nodes[0].nodeValue + nodes[1].nodeValue) : '').end()
            .find('#k-editor-link-title').val(a ? a.title : '').end()
            .find('#k-editor-link-target').attr('checked', a ? a.target == '_blank' : false).end()
            .show()
            .data('kendoWindow')
            .center();

        if (shouldShowText && nodes.length > 0)
            initialText = $('#k-editor-link-text', dialog.element).val();

        $('#k-editor-link-url', dialog.element).focus().select();
    },

    redo: function () {
        var that = this,
            range = that.lockRange(true);

        that.formatter.apply(range, that.attributes);
        that.releaseRange(range);
    }

});

var UnlinkTool = Tool.extend({
    init: function(options) {
        this.options = options;
        this.finder = new InlineFormatFinder([{tags:['a']}]);

        Tool.fn.init.call(this, $.extend(options, {command:UnlinkCommand}));
    },

    initialize: function($ui) {
        $ui.attr('unselectable', 'on')
           .addClass('k-state-disabled');
    },

    update: function ($ui, nodes) {
        $ui.toggleClass('k-state-disabled', !this.finder.isFormatted(nodes))
            .removeClass('k-state-hover');
    }
});

extend(kendo.ui.editor, {
    LinkFormatFinder: LinkFormatFinder,
    LinkFormatter: LinkFormatter,
    UnlinkCommand: UnlinkCommand,
    LinkCommand: LinkCommand,
    UnlinkTool: UnlinkTool
});

registerTool("createLink", new Tool({ key: 'K', ctrl: true, command: LinkCommand, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Create Link"})}));
registerTool("unlink", new UnlinkTool({ key: 'K', ctrl: true, shift: true, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: "Remove Link"})}));

})(jQuery);
