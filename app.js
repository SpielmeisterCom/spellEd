Ext.ns("Ext.app");
Ext.app.REMOTING_API = {
    "url": "/router",
    "type": "remoting",
    "actions": {
        "ZoneListing": [ {
            "name": "getTree",
            "len": 1
        }]
    }
};

Ext.require([
    'Ext.direct.*',
    'Ext.data.*'
]);

Ext.onReady(function() {
    Ext.direct.Manager.addProvider( Ext.app.REMOTING_API );
})

Ext.application({
    name: 'Spelled',

    appFolder: 'app',

    controllers: [
        'Zones'
    ],

    launch: function() {
        Ext.create('Spelled.view.SpelledViewport');
    }
});