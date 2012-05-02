Ext.define('Spelled.model.blueprint.ComponentAttribute', {
    extend: 'Ext.data.Model',

    fields: [
        "type",
        "name",
        "default"
    ],

    idgen: 'uuid',

    belongsTo: 'Spelled.model.blueprint.Component',

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'blueprint.ComponentAttributes' ).add( this )
    }
});