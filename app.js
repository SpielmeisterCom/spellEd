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
        'Zones',
        'Entities'
    ],

    launch: function() {
        Ext.create('Spelled.view.ui.SpelledViewport');
    }
});