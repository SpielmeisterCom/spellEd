Ext.define('Spelled.model.template.Component', {
	extend: 'Spelled.abstract.model.Template',

	requires: [
		'association.hasmany',
		'Spelled.data.writer.ComponentTemplate',
		'Spelled.data.reader.Component'
	],

    fields: [
        "namespace",
		{ name: 'group', type: 'string', defaultValue: 'General' },
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

	getCalculatedDependencies: function() {
		var cmp = Ext.create( 'Spelled.model.config.Component', { templateId: this.getFullName() } )

		return cmp.getCalculatedDependencies()
	},

	createDependencyNode: function() {
		var cmp = Ext.create( 'Spelled.model.config.Component', { templateId: this.getFullName() } )

		return cmp.createDependencyNode()
	},

	getAttributeByName: function( name ) {
		return this.getAttributes().findRecord( 'name', name )
	},

    appendOnTreeNode: function( node ) {
		var me = this

        this.getAttributes().each( function( attribute ) {
			if( attribute.isEngineInternal() ) return

			var newNode = node.createNode ( {
				text      : attribute.get('name'),
				id        : attribute.getId(),
				iconCls   : "tree-component-attribute-icon",
				leaf      : true
			} )

			newNode.set( 'group', me.get( 'group' ) )
            node.appendChild( newNode )
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
