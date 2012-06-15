Ext.define('Spelled.model.blueprint.SystemInputDefinition', {
    extend: 'Ext.data.Model',

    fields: [
        "name",
        "blueprintId"
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.blueprint.System",
        type:"belongsTo",
		getterName: 'getSystem',
		setterName: 'setSystem'
    }],

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'blueprint.SystemInputDefinitions' ).add( this )
    }
});