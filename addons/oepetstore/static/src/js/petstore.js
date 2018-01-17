odoo.define('PetStoreHomePage', function (require) {
    "use strict";

    var core = require('web.core');
    var rpc = require('web.rpc');
    var Widget = require('web.Widget');
    var qweb = core.qweb;

    var ProductWidget = Widget.extend({
        template: "ProductsWidget",
        init: function (parent, products, color) {
            this._super(parent);
            this.products = products;
            this.color = color;
        },
    });

    var ConfirmWidget = Widget.extend({
        events: {
            'click button.ok_button': function () {
                this.trigger('user_chose', true);
            },
            'click button.cancel_button': function () {
                this.trigger('user_chose', false);
            }
        },
        start: function () {
            this.$el.append("<div>Are you sure you want to perform this action?</div>" +
                "<button class='ok_button'>Ok</button>" +
                "<button class='cancel_button'>Cancel</button>");
        },
    });

    var ColorInputWidget = Widget.extend({
        template: "ColorInputWidget",
        events: {
            'change input': 'input_changed'
        },
        start: function () {
            this.input_changed();
            return this._super();
        },
        input_changed: function () {
            var color = [
                "#",
                this.$(".oe_color_red").val(),
                this.$(".oe_color_green").val(),
                this.$(".oe_color_blue").val()
            ].join('');
            this.set("color", color);
        },
    });

    var MessageOfTheDay = Widget.extend({
        template: "MessageOfTheDay",
        start: function () {
            var self = this;
            rpc.query({
                model: 'oepetstore.message_of_the_day',
                method: 'search_read',
                args: [],  // empty WHERE clause
                kwargs: {},
                fields: ["message"],
                orderBy: [
                    {name: 'create_date', asc: false},
                    {name: 'id', asc: false}
                ],
                limit: 1,
            }).then(function (results) {
                console.log("Query results for MOTD", results);

                var msg = results && results[0] && results[0].message;
                self.$(".oe_mywidget_message_of_the_day").text(msg);
            });
        },
    });

    var PetToysList = Widget.extend({
        template: 'PetToysList',
        start: function () {
            var self = this;
            return rpc.query({
                model: 'product.product',
                method: 'search_read',
                args: [[['categ_id.name', '=', "Pet Toys"]]],  // WHERE clause: [[ [cond1], [cond2]... ]]
                kwargs: {},
                fields: ['name', 'image'],
                limit: 5,
            }).then(function (results) {
                console.log("Query results for toys", results);

                _(results).each(function (item) {
                    self.$el.append(qweb.render('PetToy', {item: item}));
                });
            });
        }
    });


    var HomePageWidget = Widget.extend({
        template: 'HomePageTemplate',
        events: {
            'click .oe_products_item': 'product_item_click',
        },
        init: function (parent) {
            this._super(parent);
            this.locale_name = "Vietnam";
        },
        start: function () {
            var self = this;
            rpc.query({
                model: 'oepetstore.message_of_the_day',
                method: 'my_method',
                args: [],
                kwargs: {}
            }).then(function (result) {
                self.$el.append("<div>Hello " + result["hello"] + "</div>");
            });

            this.colorInput = new ColorInputWidget(this);
            this.colorInput.on("change:color", this, this.color_changed);
            this.colorInput.appendTo(this.$el);

            var toyListWidget = new PetToysList(this);
            var motdWidget = new MessageOfTheDay(this);

            $.when(
                toyListWidget.appendTo(this.$('.oe_petstore_homepage_left')),
                motdWidget.appendTo(this.$('.oe_petstore_homepage_right'))
            );

            var products = new ProductWidget(
                this, ["cpu", "mouse", "keyboard", "graphic card", "screen"], "#00FF00");
            products.appendTo(this.$el);

            var confirmWidget = new ConfirmWidget(this);
            confirmWidget.on("user_chose", this, this.user_chose);
            confirmWidget.appendTo(this.$el);
        },
        product_item_click: function (e) {
            console.log(e);
            alert("You have selected: " + $(e.target).text().trim());
        },
        user_chose: function (confirm) {
            if (confirm) {
                console.log("The user agreed to continue");
            } else {
                console.log("The user refused to continue");
            }
        },
        color_changed: function () {
            this.$(".oe_color_div").css("background-color", this.colorInput.get("color"));
        },
    });

    core.action_registry.add('petstore.homepage', HomePageWidget);
});