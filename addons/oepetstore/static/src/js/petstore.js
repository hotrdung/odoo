odoo.define('PetStoreHomePage', function (require) {
    "use strict";

    var core = require('web.core');
    var Widget = require('web.Widget');

    var HomePageWidget = Widget.extend({
        //template: 'petstore.homepage',
        start: function () {
            // this.$el.append($('<div>').text('Hello dear Odoo user!'));
            console.log("Pet Store HomePage widget start");
        }
    });

    core.action_registry.add('petstore.homepage', HomePageWidget);
});