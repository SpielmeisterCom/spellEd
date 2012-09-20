Ext.define('Spelled.model.template.Component', {
    extend: 'Spelled.abstract.model.Template',

	iconCls : "tree-component-icon",

    fields: [
        "type",
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
			type: 'componentTemplate'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: {
			type: 'componentTemplate'
		}
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
