Ext.application({
    name: 'Spelled',
    appFolder: 'app',
    launch: function() {
        Ext.create('Spelled.view.SpelledViewport');
    }
});