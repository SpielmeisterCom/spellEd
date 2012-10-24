Ext.define('Spelled.model.template.SystemConfigItem', {
    extend: 'Ext.data.Model',

	requires: ['idgen.uuid'],

    fields: [
		"name",
		"type",
		"default",
		"doc"
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
	}
})
