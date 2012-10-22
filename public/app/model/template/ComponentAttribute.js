Ext.define('Spelled.model.template.ComponentAttribute', {
    extend: 'Ext.data.Model',

	requires: ['idgen.uuid'],

    fields: [
        "type",
        "name",
		"values",
		"default"
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
