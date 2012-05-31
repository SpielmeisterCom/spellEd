Ext.define('Spelled.model.blueprint.SystemInputDefinition', {
    extend: 'Ext.data.Model',

    fields: [
        "name",
        "components"
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.blueprint.System",
        type:"belongsTo"
    }],

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'blueprint.SystemInputDefinitions' ).add( this )
    }
});