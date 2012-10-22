Ext.define('Spelled.model.template.Component', {
	extend: 'Spelled.abstract.model.Template',

	requires: [
		'association.hasmany',
		'Spelled.data.writer.ComponentTemplate',
		'Spelled.data.reader.Component'
	],

	iconCls : "tree-component-icon",
	sortOrder: 210,

    fields: [
        "namespace",
		{ name: 'title', type: 'string', defaultValue: "" },
		{ name: 'icon', type: 'string', defaultValue: '' },
		"doc",
        "name"
    ],

    hasMany: {
        model: 'Spelled.model.template.ComponentAttribute',
        associationKey: 'attributes',
        name :  'getAttributes'
    },

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'component'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: 'componentTemplate',
		reader: 'component'
	},

	getAttributeByName: function( name ) {
		return this.getAttributes().findRecord( 'name', name )
	},

    appendOnTreeNode: function( node ) {

        this.getAttributes().each( function( attribute ) {
            node.appendChild(
                node.createNode ( {
                    text      : attribute.get('name'),
                    id        : attribute.getId(),
					iconCls   : "tree-component-attribute-icon",
                    leaf      : true
                } )
            )
        })

        return node
    },

	getConfig: function() {
		var templateConfig =  {}
		this.getAttributes().each(
			function( attribute ) {
				templateConfig[ attribute.get('name') ] = attribute
			}
		)

		return templateConfig
	}
});
