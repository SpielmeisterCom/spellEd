Ext.define('Spelled.model.blueprint.SystemInputDefinition', {
    extend: 'Ext.data.Model',

    fields: [
        "name",
        {
            name: "components", type: 'array', defaultValue: []
        }
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