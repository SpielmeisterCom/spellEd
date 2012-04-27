Ext.define('Spelled.model.config.Component', {
    extend: 'Ext.data.Model',

    fields: [
        'blueprintId',
        'configuration'
    ],

    idgen: 'uuid',

    belongsTo: 'Spelled.model.config.Entity',

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'config.Components' ).add( this )
    }
});