(function($, undefined) {

var kendo = window.kendo,
    extend = $.extend,
    Editor = kendo.ui.editor,
    EditorUtils = Editor.EditorUtils,
    dom = Editor.Dom,
    registerTool = EditorUtils.registerTool,
    ToolTemplate = Editor.ToolTemplate,
    RangeUtils = Editor.RangeUtils,
    Command = Editor.Command,
    keys = kendo.keys,
    INSERTIMAGE = "Insert Image",
    KEDITORIMAGEURL = "#k-editor-image-url",
    KEDITORIMAGETITLE = "#k-editor-image-title";

var ImageCommand = Command.extend({
    init: function(options) {
        var that = this;
        Command.fn.init.call(that, options);

        that.async = true;
        that.attributes = {};
    },

    insertImage: function(img, range) {
        var attributes = this.attributes;
        if (attributes.src && attributes.src != "http://") {
            if (!img) {
                img = dom.create(RangeUtils.documentFromRange(range), "img", attributes);
                img.onload = img.onerror = function () {
                        img.removeAttribute("complete");
                        img.removeAttribute("width");
                        img.removeAttribute("height");
                    };

                range.deleteContents();
                range.insertNode(img);
                range.setStartAfter(img);
                range.setEndAfter(img);
                RangeUtils.selectRange(range);
                return true;
            } else {
                dom.attr(img, attributes);
            }
        }

        return false;
    },

    redo: function () {
        var that = this,
            range = that.lockRange();

        if (!that.insertImage(RangeUtils.image(range), range)) {
            that.releaseRange(range);
        }
    },

    exec: function () {
        var that = this,
            range = that.lockRange(),
            applied = false,
            img = RangeUtils.image(range),
            windowContent, dialog;

        function apply(e) {
            that.attributes = {
                src: $(KEDITORIMAGEURL, dialog.element).val(),
                alt: $(KEDITORIMAGETITLE, dialog.element).val()
            };

            applied = that.insertImage(img, range);

            close(e);

            if (that.change) {
                that.change();
            }
        }

        function close(e) {
            e.preventDefault();
            dialog.destroy();

            dom.windowFromDocument(RangeUtils.documentFromRange(range)).focus();
            if (!applied) {
                that.releaseRange(range);
            }
        }

        function keyDown(e) {
            if (e.keyCode == keys.ENTER) {
                apply(e);
            } else if (e.keyCode == keys.ESC) {
                close(e);
            }
        }

        //var fileBrowser = that.editor.fileBrowser;
        //var showBrowser = fileBrowser && fileBrowser.selectUrl !== undefined;

        windowContent =
            '<div class="k-editor-dialog">' +
                '<ol>' +
                    '<li class="k-form-text-row"><label for="k-editor-image-url">Web address</label><input type="text" class="k-input" id="k-editor-image-url"/></li>' +
                    '<li class="k-form-text-row"><label for="k-editor-image-title">Tooltip</label><input type="text" class="k-input" id="k-editor-image-title"/></li>' +
                '</ol>' +
                '<div class="k-button-wrapper">' +
                    '<button class="k-dialog-insert k-button">Insert</button>' +
                    '&nbsp;or&nbsp;' +
                    '<a href="#" class="k-dialog-close k-link">Close</a>' +
                '</div>' +
            '</div>';

        dialog = $(windowContent)
                .appendTo(document.body)
                .kendoWindow(extend({}, that.editor.options.dialogOptions, {
                    title: INSERTIMAGE,
                    close: close,
                    activate: function() {
                        //if (showBrowser) {
                            //new $t.imageBrowser(
                                //$(this).find(".k-image-browser"),
                                //extend(fileBrowser, {
                                    //apply: apply,
                                    //element: that.editor.element,
                                    //messages: that.editor.options.messages
                                //}));
                        //}
                    }
                }))
                .hide()
                .find(".k-dialog-insert").click(apply).end()
                .find(".k-dialog-close").click(close).end()
                .find(".k-form-text-row input").keydown(keyDown).end()
                //.toggleClass("k-imagebrowser", showBrowser)
                // IE < 8 returns absolute url if getAttribute is not used
                .find(KEDITORIMAGEURL).val(img ? img.getAttribute("src", 2) : "http://").end()
                .find(KEDITORIMAGETITLE).val(img ? img.alt : "").end()
                .show()
                .data("kendoWindow")
                .center();

        $(KEDITORIMAGEURL, dialog.element).focus().select();
    }

});

kendo.ui.editor.ImageCommand = ImageCommand;

registerTool("insertImage", new Editor.Tool({ command: ImageCommand, template: new ToolTemplate({template: EditorUtils.buttonTemplate, title: INSERTIMAGE}) }));

})(jQuery);
