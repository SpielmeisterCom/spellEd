Ext.define('Spelled.abstract.model.Template', {
	requires: [
		'proxy.direct',
		'association.belongsto',
		'association.hasmany',
		'Spelled.model.config.Component',
		'Spelled.model.config.Entity'
	],

	extend: 'Ext.data.Model',

	mergeDependencies: false,

	mixins: {
		abstractModel: 'Spelled.abstract.model.Model'
	},

    requires: ['Spelled.abstract.writer.JsonWriter'],

	fields: [
		{ name: 'type', type: 'string', defaultValue: 'entity' },
		{ name: 'readonly', type: 'boolean', defaultValue: false },
		{ name: 'engineInternal', type: 'boolean', defaultValue: false },
		{ name: 'dependencies', type: 'array' }
	],

	save: function() {
		this.updateDependencies()

		return this.callParent( arguments )
	},

	constructor: function() {
		var params = arguments[0] || arguments[2]
		this.callParent( arguments )

		this.insertMetaData( 'template.Types', this.raw.type || this.data.type )

		this.set( 'templateId', this.generateIdentifier( params ))
	},

	isReadonly: function() {
		return ( this.get('readonly') === true )
	},

	isEngineInternal: function() {
		return ( this.get('engineInternal') === true )
	},

	getFullName: function() {
        return this.get('templateId')
	},

	isDirty: function() {
		return this.dirty
	},

	getDocumentationName: function() {
		return this.get('type').replace(/([a-z])([A-Z])/, "$1_$2").toLowerCase() + "_" + this.getFullName().replace( /\./g, "_")
	}
});
