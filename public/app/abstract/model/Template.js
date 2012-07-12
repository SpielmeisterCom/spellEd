Ext.define('Spelled.abstract.model.Template', {
    extend: 'Ext.data.Model',

    requires: ['Spelled.abstract.writer.JsonWriter'],

	constructor: function() {
		this.callParent( arguments )

		var object    = arguments[2],
			namespace = object.namespace,
			name      = object.name,
			templateId = ( namespace.length > 0 ) ? namespace +"."+ name : name

		this.set( 'templateId', templateId)
	},

    getFullName: function() {
        return this.get('templateId')
	},

	getDocumentationName: function() {
		return this.get('type').replace(/([a-z])([A-Z])/, "$1_$2").toLowerCase() + "_" + this.getFullName().replace( /\./g, "_")
	}
});
