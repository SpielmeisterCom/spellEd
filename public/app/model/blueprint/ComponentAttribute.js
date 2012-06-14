Ext.define('Spelled.model.blueprint.ComponentAttribute', {
    extend: 'Ext.data.Model',

    fields: [
        "type",
        "name",
        "default"
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.blueprint.Component",
        type:"belongsTo",
		getterName: 'getComponent',
		setterName: 'setComponent'
    }],

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'blueprint.ComponentAttributes' ).add( this )
    }
});