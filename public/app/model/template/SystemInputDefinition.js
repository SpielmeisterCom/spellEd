Ext.define('Spelled.model.template.SystemInputDefinition', {
    extend: 'Ext.data.Model',

    fields: [
        "name",
        "templateId"
    ],

    idgen: 'uuid',

    associations: [{
        model:"Spelled.model.template.System",
        type:"belongsTo",
		getterName: 'getSystem',
		setterName: 'setSystem'
    }],

	setDirty: function() {
		this.getSystem().setDirty()
		this.callParent()
	},

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'template.SystemInputDefinitions' ).add( this )
    }
});
