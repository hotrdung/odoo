odoo.define('PetStoreHomePage', function (require) {
    "use strict";

    var core = require('web.core');
    var Widget = require('web.Widget');

    var Class = require('web.Class');

    var MyClass = Class.extend({
        init: function (name) {
            this.name = name;
        },
        say_hello: function () {
            console.log("Hello ", this.name);
        },
    });

    var MySpanishClass = MyClass.extend({
        say_hello: function () {
            this._super();
            console.log("[Spanish] Hola ", this.name);
        },
    });

    var HomePageWidget = Widget.extend({
        //template: 'petstore.homepage',
        start: function () {
            this.$el.append($('<div>').text('Welcome to Pet Store 333!'));
            // console.log("xxx");
            var my_object = new MySpanishClass("Pet Store");
            my_object.say_hello();
        }
    });

    core.action_registry.add('petstore.homepage', HomePageWidget);
});