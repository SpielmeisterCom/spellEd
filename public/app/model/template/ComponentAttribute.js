Ext.define('Spelled.model.template.ComponentAttribute', {
    extend: 'Ext.data.Model',

	requires: ['idgen.uuid'],

    fields: [
        "type",
        "name",
		{ name: 'engineInternal', type: 'boolean', defaultValue: false },
		{ name: 'values', type: 'array', defaultValue: [] },
		{ name: 'default', type: 'array', defaultValue: "defaultValue" }
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.template.Component",
        type:"belongsTo",
		getterName: 'getComponent'
    }],

	isEngineInternal: function() {
		return this.get( 'engineInternal' ) === true
	},

	setDirty: function() {
		this.getComponent().setDirty()
		this.callParent()
	},

	setComponent: function( component ) {
		this[ 'Spelled.model.template.ComponentBelongsToInstance' ] = component
	},

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'template.component.Attributes' ).add( this )
    }
});
