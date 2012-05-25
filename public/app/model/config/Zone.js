Ext.define('Spelled.model.config.Zone', {
    extend: 'Ext.data.Model',

    fields: [
        'name'
    ],

    idProperty: 'name',

    belongsTo: 'Spelled.model.Project',
    hasMany: {
        model: 'Spelled.model.config.Entity',
        associationKey: 'entities',
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
        entities.each( function( entity ) {
            result.entities.push( entity.getJSONConfig() )
        })

        return result
    }
});