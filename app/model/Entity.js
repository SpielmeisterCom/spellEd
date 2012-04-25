Ext.define('Spelled.model.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'id'
    ],

    belongsTo: 'Spelled.model.Zone',
    hasMany: {
        model: 'Spelled.model.Component',
        associationKey: 'components',
        name :  'getComponents'
    },

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'Entities' ).add( this )
    }
});