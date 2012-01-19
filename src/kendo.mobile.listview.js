(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.mobile.ui,
        support = kendo.support,
        DataSource = kendo.data.DataSource,
        Widget = ui.Widget,
        ITEM_SELECTOR = ".km-list > li",
        proxy = $.proxy,
        GROUP_TEMPLATE = kendo.template("<li>#= this.headerTemplate(data) #<ul>#= kendo.render(this.template, data.items)#</ul></li>"),
        FUNCTION = "function",
        MOUSEDOWN = support.mousedown,
        MOUSEUP = support.mouseup,
        CLICK = "click";

    function toggleItemActiveClass(e) {
        var item = $(e.currentTarget);
        if ($(e.target).closest("a" + kendo.roleSelector("listview-link"), item)[0]) {
            item.toggleClass("km-state-active", e.type === MOUSEDOWN);
        }
    }

    function enhanceLinkItem(i, item) {
        item = $(item);
        var parent = item.parent();

        if (parent.contents().not(item)[0]) {
            return;
        }

        var icon = parent.data(kendo.ns + "icon"),
            iconSpan = $('<span class="km-icon"/>');

        item.addClass("km-listview-link")
            .attr(kendo.attr("role"), "listview-link");

        if (icon) {
            item.prepend(iconSpan);
            iconSpan.addClass("km-" + icon);
        }
    }

    /**
    * @name kendo.mobile.ui.ListView.Description
    * @section The Kendo Mobile ListView widget is used to display flat or grouped list of items.
    * <p>It can be either used in unbound mode by enhancing an HTML <code>ul</code> element, or bound to a kendo.data.DataSource instance.</p>
    *
    * <h3>Getting Started</h3>
    * <p>The Kendo Mobile Application automatically initializes the Mobile ListView for every <code>ul</code> element with <code>role</code> data attribute set to <code>listview</code> present in the views' markup.
    * Alternatively, it can be initialized using a jQuery selector. The Mobile ListView element can contain one or more <code>li</code> elements.</p>
    * @exampleTitle Initialize mobile ListView using a role data attribute.
    * @example
    * <ul data-role="listview">
    *   <li>Foo</li>
    *   <li>Bar</li>
    * </ul>
    *
    * @exampleTitle Initialize mobile ListView using a jQuery selector.
    * @example
    * <ul id="listView"></ul>
    * <script>
    * var listView = $("#listView").kendoMobileListView();
    * </script>
    *
    * @section
    * <h3>Inset mobile ListView</h3>
    * <p>In iOS, the mobile ListView appearance can be changed to <strong>inset</strong>, to achieve an effect similar to iOS grouped table views, where the list items are padded from the container, and have rounded corners.
    * This can be accomplished by setting the <code>style</code> data attribute to <code>inset</code>. <strong>Note:</strong> This setting won't affect the appearance of the mobile ListView on Android devices.</p>
    *
    * @exampleTitle Create Inset mobile ListView
    * @example
    * <ul data-role="listview" data-style="inset">
    *   <li>Foo</li>
    *   <li>Bar</li>
    * </ul>
    *
    * @section
    * <h3>Grouped mobile ListView</h3>
    * <p>The mobile ListView can display items in groups, with optional headers. This can be achieved by nesting unordered list in items, and setting the <code>type</code> data attribute to <code>group</code>.</p>
    * @exampleTitle Create grouped mobile ListView
    * @example
    * <ul data-role="listview" data-type="group">
    *     <li>
    *         Foo
    *         <ul>
    *             <li>Bar</li>
    *             <li>Baz</li>
    *         </ul>
    *     </li>
    *     <li>
    *         Bar
    *         <ul>
    *             <li>Bar</li>
    *             <li>Qux</li>
    *         </ul>
    *     </li>
    * </ul>
    *
    * @section
    * <h3>Binding to Data</h3>
    *
    * <p>
    * The mobile ListView can be bound to both local JavaScript arrays and remote data via the
    * Kendo DataSource component. Local JavaScript arrays are appropriate for limited value
    * options, while remote data binding is better for larger data sets.
    * </p>
    *
    * @exampleTitle Bind mobile ListView to a local data source.
    * @example
    * $(document).ready(function() {
    *     $("#listview").kendoMobileListView({
    *         dataSource: kendo.data.DataSource.create(["foo", "bar", "baz"])
    *      });
    * });
    *
    * @section
    * <h3>Customizing Item Templates</h3>
    * <p>
    *     The mobile ListView leverages Kendo UI high-performance Templates to give you complete control
    *     over item rendering. For a complete overview of Kendo UI Template capabilities and syntax,
    *     please review the <a href="../templates/index.html" title="Kendo UI Template">Kendo UI Template</a> demos and documentation.
    * </p>
    * @exampleTitle Basic item template customization
    * @example
    * <ul id="listview"></ul>
    *
    * <script type="text/javascript">
    *     $(document).ready(function() {
    *         $("#listview").kendoMobileListView({
    *             template : "<strong>${data.foo}</strong>",
    *             dataSource: kendo.data.DataSource.create([{foo: "bar"}, {foo: "baz"}])
    *         });
    *     });
    * </script>
    */
    var ListView = Widget.extend(/** @lends kendo.mobile.ui.ListView.prototype */{
        /**
        * @constructs
        * @extends kendo.mobile.ui.Widget
        * @param {DomElement} element DOM element.
        * @param {Object} options Configuration options.
        * @option {kendo.data.DataSource|Object} [dataSource] Instance of DataSource or the data that the mobile ListView will be bound to.
        * @option {String} [type] The type of the control. Can be either <code>flat</code> (default) or <code>group</code>. Determined automatically in databound mode.
        * @option {String} [style] The style of the control. Can be either empty string(""), or <code>inset</code>.
        * @option {String} [template] <${data}> The item template.
        * @option {String} [headerTemplate] <${value}> The header item template (applies for grouped mode).
        */
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            options = that.options;

            that.element
                .delegate(ITEM_SELECTOR, MOUSEDOWN + " " + MOUSEUP, toggleItemActiveClass)
                .delegate(ITEM_SELECTOR, MOUSEUP, proxy(that._click, that));

            if (options.dataSource) {
                that.dataSource = DataSource.create(options.dataSource).bind("change", $.proxy(that._refresh, that));
                that._template();
                that.dataSource.fetch();
            } else {
                that._style();
            }

            that.bind([
            /**
             * Fires when item is clicked
             * @name kendo.mobile.ui.ListView#click
             * @event
             * @param {Event} e
             * @param {jQueryObject} e.item The selected list item
             * @param {jQueryObject} e.target The clicked DOM element
             * @param {Object} e.dataItem The corresponding dataItem associated with the item (available in databound mode only).
             * @param {String} e.buttonName The name of the clicked Kendo MobileButton. Specified by setting the <code>name</code> data attribute of the button widget.
             * @param {kendo.ui.MobileButton} e.button The clicked Kendo MobileButton
             *
             * @exampleTitle Handling button clicks
             * @example
             * <ul data-role="listview" id="foo">
             *     <li><a data-role="button" data-name="bar">Bar button</a> | <a data-role="button" data-name="baz">Baz button</a></li>
             * </ul>
             *
             * <script>
             *  $("#foo").data("kendoMobileListView").bind("click", function(e) {
             *      console.log(e.buttonName); // "foo" or "bar"
             *      console.log(e.button); // Kendo MobileButton instance
             *  }
             * </script>
             *
             * @exampleTitle Making dataItem available in events
             * @example
             * <ul id="foo"></ul>
             *
             * <script>
             *  // for the dataItem to be present in the click event, The datasource must have schema definition, specifying the model id field.
             *  $("#foo").kendoMobileListView({
             *     dataSource: new kendo.data.DataSource({
             *          data:   [{id: 1, title: "foo"}, {id: 2, title: "bar"}],
             *          schema: {model: {id: "id"}}
             *     }),
             *
             *     click: function(e) {
             *          console.log(e.dataItem.title);
             *     }
             *  });
             * </script>
             */
            CLICK
            ], options);
        },

        options: {
            name: "ListView",
            selector: kendo.roleSelector("listview"),
            type: "flat",
            template: "${data}",
            headerTemplate: "${value}",
            style: ""
        },

        _refresh: function() {
            var that = this,
                dataSource = that.dataSource,
                grouped,
                view = dataSource.view();

            if (dataSource.group()[0]) {
                that.options.type = "group";
                that.element.html(kendo.render(that.groupTemplate, view));
            } else {
                that.element.html(kendo.render(that.template, view));
            }

            kendo.mobile.enhance(that.element.children());

            that._style();
        },

        _template: function() {
            var that = this,
                template = that.options.template,
                headerTemplate = that.options.headerTemplate,
                model = that.dataSource.options.schema.model,
                dataIDAttribute = "",
                templateProxy = {},
                groupTemplateProxy = {};

            if (model) {
                dataIDAttribute = ' data-uid="#=uid#"';
            }

            if (typeof template === FUNCTION) {
                templateProxy.template = template;
                template = "#=this.template(data)#";
            }

            groupTemplateProxy.template = that.template = $.proxy(kendo.template("<li" + dataIDAttribute + ">" + template + "</li>"), templateProxy);

            if (typeof headerTemplate === FUNCTION) {
                groupTemplateProxy._headerTemplate = headerTemplate;
                headerTemplate = "#=this._headerTemplate(data)#";
            }

            groupTemplateProxy.headerTemplate = kendo.template(headerTemplate);

            that.groupTemplate = $.proxy(GROUP_TEMPLATE, groupTemplateProxy);
        },

        _click: function(e) {
            var that = this,
                dataItem,
                item = $(e.currentTarget),
                target = $(e.target),
                button = target.closest("[" + kendo.attr("name") + "]", item),
                buttonName = button.data(kendo.ns + "name"),
                id = item.attr(kendo.attr("uid"));

            if (id) {
                dataItem = that.dataSource.getByUid(id);
            }

            if (that.trigger(CLICK, {target: target, item: item, dataItem: dataItem, buttonName: buttonName, button: button.data("kendoMobileButton")})) {
                e.preventDefault();
            }
        },

        _style: function() {
            var that = this,
                options = that.options,
                grouped = options.type === "group",
                inset = options.style === "inset";

            that.element.addClass("km-listview")
                .toggleClass("km-list", !grouped)
                .toggleClass("km-listinset", !grouped && inset)
                .toggleClass("km-listgroup", grouped && !inset)
                .toggleClass("km-listgroupinset", grouped && inset)
                .find("a:only-child:not([data-" + kendo.ns + "role])").each(enhanceLinkItem);

            if (grouped) {
                that.element
                    .children()
                    .children("ul")
                    .addClass("km-list");
            }

            that.element.closest(".km-content").toggleClass("km-insetcontent", inset); // iOS has white background when the list is not inset.
        }
    });

    ui.plugin(ListView);
})(jQuery);
