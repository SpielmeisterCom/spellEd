Ext.define('Spelled.controller.Scripts', {
    extend: 'Ext.app.Controller',

    views: [
        'script.Editor',
//        'script.TreeList',
        'script.Manager'
    ],

    stores: [
        'Scripts'
    ],

    models: [
        'Script'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({

        })
    }


});