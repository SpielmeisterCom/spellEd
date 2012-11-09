Ext.define('Spelled.model.template.ComponentAttribute', {
    extend: 'Ext.data.Model',

	requires: ['idgen.uuid'],

    fields: [
        "type",
        "name",
		{ name: 'values', type: 'array', defaultValue: [] },
		{ name: 'default', type: 'array', defaultValue: "defaultValue" }
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.template.Component",
        type:"belongsTo",
		getterName: 'getComponent'
    }],

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
