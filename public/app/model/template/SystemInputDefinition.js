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

    constructor: function() {
        this.callParent(arguments)
        Ext.getStore( 'template.SystemInputDefinitions' ).add( this )
    }
});
