Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'id'
    ],

    belongsTo: 'Spelled.model.config.Zone',
    hasMany: {
        model: 'Spelled.model.config.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Entities' ).add( this )
    }
});