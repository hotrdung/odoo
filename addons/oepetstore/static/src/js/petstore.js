odoo.define('PetStoreHomePage', function (require) {
    "use strict";

    var core = require('web.core');
    var Widget = require('web.Widget');

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
            var products = new ProductWidget(
                this, ["cpu", "mouse", "keyboard", "graphic card", "screen"], "#00FF00");
            products.appendTo(this.$el);

            var widget = new ConfirmWidget(this);
            widget.on("user_chose", this, this.user_chose);
            widget.appendTo(this.$el);

            this.colorInput = new ColorInputWidget(this);
            this.colorInput.on("change:color", this, this.color_changed);
            return this.colorInput.appendTo(this.$el);
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