Ext.define('Spelled.model.config.Zone', {
    extend: 'Ext.data.Model',

    fields: [
        'id'
    ],

    belongsTo: 'Spelled.model.Project',
    hasMany: {
        model: 'Spelled.model.config.Entity',
        associationKey: 'entityInstanceConfigurations',
        name :  'getEntities'
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Zones' ).add( this )
    },

    getJSONConfig: function() {

        var result = this.data
        var entities = this.getEntities()

        result.entities = []
        Ext.each( entities.data.items, function( entity ) {
            result.entities.push( entity.getJSONConfig() )
        })

        return result
    }
});