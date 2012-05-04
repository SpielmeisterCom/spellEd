Ext.require([
    'Ext.direct.*',
    'Ext.data.*'
]);

Ext.onReady(function() {
    Ext.direct.Manager.addProvider( Ext.app.REMOTING_API )

    Ext.override( Ext.data.Store, {
        loadDataViaReader : function(data, append) {
            var me      = this,
                result  = me.proxy.reader.read(data),
                records = result.records;

            me.loadRecords(records, { addRecords: append })
            me.fireEvent('load', me, result.records, true)
        }
    })
})

Ext.application({
    name: 'Spelled',

    appFolder: 'app',

    controllers: [
        'Zones',
        'Entities',
        'Menu',
        'Projects',
        'Components',
        'Assets',
        'Blueprints'
    ],

    stores: [
        'blueprint.Components',
        'blueprint.Entities'
    ],

    project: undefined,
    zone: undefined,

    getActiveProject: function() {
        return this.project
    },

    setActiveProject: function( project ) {
        this.project = project
    },

    getActiveZone: function() {
        return this.zone
    },

    setActiveZone: function( zone ) {
        this.zone = zone
    },

    launch: function() {

        Spelled.EntityBlueprintActions.getAll( "1", function( provider, response ) {
            Ext.getStore('blueprint.Entities').loadDataViaReader( response.result )
        })

        Spelled.ComponentBlueprintActions.getAll( "1", function( provider, response ) {
            Ext.getStore('blueprint.Components').loadDataViaReader( response.result )
        })

        Ext.create('Spelled.view.ui.SpelledViewport')
    }
});