Ext.define('Spelled.model.config.Zone', {
    extend: 'Ext.data.Model',

    fields: [
        'id'
    ],

    belongsTo: 'Spelled.model.config.Project',
    hasMany: {
        model: 'Spelled.model.config.Entity',
        associationKey: 'entityInstanceConfigurations',
        name :  'getEntities'
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Zones' ).add( this )
    }
});