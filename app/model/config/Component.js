Ext.define('Spelled.model.config.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'configuration'
    ],

    belongsTo: 'Spelled.model.config.Entity',

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Components' ).add( this )
    }
});