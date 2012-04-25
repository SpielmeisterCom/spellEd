Ext.define('Spelled.model.Zone', {
    extend: 'Ext.data.Model',

    fields: [
        'id'
    ],

    belongsTo: 'Spelled.model.Project',
    hasMany: {
        model: 'Spelled.model.Entity',
        associationKey: 'entityInstanceConfigurations',
        name :  'getEntities'
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'Zones' ).add( this )
    }
});